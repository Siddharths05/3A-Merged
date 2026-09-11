import { Link } from "react-router-dom";

import {
  Users,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

import useTranslate from "../hooks/useTranslate";


// ==================================================
// DASHBOARD
// ==================================================

export default function Dashboard() {


  // ==================================================
  // TRANSLATIONS
  // ==================================================

  const pageTitle =
    useTranslate(
      "dashboard.pageTitle"
    );


  const pageDescription =
    useTranslate(
      "dashboard.pageDescription"
    );


  const companyName =
    useTranslate(
      "dashboard.companyName"
    );


  const welcomeBack =
    useTranslate(
      "dashboard.welcomeBack"
    );


  const welcomeDescription =
    useTranslate(
      "dashboard.welcomeDescription"
    );


  // ==================================================
  // QUICK ACCESS
  // ==================================================

  const quickAccessTitle =
    useTranslate(
      "dashboard.quickAccessTitle"
    );


  const quickAccessDescription =
    useTranslate(
      "dashboard.quickAccessDescription"
    );


  // ==================================================
  // REGISTER USER
  // ==================================================

  const registerUserTitle =
    useTranslate(
      "dashboard.registerUserTitle"
    );


  const registerUserDescription =
    useTranslate(
      "dashboard.registerUserDescription"
    );


  const registerUserAction =
    useTranslate(
      "dashboard.registerUserAction"
    );


  // ==================================================
  // FINANCIAL YEAR
  // ==================================================

  const financialYearTitle =
    useTranslate(
      "dashboard.financialYearTitle"
    );


  const financialYearDescription =
    useTranslate(
      "dashboard.financialYearDescription"
    );


  const financialYearAction =
    useTranslate(
      "dashboard.financialYearAction"
    );


  // ==================================================
  // COMPONENT
  // ==================================================

  return (

    <div className="w-full space-y-8">


      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="mb-8">

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



      {/* ==================================================
          WELCOME BANNER
      ================================================== */}

      <section
        className="
          relative
          overflow-hidden
          rounded-2xl
          bg-theme-primary
          px-6
          py-8
          text-white
          shadow-lg
          sm:px-8
          sm:py-10
        "
      >


        <div className="relative z-10">


          <p
            className="
              text-sm
              font-medium
              tracking-wide
              text-white/80
            "
          >

            {companyName}

          </p>


          <h2
            className="
              mt-2
              text-3xl
              font-bold
              tracking-tight
              sm:text-4xl
            "
          >

            {welcomeBack}

          </h2>


          <p
            className="
              mt-3
              max-w-2xl
              text-sm
              leading-6
              text-white/80
              sm:text-base
            "
          >

            {welcomeDescription}

          </p>

        </div>


        <div
          className="
            pointer-events-none
            absolute
            -right-10
            -top-16
            h-48
            w-48
            rounded-full
            bg-white/10
          "
        />


        <div
          className="
            pointer-events-none
            absolute
            -bottom-20
            right-24
            h-40
            w-40
            rounded-full
            bg-white/10
          "
        />


        <div
          className="
            pointer-events-none
            absolute
            right-1/3
            top-0
            h-24
            w-24
            rounded-full
            bg-white/5
          "
        />

      </section>



      {/* ==================================================
          QUICK ACCESS
      ================================================== */}

      <section>


        <div className="mb-5">

          <h2
            className="
              text-lg
              font-semibold
              text-theme-text
            "
          >

            {quickAccessTitle}

          </h2>


          <p
            className="
              mt-1
              text-sm
              text-theme-muted
            "
          >

            {quickAccessDescription}

          </p>

        </div>



        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
          "
        >


          {/* REGISTER USER */}

          <Link
            to="/register"
            className="
              group
              rounded-2xl
              border
              border-theme-border
              bg-card
              p-6
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-1
              hover:border-theme-primary/40
              hover:shadow-lg
            "
          >

            <div className="flex items-start justify-between">

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


              <ArrowRight
                size={20}
                className="
                  text-theme-faint
                  transition-all
                  duration-200
                  group-hover:translate-x-1
                  group-hover:text-theme-primary
                "
              />

            </div>


            <h3
              className="
                mt-5
                text-lg
                font-semibold
                text-theme-text
              "
            >

              {registerUserTitle}

            </h3>


            <p
              className="
                mt-2
                text-sm
                leading-6
                text-theme-muted
              "
            >

              {registerUserDescription}

            </p>


            <div
              className="
                mt-5
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-theme-primary
              "
            >

              {registerUserAction}

              <ArrowRight size={16} />

            </div>

          </Link>



          {/* FINANCIAL YEAR */}

          <Link
            to="/financial-year"
            className="
              group
              rounded-2xl
              border
              border-theme-border
              bg-card
              p-6
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-1
              hover:border-theme-primary/40
              hover:shadow-lg
            "
          >

            <div className="flex items-start justify-between">

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

                <CalendarDays size={24} />

              </div>


              <ArrowRight
                size={20}
                className="
                  text-theme-faint
                  transition-all
                  duration-200
                  group-hover:translate-x-1
                  group-hover:text-theme-primary
                "
              />

            </div>


            <h3
              className="
                mt-5
                text-lg
                font-semibold
                text-theme-text
              "
            >

              {financialYearTitle}

            </h3>


            <p
              className="
                mt-2
                text-sm
                leading-6
                text-theme-muted
              "
            >

              {financialYearDescription}

            </p>


            <div
              className="
                mt-5
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-theme-primary
              "
            >

              {financialYearAction}

              <ArrowRight size={16} />

            </div>

          </Link>

        </div>

      </section>

    </div>

  );

}