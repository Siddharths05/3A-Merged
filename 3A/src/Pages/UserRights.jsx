import { useEffect, useMemo, useState } from "react";

import {
  ShieldCheck,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Search,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// ==================================================
// SECTIONS
// "module" here MUST match the module keys used in
// Header.jsx and on the backend. Add a new master to
// both places when one gets built — nothing else in
// this file needs to change.
// ==================================================

const SECTIONS = [
  {
    key: "masters",
    label: "Masters",
    modules: [
      { key: "ability", label: "Ability" },
      { key: "location", label: "Work Location" },
      { key: "announcement_type", label: "Announcement Type" },
      { key: "advertising_media", label: "Advertising Media" },
      { key: "advertising_purpose", label: "Advertising Purpose" },
      { key: "requirements", label: "Requirements" },
      { key: "job_function", label: "Job Function" },
      { key: "ksa", label: "KSA" },
      { key: "ksa_category", label: "KSA Category" },
      { key: "position_grades", label: "Position Grades" },
      { key: "meeting_type", label: "Meeting Type" },
      { key: "meeting_location", label: "Meeting Location" },
      { key: "languages", label: "Languages" },
      { key: "office_type", label: "Office Type" },
      { key: "office_level", label: "Office Level" },
      { key: "role_in_offense", label: "Role in Offense" },
      { key: "hobby", label: "Hobbies" },
    ],
  },
  {
    key: "purchase",
    label: "Purchase",
    modules: [],
  },
  {
    key: "reports",
    label: "Reports",
    modules: [],
  },
];

const ACTIONS = [
  { key: "add", label: "Add" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
  { key: "view", label: "View" },
  { key: "print", label: "Print" },
  { key: "export", label: "Export" },
];

// ==================================================
// WIRE FORMAT NOTE
// `can_add`/`can_edit`/etc. are internal DB column names
// only (see UserRight in model.py). The actual JSON contract
// — UserRightItem in schema.py, and what get_user_rights_map /
// user_right_to_dict in model.py serialize to — uses bare
// keys: add, edit, delete, view, print, export. The frontend
// should never send or expect can_* keys; ACTIONS' own `key`
// values already match the wire format directly.
//
// (A previous pass here briefly introduced a can_* mapping
// based on a guess about the DB column names, before the real
// schema.py/model.py were available — that was wrong and has
// been reverted. Confirmed against the actual backend files.)
// ==================================================
// BUILD A BLANK RIGHTS MAP ACROSS ALL SECTIONS
// { ability: { add: false, ... }, location: { ... }, ... }
// ==================================================

function buildBlankRights() {
  const rights = {};

  for (const section of SECTIONS) {
    for (const module of section.modules) {
      rights[module.key] = {};

      for (const action of ACTIONS) {
        rights[module.key][action.key] = false;
      }
    }
  }

  return rights;
}

// ==================================================
// NORMALIZE THE GET RESPONSE
// Confirmed shape from route.py: GET /user-rights/{id} and
// GET /user-rights/me both return
//   { rights: { ability: { add, edit, delete, view, print, export }, ... } }
// — a dict keyed by module (via get_user_rights_map in
// model.py), bare keys, booleans. The array-of-rows branch
// below is kept only as a defensive fallback in case that
// ever changes; the object branch is what actually runs today.
// ==================================================

// ==================================================
// ENFORCE THE "ANY RIGHT IMPLIES VIEW" INVARIANT
// A user granted can_edit/can_delete/can_print/can_export
// on a module but not can_view would never be able to open
// the module in the first place (Header.jsx's Masters
// dropdown is filtered on can_view only), so those other
// rights would be silently unusable. Rather than teach every
// consumer of the rights data about this rule, enforce it
// once here: if any non-view action is true for a module,
// force view true too. Applied on load (in case saved data
// somehow drifted) and again right before save (belt and
// suspenders).
// ==================================================

function enforceViewInvariant(rightsMap) {
  const result = {};

  for (const moduleKey of Object.keys(rightsMap)) {
    const row = { ...rightsMap[moduleKey] };

    const hasOtherRight = ACTIONS.some(
      (action) => action.key !== "view" && row[action.key]
    );

    if (hasOtherRight) {
      row.view = true;
    }

    result[moduleKey] = row;
  }

  return result;
}

function normalizeSavedRights(rawRights) {
  const rowsByModule = {};

  if (Array.isArray(rawRights)) {
    for (const row of rawRights) {
      if (row && row.module) {
        rowsByModule[row.module] = row;
      }
    }
  } else if (rawRights && typeof rawRights === "object") {
    for (const moduleKey of Object.keys(rawRights)) {
      const row = rawRights[moduleKey];
      // Support a dict value that's either a row object
      // itself, or already just the module's row without
      // a `module` field.
      rowsByModule[moduleKey] = row;
    }
  }

  const merged = buildBlankRights();

  for (const moduleKey of Object.keys(rowsByModule)) {
    if (!merged[moduleKey]) {
      continue;
    }

    const row = rowsByModule[moduleKey] || {};

    for (const action of ACTIONS) {
      merged[moduleKey][action.key] = Boolean(
        row[action.key] ?? false
      );
    }
  }

  return enforceViewInvariant(merged);
}

export default function UserRights() {
  // ==================================================
  // STATE
  // ==================================================

  const [users, setUsers] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(true);

  const [selectedUserId, setSelectedUserId] = useState("");

  const [activeSectionKey, setActiveSectionKey] = useState(
    SECTIONS[0].key
  );

  const [search, setSearch] = useState("");

  const [rights, setRights] = useState(buildBlankRights);

  const [loadingRights, setLoadingRights] = useState(false);

  const [saving, setSaving] = useState(false);

  const [dirty, setDirty] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const selectedUser = useMemo(
    () =>
      users.find(
        (u) => String(u.pkid) === String(selectedUserId)
      ) || null,
    [users, selectedUserId]
  );

  const activeSection = useMemo(
    () =>
      SECTIONS.find(
        (section) => section.key === activeSectionKey
      ),
    [activeSectionKey]
  );

  const visibleModules = useMemo(() => {
    if (!activeSection) {
      return [];
    }

    const query = search.trim().toLowerCase();

    if (!query) {
      return activeSection.modules;
    }

    return activeSection.modules.filter((module) =>
      module.label.toLowerCase().includes(query)
    );
  }, [activeSection, search]);

  // ==================================================
  // GET AUTH TOKEN
  // ==================================================

  const getToken = () => {
    return localStorage.getItem("access_token");
  };

  // ==================================================
  // GET ERROR MESSAGE
  // ==================================================

  const getErrorMessage = async (response) => {
    try {
      const data = await response.json();

      return (
        data.detail ||
        data.message ||
        "Something went wrong"
      );
    } catch {
      return "Something went wrong";
    }
  };

  // ==================================================
  // LOAD USERS
  // ==================================================

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/users`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load users."
        );
      }

      const data = await response.json();

      const list = Array.isArray(data.users)
        ? data.users
        : [];

      setUsers(list);

      if (list.length > 0) {
        setSelectedUserId(String(list[0].pkid));
      }
    } catch (err) {
      console.error(
        "Fetch users error:",
        err
      );

      if (err instanceof TypeError) {
        setError(
          "Failed to connect to the server. Please make sure the backend is running."
        );
      } else {
        setError(err.message);
      }
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==================================================
  // LOAD RIGHTS FOR THE SELECTED USER
  // ==================================================

  const fetchRightsForUser = async (userId) => {
    if (!userId) {
      return;
    }

    try {
      setLoadingRights(true);

      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/user-rights/${userId}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const message =
          await getErrorMessage(response);

        throw new Error(message);
      }

      const data = await response.json();

      // ==============================================
      // NORMALIZE + MERGE THE SAVED RIGHTS ONTO A BLANK
      // SHEET. Handles list-of-rows or dict-of-rows, and
      // can_view-style or bare view-style keys. Modules
      // with no saved row just stay False.
      // ==============================================

      const merged = normalizeSavedRights(data.rights);

      setRights(merged);

      setDirty(false);
    } catch (err) {
      console.error(
        "Fetch user rights error:",
        err
      );

      if (err instanceof TypeError) {
        setError(
          "Failed to connect to the server. Please make sure the backend is running."
        );
      } else {
        setError(err.message);
      }

      setRights(buildBlankRights());
    } finally {
      setLoadingRights(false);
    }
  };

  useEffect(() => {
    if (selectedUserId) {
      fetchRightsForUser(selectedUserId);
    }
  }, [selectedUserId]);

  // ==================================================
  // SWITCH USER
  // ==================================================

  const handleUserChange = (e) => {
    setSelectedUserId(e.target.value);

    setSuccess("");

    setError("");
  };

  // ==================================================
  // SWITCH SECTION TAB
  // ==================================================

  const handleSectionChange = (sectionKey) => {
    setActiveSectionKey(sectionKey);

    setSearch("");
  };

  // ==================================================
  // TOGGLE A SINGLE CHECKBOX
  // ==================================================

  const toggleRight = (moduleKey, actionKey) => {
    const currentRow = rights[moduleKey];

    // Block turning View off while another right on this
    // module is still granted — View is a prerequisite for
    // all of them (see enforceViewInvariant above).
    if (actionKey === "view" && currentRow.view) {
      const hasOtherRights = ACTIONS.some(
        (action) =>
          action.key !== "view" && currentRow[action.key]
      );

      if (hasOtherRights) {
        setError(
          "Remove the other permissions on this form before removing View — View is required for any of them to work."
        );

        return;
      }
    }

    setRights((prev) => {
      const nextRow = {
        ...prev[moduleKey],

        [actionKey]: !prev[moduleKey][actionKey],
      };

      // Granting any right other than View implies View — a
      // user can't be given edit/delete/print/export without
      // also being able to open the module.
      if (actionKey !== "view" && nextRow[actionKey]) {
        nextRow.view = true;
      }

      return {
        ...prev,

        [moduleKey]: nextRow,
      };
    });

    setDirty(true);

    setError("");

    setSuccess("");
  };

  // ==================================================
  // TOGGLE AN ENTIRE ROW (ALL ACTIONS FOR ONE MODULE)
  // ==================================================

  const toggleRow = (moduleKey) => {
    const allOn = ACTIONS.every(
      (action) => rights[moduleKey][action.key]
    );

    setRights((prev) => {
      const nextRow = {};

      for (const action of ACTIONS) {
        nextRow[action.key] = !allOn;
      }

      return {
        ...prev,

        [moduleKey]: nextRow,
      };
    });

    setDirty(true);

    setSuccess("");
  };

  // ==================================================
  // SAVE
  // Sends every module in the "masters" section (the
  // only section with real modules right now) as one
  // batch to PUT /user-rights/{user_id}. Payload keys are
  // bare (module/add/edit/delete/view/print/export), matching
  // UserRightItem in schema.py exactly — confirmed against
  // the real backend files.
  // ==================================================

  const handleSave = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      setSaving(true);

      setError("");

      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      // Safety net: toggleRight already keeps view in sync as
      // the admin clicks, but this guarantees the saved payload
      // honors the invariant even if state ever gets here some
      // other way.
      const safeRights = enforceViewInvariant(rights);

      const rightsList = Object.keys(safeRights).map(
        (moduleKey) => {
          const row = { module: moduleKey };

          for (const action of ACTIONS) {
            row[action.key] = Boolean(
              safeRights[moduleKey][action.key]
            );
          }

          return row;
        }
      );

      const response = await fetch(
        `${API_BASE_URL}/user-rights/${selectedUserId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            rights: rightsList,
          }),
        }
      );

      if (!response.ok) {
        const message =
          await getErrorMessage(response);

        throw new Error(message);
      }

      const data = await response.json();

      setSuccess(
        data.message ||
          `Rights for ${selectedUser.full_name} saved successfully.`
      );

      setDirty(false);

      // Re-fetch so the sheet reflects exactly what the
      // backend actually persisted, not just what we
      // optimistically assume was saved.
      await fetchRightsForUser(selectedUserId);
    } catch (err) {
      console.error(
        "Save user rights error:",
        err
      );

      if (err instanceof TypeError) {
        setError(
          "Failed to connect to the server. Please make sure the backend is running."
        );
      } else {
        setError(err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // COMPONENT
  // ==================================================

  return (
    <div className="space-y-8">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div>
        <h1
          className="
            text-2xl
            font-bold
            tracking-tight
            text-theme-text
            sm:text-3xl
          "
        >
          User Rights
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-theme-muted
          "
        >
          Choose what each user can add, edit, delete, view, print, or export.
        </p>
      </div>

      {/* ==================================================
          USER PICKER
      ================================================== */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-theme-border
          bg-card
          shadow-sm
        "
      >

        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-theme-border
            px-6
            py-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div className="flex items-center gap-4">

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-theme-primary-soft
                text-theme-primary
              "
            >
              <ShieldCheck size={21} />
            </div>

            <div>
              <h2
                className="
                  text-lg
                  font-semibold
                  text-theme-text
                "
              >
                Select a user
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-theme-muted
                "
              >
                Permissions apply only to this user.
              </p>
            </div>

          </div>

          <div className="relative w-full max-w-xs">

            <select
              value={selectedUserId}
              onChange={handleUserChange}
              disabled={loadingUsers || users.length === 0}
              className="
                h-12
                w-full
                appearance-none
                rounded-xl
                border
                border-theme-border
                bg-[var(--erp-background)]
                px-4
                pr-10
                text-sm
                text-theme-text
                outline-none
                transition-all
                focus:border-theme-primary
                focus:ring-2
                focus:ring-theme-primary-soft
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loadingUsers && (
                <option>Loading users...</option>
              )}

              {!loadingUsers && users.length === 0 && (
                <option>No users found</option>
              )}

              {!loadingUsers &&
                users.map((u) => (
                  <option key={u.pkid} value={u.pkid}>
                    {u.full_name} — {u.role}
                  </option>
                ))}
            </select>

            <ChevronDown
              size={18}
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-theme-faint
              "
            />

          </div>

        </div>

        {/* ================================================
            SECTION TABS
        ================================================ */}

        <div
          className="
            flex
            flex-wrap
            gap-2
            border-b
            border-theme-border
            px-6
            py-4
          "
        >

          {SECTIONS.map((section) => {
            const isActive = section.key === activeSectionKey;

            return (
              <button
                key={section.key}
                type="button"
                onClick={() => handleSectionChange(section.key)}
                className={`
                  inline-flex
                  h-9
                  items-center
                  rounded-lg
                  px-4
                  text-sm
                  font-medium
                  transition-colors
                  ${
                    isActive
                      ? "bg-theme-primary text-white"
                      : "text-theme-muted hover:bg-theme-primary-soft hover:text-theme-text"
                  }
                `}
              >
                {section.label}
              </button>
            );
          })}

        </div>

        {/* ================================================
            SEARCH
        ================================================ */}

        {activeSection.modules.length > 0 && (
          <div
            className="
              px-6
              py-4
            "
          >
            <div className="relative max-w-sm">

              <Search
                size={16}
                className="
                  pointer-events-none
                  absolute
                  left-3.5
                  top-1/2
                  -translate-y-1/2
                  text-theme-faint
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${activeSection.label.toLowerCase()}...`}
                className="
                  h-10
                  w-full
                  rounded-xl
                  border
                  border-theme-border
                  bg-[var(--erp-background)]
                  pl-9
                  pr-4
                  text-sm
                  text-theme-text
                  outline-none
                  transition-all
                  placeholder:text-theme-faint
                  focus:border-theme-primary
                  focus:ring-2
                  focus:ring-theme-primary-soft
                "
              />

            </div>
          </div>
        )}

      </div>

      {/* ERROR */}

      {error && (
        <div
          className="
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-theme-danger/30
            bg-theme-danger-soft
            px-4
            py-3
            text-sm
            text-theme-danger
          "
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />

          <span>{error}</span>
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div
          className="
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-emerald-500/20
            bg-emerald-500/10
            px-4
            py-3
            text-sm
            text-emerald-600
            dark:text-emerald-400
          "
        >
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />

          <span>{success}</span>
        </div>
      )}

      {/* ==================================================
          RIGHTS MATRIX
      ================================================== */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-theme-border
          bg-card
          shadow-sm
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            border-b
            border-theme-border
            px-6
            py-5
          "
        >

          <div>
            <h2
              className="
                text-lg
                font-semibold
                text-theme-text
              "
            >
              {activeSection.label}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              {activeSection.modules.length > 0
                ? "Click a form's name to toggle every permission in that row at once. Granting any permission automatically includes View."
                : "No forms are wired up in this section yet."}
            </p>
          </div>

        </div>

        {loadingRights ? (

          <div
            className="
              px-6
              py-12
              text-center
              text-sm
              text-theme-muted
            "
          >
            Loading rights...
          </div>

        ) : activeSection.modules.length === 0 ? (

          /* ==============================================
              EMPTY SECTION (Purchase / Reports, etc.)
          ============================================== */

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              py-16
              text-center
            "
          >
            <p
              className="
                font-medium
                text-theme-text
              "
            >
              {activeSection.label} isn't built yet
            </p>

            <p
              className="
                mt-1
                text-sm
                text-theme-faint
              "
            >
              Once {activeSection.label.toLowerCase()} forms exist, their permissions will show up here automatically.
            </p>
          </div>

        ) : visibleModules.length === 0 ? (

          /* ==============================================
              NO SEARCH RESULTS
          ============================================== */

          <div
            className="
              px-6
              py-12
              text-center
              text-sm
              text-theme-muted
            "
          >
            No forms match "{search}".
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr
                  className="
                    sticky
                    top-0
                    z-10
                    border-b
                    border-theme-border
                    bg-[var(--erp-background)]
                  "
                >
                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-theme-muted
                    "
                  >
                    Form
                  </th>

                  {ACTIONS.map((action) => (
                    <th
                      key={action.key}
                      className="
                        px-4
                        py-4
                        text-center
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-theme-muted
                      "
                    >
                      {action.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody
                className="
                  divide-y
                  divide-theme-border
                "
              >
                {visibleModules.map((module) => (
                  <tr
                    key={module.key}
                    className="
                      transition-colors
                      hover:bg-theme-primary-soft/40
                    "
                  >
                    <td
                      className="
                        px-6
                        py-4
                        text-sm
                        font-medium
                        text-theme-text
                      "
                    >
                      <button
                        type="button"
                        onClick={() => toggleRow(module.key)}
                        className="
                          text-left
                          hover:text-theme-primary
                        "
                        title={`Toggle all permissions for ${module.label}`}
                      >
                        {module.label}
                      </button>
                    </td>

                    {ACTIONS.map((action) => (
                      <td
                        key={action.key}
                        className="px-4 py-4 text-center"
                      >
                        <input
                          type="checkbox"
                          checked={
                            rights[module.key][action.key]
                          }
                          onChange={() =>
                            toggleRight(module.key, action.key)
                          }
                          className="
                            h-4
                            w-4
                            cursor-pointer
                            rounded
                            border-theme-border
                            accent-[var(--erp-primary,#7c5cff)]
                          "
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        )}

        {activeSection.modules.length > 0 && !loadingRights && (
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
              border-t
              border-theme-border
              px-6
              py-6
            "
          >

            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty || !selectedUser || saving}
              className="
                inline-flex
                h-11
                items-center
                justify-center
                rounded-xl
                bg-theme-primary
                px-5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:opacity-90
                hover:shadow-md
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {saving ? "Saving..." : "Save Rights"}
            </button>

            {dirty && !saving && (
              <span className="text-xs text-theme-faint">
                You have unsaved changes.
              </span>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
