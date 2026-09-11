import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  NavLink,
  Link,
  useLocation,
} from "react-router-dom";

import {
  Building2,
  CalendarDays,
  LayoutDashboard,
  BarChart3,
  Users,
  Database,
  Bell,
  Settings,
  ChevronDown,
  LogOut,
  UserCircle,
  Menu,
  X,
  BriefcaseBusiness,
  MapPin,
  Megaphone,
  ClipboardList,
  Network,
  GraduationCap,
  Languages,
  ShieldCheck,
  Heart,
  UsersRound,
  Moon,
  Sun,
} from "lucide-react";

import {
  useTheme,
} from "../context/ThemeContext";

import {
  useTranslation,
} from "../context/TranslationContext";

import LanguageSwitcher from "./LanguageSwitcher";

import { usePermissions } from "./Permissions";


// ==================================================
// HEADER COMPONENT
// ==================================================

export default function Header() {

  // ==================================================
  // TRANSLATION
  // ==================================================

  const {
    t,
  } = useTranslation();


  // ==================================================
  // ROUTER
  // ==================================================
  // (logout uses a hard reload instead of navigate —
  // see handleLogout — so useNavigate is not needed)

  const location =
    useLocation();


  // ==================================================
  // THEME
  // ==================================================

  const {
    darkMode,
    toggleTheme,
  } = useTheme();


  const {
    role,
    can,
    loading: rightsLoading,
  } = usePermissions();


  // ==================================================
  // STATE
  // ==================================================

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);


  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);


  const [
    mastersOpen,
    setMastersOpen,
  ] = useState(false);


  const [
    usersOpen,
    setUsersOpen,
  ] = useState(false);


  // ==================================================
  // REFS
  // ==================================================

  const profileRef =
    useRef(null);


  const mastersRef =
    useRef(null);


  const usersRef =
    useRef(null);


  // ==================================================
  // GET CURRENT USER
  // ==================================================

  const storedUser =
    localStorage.getItem("user");


  let user = null;


  try {

    user =
      storedUser
        ? JSON.parse(storedUser)
        : null;

  } catch {

    user = null;

  }


  // ==================================================
  // USER DETAILS
  // ==================================================

  const userName =
    user?.full_name ||
    user?.name ||
    user?.email ||
    "User";


  const userRole =
    user?.role ||
    "user";


  const formattedRole =
    userRole.charAt(0).toUpperCase() +
    userRole.slice(1);


  // ==================================================
  // USER INITIALS
  // ==================================================

  const getInitials = () => {

    if (!userName) {

      return "U";

    }


    const parts =
      userName
        .trim()
        .split(" ")
        .filter(Boolean);


    if (parts.length >= 2) {

      return (
        parts[0][0] +
        parts[
          parts.length - 1
        ][0]
      ).toUpperCase();

    }


    return parts[0]
      .slice(0, 2)
      .toUpperCase();

  };


  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {

    localStorage.removeItem(
      "isLoggedIn"
    );


    localStorage.removeItem(
      "access_token"
    );


    localStorage.removeItem(
      "user"
    );


    setProfileOpen(false);

    setMastersOpen(false);

    setUsersOpen(false);

    setMobileMenuOpen(false);


    // ================================================
    // A hard reload (not React Router's navigate) is
    // used deliberately here, for the same reason as
    // the post-login redirect in Login.jsx: it
    // guarantees PermissionsProvider and any other
    // top-level provider fully reset instead of
    // possibly carrying stale role/rights state into
    // whoever logs in next.
    // ================================================

    window.location.href = "/login";

  };


  // ==================================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // ==================================================

  useEffect(() => {

    const handleClickOutside =
      (event) => {

        if (
          profileRef.current &&
          !profileRef.current.contains(
            event.target
          )
        ) {

          setProfileOpen(false);

        }


        if (
          mastersRef.current &&
          !mastersRef.current.contains(
            event.target
          )
        ) {

          setMastersOpen(false);

        }


        if (
          usersRef.current &&
          !usersRef.current.contains(
            event.target
          )
        ) {

          setUsersOpen(false);

        }

      };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  // ==================================================
  // CLOSE MOBILE MENU ON RESIZE
  // ==================================================

  useEffect(() => {

    const handleResize = () => {

      if (
        window.innerWidth >= 1024
      ) {

        setMobileMenuOpen(false);

      }

    };


    window.addEventListener(
      "resize",
      handleResize
    );


    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

    };

  }, []);


  // ==================================================
  // CLOSE MENUS ON ROUTE CHANGE
  // ==================================================

  useEffect(() => {

    setMastersOpen(false);

    setUsersOpen(false);

    setMobileMenuOpen(false);

  }, [
    location.pathname,
  ]);


  // ==================================================
  // MAIN NAVIGATION
  // ==================================================

  const navigation = [

    {
      name:
        t("header.dashboard"),

      path: "/",

      icon:
        LayoutDashboard,

      end: true,
    },

    {
      name:
        t("header.overview"),

      path: "/overview",

      icon:
        BarChart3,
    },

  ];


  // ==================================================
  // USERS MENU
  // ==================================================

  const usersMenu = [

    {
      name:
        t(
          "header.userManagement"
        ),

      description:
        t(
          "header.userManagementDescription"
        ),

      path:
        "/users",

      icon:
        Users,
    },

    {
      name:
        t(
          "header.userRights"
        ),

      description:
        t(
          "header.userRightsDescription"
        ),

      path:
        "/user-rights",

      icon:
        ShieldCheck,
    },

    {
      name:
        t(
          "header.financialYear"
        ),

      description:
        t(
          "header.financialYearDescription"
        ),

      path:
        "/financial-year",

      icon:
        CalendarDays,
    },

  ];


  // ==================================================
  // MASTERS MENU
  // ==================================================

  const masters = [

    {
      module: "ability",

      name:
        t(
          "header.mastersItems.ability"
        ),

      description:
        t(
          "header.mastersItems.abilityDescription"
        ),

      path:
        "/abilities",

      icon:
        BriefcaseBusiness,
    },


    {
      module: "location",

      name:
        t(
          "header.mastersItems.workLocation"
        ),

      description:
        t(
          "header.mastersItems.workLocationDescription"
        ),

      path:
        "/work-locations",

      icon:
        MapPin,
    },


    {
      module: "announcement_type",

      name:
        t(
          "header.mastersItems.announcementType"
        ),

      description:
        t(
          "header.mastersItems.announcementTypeDescription"
        ),

      path:
        "/announcement-type",

      icon:
        Megaphone,
    },


    {
      module: "advertising_media",

      name:
        t(
          "header.mastersItems.advertisingMedia"
        ),

      description:
        t(
          "header.mastersItems.advertisingMediaDescription"
        ),

      path:
        "/advertising-media",

      icon:
        Network,
    },


    {
      module: "advertising_purpose",

      name:
        t(
          "header.mastersItems.advertisingPurpose"
        ),

      description:
        t(
          "header.mastersItems.advertisingPurposeDescription"
        ),

      path:
        "/advertising-purpose",

      icon:
        ClipboardList,
    },


    {
      module: "requirements",

      name:
        t(
          "header.mastersItems.requirements"
        ),

      description:
        t(
          "header.mastersItems.requirementsDescription"
        ),

      path:
        "/requirements",

      icon:
        ClipboardList,
    },


    {
      module: "job_function",

      name:
        t(
          "header.mastersItems.jobFunctions"
        ),

      description:
        t(
          "header.mastersItems.jobFunctionsDescription"
        ),

      path:
        "/job-functions",

      icon:
        BriefcaseBusiness,
    },


    {
      module: "ksa",

      name:
        t(
          "header.mastersItems.ksa"
        ),

      description:
        t(
          "header.mastersItems.ksaDescription"
        ),

      path:
        "/ksa",

      icon:
        GraduationCap,
    },


    {
      module: "ksa_category",

      name:
        t(
          "header.mastersItems.ksaCategory"
        ),

      description:
        t(
          "header.mastersItems.ksaCategoryDescription"
        ),

      path:
        "/ksa-category",

      icon:
        Network,
    },


    {
      module: "position_grades",

      name:
        t(
          "header.mastersItems.positionGrades"
        ),

      description:
        t(
          "header.mastersItems.positionGradesDescription"
        ),

      path:
        "/position-grades",

      icon:
        ShieldCheck,
    },


    {
      module: "meeting_type",

      name:
        t(
          "header.mastersItems.meetingType"
        ),

      description:
        t(
          "header.mastersItems.meetingTypeDescription"
        ),

      path:
        "/meeting-type",

      icon:
        UsersRound,
    },


    {
      module: "meeting_location",

      name:
        t(
          "header.mastersItems.meetingLocation"
        ),

      description:
        t(
          "header.mastersItems.meetingLocationDescription"
        ),

      path:
        "/meeting-location",

      icon:
        MapPin,
    },


    {
      module: "languages",

      name:
        t(
          "header.mastersItems.languages"
        ),

      description:
        t(
          "header.mastersItems.languagesDescription"
        ),

      path:
        "/languages",

      icon:
        Languages,
    },


    {
      module: "office_type",

      name:
        t(
          "header.mastersItems.officeType"
        ),

      description:
        t(
          "header.mastersItems.officeTypeDescription"
        ),

      path:
        "/office-type",

      icon:
        Building2,
    },


    {
      module: "office_level",

      name:
        t(
          "header.mastersItems.officeLevel"
        ),

      description:
        t(
          "header.mastersItems.officeLevelDescription"
        ),

      path:
        "/office-level",

      icon:
        Building2,
    },


    {
      module: "role_in_offense",

      name:
        t(
          "header.mastersItems.roleInOffense"
        ),

      description:
        t(
          "header.mastersItems.roleInOffenseDescription"
        ),

      path:
        "/role-in-offense",

      icon:
        ShieldCheck,
    },


    {
      module: "hobby",

      name:
        t(
          "header.mastersItems.hobbies"
        ),

      description:
        t(
          "header.mastersItems.hobbiesDescription"
        ),

      path:
        "/hobbies",

      icon:
        Heart,
    },

  ];


  // ==================================================
  // VISIBLE MASTERS
  // Admins see everything. Everyone else only sees
  // modules they have View rights on. While rights are
  // still loading, show nothing rather than flashing
  // items the person may not actually have access to.
  // ==================================================

  const visibleMasters =
    role === "admin"
      ? masters
      : rightsLoading
        ? []
        : masters.filter((master) =>
            can(master.module, "view")
          );


  // ==================================================
  // ACTIVE MENU CHECKS
  // ==================================================

  const isMasterActive =
    masters.some(
      (master) =>
        master.path ===
        location.pathname
    );


  const isUserActive =
    usersMenu.some(
      (item) =>
        item.path ===
        location.pathname
    );


  // ==================================================
  // NAVIGATION STYLES
  // ==================================================

  const navItemClass =
    ({ isActive }) => `

      flex
      items-center
      gap-2
      rounded-lg
      px-3
      py-2
      text-sm
      font-medium
      whitespace-nowrap
      transition-all
      duration-200

      ${
        isActive
          ? `
            bg-theme-primary-soft
            text-theme-primary
            shadow-sm
          `
          : `
            text-theme-muted
            hover:bg-theme-primary-soft
            hover:text-theme-primary
          `
      }

    `;


  const dropdownButtonClass =
    (isActive) => `

      flex
      items-center
      gap-2
      rounded-lg
      px-3
      py-2
      text-sm
      font-medium
      whitespace-nowrap
      transition-all
      duration-200

      ${
        isActive
          ? `
            bg-theme-primary-soft
            text-theme-primary
            shadow-sm
          `
          : `
            text-theme-muted
            hover:bg-theme-primary-soft
            hover:text-theme-primary
          `
      }

    `;


  // ==================================================
  // COMPONENT
  // ==================================================

  return (

    <header
      className="
        sticky
        top-0
        z-50
        w-full
        border-b
        border-theme-border
        bg-card
        shadow-sm
        transition-colors
        duration-300
      "
    >

      <div
        className="
          relative
          flex
          h-16
          items-center
          px-4
          sm:px-6
          lg:px-8
        "
      >


        {/* ========================================== */}
        {/* DESKTOP NAVIGATION */}
        {/* ========================================== */}

        <nav
          className="
            absolute
            left-1/2
            hidden
            -translate-x-1/2
            items-center
            gap-1
            lg:flex
          "
        >

          {navigation.map(
            (item) => {

              const Icon =
                item.icon;


              return (

                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={navItemClass}
                >

                  {({ isActive }) => (

                    <>

                      <Icon
                        size={17}
                        strokeWidth={
                          isActive
                            ? 2.4
                            : 2
                        }
                      />

                      <span>
                        {item.name}
                      </span>

                    </>

                  )}

                </NavLink>

              );

            }
          )}


          {/* ======================================== */}
          {/* USERS */}
          {/* ======================================== */}

          <div
            ref={usersRef}
            className="relative"
          >

            <button
              type="button"

              onClick={() => {

                setUsersOpen(
                  (previous) =>
                    !previous
                );

                setMastersOpen(false);

              }}

              className={
                dropdownButtonClass(
                  isUserActive
                )
              }
            >

              <Users
                size={17}
                strokeWidth={
                  isUserActive
                    ? 2.4
                    : 2
                }
              />

              <span>
                {t("header.users")}
              </span>

              <ChevronDown
                size={16}

                className={`
                  transition-transform
                  duration-200

                  ${
                    usersOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />

            </button>


            {usersOpen && (

              <div
                className="
                  absolute
                  left-0
                  mt-3
                  w-[360px]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-theme-border
                  bg-card
                  shadow-2xl
                "
              >

                <div
                  className="
                    border-b
                    border-theme-border
                    bg-theme-primary-soft
                    px-5
                    py-4
                  "
                >

                  <p
                    className="
                      text-sm
                      font-bold
                      text-theme-text
                    "
                  >

                    {t("header.userManagement")}

                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-theme-muted
                    "
                  >

                    {t("header.usersDescription")}

                  </p>

                </div>


                <div className="p-2">

                  {usersMenu.map(
                    (item) => {

                      const Icon =
                        item.icon;


                      const isActive =
                        location.pathname ===
                        item.path;


                      return (

                        <Link
                          key={item.path}
                          to={item.path}

                          className={`
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            p-3
                            transition
                            duration-200

                            ${
                              isActive
                                ? "bg-theme-primary-soft"
                                : "hover:bg-theme-primary-soft"
                            }
                          `}
                        >

                          <div
                            className={`
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg

                              ${
                                isActive
                                  ? `
                                    bg-theme-primary
                                    text-white
                                  `
                                  : `
                                    bg-theme-primary-soft
                                    text-theme-primary
                                  `
                              }
                            `}
                          >

                            <Icon size={18} />

                          </div>


                          <div className="min-w-0">

                            <p
                              className={`
                                text-sm
                                font-semibold

                                ${
                                  isActive
                                    ? "text-theme-primary"
                                    : "text-theme-text"
                                }
                              `}
                            >

                              {item.name}

                            </p>


                            <p
                              className="
                                mt-0.5
                                text-xs
                                text-theme-muted
                              "
                            >

                              {item.description}

                            </p>

                          </div>

                        </Link>

                      );

                    }
                  )}

                </div>

              </div>

            )}

          </div>


          {/* ======================================== */}
          {/* MASTERS */}
          {/* ======================================== */}

          <div
            ref={mastersRef}
            className="relative"
          >

            <button
              type="button"

              onClick={() => {

                setMastersOpen(
                  (previous) =>
                    !previous
                );

                setUsersOpen(false);

              }}

              className={
                dropdownButtonClass(
                  isMasterActive
                )
              }
            >

              <Database
                size={17}
                strokeWidth={
                  isMasterActive
                    ? 2.4
                    : 2
                }
              />

              <span>
                {t("header.masters")}
              </span>

              <ChevronDown
                size={16}

                className={`
                  transition-transform
                  duration-200

                  ${
                    mastersOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />

            </button>


            {mastersOpen && (

              <div
                className="
                  absolute
                  right-0
                  mt-3
                  w-[720px]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-theme-border
                  bg-card
                  shadow-2xl
                "
              >

                <div
                  className="
                    border-b
                    border-theme-border
                    bg-theme-primary-soft
                    px-5
                    py-4
                  "
                >

                  <p
                    className="
                      text-sm
                      font-bold
                      text-theme-text
                    "
                  >

                    {t("header.mastersTitle")}

                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-theme-muted
                    "
                  >

                    {t("header.mastersDescription")}

                  </p>

                </div>


                <div
                  className="
                    grid
                    grid-cols-2
                    gap-1
                    p-3
                  "
                >

                  {visibleMasters.length === 0 ? (

                    <p
                      className="
                        col-span-2
                        px-3
                        py-6
                        text-center
                        text-sm
                        text-theme-faint
                      "
                    >
                      {t("header.noMastersAccess")}
                    </p>

                  ) : (

                    visibleMasters.map(
                    (master) => {

                      const Icon =
                        master.icon;


                      const isActive =
                        location.pathname ===
                        master.path;


                      return (

                        <Link
                          key={master.path}
                          to={master.path}

                          className={`
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            p-3
                            transition
                            duration-200

                            ${
                              isActive
                                ? "bg-theme-primary-soft"
                                : "hover:bg-theme-primary-soft"
                            }
                          `}
                        >

                          <div
                            className={`
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg

                              ${
                                isActive
                                  ? `
                                    bg-theme-primary
                                    text-white
                                  `
                                  : `
                                    bg-theme-primary-soft
                                    text-theme-primary
                                  `
                              }
                            `}
                          >

                            <Icon size={17} />

                          </div>


                          <div className="min-w-0">

                            <p
                              className={`
                                text-sm
                                font-semibold

                                ${
                                  isActive
                                    ? "text-theme-primary"
                                    : "text-theme-text"
                                }
                              `}
                            >

                              {master.name}

                            </p>


                            <p
                              className="
                                mt-0.5
                                truncate
                                text-xs
                                text-theme-muted
                              "
                            >

                              {master.description}

                            </p>

                          </div>

                        </Link>

                      );

                    }
                    )

                  )}

                </div>

              </div>

            )}

          </div>

        </nav>


        {/* ========================================== */}
        {/* RIGHT SIDE */}
        {/* ========================================== */}

        <div
          className="
            ml-auto
            flex
            items-center
            gap-1
            sm:gap-2
          "
        >

          {/* LANGUAGE SWITCHER */}

          <div className="flex items-center">

            <LanguageSwitcher />

          </div>


          {/* DARK MODE */}

          <button
            type="button"

            onClick={toggleTheme}

            title={
              darkMode
                ? t("header.switchToLight")
                : t("header.switchToDark")
            }

            aria-label={
              darkMode
                ? t("header.switchToLight")
                : t("header.switchToDark")
            }

            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              text-theme-muted
              transition-all
              duration-200
              hover:bg-theme-primary-soft
              hover:text-theme-primary
            "
          >

            {darkMode ? (

              <Sun size={20} />

            ) : (

              <Moon size={20} />

            )}

          </button>


          {/* NOTIFICATIONS */}

          <button
            type="button"

            title={
              t("header.notifications")
            }

            aria-label={
              t("header.notifications")
            }

            className="
              rounded-xl
              p-2
              text-theme-muted
              transition
              duration-200
              hover:bg-theme-primary-soft
              hover:text-theme-primary
            "
          >

            <Bell size={20} />

          </button>


          {/* SETTINGS */}

          <button
            type="button"

            title={
              t("header.settings")
            }

            aria-label={
              t("header.settings")
            }

            className="
              hidden
              rounded-xl
              p-2
              text-theme-muted
              transition
              duration-200
              hover:bg-theme-primary-soft
              hover:text-theme-primary
              md:block
            "
          >

            <Settings size={20} />

          </button>


          {/* PROFILE */}

          <div
            ref={profileRef}

            className="
              relative
              ml-1
              border-l
              border-theme-border
              pl-2
            "
          >

            <button
              type="button"

              onClick={() =>
                setProfileOpen(
                  (previous) =>
                    !previous
                )
              }

              className="
                flex
                items-center
                gap-2
                rounded-xl
                px-2
                py-1.5
                transition
                duration-200
                hover:bg-theme-primary-soft
              "
            >

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-theme-primary
                  text-sm
                  font-bold
                  text-white
                "
              >

                {getInitials()}

              </div>

            </button>


            {profileOpen && (

              <div
                className="
                  absolute
                  right-0
                  mt-2
                  w-72
                  overflow-hidden
                  rounded-xl
                  border
                  border-theme-border
                  bg-card
                  shadow-xl
                "
              >

                <div
                  className="
                    border-b
                    border-theme-border
                    bg-theme-primary-soft
                    px-4
                    py-4
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-full
                        bg-theme-primary
                        text-sm
                        font-bold
                        text-white
                      "
                    >

                      {getInitials()}

                    </div>


                    <div className="min-w-0">

                      <p
                        className="
                          truncate
                          text-sm
                          font-semibold
                          text-theme-text
                        "
                      >

                        {userName}

                      </p>


                      <p
                        className="
                          mt-1
                          truncate
                          text-xs
                          text-theme-muted
                        "
                      >

                        {
                          user?.email ||
                          t("header.noEmail")
                        }

                      </p>


                      <p
                        className="
                          mt-1
                          text-xs
                          font-medium
                          text-theme-primary
                        "
                      >

                        {formattedRole}

                      </p>

                    </div>

                  </div>

                </div>


                <div className="py-2">

                  <button
                    type="button"

                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-left
                      text-sm
                      font-medium
                      text-theme-muted
                      transition
                      hover:bg-theme-primary-soft
                      hover:text-theme-primary
                    "
                  >

                    <UserCircle size={18} />

                    {t("header.myProfile")}

                  </button>


                  <button
                    type="button"

                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-left
                      text-sm
                      font-medium
                      text-theme-muted
                      transition
                      hover:bg-theme-primary-soft
                      hover:text-theme-primary
                    "
                  >

                    <Settings size={18} />

                    {t("header.settings")}

                  </button>

                </div>


                <div
                  className="
                    border-t
                    border-theme-border
                    p-2
                  "
                >

                  <button
                    type="button"

                    onClick={handleLogout}

                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-2.5
                      text-left
                      text-sm
                      font-semibold
                      text-theme-danger
                      transition
                      hover:bg-theme-danger-soft
                    "
                  >

                    <LogOut size={18} />

                    {t("header.logout")}

                  </button>

                </div>

              </div>

            )}

          </div>


          {/* MOBILE MENU */}

          <button
            type="button"

            onClick={() =>
              setMobileMenuOpen(
                (previous) =>
                  !previous
              )
            }

            className="
              ml-1
              rounded-xl
              p-2
              text-theme-muted
              transition
              duration-200
              hover:bg-theme-primary-soft
              hover:text-theme-primary
              lg:hidden
            "
          >

            {
              mobileMenuOpen
                ? <X size={22} />
                : <Menu size={22} />
            }

          </button>

        </div>

      </div>


      {/* ============================================ */}
      {/* MOBILE NAVIGATION */}
      {/* ============================================ */}

      {mobileMenuOpen && (

        <div
          className="
            border-t
            border-theme-border
            bg-card
            px-4
            py-4
            shadow-lg
            lg:hidden
          "
        >

          {/* MAIN NAVIGATION */}

          <nav
            className="
              flex
              flex-col
              gap-1
            "
          >

            {navigation.map(
              (item) => {

                const Icon =
                  item.icon;


                return (

                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={navItemClass}
                  >

                    <Icon size={18} />

                    <span>
                      {item.name}
                    </span>

                  </NavLink>

                );

              }
            )}

          </nav>


          {/* USERS */}

          <div
            className="
              mt-4
              border-t
              border-theme-border
              pt-4
            "
          >

            <p
              className="
                mb-2
                px-3
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-theme-faint
              "
            >

              {t("header.users")}

            </p>


            <div
              className="
                flex
                flex-col
                gap-1
              "
            >

              {usersMenu.map(
                (item) => {

                  const Icon =
                    item.icon;


                  return (

                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={navItemClass}
                    >

                      <Icon size={18} />

                      <span>
                        {item.name}
                      </span>

                    </NavLink>

                  );

                }
              )}

            </div>

          </div>


          {/* MASTERS */}

          <div
            className="
              mt-4
              border-t
              border-theme-border
              pt-4
            "
          >

            <p
              className="
                mb-2
                px-3
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-theme-faint
              "
            >

              {t("header.masters")}

            </p>


            <div
              className="
                flex
                flex-col
                gap-1
              "
            >

              {visibleMasters.map(
                (master) => {

                  const Icon =
                    master.icon;


                  return (

                    <NavLink
                      key={master.path}
                      to={master.path}
                      className={navItemClass}
                    >

                      <Icon size={18} />

                      <span>
                        {master.name}
                      </span>

                    </NavLink>

                  );

                }
              )}

            </div>

          </div>


          {/* LOGOUT */}

          <div
            className="
              mt-4
              border-t
              border-theme-border
              pt-4
            "
          >

            <button
              type="button"

              onClick={handleLogout}

              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-3
                text-sm
                font-semibold
                text-theme-danger
                transition
                hover:bg-theme-danger-soft
              "
            >

              <LogOut size={18} />

              {t("header.logout")}

            </button>

          </div>

        </div>

      )}

    </header>

  );

}
