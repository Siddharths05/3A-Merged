import {
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
  Users,
  ClipboardList,
  ListChecks,
} from "lucide-react";

import { Can } from "../../components/Permissions";


// ==================================================
// API
// ==================================================

const API_BASE_URL =
  "http://127.0.0.1:8000/api";


// ==================================================
// SALARY EMPLOYEE LIST
// ==================================================

export default function SalaryEmployeeList() {


  const navigate =
    useNavigate();


  // ==================================================
  // STATE
  // ==================================================

  const [employees, setEmployees] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState("");

  // pkEmpId -> true for rows whose stored photo failed to
  // render, so those fall back to initials.

  const [failedPhotos, setFailedPhotos] =
    useState({});


  // ==================================================
  // AUTH HEADERS
  // ==================================================

  const getAuthHeaders = () => {

    const token =
      localStorage.getItem("access_token");

    if (!token) {

      throw new Error(
        "Authentication token not found."
      );

    }

    return {

      Authorization: `Bearer ${token}`,

      Accept: "application/json",

      "Content-Type": "application/json",

    };

  };


  // ==================================================
  // FETCH EMPLOYEES
  // ==================================================

  const fetchEmployees = async () => {

    setError("");
    setLoading(true);
    setFailedPhotos({});

    try {

      const response = await fetch(
        `${API_BASE_URL}/salary-employees`,
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.detail || "Failed to load employees."
        );

      }

      setEmployees(data.employees || []);

    } catch (err) {

      setError(err.message || "Something went wrong.");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchEmployees();

  }, []);


  // ==================================================
  // SEARCH / FILTER
  // Client-side — the list endpoint doesn't take query
  // params yet, and this data set is small enough that
  // filtering after fetch is perfectly fine.
  // ==================================================

  const filteredEmployees = useMemo(() => {

    const term = searchTerm.trim().toLowerCase();

    if (!term) return employees;

    return employees.filter((employee) => {

      const haystack = [
        employee.pkEmpId,
        employee.EmpCode,
        employee.Employee,
        employee.fkDepId,
        employee.fkDegId,
        employee.WP,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);

    });

  }, [employees, searchTerm]);


  // ==================================================
  // DELETE
  // ==================================================

  const confirmDelete = async () => {

    if (!deleteTarget) return;

    setDeleteError("");
    setDeleting(true);

    try {

      const response = await fetch(
        `${API_BASE_URL}/salary-employees/${deleteTarget.pkEmpId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {

        const data = await response.json();

        throw new Error(
          data.detail || "Failed to delete employee."
        );

      }

      setEmployees((previous) =>
        previous.filter(
          (employee) =>
            employee.pkEmpId !== deleteTarget.pkEmpId
        )
      );

      setDeleteTarget(null);

    } catch (err) {

      setDeleteError(err.message || "Something went wrong.");

    } finally {

      setDeleting(false);

    }

  };


  // ==================================================
  // HELPERS
  // ==================================================

  const formatDate = (value) => {

    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };

  const getInitials = (name) => {

    if (!name) return "EM";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  };


  // ==================================================
  // COMPONENT
  // ==================================================

  return (

    <div className="w-full space-y-6">


      {/* ==================================================
          EMPLOYEE / LIST TABS
          Mirrors the tab pair on the Salary Employee Master
          page so the two feel like one window, matching the
          legacy Employee form's Employee/List tabs.
      ================================================== */}

      <div
        className="
          flex
          items-center
          gap-1
          rounded-2xl
          border
          border-theme-border
          bg-card
          px-4
          pt-3
          shadow-sm
        "
      >

        <Link
          to="/salary-employee"
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-t-lg
            border-b-2
            border-transparent
            px-4
            py-2
            text-sm
            font-semibold
            text-theme-muted
            transition
            hover:text-theme-primary
          "
        >

          <ClipboardList size={15} />
          Employee

        </Link>

        <div
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-t-lg
            border-b-2
            border-theme-primary
            px-4
            py-2
            text-sm
            font-semibold
            text-theme-primary
          "
        >

          <ListChecks size={15} />
          List

        </div>

      </div>


      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

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

            Salary Employees

          </h1>

          <p
            className="
              mt-1
              text-sm
              text-theme-muted
            "
          >

            {loading
              ? "Loading employee records…"
              : `${filteredEmployees.length} of ${employees.length} employee${employees.length === 1 ? "" : "s"}`}

          </p>

        </div>


        <div className="flex flex-wrap items-center gap-2">

          <button
            type="button"
            onClick={fetchEmployees}
            disabled={loading}
            className="
              inline-flex
              h-11
              items-center
              gap-2
              rounded-xl
              border
              border-theme-border
              bg-card
              px-4
              text-sm
              font-semibold
              text-theme-text
              transition
              hover:border-theme-primary
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >

            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh

          </button>

          <Can module="salary_employee" action="add">

            <Link
              to="/salary-employee"
              className="
                inline-flex
                h-11
                items-center
                gap-2
                rounded-xl
                bg-theme-primary
                px-5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-all
                hover:opacity-90
                hover:shadow-md
              "
            >

              <Plus size={17} />
              Add New Employee

            </Link>

          </Can>

        </div>

      </div>


      {/* ==================================================
          SEARCH
      ================================================== */}

      <div className="relative max-w-md">

        <Search
          size={17}
          className="
            pointer-events-none
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-theme-faint
          "
        />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, code, department…"
          className="
            h-11
            w-full
            rounded-xl
            border
            border-theme-border
            bg-card
            pl-11
            pr-4
            text-sm
            text-theme-text
            outline-none
            transition-all
            focus:border-theme-primary
            focus:ring-2
            focus:ring-theme-primary-soft
          "
        />

      </div>


      {/* ==================================================
          ERROR
      ================================================== */}

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


      {/* ==================================================
          TABLE / EMPTY / LOADING
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

        {/* ================================================
            LIST HEADER
        ================================================ */}

        <div
          className="
            flex
            items-start
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
                font-bold
                text-theme-text
              "
            >

              Saved Employees

            </h2>

            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >

              Salary employees currently available in the system.

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

            <Users size={20} />

          </div>

        </div>


        {loading ? (

          <div className="flex flex-col items-center justify-center gap-3 py-20">

            <RefreshCw
              size={26}
              className="animate-spin text-theme-primary"
            />

            <p className="text-sm text-theme-muted">
              Loading employees…
            </p>

          </div>

        ) : filteredEmployees.length === 0 ? (

          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-theme-primary-soft
                text-theme-primary
              "
            >

              <Users size={24} />

            </div>

            <p className="font-semibold text-theme-text">

              {employees.length === 0
                ? "No employees yet"
                : "No employees match your search"}

            </p>

            <p className="max-w-xs text-sm text-theme-muted">

              {employees.length === 0
                ? "Add your first salary employee to get started."
                : "Try a different name, code or department."}

            </p>

            {employees.length === 0 && (

              <Can module="salary_employee" action="add">

                <Link
                  to="/salary-employee"
                  className="
                    mt-2
                    inline-flex
                    h-10
                    items-center
                    gap-2
                    rounded-xl
                    bg-theme-primary
                    px-4
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:opacity-90
                  "
                >

                  <Plus size={16} />
                  Add New Employee

                </Link>

              </Can>

            )}

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead>

                <tr
                  className="
                    border-b
                    border-theme-border
                    bg-[var(--erp-background)]
                  "
                >

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-primary/70">
                    Employee
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-primary/70">
                    Code
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-primary/70">
                    Department
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-primary/70">
                    Designation
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-primary/70">
                    Joining Date
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-theme-primary/70">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-theme-border">

                {filteredEmployees.map((employee) => (

                  <tr
                    key={employee.pkEmpId}
                    className="
                      transition-colors
                      hover:bg-theme-primary-soft/40
                    "
                  >

                    {/* EMPLOYEE */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-full
                            bg-theme-primary-soft
                            text-sm
                            font-semibold
                            text-theme-primary
                          "
                        >

                          {/* Photo when the record has one,
                              initials otherwise. onError falls
                              back to initials if the stored
                              blob isn't a usable image. */}

                          {failedPhotos[employee.pkEmpId] ||
                          !employee.Photo ? (

                            getInitials(employee.Employee)

                          ) : (

                            <img
                              src={employee.Photo}
                              alt={employee.Employee || "Employee photo"}
                              onError={() =>
                                setFailedPhotos((previous) => ({
                                  ...previous,
                                  [employee.pkEmpId]: true,
                                }))
                              }
                              className="h-full w-full object-cover"
                            />

                          )}

                        </div>

                        <div>

                          <p className="font-medium text-theme-text">

                            {employee.Employee || "Unnamed Employee"}

                          </p>

                          <p className="text-xs text-theme-faint">

                            ID #{employee.pkEmpId}

                          </p>

                        </div>

                      </div>

                    </td>


                    {/* CODE */}

                    <td className="px-6 py-4">

                      <span className="text-sm text-theme-muted">
                        {employee.EmpCode || "—"}
                      </span>

                    </td>


                    {/* DEPARTMENT */}

                    <td className="px-6 py-4">

                      <span className="text-sm text-theme-muted">
                        {employee.fkDepId || "—"}
                      </span>

                    </td>


                    {/* DESIGNATION */}

                    <td className="px-6 py-4">

                      <span className="text-sm text-theme-muted">
                        {employee.fkDegId || "—"}
                      </span>

                    </td>


                    {/* JOINING DATE */}

                    <td className="px-6 py-4">

                      <span className="text-sm text-theme-muted">
                        {formatDate(employee.DOJ)}
                      </span>

                    </td>


                    {/* ACTIONS */}

                    <td className="px-6 py-4">

                      <div className="flex items-center justify-end gap-2">

                        <Can module="salary_employee" action="edit">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/salary-employee/${employee.pkEmpId}`
                              )
                            }
                            title="Edit"
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              text-theme-primary
                              transition
                              hover:bg-theme-primary-soft
                            "
                          >

                            <Pencil size={16} />

                          </button>

                        </Can>

                        <Can module="salary_employee" action="delete">

                          <button
                            type="button"
                            onClick={() => {
                              setDeleteError("");
                              setDeleteTarget(employee);
                            }}
                            title="Delete"
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              text-theme-danger
                              transition
                              hover:bg-theme-danger-soft
                            "
                          >

                            <Trash2 size={16} />

                          </button>

                        </Can>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ==================================================
          DELETE CONFIRMATION MODAL
      ================================================== */}

      {deleteTarget && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/50
            px-4
            backdrop-blur-sm
          "
        >

          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              border
              border-theme-border
              bg-card
              p-6
              shadow-2xl
            "
          >

            <div className="flex items-start justify-between">

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-theme-danger-soft
                  text-theme-danger
                "
              >
                <Trash2 size={21} />
              </div>

              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="
                  rounded-lg
                  p-2
                  text-theme-faint
                  transition
                  hover:bg-theme-primary-soft
                  hover:text-theme-text
                  disabled:opacity-50
                "
              >
                <X size={19} />
              </button>

            </div>

            <h3
              className="
                mt-5
                text-lg
                font-semibold
                text-theme-text
              "
            >
              Delete Employee
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-theme-muted
              "
            >

              Are you sure you want to permanently delete{" "}

              <span className="font-semibold text-theme-text">

                {deleteTarget.Employee ||
                  `Employee #${deleteTarget.pkEmpId}`}

              </span>

              ? This cannot be undone.

            </p>

            {deleteError && (

              <div
                className="
                  mt-4
                  flex
                  items-start
                  gap-2
                  rounded-xl
                  border
                  border-theme-danger/30
                  bg-theme-danger-soft
                  px-3
                  py-2.5
                  text-xs
                  text-theme-danger
                "
              >

                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{deleteError}</span>

              </div>

            )}

            <div
              className="
                mt-6
                flex
                justify-end
                gap-3
              "
            >

              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="
                  h-10
                  rounded-xl
                  border
                  border-theme-border
                  px-4
                  text-sm
                  font-semibold
                  text-theme-text
                  transition
                  hover:border-theme-primary
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="
                  inline-flex
                  h-10
                  items-center
                  gap-2
                  rounded-xl
                  bg-theme-danger
                  px-4
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:opacity-90
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {deleting ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <Trash2 size={15} />
                )}

                {deleting ? "Deleting…" : "Delete"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}