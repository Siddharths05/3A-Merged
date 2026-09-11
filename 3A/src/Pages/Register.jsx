import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Lock,
  Eye,
  EyeOff,
  Mail,
  UserRound,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";


export default function Register() {

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();


  // ==================================================
  // PASSWORD VALIDATION
  // ==================================================

  const passwordRequirements = {

    minLength:
      formData.password.length >= 8,

    hasLetter:
      /[A-Za-z]/.test(formData.password),

    hasNumber:
      /[0-9]/.test(formData.password),

    hasSpecial:
      /[^A-Za-z0-9]/.test(formData.password),

  };


  const isPasswordValid =

    passwordRequirements.minLength &&
    passwordRequirements.hasLetter &&
    passwordRequirements.hasNumber &&
    passwordRequirements.hasSpecial;


  // ==================================================
  // HANDLE INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {

    const { name, value } = e.target;


    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));


    setError("");

  };


  // ==================================================
  // HANDLE REGISTER
  // ==================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");


    const fullName =
      formData.full_name.trim();

    const email =
      formData.email
        .trim()
        .toLowerCase();


    if (!fullName) {

      setError(
        "Please enter your full name"
      );

      return;

    }


    if (!email) {

      setError(
        "Please enter your email address"
      );

      return;

    }


    if (!isPasswordValid) {

      setError(
        "Password must be at least 8 characters and contain a letter, a number, and a special character"
      );

      return;

    }


    if (
      formData.password !==
      formData.confirmPassword
    ) {

      setError(
        "Passwords do not match"
      );

      return;

    }


    setLoading(true);


    try {

      const response = await fetch(
        "http://localhost:8000/api/register",
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            full_name: fullName,

            email: email,

            password: formData.password,

          }),

        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Registration failed"
        );

      }


      localStorage.setItem(
        "isLoggedIn",
        "true"
      );


      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );


      navigate("/");


    } catch (err) {

      setError(
        err.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };


  // ==================================================
  // COMPONENT
  // ==================================================

  return (

    <div className="mx-auto w-full max-w-3xl">


      {/* ==================================================
          CREATE USER CARD
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


        {/* ==================================================
            CARD HEADER
        ================================================== */}

        <div
          className="
            border-b
            border-theme-border
            px-6
            py-5
          "
        >

          <div className="flex items-center gap-3">


            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-theme-primary-soft
                text-theme-primary
              "
            >

              <UserRound size={21} />

            </div>


            <div>

              <h2
                className="
                  text-lg
                  font-semibold
                  text-theme-text
                "
              >

                User Information

              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                  text-theme-muted
                "
              >

                Enter the details required to create the user account.

              </p>

            </div>


          </div>

        </div>


        {/* ==================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >


          {/* FULL NAME */}

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

              Full name

            </label>


            <div className="relative">

              <UserRound
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
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter full name"
                autoComplete="name"
                required
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
                  outline-none
                  transition
                  placeholder:text-theme-muted
                  focus:border-theme-primary
                  focus:ring-4
                  focus:ring-theme-primary-soft
                "
              />

            </div>

          </div>


          {/* EMAIL */}

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

              Email address

            </label>


            <div className="relative">

              <Mail
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
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                autoComplete="email"
                required
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
                  outline-none
                  transition
                  placeholder:text-theme-muted
                  focus:border-theme-primary
                  focus:ring-4
                  focus:ring-theme-primary-soft
                "
              />

            </div>

          </div>


          {/* PASSWORD */}

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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
                required
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
                  outline-none
                  transition
                  placeholder:text-theme-muted
                  focus:border-theme-primary
                  focus:ring-4
                  focus:ring-theme-primary-soft
                "
              />


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
              >

                {showPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />
                }

              </button>

            </div>

          </div>


          {/* CONFIRM PASSWORD */}

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

              Confirm password

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
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
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
                  outline-none
                  transition
                  placeholder:text-theme-muted
                  focus:border-theme-primary
                  focus:ring-4
                  focus:ring-theme-primary-soft
                "
              />


              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
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
              >

                {showConfirmPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />
                }

              </button>

            </div>

          </div>


          {/* ==================================================
              PASSWORD REQUIREMENTS
          ================================================== */}

          <div
            className="
              space-y-2
              rounded-xl
              border
              border-theme-border
              bg-theme-surface
              px-4
              py-4
            "
          >

            <p
              className="
                text-xs
                font-semibold
                text-theme-text
              "
            >

              Password requirements

            </p>


            {/* REQUIREMENTS */}

            <Requirement
              valid={passwordRequirements.minLength}
              text="At least 8 characters"
            />

            <Requirement
              valid={passwordRequirements.hasLetter}
              text="At least one letter"
            />

            <Requirement
              valid={passwordRequirements.hasNumber}
              text="At least one number"
            />

            <Requirement
              valid={passwordRequirements.hasSpecial}
              text="At least one special character"
            />

          </div>


          {/* ERROR */}

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


          {/* CREATE ACCOUNT */}

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

              "Creating account..."

            ) : (

              <>

                Create Account

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


        {/* ==================================================
            LOGIN LINK
        ================================================== */}

        <div
          className="
            border-t
            border-theme-border
            px-6
            py-5
          "
        >

          <p
            className="
              text-sm
              font-medium
              text-theme-muted
            "
          >

            Already have an account?{" "}

            <Link
              to="/login"
              className="
                font-semibold
                text-theme-primary
                transition
                hover:opacity-80
              "
            >

              Sign In

            </Link>

          </p>

        </div>


      </div>

    </div>

  );

}


// ==================================================
// PASSWORD REQUIREMENT COMPONENT
// ==================================================

function Requirement({ valid, text }) {

  return (

    <div
      className="
        flex
        items-center
        gap-2
        text-xs
      "
    >

      <CheckCircle2
        size={15}
        className={
          valid
            ? "text-green-500"
            : "text-theme-muted"
        }
      />


      <span
        className={
          valid
            ? "font-medium text-green-700"
            : "font-medium text-theme-muted"
        }
      >

        {text}

      </span>

    </div>

  );

}