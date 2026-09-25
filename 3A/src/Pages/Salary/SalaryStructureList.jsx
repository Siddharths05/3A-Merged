import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Pencil,
  Trash2,
  Plus,
  Search,
  RefreshCw,
  AlertCircle,
  X,
  Calculator,
  ClipboardList,
  ListChecks,
} from "lucide-react";

import { Can } from "../../components/Permissions";

const API_BASE_URL = "http://127.0.0.1:8000/api";

function formatApiError(data, fallback) {
  const detail = data?.detail;

  if (!detail) return fallback;
  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "string") return item;

        const field = Array.isArray(item?.loc)
          ? item.loc[item.loc.length - 1]
          : null;

        return field ? `${field}: ${item.msg}` : item?.msg;
      })
      .filter(Boolean)
      .join("; ");
  }

  return fallback;
}

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

export default function SalaryStructureList() {
  const navigate = useNavigate();

  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchStructures = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/salary-structures`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          formatApiError(data, "Failed to load salary structures.")
        );
      }

      const rows = Array.isArray(data)
        ? data
        : Array.isArray(data.structures)
          ? data.structures
          : [];

      setStructures(rows);
    } catch (err) {
      setStructures([]);
      setError(err.message || "Failed to load salary structures.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStructures();
  }, [fetchStructures]);

  const filteredStructures = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return structures;

    return structures.filter((row) => {
      const haystack = [
        row.pkSalStructureId,
        row.fkEmpId,
        row.EmployeeName,
        row.AttendanceRules,
        row.SuppliedTo,
        row.ManpowerAgency,
      ]
        .filter(
          (value) =>
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ""
        )
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [structures, searchTerm]);

  const openStructure = (id) => {
    if (
      id === null ||
      id === undefined ||
      String(id).trim() === ""
    ) {
      return;
    }

    navigate(`/salary-structure/${id}`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    setDeleteError("");

    try {
      const id = deleteTarget.pkSalStructureId;

      const response = await fetch(
        `${API_BASE_URL}/salary-structures/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          formatApiError(data, "Failed to delete salary structure.")
        );
      }

      setDeleteTarget(null);
      await fetchStructures();
    } catch (err) {
      setDeleteError(
        err.message || "Failed to delete salary structure."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="overflow-hidden rounded-2xl border border-theme-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-theme-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-theme-primary-soft text-theme-primary">
              <Calculator size={20} />
            </div>

            <div>
              <h1 className="text-lg font-semibold text-theme-text">
                Salary Structures
              </h1>
              <p className="mt-1 text-sm text-theme-muted">
                Pay components, leave, and deductions per employee.
              </p>
            </div>
          </div>

          <Can module="salary_structure" action="add">
            <button
              type="button"
              onClick={() => navigate("/salary-structure")}
              className="flex h-10 items-center gap-2 rounded-xl bg-theme-primary px-4 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Plus size={16} />
              New Salary Structure
            </button>
          </Can>
        </div>

        <div className="flex items-center gap-1 px-4 pt-3">
          <Link
            to="/salary-structure"
            className="inline-flex items-center justify-center gap-2 rounded-t-lg border-b-2 border-transparent px-4 py-2 text-sm font-semibold text-theme-muted transition hover:text-theme-primary"
          >
            <ClipboardList size={15} />
            Salary Structure
          </Link>

          <div className="inline-flex items-center justify-center gap-2 rounded-t-lg border-b-2 border-theme-primary px-4 py-2 text-sm font-semibold text-theme-primary">
            <ListChecks size={15} />
            List
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-theme-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-theme-faint"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search employee, ID, or attendance rule…"
              className="h-10 w-full rounded-xl border border-theme-border bg-[var(--erp-background)] pl-9 pr-3 text-sm text-theme-text outline-none focus:border-theme-primary"
            />
          </div>

          <button
            type="button"
            onClick={fetchStructures}
            disabled={loading}
            className="flex h-10 items-center gap-2 rounded-xl border border-theme-border px-4 text-sm font-semibold text-theme-text transition hover:bg-theme-primary-soft disabled:opacity-50"
          >
            <RefreshCw size={15} />
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-theme-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-theme-primary-soft text-left text-theme-text">
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Employee</th>
                <th className="px-4 py-3 font-semibold">Salary Start</th>
                <th className="px-4 py-3 font-semibold">Salary End</th>
                <th className="px-4 py-3 font-semibold">Basic</th>
                <th className="px-4 py-3 font-semibold">Gross Salary</th>
                <th className="px-4 py-3 font-semibold">Attendance Rules</th>
                <th className="w-24 px-4 py-3" />
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-theme-faint"
                  >
                    Loading salary structures…
                  </td>
                </tr>
              )}

              {!loading && filteredStructures.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-theme-faint"
                  >
                    {searchTerm
                      ? "No matching salary structures found."
                      : "No salary structures found."}
                  </td>
                </tr>
              )}

              {!loading &&
                filteredStructures.map((row) => {
                  const id = row.pkSalStructureId;

                  return (
                    <tr
                      key={String(id)}
                      className="border-t border-theme-border hover:bg-theme-primary-soft/40"
                    >
                      <td className="px-4 py-3 text-theme-text">
                        {id ?? "—"}
                      </td>

                      <td className="px-4 py-3 text-theme-text">
                        {row.EmployeeName || row.fkEmpId || "—"}
                      </td>

                      <td className="px-4 py-3 text-theme-text">
                        {row.SalaryStart
                          ? String(row.SalaryStart).slice(0, 10)
                          : "—"}
                      </td>

                      <td className="px-4 py-3 text-theme-text">
                        {row.SalaryEnd
                          ? String(row.SalaryEnd).slice(0, 10)
                          : "—"}
                      </td>

                      <td className="px-4 py-3 text-theme-text">
                        {row.Basic ?? "—"}
                      </td>

                      <td className="px-4 py-3 font-semibold text-theme-text">
                        {row.GrossSalary ?? "—"}
                      </td>

                      <td className="px-4 py-3 text-theme-text">
                        {row.AttendanceRules || "—"}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Can module="salary_structure" action="edit">
                            <button
                              type="button"
                              onClick={() => openStructure(id)}
                              className="rounded-lg p-1.5 text-theme-muted transition hover:bg-theme-primary-soft hover:text-theme-primary"
                              title="Edit"
                            >
                              <Pencil size={15} />
                            </button>
                          </Can>

                          <Can module="salary_structure" action="delete">
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteError("");
                                setDeleteTarget(row);
                              }}
                              className="rounded-lg p-1.5 text-theme-muted transition hover:bg-red-50 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </Can>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-theme-border bg-card p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-theme-text">
                Delete salary structure?
              </h2>

              <button
                type="button"
                onClick={() => {
                  if (!deleting) {
                    setDeleteTarget(null);
                    setDeleteError("");
                  }
                }}
                className="text-theme-faint transition hover:text-theme-text disabled:opacity-50"
                disabled={deleting}
              >
                <X size={18} />
              </button>
            </div>

            <p className="mt-2 text-sm text-theme-muted">
              This will permanently remove salary structure #
              {deleteTarget.pkSalStructureId}. This cannot be undone.
            </p>

            {deleteError && (
              <p className="mt-3 text-sm text-red-600">
                {deleteError}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!deleting) {
                    setDeleteTarget(null);
                    setDeleteError("");
                  }
                }}
                disabled={deleting}
                className="h-10 rounded-xl border border-theme-border px-4 text-sm font-semibold text-theme-text transition hover:bg-theme-primary-soft disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="h-10 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
