import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  ChevronDown,
  Megaphone,
  Radio,
  Target,
  ClipboardList,
  BriefcaseBusiness,
  Brain,
  Tags,
  ShieldCheck,
  MapPin,
  Award,
  CalendarCheck,
  Languages as LanguagesIcon,
  Building2,
  Layers3,
  ShieldAlert,
  Heart,
  LayoutDashboard,
  Users,
  UserPlus,
  BarChart3,
} from "lucide-react";


export default function MastersBar() {

  const [isMastersOpen, setIsMastersOpen] = useState(false);

  const [
    isUserManagementOpen,
    setIsUserManagementOpen
  ] = useState(false);


  /* ==================================================
      MASTERS MENU
  ================================================== */

  const masters = [

    {
      name: "Announcement Type",
      path: "/announcement-type",
      icon: Megaphone,
    },

    {
      name: "Advertising Media",
      path: "/advertising-media",
      icon: Radio,
    },

    {
      name: "Advertising Purpose",
      path: "/advertising-purpose",
      icon: Target,
    },

    {
      name: "Requirements",
      path: "/requirements",
      icon: ClipboardList,
    },

    {
      name: "Job Functions and Responsibilities",
      path: "/job-functions",
      icon: BriefcaseBusiness,
    },

    {
      name: "Knowledge Skills and Abilities (KSA)",
      path: "/ksa",
      icon: Brain,
    },

    {
      name: "Category (KSA)",
      path: "/ksa-category",
      icon: Tags,
    },

    {
      name: "Ability Master",
      path: "/abilities",
      icon: ShieldCheck,
    },

    {
      name: "Work Location",
      path: "/work-locations",
      icon: MapPin,
    },

    {
      name: "Position Grades",
      path: "/position-grades",
      icon: Award,
    },

    {
      name: "Meeting Type",
      path: "/meeting-type",
      icon: CalendarCheck,
    },

    {
      name: "Meeting Location",
      path: "/meeting-location",
      icon: MapPin,
    },

    {
      name: "Languages",
      path: "/languages",
      icon: LanguagesIcon,
    },

    {
      name: "Office Type",
      path: "/office-type",
      icon: Building2,
    },

    {
      name: "Office Level",
      path: "/office-level",
      icon: Layers3,
    },

    {
      name: "Role in Offense",
      path: "/role-in-offense",
      icon: ShieldAlert,
    },

    {
      name: "Hobbies",
      path: "/hobbies",
      icon: Heart,
    },

  ];


  /* ==================================================
      USER MANAGEMENT MENU
  ================================================== */

  const userManagement = [

    {
      name: "User List",
      path: "/users",
      icon: Users,
    },

    {
      name: "Create User",
      path: "/register",
      icon: UserPlus,
    },

  ];


  /* ==================================================
      TOGGLE MASTERS
  ================================================== */

  const handleMastersToggle = () => {

    setIsMastersOpen(!isMastersOpen);

    setIsUserManagementOpen(false);

  };


  /* ==================================================
      TOGGLE USER MANAGEMENT
  ================================================== */

  const handleUserManagementToggle = () => {

    setIsUserManagementOpen(!isUserManagementOpen);

    setIsMastersOpen(false);

  };


  return (

    <div className="bg-white border-b border-slate-200 px-8 relative">


      {/* ==================================================
          HEADER NAVIGATION
      ================================================== */}

      <div className="h-14 flex items-center gap-8">


        {/* ==================================================
            DASHBOARD
        ================================================== */}

        <NavLink
          to="/"
          end
          onClick={() => {
            setIsMastersOpen(false);
            setIsUserManagementOpen(false);
          }}
          className={({ isActive }) =>
            `
            h-14
            flex items-center gap-2
            text-sm font-semibold
            border-b-2
            transition-colors
            ${
              isActive
                ? "text-blue-700 border-blue-600"
                : "text-slate-600 border-transparent hover:text-slate-900"
            }
            `
          }
        >

          <LayoutDashboard className="w-4 h-4" />

          <span>Dashboard</span>

        </NavLink>


        {/* ==================================================
            OVERVIEW
        ================================================== */}

        <NavLink
          to="/overview"
          onClick={() => {
            setIsMastersOpen(false);
            setIsUserManagementOpen(false);
          }}
          className={({ isActive }) =>
            `
            h-14
            flex items-center gap-2
            text-sm font-semibold
            border-b-2
            transition-colors
            ${
              isActive
                ? "text-blue-700 border-blue-600"
                : "text-slate-600 border-transparent hover:text-slate-900"
            }
            `
          }
        >

          <BarChart3 className="w-4 h-4" />

          <span>Overview</span>

        </NavLink>


        {/* ==================================================
            MASTERS
        ================================================== */}

        <button
          type="button"
          onClick={handleMastersToggle}
          className={`
            h-14
            flex items-center gap-2
            text-sm font-semibold
            border-b-2
            transition-colors
            ${
              isMastersOpen
                ? "text-blue-700 border-blue-600"
                : "text-slate-600 border-transparent hover:text-slate-900"
            }
          `}
        >

          <span>Masters</span>

          <ChevronDown
            className={`
              w-4 h-4
              transition-transform
              ${
                isMastersOpen
                  ? "rotate-180"
                  : ""
              }
            `}
          />

        </button>


        {/* ==================================================
            USER MANAGEMENT
        ================================================== */}

        <button
          type="button"
          onClick={handleUserManagementToggle}
          className={`
            h-14
            flex items-center gap-2
            text-sm font-semibold
            border-b-2
            transition-colors
            ${
              isUserManagementOpen
                ? "text-blue-700 border-blue-600"
                : "text-slate-600 border-transparent hover:text-slate-900"
            }
          `}
        >

          <span>User Management</span>

          <ChevronDown
            className={`
              w-4 h-4
              transition-transform
              ${
                isUserManagementOpen
                  ? "rotate-180"
                  : ""
              }
            `}
          />

        </button>


      </div>


      {/* ==================================================
          MASTERS DROPDOWN
      ================================================== */}

      {isMastersOpen && (

        <div className="absolute left-8 top-14 z-50 w-[420px]">

          <div className="border border-slate-200 rounded-lg bg-white shadow-lg overflow-hidden">

            <div className="max-h-[500px] overflow-y-auto">

              {masters.map((master) => {

                const Icon = master.icon;

                return (

                  <NavLink
                    key={master.path}
                    to={master.path}
                    onClick={() => setIsMastersOpen(false)}
                    className={({ isActive }) =>
                      `
                      flex items-center gap-3
                      px-4 py-3
                      text-sm
                      border-b border-slate-100
                      last:border-b-0
                      transition-colors
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }
                      `
                    }
                  >

                    <Icon className="w-4 h-4 shrink-0" />

                    <span>{master.name}</span>

                  </NavLink>

                );

              })}

            </div>

          </div>

        </div>

      )}


      {/* ==================================================
          USER MANAGEMENT DROPDOWN
      ================================================== */}

      {isUserManagementOpen && (

        <div className="absolute left-[330px] top-14 z-50 w-64">

          <div className="border border-slate-200 rounded-lg bg-white shadow-lg overflow-hidden">

            {userManagement.map((item) => {

              const Icon = item.icon;

              return (

                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() =>
                    setIsUserManagementOpen(false)
                  }
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3
                    px-4 py-3
                    text-sm
                    border-b border-slate-100
                    last:border-b-0
                    transition-colors
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }
                    `
                  }
                >

                  <Icon className="w-4 h-4 shrink-0" />

                  <span>{item.name}</span>

                </NavLink>

              );

            })}

          </div>

        </div>

      )}


    </div>

  );
}