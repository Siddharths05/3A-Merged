import { useEffect, useState } from "react";

import {
  MapPin,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  Download,
  Printer,
} from "lucide-react";

import { Can, usePermissions } from "../../components/Permissions";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function WorkLocation() {
  // ==================================================
  // PERMISSIONS
  // ==================================================

  const { can, loading: rightsLoading } = usePermissions();

  // ==================================================
  // STATE
  // ==================================================

  const [location, setLocation] = useState("");

  const [locations, setLocations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [editingId, setEditingId] = useState(null);

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
  // LOAD LOCATIONS
  // ==================================================

  const fetchLocations = async () => {
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
        `${API_BASE_URL}/locations`,
        {
          method: "GET",

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

      setLocations(
        Array.isArray(data.locations)
          ? data.locations
          : []
      );
    } catch (err) {
      console.error(
        "Fetch locations error:",
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

  // ==================================================
  // LOAD ON COMPONENT MOUNT
  // ==================================================

  useEffect(() => {
    fetchLocations();
  }, []);

  // ==================================================
  // RESET FORM
  // ==================================================

  const resetForm = () => {
    setLocation("");

    setEditingId(null);

    setError("");

    setSuccess("");
  };

  // ==================================================
  // HANDLE INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {
    setLocation(e.target.value);

    setError("");

    setSuccess("");
  };

  // ==================================================
  // SAVE / UPDATE LOCATION
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedLocation =
      location.trim();

    if (!trimmedLocation) {
      setError(
        "Please enter a work location."
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
        ? `${API_BASE_URL}/locations/${editingId}`
        : `${API_BASE_URL}/locations`;

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
            location:
              trimmedLocation,
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
              ? "Work location updated successfully."
              : "Work location created successfully."
          )
      );

      setLocation("");

      setEditingId(null);

      await fetchLocations();
    } catch (err) {
      console.error(
        "Save location error:",
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
  // START EDITING
  // ==================================================

  const handleEdit = (item) => {
    setEditingId(item.pkHLId);

    setLocation(item.Location || "");

    setError("");

    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==================================================
  // DELETE LOCATION
  // ==================================================

  const handleDelete = async (item) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${item.Location}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(item.pkHLId);

      setError("");

      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/locations/${item.pkHLId}`,
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
          "Work location deleted successfully."
      );

      if (
        editingId === item.pkHLId
      ) {
        setLocation("");

        setEditingId(null);
      }

      await fetchLocations();
    } catch (err) {
      console.error(
        "Delete location error:",
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
        `${API_BASE_URL}/locations/export`,
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
      link.download = `export_Location_${date}.xlsx`;
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
        `${API_BASE_URL}/locations/print`,
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
      link.download = `print_Location_${date}.docx`;
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
  // NO VIEW RIGHT
  // ==================================================

  if (!rightsLoading && !can("location", "view")) {
    return (
      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          rounded-2xl
          border
          border-theme-border
          bg-card
          py-20
          text-center
          shadow-sm
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
            bg-theme-danger-soft
            text-theme-danger
          "
        >
          <MapPin size={26} />
        </div>

        <p
          className="
            mt-4
            font-medium
            text-theme-text
          "
        >
          You don't have access to this page
        </p>

        <p
          className="
            mt-1
            text-sm
            text-theme-faint
          "
        >
          Ask an admin to grant you View rights for Work Location.
        </p>
      </div>
    );
  }

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
          Work Location
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-theme-muted
          "
        >
          Manage employee work locations.
        </p>

      </div>

      {/* ==================================================
          ADD / EDIT LOCATION
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
              {editingId !== null
                ? "Edit Work Location"
                : "Add Work Location"}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              {editingId !== null
                ? "Update the selected work location."
                : "Enter a new work location to add it to the master list."}
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
            <MapPin size={21} />
          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="
            space-y-6
            p-6
          "
        >

          <div className="max-w-xl">

            <label
              htmlFor="location"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-theme-text
              "
            >
              Work Location
            </label>

            <input
              id="location"
              type="text"
              value={location}
              onChange={handleChange}
              placeholder="Enter work location"
              maxLength={30}
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
                disabled:cursor-not-allowed
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
              Maximum 30 characters.
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
              <AlertCircle
                size={18}
                className="
                  mt-0.5
                  shrink-0
                "
              />

              <span>
                {error}
              </span>
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
              <CheckCircle2
                size={18}
                className="
                  mt-0.5
                  shrink-0
                "
              />

              <span>
                {success}
              </span>
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

            <Can
              module="location"
              action={editingId !== null ? "edit" : "add"}
            >
              <button
                type="submit"
                disabled={saving}
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
                  ? "Update Work Location"
                  : "Save Work Location"}
              </button>
            </Can>

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
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
                  bg-card
                  px-5
                  text-sm
                  font-semibold
                  text-theme-text
                  transition-all
                  hover:bg-theme-primary-soft
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <X size={17} />

                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {/* ==================================================
          SAVED WORK LOCATIONS
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
              Saved Work Locations
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Work locations currently available in the system.
            </p>

          </div>

          <div className="flex items-center gap-2">
            <Can module="location" action="export">
              <button
                type="button"
                onClick={handleExport}
                disabled={
                  loading ||
                  exporting ||
                  printing ||
                  locations.length === 0
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
            </Can>

            <Can module="location" action="print">
              <button
                type="button"
                onClick={handlePrint}
                disabled={
                  loading ||
                  exporting ||
                  printing ||
                  locations.length === 0
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
            </Can>

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
              <MapPin size={21} />
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
            Loading work locations...
          </div>
        )}

        {!loading &&
          locations.length === 0 &&
          !error && (

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
              <MapPin size={26} />
            </div>

            <p
              className="
                mt-4
                font-medium
                text-theme-text
              "
            >
              No work locations found
            </p>

            <p
              className="
                mt-1
                text-sm
                text-theme-faint
              "
            >
              Add a work location to get started.
            </p>

          </div>
        )}

        {!loading && locations.length > 0 && (
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
                    Work Location
                  </th>

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

                </tr>

              </thead>

              <tbody
                className="
                  divide-y
                  divide-theme-border
                "
              >

                {locations.map((item) => (

                  <tr
                    key={item.pkHLId}
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
                      {item.pkHLId}
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
                      {item.Location}
                    </td>

                    <td className="px-6 py-4">

                      <div
                        className="
                          flex
                          items-center
                          justify-end
                          gap-2
                        "
                      >

                        <Can module="location" action="edit">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(item)
                            }
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
                            title="Edit Work Location"
                          >
                            <Pencil size={17} />
                          </button>
                        </Can>

                        <Can module="location" action="delete">
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(item)
                            }
                            disabled={
                              deletingId === item.pkHLId
                            }
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
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                            title="Delete Work Location"
                          >
                            <Trash2 size={17} />
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

    </div>
  );
}
