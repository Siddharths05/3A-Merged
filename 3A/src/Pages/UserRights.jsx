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
// "module" keys MUST match what each master form passes
// to can("module", action) / usePermissions. These are
// the live keys from the Phase 3 forms.
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
      { key: "requirement", label: "Requirements" },
      { key: "job_function", label: "Job Function" },
      { key: "ksa", label: "KSA" },
      { key: "ksa_category", label: "KSA Category" },
      { key: "position_grade", label: "Position Grades" },
      { key: "meeting_type", label: "Meeting Type" },
      { key: "meeting_location", label: "Meeting Location" },
      { key: "language", label: "Languages" },
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
// Wire keys are bare: add, edit, delete, view, print, export.
// ACTIONS' own `key` values match the wire format directly.
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
// ENFORCE "ANY RIGHT IMPLIES VIEW"
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
      rowsByModule[moduleKey] = row;
    }
  }

  // Legacy key aliases from earlier versions of this screen
  // so existing saved rows still load under the corrected keys.
  const ALIASES = {
    requirements: "requirement",
    languages: "language",
    position_grades: "position_grade",
  };

  const merged = buildBlankRights();

  for (const moduleKey of Object.keys(rowsByModule)) {
    const targetKey = ALIASES[moduleKey] || moduleKey;

    if (!merged[targetKey]) {
      continue;
    }

    const row = rowsByModule[moduleKey] || {};

    for (const action of ACTIONS) {
      if (row[action.key]) {
        merged[targetKey][action.key] = true;
      }
    }
  }

  return enforceViewInvariant(merged);
}

export default function UserRights() {
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

  const getToken = () => {
    return localStorage.getItem("access_token");
  };

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

  const handleUserChange = (e) => {
    setSelectedUserId(e.target.value);
    setSuccess("");
    setError("");
  };

  const handleSectionChange = (sectionKey) => {
    setActiveSectionKey(sectionKey);
    setSearch("");
  };

  const toggleRight = (moduleKey, actionKey) => {
    const currentRow = rights[moduleKey];

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

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-theme-text sm:text-3xl">
          User Rights
        </h1>
        <p className="mt-1 text-sm text-theme-muted">
          Choose what each user can add, edit, delete, view, print, or export.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-theme-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-theme-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-theme-primary-soft text-theme-primary">
              <ShieldCheck size={21} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-theme-text">
                Select a user
              </h2>
              <p className="mt-1 text-sm text-theme-muted">
                Permissions apply only to this user.
              </p>
            </div>
          </div>

          <div className="relative w-full max-w-xs">
            <select
              value={selectedUserId}
              onChange={handleUserChange}
              disabled={loadingUsers || users.length === 0}
              className="h-12 w-full appearance-none rounded-xl border border-theme-border bg-[var(--erp-background)] px-4 pr-10 text-sm text-theme-text outline-none transition-all focus:border-theme-primary focus:ring-2 focus:ring-theme-primary-soft disabled:cursor-not-allowed disabled:opacity-60"
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
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-theme-faint"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-theme-border px-6 py-4">
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

        {activeSection.modules.length > 0 && (
          <div className="px-6 py-4">
            <div className="relative max-w-sm">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-faint"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${activeSection.label.toLowerCase()}...`}
                className="h-10 w-full rounded-xl border border-theme-border bg-[var(--erp-background)] pl-9 pr-4 text-sm text-theme-text outline-none transition-all placeholder:text-theme-faint focus:border-theme-primary focus:ring-2 focus:ring-theme-primary-soft"
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-theme-danger/30 bg-theme-danger-soft px-4 py-3 text-sm text-theme-danger">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-theme-border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-theme-border px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-theme-text">
              {activeSection.label}
            </h2>
            <p className="mt-1 text-sm text-theme-muted">
              {activeSection.modules.length > 0
                ? "Click a form's name to toggle every permission in that row at once. Granting any permission automatically includes View. Export and Print control the Excel / Word download buttons on each master."
                : "No forms are wired up in this section yet."}
            </p>
          </div>
        </div>

        {loadingRights ? (
          <div className="px-6 py-12 text-center text-sm text-theme-muted">
            Loading rights...
          </div>
        ) : activeSection.modules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="font-medium text-theme-text">
              {activeSection.label} isn't built yet
            </p>
            <p className="mt-1 text-sm text-theme-faint">
              Once {activeSection.label.toLowerCase()} forms exist, their permissions will show up here automatically.
            </p>
          </div>
        ) : visibleModules.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-theme-muted">
            No forms match "{search}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="sticky top-0 z-10 border-b border-theme-border bg-[var(--erp-background)]">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-muted">
                    Form
                  </th>
                  {ACTIONS.map((action) => (
                    <th
                      key={action.key}
                      className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-theme-muted"
                    >
                      {action.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border">
                {visibleModules.map((module) => (
                  <tr
                    key={module.key}
                    className="transition-colors hover:bg-theme-primary-soft/40"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-theme-text">
                      <button
                        type="button"
                        onClick={() => toggleRow(module.key)}
                        className="text-left hover:text-theme-primary"
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
                          className="h-4 w-4 cursor-pointer rounded border-theme-border accent-[var(--erp-primary,#7c5cff)]"
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
          <div className="flex flex-wrap items-center gap-3 border-t border-theme-border px-6 py-6">
            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty || !selectedUser || saving}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-theme-primary px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
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
