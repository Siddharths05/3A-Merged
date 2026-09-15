import { useState, useEffect } from "react";
import {
  Award,
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

function formatPay(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return n.toFixed(2);
}

export default function PositionGrades() {
  // ==================================================
  // PERMISSIONS
  // ==================================================

  const { role, can } = usePermissions();

  const isAllowed = (action) =>
    role === "admin" || can("position_grade", action);

  // ==================================================
  // STATE
  // ==================================================

  const [positionGrade, setPositionGrade] = useState("");
  const [minimumPay, setMinimumPay] = useState("");
  const [maximumPay, setMaximumPay] = useState("");
  const [positionGrades, setPositionGrades] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==================================================
  // FETCH
  // ==================================================

  const fetchPositionGrades = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/position-grades`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          getErrorMessage(data, "Failed to load position grades")
        );
      }

      setPositionGrades(data.position_grades || []);
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          "Failed to connect to the server. Please make sure the backend is running on http://127.0.0.1:8000"
        );
      } else {
        setError(err.message || "Failed to load position grades");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositionGrades();
  }, []);

  // ==================================================
  // HELPERS
  // ==================================================

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const resetForm = () => {
    setPositionGrade("");
    setMinimumPay("");
    setMaximumPay("");
    setEditingId(null);
  };

  // ==================================================
  // SAVE (CREATE / UPDATE)
  // ==================================================

  const handleSave = async () => {
    const value = positionGrade.trim();

    if (!value) {
      setError("Please enter a position grade.");
      return;
    }

    if (value.length > 200) {
      setError("Position grade must be 200 characters or fewer.");
      return;
    }

    if (minimumPay === "" || maximumPay === "") {
      setError("Please enter both minimum and maximum pay.");
      return;
    }

    const min = Number(minimumPay);
    const max = Number(maximumPay);

    if (Number.isNaN(min) || Number.isNaN(max)) {
      setError("Minimum and maximum pay must be valid numbers.");
      return;
    }

    if (min < 0 || max < 0) {
      setError("Pay values cannot be negative.");
      return;
    }

    if (min > max) {
      setError("Minimum pay cannot be greater than maximum pay.");
      return;
    }

    clearMessages();
    setSaving(true);

    try {
      const isEdit = editingId !== null;
      const url = isEdit
        ? `${API_BASE_URL}/position-grades/${editingId}`
        : `${API_BASE_URL}/position-grades`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          position_grade: value,
          minimum_pay: min,
          maximum_pay: max,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          getErrorMessage(
            data,
            isEdit
              ? "Failed to update position grade"
              : "Failed to create position grade"
          )
        );
      }

      setSuccess(
        isEdit
          ? "Position grade updated successfully."
          : "Position grade saved successfully."
      );
      resetForm();
      await fetchPositionGrades();
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          "Failed to connect to the server. Please make sure the backend is running on http://127.0.0.1:8000"
        );
      } else {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // EDIT
  // ==================================================

  const handleEdit = (item) => {
    clearMessages();
    setEditingId(item.pkPGId);
    setPositionGrade(item.PositionGrade || "");
    setMinimumPay(
      item.MinimumPay !== null && item.MinimumPay !== undefined
        ? String(item.MinimumPay)
        : ""
    );
    setMaximumPay(
      item.MaximumPay !== null && item.MaximumPay !== undefined
        ? String(item.MaximumPay)
        : ""
    );
  };

  // ==================================================
  // DELETE
  // ==================================================

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this position grade?")) {
      return;
    }

    clearMessages();
    setDeletingId(id);

    try {
      const res = await fetch(`${API_BASE_URL}/position-grades/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          getErrorMessage(data, "Failed to delete position grade")
        );
      }

      setSuccess("Position grade deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await fetchPositionGrades();
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          "Failed to connect to the server. Please make sure the backend is running on http://127.0.0.1:8000"
        );
      } else {
        setError(err.message || "Something went wrong");
      }
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
          Position Grades
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-theme-muted
          "
        >
          Create and manage position grades and pay scales.
        </p>
      </div>

      {/* ==================================================
          ADD / EDIT FORM
      ================================================== */}
      {(isAllowed("add") ||
        (editingId !== null && isAllowed("edit"))) && (
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
                  ? "Edit Position Grade"
                  : "Add Position Grade"}
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-theme-muted
                "
              >
                {editingId !== null
                  ? "Update the selected position grade and pay scale."
                  : "Enter position grade details and define the applicable pay scale."}
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
              <Award size={21} />
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div className="max-w-xl">
              <label
                htmlFor="positionGrade"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-theme-text
                "
              >
                Position Grade
              </label>

              <input
                id="positionGrade"
                type="text"
                value={positionGrade}
                onChange={(e) => {
                  setPositionGrade(e.target.value);
                  clearMessages();
                }}
                onKeyDown={handleKeyDown}
                maxLength={200}
                placeholder="Enter position grade"
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

            <div className="max-w-2xl">
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-theme-text
                "
              >
                Pay Scale
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="payScaleMin"
                    className="
                      mb-2
                      block
                      text-xs
                      font-medium
                      text-theme-muted
                    "
                  >
                    Minimum Pay
                  </label>

                  <input
                    id="payScaleMin"
                    type="number"
                    min="0"
                    step="0.01"
                    value={minimumPay}
                    onChange={(e) => {
                      setMinimumPay(e.target.value);
                      clearMessages();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter minimum pay"
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
                </div>

                <div>
                  <label
                    htmlFor="payScaleMax"
                    className="
                      mb-2
                      block
                      text-xs
                      font-medium
                      text-theme-muted
                    "
                  >
                    Maximum Pay
                  </label>

                  <input
                    id="payScaleMax"
                    type="number"
                    min="0"
                    step="0.01"
                    value={maximumPay}
                    onChange={(e) => {
                      setMaximumPay(e.target.value);
                      clearMessages();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter maximum pay"
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
                </div>
              </div>
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
                    ? "Update Position Grade"
                    : "Save Position Grade"}
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
              Saved Position Grades
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Position grades currently available in the system.
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
            <Award size={21} />
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
              Loading position grades…
            </p>
          </div>
        )}

        {!loading && positionGrades.length === 0 && (
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
              <Award size={26} />
            </div>

            <p
              className="
                mt-4
                font-medium
                text-theme-text
              "
            >
              No position grades found
            </p>

            <p
              className="
                mt-1
                text-sm
                text-theme-faint
              "
            >
              Add a position grade to get started.
            </p>
          </div>
        )}

        {!loading && positionGrades.length > 0 && (
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
                    Position Grade
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
                    Minimum Pay
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
                    Maximum Pay
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
                {positionGrades.map((item) => (
                  <tr
                    key={item.pkPGId}
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
                      {item.pkPGId}
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
                      {item.PositionGrade}
                    </td>

                    <td
                      className="
                        px-6
                        py-4
                        text-sm
                        text-theme-text
                      "
                    >
                      {formatPay(item.MinimumPay)}
                    </td>

                    <td
                      className="
                        px-6
                        py-4
                        text-sm
                        text-theme-text
                      "
                    >
                      {formatPay(item.MaximumPay)}
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
                              onClick={() => handleDelete(item.pkPGId)}
                              disabled={
                                saving || deletingId === item.pkPGId
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
