import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Database,
  Layers,
  FileText,
  MapPin,
  Users,
  Briefcase,
  CalendarDays,
  Languages,
  Building2,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Activity,
  LayoutGrid,
} from "lucide-react";


export default function MastersOverview() {

  const { t } = useTranslation();


  // ==================================================
  // DUMMY KPI DATA
  // ==================================================

  const kpis = [

    {
      title: t("mastersOverview.kpis.totalMasterRecords"),
      value: "1,248",
      description: t(
        "mastersOverview.kpis.totalMasterRecordsDescription"
      ),
      icon: Database,
      trend: "+12.5%",
    },

    {
      title: t("mastersOverview.kpis.activeMasterModules"),
      value: "17",
      description: t(
        "mastersOverview.kpis.activeMasterModulesDescription"
      ),
      icon: Layers,
      trend: t("mastersOverview.kpis.allActive"),
    },

    {
      title: t("mastersOverview.kpis.recentlyUpdated"),
      value: "86",
      description: t(
        "mastersOverview.kpis.recentlyUpdatedDescription"
      ),
      icon: Activity,
      trend: "+8.2%",
    },

    {
      title: t("mastersOverview.kpis.pendingConfiguration"),
      value: "5",
      description: t(
        "mastersOverview.kpis.pendingConfigurationDescription"
      ),
      icon: Clock,
      trend: t("mastersOverview.kpis.review"),
    },

  ];


  // ==================================================
  // MASTER MODULES
  // ==================================================

  const masterModules = [

    {
      title: t("mastersOverview.modules.ability.title"),
      description: t("mastersOverview.modules.ability.description"),
      path: "/abilities",
      icon: Activity,
    },

    {
      title: t("mastersOverview.modules.workLocation.title"),
      description: t("mastersOverview.modules.workLocation.description"),
      path: "/work-locations",
      icon: MapPin,
    },

    {
      title: t("mastersOverview.modules.announcementType.title"),
      description: t(
        "mastersOverview.modules.announcementType.description"
      ),
      path: "/announcement-type",
      icon: FileText,
    },

    {
      title: t("mastersOverview.modules.advertisingMedia.title"),
      description: t(
        "mastersOverview.modules.advertisingMedia.description"
      ),
      path: "/advertising-media",
      icon: TrendingUp,
    },

    {
      title: t("mastersOverview.modules.advertisingPurpose.title"),
      description: t(
        "mastersOverview.modules.advertisingPurpose.description"
      ),
      path: "/advertising-purpose",
      icon: FileText,
    },

    {
      title: t("mastersOverview.modules.requirements.title"),
      description: t(
        "mastersOverview.modules.requirements.description"
      ),
      path: "/requirements",
      icon: CheckCircle2,
    },

    {
      title: t("mastersOverview.modules.jobFunctions.title"),
      description: t(
        "mastersOverview.modules.jobFunctions.description"
      ),
      path: "/job-functions",
      icon: Briefcase,
    },

    {
      title: t("mastersOverview.modules.ksa.title"),
      description: t("mastersOverview.modules.ksa.description"),
      path: "/ksa",
      icon: Users,
    },

    {
      title: t("mastersOverview.modules.ksaCategory.title"),
      description: t(
        "mastersOverview.modules.ksaCategory.description"
      ),
      path: "/ksa-category",
      icon: Layers,
    },

    {
      title: t("mastersOverview.modules.positionGrades.title"),
      description: t(
        "mastersOverview.modules.positionGrades.description"
      ),
      path: "/position-grades",
      icon: TrendingUp,
    },

    {
      title: t("mastersOverview.modules.meetingType.title"),
      description: t(
        "mastersOverview.modules.meetingType.description"
      ),
      path: "/meeting-type",
      icon: CalendarDays,
    },

    {
      title: t("mastersOverview.modules.meetingLocation.title"),
      description: t(
        "mastersOverview.modules.meetingLocation.description"
      ),
      path: "/meeting-location",
      icon: MapPin,
    },

    {
      title: t("mastersOverview.modules.languages.title"),
      description: t(
        "mastersOverview.modules.languages.description"
      ),
      path: "/languages",
      icon: Languages,
    },

    {
      title: t("mastersOverview.modules.officeType.title"),
      description: t(
        "mastersOverview.modules.officeType.description"
      ),
      path: "/office-type",
      icon: Building2,
    },

    {
      title: t("mastersOverview.modules.officeLevel.title"),
      description: t(
        "mastersOverview.modules.officeLevel.description"
      ),
      path: "/office-level",
      icon: Layers,
    },

    {
      title: t("mastersOverview.modules.roleInOffense.title"),
      description: t(
        "mastersOverview.modules.roleInOffense.description"
      ),
      path: "/role-in-offense",
      icon: Users,
    },

    {
      title: t("mastersOverview.modules.hobbies.title"),
      description: t(
        "mastersOverview.modules.hobbies.description"
      ),
      path: "/hobbies",
      icon: Activity,
    },

  ];


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

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-theme-primary
              text-white
              shadow-sm
            "
          >

            <Database size={22} />

          </div>


          <div>

            <h1
              className="
                text-2xl
                font-bold
                text-theme-text
              "
            >

              {t("mastersOverview.pageTitle")}

            </h1>


            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >

              {t("mastersOverview.pageDescription")}

            </p>

          </div>

        </div>


        {/* STATUS */}

        <div
          className="
            inline-flex
            items-center
            gap-2
            self-start
            rounded-xl
            border
            border-emerald-500/20
            bg-emerald-500/10
            px-4
            py-2.5
            text-sm
            font-medium
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

          {t("mastersOverview.allSystemsOperational")}

        </div>

      </div>



      {/* KPI CARDS */}

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

          const Icon = kpi.icon;

          return (

            <div
              key={kpi.title}
              className="
                rounded-2xl
                border
                border-theme-border
                bg-card
                p-6
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-theme-muted">
                    {kpi.title}
                  </p>


                  <h3 className="mt-2 text-3xl font-bold text-theme-text">
                    {kpi.value}
                  </h3>

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

                  <Icon size={23} />

                </div>

              </div>


              <div
                className="
                  mt-5
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >

                <p className="text-xs text-theme-faint">
                  {kpi.description}
                </p>


                <span
                  className="
                    whitespace-nowrap
                    text-xs
                    font-semibold
                    text-theme-primary
                  "
                >
                  {kpi.trend}
                </span>

              </div>

            </div>

          );

        })}

      </div>



      {/* QUICK OVERVIEW */}

      <div
        className="
          grid
          grid-cols-1
          gap-6
          xl:grid-cols-3
        "
      >


        {/* MASTER DATA SUMMARY */}

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-theme-border
            bg-card
            shadow-sm
            xl:col-span-2
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-theme-border
              px-6
              py-5
            "
          >

            <div>

              <h2 className="text-lg font-semibold text-theme-text">
                {t("mastersOverview.summary.title")}
              </h2>


              <p className="mt-1 text-sm text-theme-muted">
                {t("mastersOverview.summary.description")}
              </p>

            </div>


            <Database
              size={21}
              className="text-theme-faint"
            />

          </div>


          <div
            className="
              grid
              grid-cols-1
              divide-y
              divide-theme-border
              sm:grid-cols-3
              sm:divide-x
              sm:divide-y-0
            "
          >

            <div className="p-6">

              <p className="text-sm text-theme-muted">
                {t("mastersOverview.summary.hrMasters")}
              </p>


              <p className="mt-2 text-3xl font-bold text-theme-text">
                17
              </p>


              <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                {t("mastersOverview.summary.allConfigured")}
              </p>

            </div>



            <div className="p-6">

              <p className="text-sm text-theme-muted">
                {t("mastersOverview.summary.activeRecords")}
              </p>


              <p className="mt-2 text-3xl font-bold text-theme-text">
                1,163
              </p>


              <p className="mt-2 text-xs text-theme-primary">
                {t("mastersOverview.summary.activePercentage")}
              </p>

            </div>



            <div className="p-6">

              <p className="text-sm text-theme-muted">
                {t("mastersOverview.summary.draftRecords")}
              </p>


              <p className="mt-2 text-3xl font-bold text-theme-text">
                85
              </p>


              <p className="mt-2 text-xs text-theme-amber">
                {t("mastersOverview.summary.requiresReview")}
              </p>

            </div>

          </div>

        </div>



        {/* QUICK ACTION */}

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
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-theme-primary-soft
              text-theme-primary
            "
          >

            <LayoutGrid size={22} />

          </div>


          <h2 className="mt-5 text-lg font-semibold text-theme-text">
            {t("mastersOverview.management.title")}
          </h2>


          <p
            className="
              mt-2
              text-sm
              leading-6
              text-theme-muted
            "
          >
            {t("mastersOverview.management.description")}
          </p>


          <div
            className="
              mt-6
              rounded-xl
              bg-[var(--erp-background)]
              p-4
            "
          >

            <p className="text-sm font-semibold text-theme-muted">
              {t("mastersOverview.management.availableModules")}
            </p>


            <p className="mt-1 text-2xl font-bold text-theme-primary">
              {masterModules.length}
            </p>

          </div>

        </div>

      </div>



      {/* MASTER MODULES */}

      <div>

        <div
          className="
            mb-5
            flex
            flex-col
            gap-2
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >

          <div>

            <h2 className="text-lg font-semibold text-theme-text">
              {t("mastersOverview.modules.title")}
            </h2>


            <p className="mt-1 text-sm text-theme-muted">
              {t("mastersOverview.modules.description")}
            </p>

          </div>


          <p className="text-sm font-medium text-theme-faint">

            {masterModules.length}{" "}
            {t("mastersOverview.modules.modulesAvailable")}

          </p>

        </div>



        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-3
          "
        >

          {masterModules.map((module) => {

            const Icon = module.icon;

            return (

              <Link
                key={module.path}
                to={module.path}
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
                  hover:border-theme-primary/30
                  hover:shadow-md
                "
              >

                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[var(--erp-background)]
                      text-theme-muted
                      transition
                      group-hover:bg-theme-primary-soft
                      group-hover:text-theme-primary
                    "
                  >

                    <Icon size={22} />

                  </div>


                  <ChevronRight
                    size={19}
                    className="
                      text-theme-faint
                      transition
                      group-hover:translate-x-1
                      group-hover:text-theme-primary
                    "
                  />

                </div>


                <h3
                  className="
                    mt-5
                    text-sm
                    font-semibold
                    text-theme-text
                  "
                >

                  {module.title}

                </h3>


                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-theme-muted
                  "
                >

                  {module.description}

                </p>


                <div
                  className="
                    mt-5
                    text-sm
                    font-semibold
                    text-theme-primary
                  "
                >

                  {t("mastersOverview.modules.manageModule")}

                </div>

              </Link>

            );

          })}

        </div>

      </div>

    </div>

  );

}