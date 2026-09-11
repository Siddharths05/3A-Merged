import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  Users,
  UserPlus,
  Trash2,
  RefreshCw,
  Search,
  AlertCircle,
  X,
} from "lucide-react";

import {
  useTranslation,
} from "../context/TranslationContext";


// ==================================================
// API
// ==================================================

const API_BASE_URL =
  "http://127.0.0.1:8000/api";


// ==================================================
// USER LIST
// ==================================================

export default function UserList() {


  // ==================================================
  // TRANSLATIONS
  // ==================================================

  const { t } =
    useTranslation();


  const pageTitle =
    t("userList.pageTitle");

  const pageDescription =
    t("userList.pageDescription");

  const refreshText =
    t("userList.refresh");

  const addUserText =
    t("userList.addUser");

  const activeUsersText =
    t("userList.activeUsers");

  const currentlyActiveText =
    t("userList.currentlyActive");

  const recordsText =
    t("userList.records");

  const usersShownText =
    t("userList.usersShown");

  const userListText =
    t("userList.userList");

  const userListDescription =
    t("userList.userListDescription");

  const searchUsersText =
    t("userList.searchUsers");

  const loadingUsersText =
    t("userList.loadingUsers");

  const noUsersMatchText =
    t("userList.noUsersMatch");

  const noActiveUsersText =
    t("userList.noActiveUsers");

  const tryDifferentSearchText =
    t("userList.tryDifferentSearch");

  const addUserToStartText =
    t("userList.addUserToStart");

  const idText =
    t("userList.id");

  const userText =
    t("userList.user");

  const emailText =
    t("userList.email");

  const roleText =
    t("userList.role");

  const statusText =
    t("userList.status");

  const actionText =
    t("userList.action");

  const userIdText =
    t("userList.userId");

  const unnamedUserText =
    t("userList.unnamedUser");

  const defaultUserRoleText =
    t("userList.defaultUserRole");

  const activeText =
    t("userList.active");

  const inactiveText =
    t("userList.inactive");

  const deactivateText =
    t("userList.deactivate");

  const showingText =
    t("userList.showing");

  const singularUserText =
    t("userList.singularUser");

  const pluralUsersText =
    t("userList.pluralUsers");

  const activeUsersFooterText =
    t("userList.activeUsersFooter");

  const deactivateUserTitle =
    t("userList.deactivateUserTitle");

  const deactivateQuestion =
    t("userList.deactivateQuestion");

  const deactivateDescription =
    t("userList.deactivateDescription");

  const cancelText =
    t("userList.cancel");

  const deactivateUserText =
    t("userList.deactivateUser");

  const deactivatingText =
    t("userList.deactivating");

  const authTokenError =
    t("userList.authTokenError");

  const failedLoadUsers =
    t("userList.failedLoadUsers");

  const failedDeactivateUser =
    t("userList.failedDeactivateUser");

  const somethingWentWrong =
    t("userList.somethingWentWrong");


  // ==================================================
  // CURRENT USER
  // ==================================================

  const storedUser =
    localStorage.getItem("user");


  let currentUser = null;


  try {

    currentUser =
      storedUser
        ? JSON.parse(storedUser)
        : null;

  } catch {

    currentUser = null;

  }


  const isAdmin =
    currentUser?.role
      ?.toLowerCase() === "admin";


  // ==================================================
  // STATE
  // ==================================================

  const [users, setUsers] =
    useState([]);

  const [activeCount, setActiveCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [deleteUser, setDeleteUser] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);


  // ==================================================
  // GET AUTH HEADERS
  // ==================================================

  const getAuthHeaders = () => {

    const token =
      localStorage.getItem(
        "access_token"
      );


    if (!token) {

      throw new Error(
        authTokenError ||
        "Authentication token not found."
      );

    }


    return {

      Authorization:
        `Bearer ${token}`,

      Accept:
        "application/json",

      "Content-Type":
        "application/json",

    };

  };


  // ==================================================
  // GET RESPONSE ERROR
  // ==================================================

  const getResponseError =
    async (response, fallbackMessage) => {

      try {

        const data =
          await response.json();

        return (
          data.detail ||
          data.message ||
          fallbackMessage
        );

      } catch {

        return fallbackMessage;

      }

    };


  // ==================================================
  // FETCH USERS
  // ==================================================

  const fetchUsers =
    async () => {

      setLoading(true);

      setError("");


      try {

        const headers =
          getAuthHeaders();


        const [
          usersResponse,
          countResponse,
        ] = await Promise.all([

          fetch(
            `${API_BASE_URL}/users`,
            {
              method: "GET",
              headers,
            }
          ),

          fetch(
            `${API_BASE_URL}/users/count`,
            {
              method: "GET",
              headers,
            }
          ),

        ]);


        // ==============================================
        // USERS RESPONSE
        // ==============================================

        if (!usersResponse.ok) {

          const message =
            await getResponseError(
              usersResponse,
              failedLoadUsers ||
              "Failed to load users."
            );

          throw new Error(message);

        }


        const usersData =
          await usersResponse.json();


        // ==============================================
        // HANDLE DIFFERENT RESPONSE FORMATS
        // ==============================================

        let usersArray = [];


        if (Array.isArray(usersData)) {

          usersArray =
            usersData;

        } else if (Array.isArray(usersData.data)) {

          usersArray =
            usersData.data;

        } else if (Array.isArray(usersData.users)) {

          usersArray =
            usersData.users;

        }


        // ==============================================
        // NORMALIZE USERS
        // ==============================================

        const normalizedUsers =
          usersArray.map(
            (user) => ({

              ...user,

              id:
                user.id ??
                user.pkid ??
                user.pkId,

              is_active:
                user.is_active ??
                user.active ??
                true,

            })
          );


        setUsers(
          normalizedUsers
        );


        // ==============================================
        // COUNT RESPONSE
        // ==============================================

        if (countResponse.ok) {

          try {

            const countData =
              await countResponse.json();


            setActiveCount(

              countData.count ??
              countData.active_count ??
              countData.data?.count ??
              normalizedUsers.filter(
                (user) => user.is_active
              ).length

            );

          } catch {

            setActiveCount(
              normalizedUsers.filter(
                (user) => user.is_active
              ).length
            );

          }

        } else {

          setActiveCount(
            normalizedUsers.filter(
              (user) => user.is_active
            ).length
          );

        }


      } catch (err) {

        console.error(
          "Fetch users error:",
          err
        );


        if (
          err.name === "TypeError" &&
          err.message === "Failed to fetch"
        ) {

          setError(
            "Failed to connect to the server. Please make sure the backend is running on http://127.0.0.1:8000."
          );

        } else {

          setError(
            err.message ||
            somethingWentWrong ||
            "Something went wrong."
          );

        }


        setUsers([]);

        setActiveCount(0);


      } finally {

        setLoading(false);

      }

    };


  // ==================================================
  // LOAD ON MOUNT
  // ==================================================

  useEffect(() => {

    fetchUsers();

  }, []);


  // ==================================================
  // DELETE USER
  // ==================================================

  const handleDelete =
    async () => {

      if (!deleteUser?.id) {

        return;

      }


      try {

        setDeleting(true);

        setError("");


        const headers =
          getAuthHeaders();


        const response =
          await fetch(
            `${API_BASE_URL}/users/${deleteUser.id}`,
            {
              method: "DELETE",
              headers,
            }
          );


        if (!response.ok) {

          const message =
            await getResponseError(
              response,
              failedDeactivateUser ||
              "Failed to deactivate user."
            );

          throw new Error(message);

        }


        setDeleteUser(null);


        await fetchUsers();


      } catch (err) {

        console.error(
          "Delete user error:",
          err
        );


        setError(
          err.message ||
          somethingWentWrong ||
          "Something went wrong."
        );


      } finally {

        setDeleting(false);

      }

    };


  // ==================================================
  // SEARCH
  // ==================================================

  const filteredUsers =
    users.filter(
      (user) => {

        const search =
          searchTerm
            .toLowerCase()
            .trim();


        if (!search) {

          return true;

        }


        return (

          String(user.id || "")
            .toLowerCase()
            .includes(search)

          ||

          String(user.full_name || "")
            .toLowerCase()
            .includes(search)

          ||

          String(user.email || "")
            .toLowerCase()
            .includes(search)

          ||

          String(user.role || "")
            .toLowerCase()
            .includes(search)

        );

      }
    );


  // ==================================================
  // USER INITIALS
  // ==================================================

  const getInitials =
    (user) => {

      if (user.full_name) {

        const parts =
          user.full_name
            .trim()
            .split(" ")
            .filter(Boolean);


        if (parts.length >= 2) {

          return (
            parts[0][0] +
            parts[parts.length - 1][0]
          ).toUpperCase();

        }


        if (parts.length === 1) {

          return parts[0]
            .slice(0, 2)
            .toUpperCase();

        }

      }


      return String(
        user.email || "U"
      )
        .slice(0, 2)
        .toUpperCase();

    };


  // ==================================================
  // COMPONENT
  // ==================================================

  return (

    <div className="space-y-8">


      {/* PAGE HEADER */}

      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
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
            {pageTitle}
          </h1>


          <p
            className="
              mt-1
              text-sm
              text-theme-muted
              sm:text-base
            "
          >
            {pageDescription}
          </p>

        </div>


        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
          "
        >

          <button
            type="button"
            onClick={fetchUsers}
            disabled={loading}

            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-theme-border
              bg-card
              px-4
              py-2.5
              text-sm
              font-medium
              text-theme-text
              shadow-sm
              transition-all
              hover:bg-theme-primary-soft
              hover:text-theme-primary
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            <RefreshCw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshText}

          </button>


          {isAdmin && (

            <Link
              to="/register"

              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-theme-primary
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-all
                hover:opacity-90
                hover:shadow-md
              "
            >

              <UserPlus size={17} />

              {addUserText}

            </Link>

          )}

        </div>

      </div>



      {/* SUMMARY */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          sm:grid-cols-2
        "
      >


        <div
          className="
            rounded-2xl
            border
            border-theme-border
            bg-card
            p-6
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p className="text-sm font-medium text-theme-muted">
                {activeUsersText}
              </p>

              <p className="mt-2 text-3xl font-bold text-theme-text">
                {activeCount}
              </p>

              <p className="mt-1 text-xs text-theme-faint">
                {currentlyActiveText}
              </p>

            </div>


            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-theme-primary-soft
                text-theme-primary
              "
            >
              <Users size={24} />
            </div>

          </div>

        </div>



        <div
          className="
            rounded-2xl
            border
            border-theme-border
            bg-card
            p-6
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p className="text-sm font-medium text-theme-muted">
                {recordsText}
              </p>

              <p className="mt-2 text-3xl font-bold text-theme-text">
                {filteredUsers.length}
              </p>

              <p className="mt-1 text-xs text-theme-faint">
                {usersShownText}
              </p>

            </div>


            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-theme-primary-soft
                text-theme-primary
              "
            >
              <Users size={24} />
            </div>

          </div>

        </div>

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
            className="mt-0.5 shrink-0"
          />

          <span>
            {error}
          </span>

        </div>

      )}



      {/* USER LIST */}

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


        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-theme-border
            px-6
            py-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div>

            <h2 className="text-lg font-semibold text-theme-text">
              {userListText}
            </h2>

            <p className="mt-1 text-sm text-theme-muted">
              {userListDescription}
            </p>

          </div>


          <div className="relative w-full lg:w-80">

            <Search
              size={18}

              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-theme-faint
              "
            />


            <input
              type="text"

              placeholder={searchUsersText}

              value={searchTerm}

              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }

              className="
                w-full
                rounded-xl
                border
                border-theme-border
                bg-[var(--erp-background)]
                py-2.5
                pl-10
                pr-4
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

          </div>

        </div>



        {/* LOADING */}

        {loading ? (

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              py-20
            "
          >

            <RefreshCw
              size={28}
              className="
                animate-spin
                text-theme-primary
              "
            />

            <p className="mt-3 text-sm text-theme-muted">
              {loadingUsersText}
            </p>

          </div>


        ) : filteredUsers.length === 0 ? (

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              py-20
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
              <Users size={26} />
            </div>


            <p className="mt-4 font-medium text-theme-text">

              {searchTerm
                ? noUsersMatchText
                : noActiveUsersText}

            </p>


            <p className="mt-1 text-sm text-theme-faint">

              {searchTerm
                ? tryDifferentSearchText
                : addUserToStartText}

            </p>

          </div>


        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>

                <tr
                  className="
                    border-b
                    border-theme-border
                    bg-[var(--erp-background)]
                  "
                >

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-muted">
                    {idText}
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-muted">
                    {userText}
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-muted">
                    {emailText}
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-muted">
                    {roleText}
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-muted">
                    {statusText}
                  </th>


                  {isAdmin && (

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-theme-muted">
                      {actionText}
                    </th>

                  )}

                </tr>

              </thead>



              <tbody className="divide-y divide-theme-border">

                {filteredUsers.map(
                  (user) => (

                    <tr
                      key={user.id}

                      className="
                        transition-colors
                        hover:bg-theme-primary-soft/40
                      "
                    >


                      {/* ID */}

                      <td className="whitespace-nowrap px-6 py-4">

                        <span className="text-sm font-medium text-theme-muted">

                          #
                          {String(
                            user.id
                          ).padStart(
                            3,
                            "0"
                          )}

                        </span>

                      </td>



                      {/* USER */}

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
                              rounded-full
                              bg-theme-primary-soft
                              text-sm
                              font-semibold
                              text-theme-primary
                            "
                          >
                            {getInitials(user)}
                          </div>


                          <div>

                            <p className="font-medium text-theme-text">

                              {user.full_name ||
                                unnamedUserText}

                            </p>


                            <p className="text-xs text-theme-faint">

                              {userIdText}
                              {" "}
                              {user.id}

                            </p>

                          </div>

                        </div>

                      </td>



                      {/* EMAIL */}

                      <td className="px-6 py-4">

                        <span className="text-sm text-theme-muted">
                          {user.email}
                        </span>

                      </td>



                      {/* ROLE */}

                      <td className="px-6 py-4">

                        <span
                          className="
                            inline-flex
                            items-center
                            rounded-lg
                            bg-theme-primary-soft
                            px-2.5
                            py-1
                            text-xs
                            font-semibold
                            capitalize
                            text-theme-primary
                          "
                        >

                          {user.role ||
                            defaultUserRoleText}

                        </span>

                      </td>



                      {/* STATUS */}

                      <td className="px-6 py-4">

                        {user.is_active ? (

                          <span
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-full
                              bg-emerald-500/10
                              px-3
                              py-1.5
                              text-xs
                              font-semibold
                              text-emerald-600
                              dark:text-emerald-400
                            "
                          >

                            <span
                              className="
                                h-2
                                w-2
                                rounded-full
                                bg-emerald-500
                              "
                            />

                            {activeText}

                          </span>


                        ) : (

                          <span
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-full
                              bg-theme-danger-soft
                              px-3
                              py-1.5
                              text-xs
                              font-semibold
                              text-theme-danger
                            "
                          >

                            <span
                              className="
                                h-2
                                w-2
                                rounded-full
                                bg-theme-danger
                              "
                            />

                            {inactiveText}

                          </span>

                        )}

                      </td>



                      {/* ACTION */}

                      {isAdmin && (

                        <td className="px-6 py-4 text-right">

                          <button
                            type="button"

                            onClick={() =>
                              setDeleteUser(user)
                            }

                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-lg
                              px-3
                              py-2
                              text-sm
                              font-medium
                              text-theme-danger
                              transition
                              hover:bg-theme-danger-soft
                            "
                          >

                            <Trash2 size={16} />

                            {deactivateText}

                          </button>

                        </td>

                      )}

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}



        {/* FOOTER */}

        {!loading &&
          filteredUsers.length > 0 && (

            <div
              className="
                flex
                flex-col
                gap-2
                border-t
                border-theme-border
                bg-[var(--erp-background)]
                px-6
                py-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <p className="text-sm text-theme-muted">

                {showingText}
                {" "}

                <span className="font-semibold text-theme-text">
                  {filteredUsers.length}
                </span>

                {" "}

                {filteredUsers.length === 1
                  ? singularUserText
                  : pluralUsersText}

              </p>


              <p className="text-xs text-theme-faint">

                {activeUsersFooterText}
                {" "}
                {activeCount}

              </p>

            </div>

          )}

      </div>



      {/* DELETE MODAL */}

      {deleteUser && (

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

                onClick={() =>
                  setDeleteUser(null)
                }

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
              {deactivateUserTitle}
            </h3>



            <p
              className="
                mt-2
                text-sm
                leading-6
                text-theme-muted
              "
            >

              {deactivateQuestion}
              {" "}

              <span className="font-semibold text-theme-text">

                {deleteUser.full_name ||
                  deleteUser.email}

              </span>

              ?

            </p>



            <p
              className="
                mt-2
                text-xs
                text-theme-faint
              "
            >
              {deactivateDescription}
            </p>



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

                onClick={() =>
                  setDeleteUser(null)
                }

                disabled={deleting}

                className="
                  rounded-xl
                  border
                  border-theme-border
                  bg-card
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-theme-text
                  transition
                  hover:bg-theme-primary-soft
                  disabled:opacity-50
                "
              >
                {cancelText}
              </button>



              <button
                type="button"

                onClick={handleDelete}

                disabled={deleting}

                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-theme-danger
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  hover:opacity-90
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {deleting && (

                  <RefreshCw
                    size={16}
                    className="animate-spin"
                  />

                )}


                {deleting
                  ? deactivatingText
                  : deactivateUserText}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}