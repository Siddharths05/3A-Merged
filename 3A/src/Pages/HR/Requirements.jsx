import { useEffect, useState } from "react";

import {
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  Pencil,
  Trash2,
  X,
  Download,
  Printer,
} from "lucide-react";

import { usePermissions } from "../../components/Permissions";


const API_BASE_URL = "http://127.0.0.1:8000/api";


export default function Requirements() {

  // ==================================================
  // PERMISSIONS
  // ==================================================

  const { role, can } = usePermissions();

  const isAllowed = (action) =>
    role === "admin" || can("requirement", action);


  // ==================================================
  // STATE
  // ==================================================

  const [requirement, setRequirement] = useState("");

  const [requirements, setRequirements] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [exporting, setExporting] = useState(false);

  const [printing, setPrinting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


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
  // LOAD REQUIREMENTS
  // ==================================================

  const fetchRequirements = async () => {
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
        `${API_BASE_URL}/requirements`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load requirements."
        );
      }

      const data = await response.json();

      setRequirements(
        Array.isArray(data.requirements)
          ? data.requirements
          : []
      );
    } catch (err) {
      console.error(
        "Fetch requirements error:",
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
    fetchRequirements();
  }, []);


  // ==================================================
  // HANDLE INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {
    setRequirement(e.target.value);
  };


  // ==================================================
  // START EDITING A ROW
  // ==================================================

  const handleEditClick = (item) => {
    setEditingId(item.pkRId);

    setRequirement(item.Requirement);

    setError("");

    setSuccess("");
  };


  // ==================================================
  // CANCEL EDITING
  // ==================================================

  const handleCancelEdit = () => {
    setEditingId(null);

    setRequirement("");

    setError("");
  };


  // ==================================================
  // SAVE (CREATE OR UPDATE)
  // ==================================================

  const handleSave = async () => {
    const value = requirement.trim();

    if (!value) {
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

      const isEditing = editingId !== null;

      const url = isEditing
        ? `${API_BASE_URL}/requirements/${editingId}`
        : `${API_BASE_URL}/requirements`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          requirement: value,
        }),
      });

      if (!response.ok) {
        const message = await getErrorMessage(response);

        throw new Error(message);
      }

      const data = await response.json();

      setSuccess(
        data.message ||
          (isEditing
            ? "Requirement updated successfully."
            : "Requirement created successfully.")
      );

      setRequirement("");

      setEditingId(null);

      await fetchRequirements();
    } catch (err) {
      console.error(
        "Save requirement error:",
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
  // HANDLE ENTER KEY
  // ==================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      handleSave();
    }
  };


  // ==================================================
  // DELETE
  // ==================================================

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Delete "${item.Requirement}"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(item.pkRId);

      setError("");

      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/requirements/${item.pkRId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const message = await getErrorMessage(response);

        throw new Error(message);
      }

      const data = await response.json();

      setSuccess(
        data.message || "Requirement deleted successfully."
      );

      if (editingId === item.pkRId) {
        setEditingId(null);

        setRequirement("");
      }

      await fetchRequirements();
    } catch (err) {
      console.error(
        "Delete requirement error:",
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


  // ==================================================
  // EXPORT TO EXCEL
  // ==================================================

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
        `${API_BASE_URL}/requirements/export`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const message = await getErrorMessage(response);
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
      link.download = `export_Requirement_${date}.xlsx`;
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


  // ==================================================
  // PRINT TO WORD
  // ==================================================

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
        `${API_BASE_URL}/requirements/print`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const message = await getErrorMessage(response);
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
      link.download = `print_Requirement_${date}.docx`;
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
          Requirements
        </h1>


        <p
          className="
            mt-1
            text-sm
            text-theme-muted
          "
        >
          Create and manage job requirements.
        </p>

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
          ADD / EDIT REQUIREMENT
      ================================================== */}

      {(isAllowed("add") || isAllowed("edit")) && (

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
                  ? "Edit Requirement"
                  : "Add Requirement"}
              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  text-theme-muted
                "
              >
                {editingId !== null
                  ? "Update the selected requirement."
                  : "Enter a new requirement to add it to the master list."}
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

              <ClipboardList size={21} />

            </div>

          </div>



          <div
            className="
              space-y-6
              p-6
            "
          >


            <div className="max-w-xl">


              <label
                htmlFor="requirement"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-theme-text
                "
              >
                Requirement
              </label>



              <input
                id="requirement"
                type="text"
                value={requirement}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                maxLength={300}
                placeholder="Enter requirement"
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
                "
              />


              <p
                className="
                  mt-2
                  text-xs
                  text-theme-faint
                "
              >
                Maximum 300 characters.
              </p>


            </div>



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
                disabled={saving || !requirement.trim()}
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
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Requirement"
                  : "Save Requirement"}
              </button>


              {editingId !== null && (

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="
                    inline-flex
                    h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-theme-border
                    px-5
                    text-sm
                    font-semibold
                    text-theme-muted
                    transition-all
                    duration-200
                    hover:bg-theme-primary-soft
                    hover:text-theme-text
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <X size={16} />
                  Cancel
                </button>

              )}


            </div>

          </div>

        </div>

      )}



      {/* ==================================================
          SAVED REQUIREMENTS
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
            flex-wrap
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
              Saved Requirements
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Requirements currently available in the system.
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
                  requirements.length === 0
                }
                className="
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-blue-600
                  px-4
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
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
                  requirements.length === 0
                }
                className="
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-emerald-600
                  px-4
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-emerald-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <Printer size={16} />
                {printing ? "Preparing…" : "Print"}
              </button>

            )}


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

              <ClipboardList size={21} />

            </div>

          </div>

        </div>



        {loading && (

          <div
            className="
              px-6
              py-12
              text-center
              text-sm
              text-theme-muted
            "
          >
            Loading requirements...
          </div>

        )}



        {!loading && requirements.length === 0 && (

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

              <ClipboardList size={26} />

            </div>


            <p
              className="
                mt-4
                font-medium
                text-theme-text
              "
            >
              No requirements found
            </p>


            <p
              className="
                mt-1
                text-sm
                text-theme-faint
              "
            >
              Add a requirement to get started.
            </p>


          </div>

        )}



        {!loading && requirements.length > 0 && (

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
                    Requirement
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



              <tbody
                className="
                  divide-y
                  divide-theme-border
                "
              >

                {requirements.map((item, index) => (

                  <tr
                    key={item.pkRId}
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
                      {index + 1}
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
                      {item.Requirement}
                    </td>


                    {(isAllowed("edit") || isAllowed("delete")) && (

                      <td
                        className="
                          px-6
                          py-4
                          text-right
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            justify-end
                            gap-2
                          "
                        >

                          {isAllowed("edit") && (

                            <button
                              type="button"
                              onClick={() => handleEditClick(item)}
                              title="Edit"
                              className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                text-theme-muted
                                transition
                                hover:bg-theme-primary-soft
                                hover:text-theme-primary
                              "
                            >
                              <Pencil size={16} />
                            </button>

                          )}


                          {isAllowed("delete") && (

                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              disabled={deletingId === item.pkRId}
                              title="Delete"
                              className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                text-theme-muted
                                transition
                                hover:bg-theme-danger-soft
                                hover:text-theme-danger
                                disabled:cursor-not-allowed
                                disabled:opacity-60
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
