import { useState, useEffect } from "react";
import {
  Palette,
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
// TABLE: salskintones
// PK: pkSkinId  |  value: Colour  |  body: colour
// LIST KEY: skin_tones
// max_length: 25
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

export default function SkinTone() {
  const { role, can } = usePermissions();

  const isAllowed = (action) =>
    role === "admin" || can("salary_skin_tone", action);

  const [colour, setColour] = useState("");
  const [skinTones, setSkinTones] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchSkinTones = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/skin-tones`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          getErrorMessage(data, "Failed to load skin tones")
        );
      }

      setSkinTones(data.skin_tones || []);
    } catch (err) {
      setError(err.message || "Failed to load skin tones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkinTones();
  }, []);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const resetForm = () => {
    setColour("");
    setEditingId(null);
  };

  const handleSave = async () => {
    const value = colour.trim();

    if (!value) {
      setError("Please enter a skin tone (colour).");
      return;
    }

    if (value.length > 25) {
      setError("Skin tone must be 25 characters or fewer.");
      return;
    }

    clearMessages();
    setSaving(true);

    try {
      const isEdit = editingId !== null;
      const url = isEdit
        ? `${API_BASE_URL}/skin-tones/${editingId}`
        : `${API_BASE_URL}/skin-tones`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ colour: value }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          getErrorMessage(
            data,
            isEdit
              ? "Failed to update skin tone"
              : "Failed to create skin tone"
          )
        );
      }

      setSuccess(
        isEdit
          ? "Skin tone updated successfully."
          : "Skin tone saved successfully."
      );
      resetForm();
      await fetchSkinTones();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    clearMessages();
    setEditingId(item.pkSkinId);
    setColour(item.Colour || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skin tone?")) {
      return;
    }

    clearMessages();
    setDeletingId(id);

    try {
      const res = await fetch(`${API_BASE_URL}/skin-tones/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          getErrorMessage(data, "Failed to delete skin tone")
        );
      }

      setSuccess("Skin tone deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await fetchSkinTones();
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

      const res = await fetch(`${API_BASE_URL}/skin-tones/export`, {
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
      link.download = `export_SkinTone_${date}.xlsx`;
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

      const res = await fetch(`${API_BASE_URL}/skin-tones/print`, {
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
      link.download = `print_SkinTone_${date}.docx`;
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
          Skin Tones
        </h1>
        <p className="mt-1 text-sm text-theme-muted">
          Create and manage skin tone classifications.
        </p>
      </div>

      {(isAllowed("add") || (editingId !== null && isAllowed("edit"))) && (
        <div className="overflow-hidden rounded-2xl border border-theme-border bg-card shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-theme-border px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-theme-text">
                {editingId !== null ? "Edit Skin Tone" : "Add Skin Tone"}
              </h2>
              <p className="mt-1 text-sm text-theme-muted">
                {editingId !== null
                  ? "Update the selected skin tone."
                  : "Enter a colour to add it to the master list."}
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-theme-primary-soft text-theme-primary">
              <Palette size={21} />
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div className="max-w-xl">
              <label
                htmlFor="colour"
                className="mb-2 block text-sm font-semibold text-theme-text"
              >
                Colour
              </label>
              <input
                id="colour"
                type="text"
                value={colour}
                onChange={(e) => {
                  setColour(e.target.value);
                  clearMessages();
                }}
                onKeyDown={handleKeyDown}
                maxLength={25}
                placeholder="Enter colour"
                disabled={saving}
                className="h-12 w-full rounded-xl border border-theme-border bg-[var(--erp-background)] px-4 text-sm text-theme-text outline-none transition-all placeholder:text-theme-faint focus:border-theme-primary focus:ring-2 focus:ring-theme-primary-soft disabled:opacity-60"
              />
              <p className="mt-2 text-xs text-theme-faint">
                Maximum 25 characters.
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
                    ? "Update Skin Tone"
                    : "Save Skin Tone"}
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
              Saved Skin Tones
            </h2>
            <p className="mt-1 text-sm text-theme-muted">
              Skin tones currently available in the system.
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
                  skinTones.length === 0
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
                  skinTones.length === 0
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Printer size={16} />
                {printing ? "Preparing…" : "Print"}
              </button>
            )}

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-theme-primary-soft text-theme-primary">
              <Palette size={21} />
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-theme-muted">Loading skin tones…</p>
          </div>
        )}

        {!loading && skinTones.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-theme-primary-soft text-theme-primary">
              <Palette size={26} />
            </div>
            <p className="mt-4 font-medium text-theme-text">
              No skin tones found
            </p>
            <p className="mt-1 text-sm text-theme-faint">
              Add a skin tone to get started.
            </p>
          </div>
        )}

        {!loading && skinTones.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-theme-border bg-[var(--erp-background)]">
                  <th className="w-20 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-muted">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-muted">
                    Colour
                  </th>
                  {(isAllowed("edit") || isAllowed("delete")) && (
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-theme-muted">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border">
                {skinTones.map((item) => (
                  <tr
                    key={item.pkSkinId}
                    className="transition-colors hover:bg-theme-primary-soft/40"
                  >
                    <td className="px-6 py-4 text-sm text-theme-muted">
                      {item.pkSkinId}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-theme-text">
                      {item.Colour}
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
                              onClick={() => handleDelete(item.pkSkinId)}
                              disabled={
                                saving || deletingId === item.pkSkinId
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
