import { useEffect, useState } from "react";

import {
  Brain,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function KSA() {
  // ==================================================
  // STATE
  // ==================================================

  const [ksa, setKsa] = useState("");

  const [ksas, setKsas] = useState([]);

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
  // LOAD KSAs
  // ==================================================

  const fetchKsas = async () => {
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
        `${API_BASE_URL}/ksas`,
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
      // BACKEND RETURNS { total, ksas: [...] }
      // ==============================================

      setKsas(
        Array.isArray(data.ksas)
          ? data.ksas
          : []
      );
    } catch (err) {
      console.error(
        "Fetch KSAs error:",
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
    fetchKsas();
  }, []);

  // ==================================================
  // RESET FORM
  // ==================================================

  const resetForm = () => {
    setKsa("");

    setEditingId(null);

    setError("");

    setSuccess("");
  };

  // ==================================================
  // HANDLE INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {
    setKsa(e.target.value);

    setError("");

    setSuccess("");
  };

  // ==================================================
  // SAVE / UPDATE KSA
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedKsa = ksa.trim();

    // ================================================
    // VALIDATION
    // ================================================

    if (!trimmedKsa) {
      setError(
        "Please enter a knowledge, skill or ability."
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
        ? `${API_BASE_URL}/ksas/${editingId}`
        : `${API_BASE_URL}/ksas`;

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
            ksa: trimmedKsa,
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
              ? "KSA updated successfully."
              : "KSA saved successfully."
          )
      );

      setKsa("");

      setEditingId(null);

      await fetchKsas();
    } catch (err) {
      console.error(
        "Save KSA error:",
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
    setEditingId(item.pkKSAId);

    setKsa(item.KSA || "");

    setError("");

    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==================================================
  // DELETE KSA
  // ==================================================

  const handleDelete = async (item) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${item.KSA}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(item.pkKSAId);

      setError("");

      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/ksas/${item.pkKSAId}`,
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
          "KSA deleted successfully."
      );

      if (
        editingId === item.pkKSAId
      ) {
        setKsa("");

        setEditingId(null);
      }

      await fetchKsas();
    } catch (err) {
      console.error(
        "Delete KSA error:",
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
          Knowledge, Skills and Abilities
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-theme-muted
          "
        >
          Create and manage knowledge, skills and abilities.
        </p>
      </div>

      {/* ==================================================
          ADD / EDIT KSA
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
                ? "Edit KSA"
                : "Add KSA"}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              {editingId !== null
                ? "Update the selected knowledge, skill or ability."
                : "Enter a knowledge, skill or ability to add it to the system."}
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
            <Brain size={21} />
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

            <label
              htmlFor="ksa"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-theme-text
              "
            >
              Knowledge, Skill or Ability
            </label>

            <input
              id="ksa"
              type="text"
              value={ksa}
              onChange={handleChange}
              placeholder="Enter knowledge, skill or ability"
              maxLength={300}
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
              Maximum 300 characters.
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
                ? "Update KSA"
                : "Save KSA"}
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
          SAVED KSA RECORDS
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
              Saved KSA Records
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Knowledge, skills and abilities currently available in the system.
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
            <Brain size={21} />
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
            Loading KSA records...
          </div>
        )}

        {/* EMPTY STATE */}

        {!loading && ksas.length === 0 && !error && (
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
              <Brain size={26} />
            </div>

            <p
              className="
                mt-4
                font-medium
                text-theme-text
              "
            >
              No KSA records found
            </p>

            <p
              className="
                mt-1
                text-sm
                text-theme-faint
              "
            >
              Add a KSA entry to get started.
            </p>

          </div>
        )}

        {/* TABLE */}

        {!loading && ksas.length > 0 && (
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
                    Knowledge, Skill or Ability
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

                {ksas.map((item) => (

                  <tr
                    key={item.pkKSAId}
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
                      {item.pkKSAId}
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
                      {item.KSA}
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
                          title="Edit KSA"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(item)
                          }
                          disabled={
                            deletingId === item.pkKSAId
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
                          title="Delete KSA"
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
