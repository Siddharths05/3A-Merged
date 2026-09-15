import { useState, useEffect } from "react";
import {
  Building2,
  AlertCircle,
  CheckCircle2,
  Pencil,
  Trash2,
} from "lucide-react";
import { usePermissions } from "../../components/Permissions";

const API_BASE_URL = "http://127.0.0.1:8000/api";

function getToken() {
  return localStorage.getItem("access_token") || "";
}

function getErrorMessage(data, fallback) {
  if (!data) return fallback;
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail) && data.detail[0]?.msg) {
    return data.detail[0].msg;
  }
  return fallback;
}

export default function OfficeType() {
  // ==================================================
  // PERMISSIONS
  // ==================================================

  const { role, can } = usePermissions();

  const isAllowed = (action) =>
    role === "admin" || can("office_type", action);

  // ==================================================
  // STATE
  // ==================================================

  const [officeType, setOfficeType] = useState("");
  const [officeTypes, setOfficeTypes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==================================================
  // FETCH
  // ==================================================

  const fetchOfficeTypes = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/office-types`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          getErrorMessage(data, "Failed to load office types")
        );
      }

      setOfficeTypes(data.office_types || []);
    } catch (err) {
      setError(err.message || "Failed to load office types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficeTypes();
  }, []);

  // ==================================================
  // HELPERS
  // ==================================================

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const resetForm = () => {
    setOfficeType("");
    setEditingId(null);
  };

  // ==================================================
  // SAVE (CREATE / UPDATE)
  // ==================================================

  const handleSave = async () => {
    const value = officeType.trim();

    if (!value) {
      setError("Please enter an office type.");
      return;
    }

    if (value.length > 200) {
      setError("Office type must be 200 characters or fewer.");
      return;
    }

    clearMessages();
    setSaving(true);

    try {
      const isEdit = editingId !== null;
      const url = isEdit
        ? `${API_BASE_URL}/office-types/${editingId}`
        : `${API_BASE_URL}/office-types`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ office_type: value }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          getErrorMessage(
            data,
            isEdit
              ? "Failed to update office type"
              : "Failed to create office type"
          )
        );
      }

      setSuccess(
        isEdit
          ? "Office type updated successfully."
          : "Office type saved successfully."
      );
      resetForm();
      await fetchOfficeTypes();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // EDIT
  // ==================================================

  const handleEdit = (item) => {
    clearMessages();
    setEditingId(item.pkOTId);
    setOfficeType(item.OfficeType || "");
  };

  // ==================================================
  // DELETE
  // ==================================================

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this office type?")) {
      return;
    }

    clearMessages();
    setDeletingId(id);

    try {
      const res = await fetch(`${API_BASE_URL}/office-types/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          getErrorMessage(data, "Failed to delete office type")
        );
      }

      setSuccess("Office type deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await fetchOfficeTypes();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  // ==================================================
  // KEY DOWN
  // ==================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (
        (editingId === null && isAllowed("add")) ||
        (editingId !== null && isAllowed("edit"))
      ) {
        handleSave();
      }
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
          Office Type
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-theme-muted
          "
        >
          Create and manage office types.
        </p>
      </div>

      {/* ==================================================
          ADD / EDIT FORM
      ================================================== */}
      {(isAllowed("add") || (editingId !== null && isAllowed("edit"))) && (
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
                {editingId !== null
                  ? "Edit Office Type"
                  : "Add Office Type"}
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-theme-muted
                "
              >
                {editingId !== null
                  ? "Update the selected office type."
                  : "Enter an office type to add it to the master list."}
              </p>
            </div>

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
              <Building2 size={21} />
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div className="max-w-xl">
              <label
                htmlFor="officeType"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-theme-text
                "
              >
                Office Type
              </label>

              <input
                id="officeType"
                type="text"
                value={officeType}
                onChange={(e) => {
                  setOfficeType(e.target.value);
                  clearMessages();
                }}
                onKeyDown={handleKeyDown}
                maxLength={200}
                placeholder="Enter office type"
                disabled={saving}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-theme-border
                  bg-[var(--erp-background)]
                  px-4
                  text-sm
                  text-theme-text
                  outline-none
                  transition-all
                  placeholder:text-theme-faint
                  focus:border-theme-primary
                  focus:ring-2
                  focus:ring-theme-primary-soft
                  disabled:opacity-60
                "
              />

              <p
                className="
                  mt-2
                  text-xs
                  text-theme-faint
                "
              >
                Maximum 200 characters.
              </p>
            </div>

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

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-3
                border-t
                border-theme-border
                pt-6
              "
            >
              <button
                type="button"
                onClick={handleSave}
                disabled={
                  saving ||
                  (editingId === null && !isAllowed("add")) ||
                  (editingId !== null && !isAllowed("edit"))
                }
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
                {saving
                  ? "Saving…"
                  : editingId !== null
                    ? "Update Office Type"
                    : "Save Office Type"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    clearMessages();
                  }}
                  disabled={saving}
                  className="
                    inline-flex
                    h-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-theme-border
                    bg-card
                    px-5
                    text-sm
                    font-semibold
                    text-theme-text
                    transition-all
                    duration-200
                    hover:bg-theme-primary-soft/40
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          SAVED LIST
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
              Saved Office Types
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Office types currently available in the system.
            </p>
          </div>

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
            <Building2 size={21} />
          </div>
        </div>

        {loading && (
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
            <p className="text-sm text-theme-muted">
              Loading office types…
            </p>
          </div>
        )}

        {!loading && officeTypes.length === 0 && (
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
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-theme-primary-soft
                text-theme-primary
              "
            >
              <Building2 size={26} />
            </div>

            <p
              className="
                mt-4
                font-medium
                text-theme-text
              "
            >
              No office types found
            </p>

            <p
              className="
                mt-1
                text-sm
                text-theme-faint
              "
            >
              Add an office type to get started.
            </p>
          </div>
        )}

        {!loading && officeTypes.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className="
                    border-b
                    border-theme-border
                    bg-[var(--erp-background)]
                  "
                >
                  <th
                    className="
                      w-20
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
                    ID
                  </th>

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
                    Office Type
                  </th>

                  {(isAllowed("edit") || isAllowed("delete")) && (
                    <th
                      className="
                        px-6
                        py-4
                        text-right
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-theme-muted
                      "
                    >
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-theme-border">
                {officeTypes.map((item) => (
                  <tr
                    key={item.pkOTId}
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
                        text-theme-muted
                      "
                    >
                      {item.pkOTId}
                    </td>

                    <td
                      className="
                        px-6
                        py-4
                        text-sm
                        font-medium
                        text-theme-text
                      "
                    >
                      {item.OfficeType}
                    </td>

                    {(isAllowed("edit") || isAllowed("delete")) && (
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {isAllowed("edit") && (
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              disabled={saving || deletingId !== null}
                              title="Edit"
                              className="
                                inline-flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                text-theme-muted
                                transition-colors
                                hover:bg-theme-primary-soft
                                hover:text-theme-primary
                                disabled:opacity-50
                              "
                            >
                              <Pencil size={16} />
                            </button>
                          )}

                          {isAllowed("delete") && (
                            <button
                              type="button"
                              onClick={() => handleDelete(item.pkOTId)}
                              disabled={
                                saving || deletingId === item.pkOTId
                              }
                              title="Delete"
                              className="
                                inline-flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                text-theme-muted
                                transition-colors
                                hover:bg-red-50
                                hover:text-red-600
                                disabled:opacity-50
                              "
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
