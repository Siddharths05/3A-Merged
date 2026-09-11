import { useEffect, useState } from "react";

import {
  Megaphone,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function AnnouncementType() {
  // ==================================================
  // STATE
  // ==================================================

  const [announcementType, setAnnouncementType] = useState("");

  const [announcementTypes, setAnnouncementTypes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [editingId, setEditingId] = useState(null);

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
  // LOAD ANNOUNCEMENT TYPES
  // ==================================================

  const fetchAnnouncementTypes = async () => {
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
        `${API_BASE_URL}/announcement-types`,
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

      // ==============================================
      // BACKEND RETURNS { total, announcement_types: [...] }
      // ==============================================

      setAnnouncementTypes(
        Array.isArray(data.announcement_types)
          ? data.announcement_types
          : []
      );
    } catch (err) {
      console.error(
        "Fetch announcement types error:",
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
    fetchAnnouncementTypes();
  }, []);

  // ==================================================
  // RESET FORM
  // ==================================================

  const resetForm = () => {
    setAnnouncementType("");

    setEditingId(null);

    setError("");

    setSuccess("");
  };

  // ==================================================
  // HANDLE INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {
    setAnnouncementType(e.target.value);

    setError("");

    setSuccess("");
  };

  // ==================================================
  // SAVE / UPDATE ANNOUNCEMENT TYPE
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedAnnouncementType =
      announcementType.trim();

    // ================================================
    // VALIDATION
    // ================================================

    if (!trimmedAnnouncementType) {
      setError(
        "Please enter an announcement type."
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
        ? `${API_BASE_URL}/announcement-types/${editingId}`
        : `${API_BASE_URL}/announcement-types`;

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
            announcement_type:
              trimmedAnnouncementType,
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
              ? "Announcement type updated successfully."
              : "Announcement type created successfully."
          )
      );

      setAnnouncementType("");

      setEditingId(null);

      await fetchAnnouncementTypes();
    } catch (err) {
      console.error(
        "Save announcement type error:",
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
    setEditingId(item.pkATId);

    setAnnouncementType(item.AnnouncementType || "");

    setError("");

    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==================================================
  // DELETE ANNOUNCEMENT TYPE
  // ==================================================

  const handleDelete = async (item) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${item.AnnouncementType}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(item.pkATId);

      setError("");

      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/announcement-types/${item.pkATId}`,
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
          "Announcement type deleted successfully."
      );

      if (
        editingId === item.pkATId
      ) {
        setAnnouncementType("");

        setEditingId(null);
      }

      await fetchAnnouncementTypes();
    } catch (err) {
      console.error(
        "Delete announcement type error:",
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
          Announcement Type
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-theme-muted
          "
        >
          Create and manage announcement types.
        </p>
      </div>

      {/* ==================================================
          ADD / EDIT ANNOUNCEMENT TYPE
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

        {/* CARD HEADER */}

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
                ? "Edit Announcement Type"
                : "Add Announcement Type"}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              {editingId !== null
                ? "Update the selected announcement type."
                : "Enter a new announcement type to add it to the system."}
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
            <Megaphone size={21} />
          </div>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="
            space-y-6
            p-6
          "
        >

          <div className="max-w-xl">

            <div
              className="
                mb-2
                flex
                items-center
                justify-between
              "
            >
              <label
                htmlFor="announcementType"
                className="
                  text-sm
                  font-semibold
                  text-theme-text
                "
              >
                Announcement Type
              </label>

              <span
                className="
                  text-xs
                  text-theme-faint
                "
              >
                {announcementType.length}/100
              </span>
            </div>

            <input
              id="announcementType"
              type="text"
              value={announcementType}
              onChange={handleChange}
              placeholder="Enter announcement type"
              maxLength={100}
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
              Maximum 100 characters.
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

          {/* ACTIONS */}

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
                ? "Update Announcement Type"
                : "Save Announcement Type"}
            </button>

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
          SAVED ANNOUNCEMENT TYPES
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

        {/* TABLE HEADER */}

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
              Saved Announcement Types
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Announcement types currently available in the system.
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
            <Megaphone size={21} />
          </div>

        </div>

        {/* LOADING */}

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
            Loading announcement types...
          </div>
        )}

        {/* EMPTY STATE */}

        {!loading && announcementTypes.length === 0 && !error && (
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
              <Megaphone size={26} />
            </div>

            <p
              className="
                mt-4
                font-medium
                text-theme-text
              "
            >
              No announcement types found
            </p>

            <p
              className="
                mt-1
                text-sm
                text-theme-faint
              "
            >
              Add an announcement type to get started.
            </p>

          </div>
        )}

        {/* TABLE */}

        {!loading && announcementTypes.length > 0 && (
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
                    Announcement Type
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

                {announcementTypes.map((item) => (

                  <tr
                    key={item.pkATId}
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
                      {item.pkATId}
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
                      {item.AnnouncementType}
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
                          title="Edit Announcement Type"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(item)
                          }
                          disabled={
                            deletingId === item.pkATId
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
                          title="Delete Announcement Type"
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
