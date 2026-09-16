import { useEffect, useState } from "react";

import {
  Activity,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  Download,
  Printer,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function AbilityMaster() {
  const [ability, setAbility] = useState("");
  const [abilities, setAbilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const fetchAbilities = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/abilities`,
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

      setAbilities(
        Array.isArray(data.abilities)
          ? data.abilities
          : []
      );
    } catch (err) {
      console.error(
        "Fetch abilities error:",
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbilities();
  }, []);

  const resetForm = () => {
    setAbility("");
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    setAbility(e.target.value);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedAbility =
      ability.trim();

    if (!trimmedAbility) {
      setError(
        "Please enter an ability."
      );
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

      const isEditing =
        editingId !== null;

      const url = isEditing
        ? `${API_BASE_URL}/abilities/${editingId}`
        : `${API_BASE_URL}/abilities`;

      const response = await fetch(
        url,
        {
          method: isEditing
            ? "PUT"
            : "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            abilities:
              trimmedAbility,
          }),
        }
      );

      if (!response.ok) {
        const message =
          await getErrorMessage(response);
        throw new Error(message);
      }

      const data =
        await response.json();

      setSuccess(
        data.message ||
          (
            isEditing
              ? "Ability updated successfully."
              : "Ability created successfully."
          )
      );

      setAbility("");
      setEditingId(null);
      await fetchAbilities();
    } catch (err) {
      console.error(
        "Save ability error:",
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

  const handleEdit = (item) => {
    setEditingId(item.pkABId);
    setAbility(item.Abilities || "");
    setError("");
    setSuccess("");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (item) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${item.Abilities}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(item.pkABId);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/abilities/${item.pkABId}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const message =
          await getErrorMessage(response);
        throw new Error(message);
      }

      const data =
        await response.json();

      setSuccess(
        data.message ||
          "Ability deleted successfully."
      );

      if (
        editingId === item.pkABId
      ) {
        setAbility("");
        setEditingId(null);
      }

      await fetchAbilities();
    } catch (err) {
      console.error(
        "Delete ability error:",
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
      setDeletingId(null);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/abilities/export`,
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

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const date = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "_");
      link.download = `export_Ability_${date}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess("Excel file downloaded successfully.");
    } catch (err) {
      console.error("Export error:", err);
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
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/abilities/print`,
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

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const date = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "_");
      link.download = `print_Ability_${date}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess("Word file downloaded successfully.");
    } catch (err) {
      console.error("Print error:", err);
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

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-theme-text sm:text-3xl">
          Ability
        </h1>
        <p className="mt-1 text-sm text-theme-muted">
          Create and manage employee abilities.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-theme-border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-theme-border px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-theme-text">
              {editingId !== null
                ? "Edit Ability"
                : "Add Ability"}
            </h2>
            <p className="mt-1 text-sm text-theme-muted">
              {editingId !== null
                ? "Update the selected ability."
                : "Enter a new ability to add it to the master list."}
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-theme-primary-soft text-theme-primary">
            <Activity size={21} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="max-w-xl">
            <label
              htmlFor="ability"
              className="mb-2 block text-sm font-semibold text-theme-text"
            >
              Ability
            </label>
            <input
              id="ability"
              type="text"
              value={ability}
              onChange={handleChange}
              placeholder="Enter ability"
              maxLength={30}
              disabled={saving}
              className="h-12 w-full rounded-xl border border-theme-border bg-[var(--erp-background)] px-4 text-sm text-theme-text outline-none transition-all placeholder:text-theme-faint focus:border-theme-primary focus:ring-2 focus:ring-theme-primary-soft disabled:cursor-not-allowed disabled:opacity-60"
            />
            <p className="mt-2 text-xs text-theme-faint">
              Maximum 30 characters.
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
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-theme-primary px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId !== null
                ? "Update Ability"
                : "Save Ability"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-theme-border bg-card px-5 text-sm font-semibold text-theme-text transition-all hover:bg-theme-primary-soft disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X size={17} />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-theme-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-theme-border px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-theme-text">
              Saved Abilities
            </h2>
            <p className="mt-1 text-sm text-theme-muted">
              Abilities currently available in the system.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              disabled={
                loading ||
                exporting ||
                printing ||
                abilities.length === 0
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download size={16} />
              {exporting ? "Exporting…" : "Export"}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={
                loading ||
                exporting ||
                printing ||
                abilities.length === 0
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Printer size={16} />
              {printing ? "Preparing…" : "Print"}
            </button>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-theme-primary-soft text-theme-primary">
              <Activity size={21} />
            </div>
          </div>
        </div>

        {loading && (
          <div className="px-6 py-12 text-center text-sm text-theme-muted">
            Loading abilities...
          </div>
        )}

        {!loading && abilities.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-theme-primary-soft text-theme-primary">
              <Activity size={26} />
            </div>
            <p className="mt-4 font-medium text-theme-text">
              No abilities found
            </p>
            <p className="mt-1 text-sm text-theme-faint">
              Add an ability to get started.
            </p>
          </div>
        )}

        {!loading && abilities.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-theme-border bg-[var(--erp-background)]">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-muted">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-muted">
                    Ability
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-theme-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border">
                {abilities.map((item) => (
                  <tr
                    key={item.pkABId}
                    className="transition-colors hover:bg-theme-primary-soft/40"
                  >
                    <td className="px-6 py-4 text-sm text-theme-muted">
                      {item.pkABId}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-theme-text">
                      {item.Abilities}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(item)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-theme-primary transition hover:bg-theme-primary-soft"
                          title="Edit Ability"
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(item)
                          }
                          disabled={
                            deletingId === item.pkABId
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-theme-danger transition hover:bg-theme-danger-soft disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete Ability"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
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
