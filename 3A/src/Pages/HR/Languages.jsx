import { useEffect, useState } from "react";

import {
  Languages as LanguagesIcon,
  AlertCircle,
  CheckCircle2,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import { usePermissions } from "../../components/Permissions";


const API_BASE_URL = "http://127.0.0.1:8000/api";


export default function Languages() {

  // ==================================================
  // PERMISSIONS
  // Admin bypasses entirely; everyone else is gated on
  // the "language" module rights, same pattern
  // Header.jsx uses for the Masters dropdown.
  // ==================================================

  const { role, can } = usePermissions();

  const isAllowed = (action) =>
    role === "admin" || can("language", action);


  // ==================================================
  // STATE
  // ==================================================

  const [language, setLanguage] = useState("");

  const [languages, setLanguages] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

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
  // LOAD LANGUAGES
  // ==================================================

  const fetchLanguages = async () => {
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
        `${API_BASE_URL}/languages`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load languages."
        );
      }

      const data = await response.json();

      setLanguages(
        Array.isArray(data.languages)
          ? data.languages
          : []
      );
    } catch (err) {
      console.error(
        "Fetch languages error:",
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
    fetchLanguages();
  }, []);


  // ==================================================
  // HANDLE INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {
    setLanguage(e.target.value);
  };


  // ==================================================
  // START EDITING A ROW
  // ==================================================

  const handleEditClick = (item) => {
    setEditingId(item.pkLId);

    setLanguage(item.Language);

    setError("");

    setSuccess("");
  };


  // ==================================================
  // CANCEL EDITING
  // ==================================================

  const handleCancelEdit = () => {
    setEditingId(null);

    setLanguage("");

    setError("");
  };


  // ==================================================
  // SAVE (CREATE OR UPDATE)
  // ==================================================

  const handleSave = async () => {
    const value = language.trim();

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
        ? `${API_BASE_URL}/languages/${editingId}`
        : `${API_BASE_URL}/languages`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          language: value,
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
            ? "Language updated successfully."
            : "Language created successfully.")
      );

      setLanguage("");

      setEditingId(null);

      await fetchLanguages();
    } catch (err) {
      console.error(
        "Save language error:",
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
      `Delete "${item.Language}"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(item.pkLId);

      setError("");

      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/languages/${item.pkLId}`,
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
        data.message || "Language deleted successfully."
      );

      // If the deleted row was mid-edit, clear the form.
      if (editingId === item.pkLId) {
        setEditingId(null);

        setLanguage("");
      }

      await fetchLanguages();
    } catch (err) {
      console.error(
        "Delete language error:",
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
          Languages
        </h1>


        <p
          className="
            mt-1
            text-sm
            text-theme-muted
          "
        >
          Create and manage languages available in the system.
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
          ADD / EDIT LANGUAGE
          Hidden entirely for a user with neither add nor
          edit rights on this module — matches the read-only
          treatment the rest of the app gives non-permitted
          users, rather than showing a form that will just
          403 on submit.
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
                  ? "Edit Language"
                  : "Add Language"}
              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  text-theme-muted
                "
              >
                {editingId !== null
                  ? "Update the selected language."
                  : "Enter a language to add it to the master list."}
              </p>

            </div>



            {/* ICON */}

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

              <LanguagesIcon size={21} />

            </div>

          </div>



          {/* FORM */}

          <div
            className="
              space-y-6
              p-6
            "
          >


            <div className="max-w-xl">


              {/* LABEL */}

              <label
                htmlFor="language"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-theme-text
                "
              >
                Language
              </label>



              {/* INPUT */}

              <input
                id="language"
                type="text"
                value={language}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                maxLength={200}
                placeholder="Enter language"
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
                Maximum 200 characters.
              </p>


            </div>



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
                type="button"
                onClick={handleSave}
                disabled={saving || !language.trim()}
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
                  ? "Update Language"
                  : "Save Language"}
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
          SAVED LANGUAGES
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
              Saved Languages
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Languages currently available in the system.
            </p>

          </div>



          {/* ICON */}

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

            <LanguagesIcon size={21} />

          </div>

        </div>



        {/* LOADING STATE */}

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
            Loading languages...
          </div>

        )}



        {/* EMPTY STATE */}

        {!loading && languages.length === 0 && (

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

              <LanguagesIcon size={26} />

            </div>


            <p
              className="
                mt-4
                font-medium
                text-theme-text
              "
            >
              No languages found
            </p>


            <p
              className="
                mt-1
                text-sm
                text-theme-faint
              "
            >
              Add a language to get started.
            </p>


          </div>

        )}



        {/* TABLE */}

        {!loading && languages.length > 0 && (

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
                    Language
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

                {languages.map((item, index) => (

                  <tr
                    key={item.pkLId}
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
                      {item.Language}
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
                              disabled={deletingId === item.pkLId}
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
