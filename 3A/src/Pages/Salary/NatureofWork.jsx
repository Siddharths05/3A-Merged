import { useState, useEffect } from "react";
import {
  BriefcaseBusiness,
  AlertCircle,
  CheckCircle2,
  Pencil,
  Trash2,
  Download,
  Printer,
} from "lucide-react";
import { usePermissions } from "../../components/Permissions";

// ==================================================
// REAL BACKEND
// TABLE: salnatureofwork
// PK: pkNWId  |  value: NatureOfWork  |  body: nature_of_work
// LIST KEY: nature_of_works
// max_length: 40
// ==================================================

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

export default function NatureOfWork() {
  const { role, can } = usePermissions();

  const isAllowed = (action) =>
    role === "admin" || can("salary_nature_of_work", action);

  const [natureOfWork, setNatureOfWork] = useState("");
  const [natureOfWorks, setNatureOfWorks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchNatureOfWorks = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/nature-of-works`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          getErrorMessage(data, "Failed to load nature of work entries")
        );
      }

      setNatureOfWorks(data.nature_of_works || []);
    } catch (err) {
      setError(err.message || "Failed to load nature of work entries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNatureOfWorks();
  }, []);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const resetForm = () => {
    setNatureOfWork("");
    setEditingId(null);
  };

  const handleSave = async () => {
    const value = natureOfWork.trim();

    if (!value) {
      setError("Please enter a nature of work.");
      return;
    }

    if (value.length > 40) {
      setError("Nature of work must be 40 characters or fewer.");
      return;
    }

    clearMessages();
    setSaving(true);

    try {
      const isEdit = editingId !== null;
      const url = isEdit
        ? `${API_BASE_URL}/nature-of-works/${editingId}`
        : `${API_BASE_URL}/nature-of-works`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ nature_of_work: value }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          getErrorMessage(
            data,
            isEdit
              ? "Failed to update nature of work"
              : "Failed to create nature of work"
          )
        );
      }

      setSuccess(
        isEdit
          ? "Nature of work updated successfully."
          : "Nature of work saved successfully."
      );
      resetForm();
      await fetchNatureOfWorks();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    clearMessages();
    setEditingId(item.pkNWId);
    setNatureOfWork(item.NatureOfWork || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this nature of work?")) {
      return;
    }

    clearMessages();
    setDeletingId(id);

    try {
      const res = await fetch(`${API_BASE_URL}/nature-of-works/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          getErrorMessage(data, "Failed to delete nature of work")
        );
      }

      setSuccess("Nature of work deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await fetchNatureOfWorks();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      clearMessages();

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const res = await fetch(`${API_BASE_URL}/nature-of-works/export`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          getErrorMessage(data, "Failed to export data")
        );
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const date = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "_");
      link.download = `export_NatureOfWork_${date}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess("Excel file downloaded successfully.");
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          "Failed to connect to the server. Please make sure the backend is running."
        );
      } else {
        setError(err.message || "Failed to export data");
      }
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = async () => {
    try {
      setPrinting(true);
      clearMessages();

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const res = await fetch(`${API_BASE_URL}/nature-of-works/print`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          getErrorMessage(data, "Failed to print data")
        );
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const date = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "_");
      link.download = `print_NatureOfWork_${date}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess("Word file downloaded successfully.");
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          "Failed to connect to the server. Please make sure the backend is running."
        );
      } else {
        setError(err.message || "Failed to print data");
      }
    } finally {
      setPrinting(false);
    }
  };

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-theme-text sm:text-3xl">
          Nature of Work
        </h1>
        <p className="mt-1 text-sm text-theme-muted">
          Create and manage nature-of-work classifications.
        </p>
      </div>

      {(isAllowed("add") || (editingId !== null && isAllowed("edit"))) && (
        <div className="overflow-hidden rounded-2xl border border-theme-border bg-card shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-theme-border px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-theme-text">
                {editingId !== null
                  ? "Edit Nature of Work"
                  : "Add Nature of Work"}
              </h2>
              <p className="mt-1 text-sm text-theme-muted">
                {editingId !== null
                  ? "Update the selected nature of work."
                  : "Enter a nature of work to add it to the master list."}
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-theme-primary-soft text-theme-primary">
              <BriefcaseBusiness size={21} />
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div className="max-w-xl">
              <label
                htmlFor="natureOfWork"
                className="mb-2 block text-sm font-semibold text-theme-text"
              >
                Nature of Work
              </label>
              <input
                id="natureOfWork"
                type="text"
                value={natureOfWork}
                onChange={(e) => {
                  setNatureOfWork(e.target.value);
                  clearMessages();
                }}
                onKeyDown={handleKeyDown}
                maxLength={40}
                placeholder="Enter nature of work"
                disabled={saving}
                className="h-12 w-full rounded-xl border border-theme-border bg-[var(--erp-background)] px-4 text-sm text-theme-text outline-none transition-all placeholder:text-theme-faint focus:border-theme-primary focus:ring-2 focus:ring-theme-primary-soft disabled:opacity-60"
              />
              <p className="mt-2 text-xs text-theme-faint">
                Maximum 40 characters.
              </p>
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

            <div className="flex flex-wrap items-center gap-3 border-t border-theme-border pt-6">
              <button
                type="button"
                onClick={handleSave}
                disabled={
                  saving ||
                  (editingId === null && !isAllowed("add")) ||
                  (editingId !== null && !isAllowed("edit"))
                }
                className="inline-flex h-11 items-center justify-center rounded-xl bg-theme-primary px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving…"
                  : editingId !== null
                    ? "Update Nature of Work"
                    : "Save Nature of Work"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    clearMessages();
                  }}
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-theme-border bg-card px-5 text-sm font-semibold text-theme-text transition-all duration-200 hover:bg-theme-primary-soft/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-theme-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-theme-border px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-theme-text">
              Saved Nature of Work Entries
            </h2>
            <p className="mt-1 text-sm text-theme-muted">
              Nature of work classifications currently available in the system.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAllowed("export") && (
              <button
                type="button"
                onClick={handleExport}
                disabled={
                  loading ||
                  exporting ||
                  printing ||
                  natureOfWorks.length === 0
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download size={16} />
                {exporting ? "Exporting…" : "Export"}
              </button>
            )}

            {isAllowed("print") && (
              <button
                type="button"
                onClick={handlePrint}
                disabled={
                  loading ||
                  exporting ||
                  printing ||
                  natureOfWorks.length === 0
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Printer size={16} />
                {printing ? "Preparing…" : "Print"}
              </button>
            )}

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-theme-primary-soft text-theme-primary">
              <BriefcaseBusiness size={21} />
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-theme-muted">
              Loading nature of work entries…
            </p>
          </div>
        )}

        {!loading && natureOfWorks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-theme-primary-soft text-theme-primary">
              <BriefcaseBusiness size={26} />
            </div>
            <p className="mt-4 font-medium text-theme-text">
              No nature of work entries found
            </p>
            <p className="mt-1 text-sm text-theme-faint">
              Add a nature of work to get started.
            </p>
          </div>
        )}

        {!loading && natureOfWorks.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-theme-border bg-[var(--erp-background)]">
                  <th className="w-20 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-muted">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-muted">
                    Nature of Work
                  </th>
                  {(isAllowed("edit") || isAllowed("delete")) && (
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-theme-muted">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border">
                {natureOfWorks.map((item) => (
                  <tr
                    key={item.pkNWId}
                    className="transition-colors hover:bg-theme-primary-soft/40"
                  >
                    <td className="px-6 py-4 text-sm text-theme-muted">
                      {item.pkNWId}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-theme-text">
                      {item.NatureOfWork}
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
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-theme-muted transition-colors hover:bg-theme-primary-soft hover:text-theme-primary disabled:opacity-50"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                          {isAllowed("delete") && (
                            <button
                              type="button"
                              onClick={() => handleDelete(item.pkNWId)}
                              disabled={
                                saving || deletingId === item.pkNWId
                              }
                              title="Delete"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-theme-muted transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
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
