import { useState } from "react";

import { Link } from "react-router-dom";

import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";


// ==================================================
// API BASE URL
// ==================================================

const API_BASE_URL = "http://127.0.0.1:8000/api";


// ==================================================
// LOGIN COMPONENT
// ==================================================

export default function Login() {


  // ==================================================
  // STATE
  // ==================================================

  const [fullName, setFullName] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ==================================================
  // NAVIGATION
  // ==================================================
  // (redirect after login uses a hard reload instead —
  // see handleSubmit — so useNavigate is not needed)


  // ==================================================
  // EXTRACT ERROR MESSAGE
  // ==================================================

  const getErrorMessage = (data) => {

    // ================================================
    // FASTAPI ERROR
    // ================================================

    if (Array.isArray(data?.detail)) {

      return data.detail
        .map((item) => {

          if (item?.msg) {

            const field =
              item?.loc?.slice(-1)[0];

            if (field) {

              return `${field}: ${item.msg}`;

            }

            return item.msg;

          }

          return "Validation error";

        })
        .join(", ");

    }


    // ================================================
    // NORMAL DETAIL STRING
    // ================================================

    if (
      typeof data?.detail === "string"
    ) {

      return data.detail;

    }


    // ================================================
    // MESSAGE STRING
    // ================================================

    if (
      typeof data?.message === "string"
    ) {

      return data.message;

    }


    // ================================================
    // FALLBACK
    // ================================================

    return "Login failed. Please try again.";

  };


  // ==================================================
  // LOGIN HANDLER
  // ==================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);


    try {


      // ==============================================
      // API REQUEST
      // ==============================================

      const response =
        await fetch(
          `${API_BASE_URL}/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              "Accept":
                "application/json",
            },


            // ==========================================
            // MATCHES BACKEND LoginRequest EXACTLY
            //
            // {
            //   full_name: str
            //   password: str
            // }
            // ==========================================

            body: JSON.stringify({

              full_name:
                fullName.trim(),

              password:
                password,

            }),

          }
        );


      // ==============================================
      // PARSE RESPONSE
      // ==============================================

      let data;

      try {

        data =
          await response.json();

      } catch {

        throw new Error(
          "Invalid response from server"
        );

      }


      // ==============================================
      // HANDLE API ERROR
      // ==============================================

      if (!response.ok) {

        throw new Error(
          getErrorMessage(data)
        );

      }


      // ==============================================
      // VALIDATE TOKEN
      // ==============================================

      if (!data.access_token) {

        throw new Error(
          "Access token was not received"
        );

      }


      // ==============================================
      // SAVE LOGIN STATUS
      // ==============================================

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );


      // ==============================================
      // SAVE ACCESS TOKEN
      // ==============================================

      localStorage.setItem(
        "access_token",
        data.access_token
      );


      // ==============================================
      // SAVE USER
      // ==============================================

      if (data.user) {

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

      }


      // ==============================================
      // REDIRECT
      // A hard reload (not React Router's navigate) is
      // used deliberately here: it guarantees every
      // top-level provider — especially
      // PermissionsProvider, which only fetches rights
      // once on mount — starts fresh with the new
      // user's token instead of possibly holding onto
      // stale role/rights state from whoever was logged
      // in before.
      // ==============================================

      window.location.href = "/";


    } catch (err) {


      // ==============================================
      // CONSOLE ERROR
      // ==============================================

      console.error(
        "Login error:",
        err
      );


      // ==============================================
      // CONNECTION ERROR
      // ==============================================

      if (
        err instanceof TypeError &&
        err.message === "Failed to fetch"
      ) {

        setError(
          "Failed to connect to the backend. Please make sure FastAPI is running on http://127.0.0.1:8000."
        );

      } else {


        // ============================================
        // NORMAL ERROR
        // ============================================

        setError(

          typeof err.message === "string"
            ? err.message
            : "Something went wrong"

        );

      }


    } finally {


      // ==============================================
      // STOP LOADING
      // ==============================================

      setLoading(false);

    }

  };


  // ==================================================
  // COMPONENT
  // ==================================================

  return (

    <div
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-theme-surface
        px-4
        py-8
      "
    >


      {/* ============================================
          LOGIN CONTAINER
      ============================================ */}

      <div className="w-full max-w-md">


        {/* ============================================
            LOGIN CARD
        ============================================ */}

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-theme-border
            bg-card
            shadow-xl
          "
        >


          {/* ==========================================
              CARD HEADER
          ========================================== */}

          <div
            className="
              border-b
              border-theme-border
              px-8
              pb-6
              pt-8
            "
          >


            <h2
              className="
                text-center
                text-2xl
                font-bold
                text-theme-text
              "
            >
              Welcome back
            </h2>


            <p
              className="
                mt-2
                text-center
                text-sm
                font-medium
                text-theme-muted
              "
            >
              Sign in to continue to your account.
            </p>

          </div>



          {/* ==========================================
              LOGIN FORM
          ========================================== */}

          <form
            onSubmit={handleSubmit}
            className="
              space-y-5
              px-8
              py-7
            "
          >


            {/* ========================================
                FULL NAME
            ======================================== */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-theme-text
                "
              >
                Full Name
              </label>


              <div className="relative">

                <User
                  size={18}
                  className="
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-theme-muted
                  "
                />


                <input

                  type="text"

                  value={fullName}

                  onChange={(e) => {

                    setFullName(
                      e.target.value
                    );

                    setError("");

                  }}

                  placeholder="Enter your full name"

                  required

                  autoComplete="name"

                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-theme-border
                    bg-theme-surface
                    pl-11
                    pr-4
                    text-sm
                    font-medium
                    text-theme-text
                    placeholder:text-theme-muted
                    outline-none
                    transition
                    focus:border-theme-primary
                    focus:ring-4
                    focus:ring-theme-primary-soft
                  "
                />

              </div>

            </div>



            {/* ========================================
                PASSWORD
            ======================================== */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-theme-text
                "
              >
                Password
              </label>


              <div className="relative">

                <Lock
                  size={18}
                  className="
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-theme-muted
                  "
                />


                <input

                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }

                  value={password}

                  onChange={(e) => {

                    setPassword(
                      e.target.value
                    );

                    setError("");

                  }}

                  placeholder="Enter your password"

                  required

                  autoComplete="current-password"

                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-theme-border
                    bg-theme-surface
                    pl-11
                    pr-12
                    text-sm
                    font-medium
                    text-theme-text
                    placeholder:text-theme-muted
                    outline-none
                    transition
                    focus:border-theme-primary
                    focus:ring-4
                    focus:ring-theme-primary-soft
                  "
                />


                {/* SHOW / HIDE PASSWORD */}

                <button

                  type="button"

                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }

                  className="
                    absolute
                    right-3.5
                    top-1/2
                    -translate-y-1/2
                    text-theme-muted
                    transition
                    hover:text-theme-primary
                  "

                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (

                    <EyeOff size={18} />

                  ) : (

                    <Eye size={18} />

                  )}

                </button>

              </div>

            </div>



            {/* ========================================
                ERROR MESSAGE
            ======================================== */}

            {error && (

              <div
                className="
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-red-700
                "
              >
                {error}
              </div>

            )}



            {/* ========================================
                SIGN IN BUTTON
            ======================================== */}

            <button

              type="submit"

              disabled={loading}

              className="
                group
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-theme-primary
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {loading ? (

                "Signing in..."

              ) : (

                <>

                  Sign In

                  <ArrowRight
                    size={17}
                    className="
                      transition-transform
                      group-hover:translate-x-0.5
                    "
                  />

                </>

              )}

            </button>

          </form>



          {/* ==========================================
              REGISTER LINK
          ========================================== */}

          <div
            className="
              border-t
              border-theme-border
              bg-theme-surface
              px-8
              py-5
              text-center
            "
          >

            <p
              className="
                text-sm
                font-medium
                text-theme-muted
              "
            >

              Don't have an account?{" "}

              <Link

                to="/register"

                className="
                  font-semibold
                  text-theme-primary
                  transition
                  hover:opacity-80
                "
              >
                Create an account
              </Link>

            </p>

          </div>


        </div>

      </div>

    </div>

  );

}
