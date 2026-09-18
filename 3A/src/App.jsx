import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";


// ==================================================
// AUTHENTICATION PAGES
// ==================================================

import Login from "./Pages/Login";
import Register from "./Pages/Register";


// ==================================================
// MAIN PAGES
// ==================================================

import Dashboard from "./Pages/Dashboard";
import Overview from "./Pages/Overview";
import FinancialYear from "./Pages/FinancialYear";
import UserList from "./Pages/UserList";
import UserRights from "./Pages/UserRights";


// ==================================================
// ERP MASTERS OVERVIEW
// ==================================================

import MastersOverview from "./Pages/HR/MastersOverview";


// ==================================================
// HR MASTER FORMS
// ==================================================

import AbilityMaster from "./Pages/HR/AbilityMaster";
import WorkLocation from "./Pages/HR/WorkLocation";
import AnnouncementType from "./Pages/HR/AnnouncementType";
import AdvertisingMedia from "./Pages/HR/AdvertisingMedia";
import AdvertisingPurpose from "./Pages/HR/AdvertisingPurpose";
import Requirements from "./Pages/HR/Requirements";
import JobFunctions from "./Pages/HR/JobFunctions";
import KSA from "./Pages/HR/KSA";
import KSACategory from "./Pages/HR/KSACategory";
import PositionGrades from "./Pages/HR/PositionGrades";
import MeetingType from "./Pages/HR/MeetingType";
import MeetingLocation from "./Pages/HR/MeetingLocation";
import Languages from "./Pages/HR/Languages";
import OfficeType from "./Pages/HR/OfficeType";
import OfficeLevel from "./Pages/HR/OfficeLevel";
import RoleInOffense from "./Pages/HR/RoleInOffense";
import Hobbies from "./Pages/HR/Hobbies";


// ==================================================
// SALARY MASTER FORMS
// ==================================================

import NatureOfWork from "./Pages/Salary/NatureofWork";
import ScheduleType from "./Pages/Salary/ScheduleType";
import Religion from "./Pages/Salary/Religion";
import Caste from "./Pages/Salary/Caste";
import SkinTone from "./Pages/Salary/SkinTone";
import TaskStatus from "./Pages/Salary/TaskStatus";
import Relationship from "./Pages/Salary/Relationship";
import ShiftTiming from "./Pages/Salary/ShiftTiming";


// ==================================================
// LAYOUT
// ==================================================

import Layout from "./components/Layout";
import { PermissionsProvider } from "./components/Permissions";


// ==================================================
// AUTHENTICATION CHECK
// ==================================================

const isAuthenticated = () => {

  return (
    localStorage.getItem("isLoggedIn") === "true"
  );

};


// ==================================================
// PROTECTED ROUTE
// ==================================================

function ProtectedRoute({ children }) {

  return isAuthenticated()
    ? children
    : <Navigate to="/login" replace />;

}


// ==================================================
// APP
// ==================================================

export default function App() {

  return (

    <Routes>


      {/* ==================================================
          PUBLIC ROUTES
      ================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />


      <Route
        path="/register"
        element={<Register />}
      />


      {/* ==================================================
          PROTECTED APPLICATION
      ================================================== */}

      <Route
        element={
          <ProtectedRoute>

            <PermissionsProvider>

              <Layout />

            </PermissionsProvider>

          </ProtectedRoute>
        }
      >


        {/* ==============================================
            DASHBOARD
        ============================================== */}

        <Route
          path="/"
          element={<Dashboard />}
        />


        {/* ==============================================
            ERP OVERVIEW
        ============================================== */}

        <Route
          path="/overview"
          element={<Overview />}
        />


        {/* ==============================================
            FINANCIAL YEAR
        ============================================== */}

        <Route
          path="/financial-year"
          element={<FinancialYear />}
        />


        {/* ==============================================
            USERS
        ============================================== */}

        <Route
          path="/users"
          element={<UserList />}
        />


        <Route
          path="/user-rights"
          element={<UserRights />}
        />


        {/* ==============================================
            MASTERS OVERVIEW
        ============================================== */}

        <Route
          path="/masters"
          element={<MastersOverview />}
        />


        {/* ==============================================
            HR MASTERS
        ============================================== */}

        <Route
          path="/announcement-type"
          element={<AnnouncementType />}
        />


        <Route
          path="/advertising-media"
          element={<AdvertisingMedia />}
        />


        <Route
          path="/advertising-purpose"
          element={<AdvertisingPurpose />}
        />


        <Route
          path="/requirements"
          element={<Requirements />}
        />


        <Route
          path="/job-functions"
          element={<JobFunctions />}
        />


        <Route
          path="/ksa"
          element={<KSA />}
        />


        <Route
          path="/ksa-category"
          element={<KSACategory />}
        />


        <Route
          path="/abilities"
          element={<AbilityMaster />}
        />


        <Route
          path="/work-locations"
          element={<WorkLocation />}
        />


        <Route
          path="/position-grades"
          element={<PositionGrades />}
        />


        <Route
          path="/meeting-type"
          element={<MeetingType />}
        />


        <Route
          path="/meeting-location"
          element={<MeetingLocation />}
        />


        <Route
          path="/languages"
          element={<Languages />}
        />


        <Route
          path="/office-type"
          element={<OfficeType />}
        />


        <Route
          path="/office-level"
          element={<OfficeLevel />}
        />


        <Route
          path="/role-in-offense"
          element={<RoleInOffense />}
        />


        <Route
          path="/hobbies"
          element={<Hobbies />}
        />


        {/* ==============================================
            SALARY MASTERS
            Paths match the "path" values set on each
            master's entry in Header.jsx.
        ============================================== */}

        <Route
          path="/masters/salary/nature-of-work"
          element={<NatureOfWork />}
        />


        <Route
          path="/masters/salary/schedule-type"
          element={<ScheduleType />}
        />


        <Route
          path="/masters/salary/religion"
          element={<Religion />}
        />


        <Route
          path="/masters/salary/castes"
          element={<Caste />}
        />


        <Route
          path="/masters/salary/skin-tones"
          element={<SkinTone />}
        />


        <Route
          path="/masters/salary/task-status"
          element={<TaskStatus />}
        />


        <Route
          path="/masters/salary/relationship"
          element={<Relationship />}
        />


        <Route
          path="/masters/salary/shift-timing"
          element={<ShiftTiming />}
        />


      </Route>


      {/* ==================================================
          FALLBACK
      ================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />


    </Routes>

  );

}