import {
  useState,
} from "react";

import {
  CalendarDays,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import useTranslate from "../hooks/useTranslate";


// ==================================================
// FINANCIAL YEAR
// ==================================================

export default function FinancialYear() {


  // ==================================================
  // TRANSLATIONS
  // ==================================================

  const pageTitle =
    useTranslate(
      "financialYear.pageTitle"
    );


  const pageDescription =
    useTranslate(
      "financialYear.pageDescription"
    );


  const financialSetup =
    useTranslate(
      "financialYear.financialSetup"
    );


  const setupTitle =
    useTranslate(
      "financialYear.setupTitle"
    );


  const setupDescription =
    useTranslate(
      "financialYear.setupDescription"
    );


  const startOfFinancialYear =
    useTranslate(
      "financialYear.startOfFinancialYear"
    );


  const endOfFinancialYear =
    useTranslate(
      "financialYear.endOfFinancialYear"
    );


  const endDateError =
    useTranslate(
      "financialYear.endDateError"
    );


  const savedSuccessfully =
    useTranslate(
      "financialYear.savedSuccessfully"
    );


  const saving =
    useTranslate(
      "financialYear.saving"
    );


  const saveFinancialYear =
    useTranslate(
      "financialYear.saveFinancialYear"
    );


  // ==================================================
  // STATE
  // ==================================================

  const [
    formData,
    setFormData,
  ] = useState({
    startDate: "",
    endDate: "",
  });


  const [
    error,
    setError,
  ] = useState("");


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    success,
    setSuccess,
  ] = useState(false);


  // ==================================================
  // HANDLE INPUT CHANGE
  // ==================================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );


    setError("");

    setSuccess(false);

  };


  // ==================================================
  // HANDLE SUBMIT
  // ==================================================

  const handleSubmit = (
    event
  ) => {

    event.preventDefault();


    setError("");

    setSuccess(false);

    setLoading(true);


    // ================================================
    // VALIDATE DATES
    // ================================================

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) <=
        new Date(formData.startDate)
    ) {

      setError(
        endDateError
      );


      setLoading(false);

      return;

    }


    // ================================================
    // TEMPORARY SAVE
    // ================================================

    setTimeout(() => {

      console.log(
        "Financial Year data:",
        formData
      );


      setLoading(false);

      setSuccess(true);

    }, 600);

  };


  // ==================================================
  // COMPONENT
  // ==================================================

  return (

    <div className="w-full space-y-8">


      {/* ==============================================
          PAGE HEADER
      ============================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
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
            "
          >

            {pageDescription}

          </p>

        </div>


        <div
          className="
            flex
            w-fit
            items-center
            gap-2
            rounded-xl
            border
            border-theme-border
            bg-card
            px-4
            py-2.5
            text-sm
            text-theme-muted
            shadow-sm
          "
        >

          <CalendarDays
            size={18}
            className="
              text-theme-primary
            "
          />


          <span>

            {financialSetup}

          </span>

        </div>

      </div>



      {/* ==============================================
          FINANCIAL YEAR CONTENT
      ============================================== */}

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


        {/* ============================================
            CARD HEADER
        ============================================ */}

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

              {setupTitle}

            </h2>


            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >

              {setupDescription}

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

            <CalendarDays
              size={21}
            />

          </div>

        </div>



        {/* ============================================
            FORM
        ============================================ */}

        <form
          onSubmit={handleSubmit}

          className="
            space-y-6
            p-6
          "
        >


          <div
            className="
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
            "
          >


            {/* ========================================
                START DATE
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

                {startOfFinancialYear}

              </label>


              <div className="relative">

                <CalendarDays
                  size={18}

                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-theme-faint
                  "
                />


                <input
                  type="date"

                  name="startDate"

                  value={
                    formData.startDate
                  }

                  onChange={
                    handleChange
                  }

                  required

                  className="
                    h-12
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
                    focus:border-theme-primary
                    focus:ring-2
                    focus:ring-theme-primary-soft
                  "
                />

              </div>

            </div>



            {/* ========================================
                END DATE
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

                {endOfFinancialYear}

              </label>


              <div className="relative">

                <CalendarDays
                  size={18}

                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-theme-faint
                  "
                />


                <input
                  type="date"

                  name="endDate"

                  value={
                    formData.endDate
                  }

                  onChange={
                    handleChange
                  }

                  required

                  className="
                    h-12
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
                    focus:border-theme-primary
                    focus:ring-2
                    focus:ring-theme-primary-soft
                  "
                />

              </div>

            </div>

          </div>



          {/* ==========================================
              ERROR
          ========================================== */}

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



          {/* ==========================================
              SUCCESS
          ========================================== */}

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

                {savedSuccessfully}

              </span>

            </div>

          )}



          {/* ==========================================
              ACTION
          ========================================== */}

          <div
            className="
              flex
              justify-end
              border-t
              border-theme-border
              pt-6
            "
          >

            <button
              type="submit"

              disabled={
                loading
              }

              className="
                group
                inline-flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
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
                sm:w-auto
              "
            >

              {loading ? (

                saving

              ) : (

                <>

                  {saveFinancialYear}

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

          </div>

        </form>

      </div>

    </div>

  );

}