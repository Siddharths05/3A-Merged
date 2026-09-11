import {
  useTranslation,
} from "../context/TranslationContext";

import {
  Users,
  UserCheck,
  Building2,
  BriefcaseBusiness,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock3,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react";


// ==================================================
// OVERVIEW COMPONENT
// ==================================================

export default function Overview() {

  // ==================================================
  // TRANSLATION
  // ==================================================

  const {
    t,
  } = useTranslation();


  // ==================================================
  // KPI DATA
  // ==================================================

  const kpis = [

    {
      title:
        t(
          "overview.kpis.totalEmployees.title"
        ),

      value: "1,248",

      change: "+12.5%",

      trend: "up",

      icon: Users,

      description:
        t(
          "overview.kpis.totalEmployees.description"
        ),
    },


    {
      title:
        t(
          "overview.kpis.activeEmployees.title"
        ),

      value: "1,186",

      change: "+8.2%",

      trend: "up",

      icon: UserCheck,

      description:
        t(
          "overview.kpis.activeEmployees.description"
        ),
    },


    {
      title:
        t(
          "overview.kpis.departments.title"
        ),

      value: "24",

      change: "+2",

      trend: "up",

      icon: Building2,

      description:
        t(
          "overview.kpis.departments.description"
        ),
    },


    {
      title:
        t(
          "overview.kpis.openPositions.title"
        ),

      value: "36",

      change: "-4.3%",

      trend: "down",

      icon: BriefcaseBusiness,

      description:
        t(
          "overview.kpis.openPositions.description"
        ),
    },

  ];


  // ==================================================
  // ACTIVITY DATA
  // ==================================================

  const activities = [

    {
      title:
        t(
          "overview.activities.newEmployee.title"
        ),

      description:
        t(
          "overview.activities.newEmployee.description"
        ),

      time:
        t(
          "overview.activities.newEmployee.time"
        ),
    },


    {
      title:
        t(
          "overview.activities.financialYearUpdated.title"
        ),

      description:
        t(
          "overview.activities.financialYearUpdated.description"
        ),

      time:
        t(
          "overview.activities.financialYearUpdated.time"
        ),
    },


    {
      title:
        t(
          "overview.activities.newPosition.title"
        ),

      description:
        t(
          "overview.activities.newPosition.description"
        ),

      time:
        t(
          "overview.activities.newPosition.time"
        ),
    },


    {
      title:
        t(
          "overview.activities.masterDataUpdated.title"
        ),

      description:
        t(
          "overview.activities.masterDataUpdated.description"
        ),

      time:
        t(
          "overview.activities.masterDataUpdated.time"
        ),
    },

  ];


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

          {t("overview.title")}

        </h1>


        <p
          className="
            mt-1
            text-sm
            text-theme-muted
            sm:text-base
          "
        >

          {t("overview.description")}

        </p>

      </div>


      {/* ==================================================
          DEMO DATA BADGE
      ================================================== */}

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
          className="text-theme-primary"
        />

        <span>

          {t("overview.demoData")}

        </span>

      </div>


      {/* ==================================================
          KPI CARDS
      ================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        {kpis.map((kpi) => {

          const Icon =
            kpi.icon;


          const TrendIcon =
            kpi.trend === "up"
              ? TrendingUp
              : TrendingDown;


          return (

            <div
              key={kpi.title}

              className="
                group
                rounded-2xl
                border
                border-theme-border
                bg-card
                p-5
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-1
                hover:border-theme-primary/40
                hover:shadow-md
              "
            >

              <div
                className="
                  flex
                  items-start
                  justify-between
                "
              >


                {/* KPI ICON */}

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
                    transition-transform
                    duration-200
                    group-hover:scale-105
                  "
                >

                  <Icon size={21} />

                </div>


                {/* TREND */}

                <div
                  className={`
                    flex
                    items-center
                    gap-1
                    rounded-lg
                    px-2
                    py-1
                    text-xs
                    font-semibold

                    ${
                      kpi.trend === "up"
                        ? `
                          bg-emerald-50
                          text-emerald-700
                          dark:bg-emerald-500/10
                          dark:text-emerald-400
                        `
                        : `
                          bg-theme-danger-soft
                          text-theme-danger
                        `
                    }
                  `}
                >

                  <TrendIcon size={14} />

                  {kpi.change}

                </div>

              </div>


              {/* KPI CONTENT */}

              <div className="mt-5">

                <p
                  className="
                    text-sm
                    font-medium
                    text-theme-muted
                  "
                >

                  {kpi.title}

                </p>


                <h2
                  className="
                    mt-2
                    text-3xl
                    font-bold
                    tracking-tight
                    text-theme-text
                  "
                >

                  {kpi.value}

                </h2>


                <p
                  className="
                    mt-2
                    text-xs
                    text-theme-faint
                  "
                >

                  {kpi.description}

                </p>

              </div>

            </div>

          );

        })}

      </div>


      {/* ==================================================
          BOTTOM GRID
      ================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-6
          xl:grid-cols-3
        "
      >


        {/* ==================================================
            ORGANIZATION SUMMARY
        ================================================== */}

        <div
          className="
            rounded-2xl
            border
            border-theme-border
            bg-card
            p-6
            shadow-sm
            xl:col-span-1
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

              <h2
                className="
                  text-base
                  font-bold
                  text-theme-text
                "
              >

                {
                  t(
                    "overview.organizationSummary.title"
                  )
                }

              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  text-theme-muted
                "
              >

                {
                  t(
                    "overview.organizationSummary.description"
                  )
                }

              </p>

            </div>


            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-theme-primary-soft
                text-theme-primary
              "
            >

              <Building2 size={20} />

            </div>

          </div>


          {/* PROGRESS METRICS */}

          <div className="mt-6 space-y-5">


            {/* EMPLOYEE CAPACITY */}

            <div>

              <div
                className="
                  mb-2
                  flex
                  items-center
                  justify-between
                  text-sm
                "
              >

                <span className="text-theme-muted">

                  {
                    t(
                      "overview.organizationSummary.employeeCapacity"
                    )
                  }

                </span>


                <span className="font-semibold text-theme-text">

                  82%

                </span>

              </div>


              <div
                className="
                  h-2.5
                  overflow-hidden
                  rounded-full
                  bg-theme-primary-soft
                "
              >

                <div
                  className="
                    h-full
                    w-[82%]
                    rounded-full
                    bg-theme-primary
                    transition-all
                    duration-500
                  "
                />

              </div>

            </div>


            {/* SYSTEM COMPLETION */}

            <div>

              <div
                className="
                  mb-2
                  flex
                  items-center
                  justify-between
                  text-sm
                "
              >

                <span className="text-theme-muted">

                  {
                    t(
                      "overview.organizationSummary.systemCompletion"
                    )
                  }

                </span>


                <span className="font-semibold text-theme-text">

                  76%

                </span>

              </div>


              <div
                className="
                  h-2.5
                  overflow-hidden
                  rounded-full
                  bg-theme-primary-soft
                "
              >

                <div
                  className="
                    h-full
                    w-[76%]
                    rounded-full
                    bg-emerald-500
                    transition-all
                    duration-500
                  "
                />

              </div>

            </div>


            {/* HR DATA UPDATED */}

            <div>

              <div
                className="
                  mb-2
                  flex
                  items-center
                  justify-between
                  text-sm
                "
              >

                <span className="text-theme-muted">

                  {
                    t(
                      "overview.organizationSummary.hrDataUpdated"
                    )
                  }

                </span>


                <span className="font-semibold text-theme-text">

                  91%

                </span>

              </div>


              <div
                className="
                  h-2.5
                  overflow-hidden
                  rounded-full
                  bg-theme-primary-soft
                "
              >

                <div
                  className="
                    h-full
                    w-[91%]
                    rounded-full
                    bg-theme-primary
                    transition-all
                    duration-500
                  "
                />

              </div>

            </div>


          </div>

        </div>


        {/* ==================================================
            RECENT ACTIVITY
        ================================================== */}

        <div
          className="
            rounded-2xl
            border
            border-theme-border
            bg-card
            p-6
            shadow-sm
            xl:col-span-2
          "
        >


          {/* HEADER */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >

            <div>

              <h2
                className="
                  text-base
                  font-bold
                  text-theme-text
                "
              >

                {
                  t(
                    "overview.recentActivity.title"
                  )
                }

              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  text-theme-muted
                "
              >

                {
                  t(
                    "overview.recentActivity.description"
                  )
                }

              </p>

            </div>


            <button
              type="button"

              className="
                flex
                shrink-0
                items-center
                gap-1
                rounded-lg
                px-2
                py-1
                text-sm
                font-semibold
                text-theme-primary
                transition
                hover:bg-theme-primary-soft
              "
            >

              {
                t(
                  "overview.recentActivity.viewAll"
                )
              }

              <ArrowUpRight size={16} />

            </button>

          </div>


          {/* ACTIVITY LIST */}

          <div
            className="
              mt-5
              divide-y
              divide-theme-border
            "
          >

            {activities.map((activity) => (

              <div
                key={activity.title}

                className="
                  flex
                  items-start
                  gap-4
                  py-4
                  transition-colors
                  duration-200
                "
              >


                {/* ACTIVITY ICON */}

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
                    text-theme-primary
                  "
                >

                  <Activity size={17} />

                </div>


                {/* ACTIVITY CONTENT */}

                <div className="min-w-0 flex-1">

                  <div
                    className="
                      flex
                      flex-col
                      gap-1
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >

                    <p
                      className="
                        font-semibold
                        text-theme-text
                      "
                    >

                      {activity.title}

                    </p>


                    <span
                      className="
                        flex
                        items-center
                        gap-1
                        whitespace-nowrap
                        text-xs
                        text-theme-faint
                      "
                    >

                      <Clock3 size={13} />

                      {activity.time}

                    </span>

                  </div>


                  <p
                    className="
                      mt-1
                      text-sm
                      text-theme-muted
                    "
                  >

                    {activity.description}

                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );

}