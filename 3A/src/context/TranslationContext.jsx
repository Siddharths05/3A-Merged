import {
  createContext,
  useContext,
} from "react";

import {
  useLanguage,
} from "./LanguageContext";


// ==================================================
// CONTEXT
// ==================================================

const TranslationContext =
  createContext(null);


// ==================================================
// TRANSLATIONS
// ==================================================

const translationsData = {

  // ==================================================
  // ENGLISH
  // ==================================================

  en: {

    // ==================================================
    // HEADER
    // ==================================================

    header: {

      dashboard:
        "Dashboard",

      overview:
        "Overview",

      users:
        "Users",

      usersDescription:
        "Manage users and financial years",

      userManagement:
        "User Management",

      userManagementDescription:
        "Manage system users and permissions",

      financialYear:
        "Financial Year",

      financialYearDescription:
        "Manage financial year settings",

      masters:
        "Masters",

      mastersTitle:
        "Master Management",

      mastersDescription:
        "Manage master data and system configurations",

      notifications:
        "Notifications",

      settings:
        "Settings",

      myProfile:
        "My Profile",

      logout:
        "Logout",

      noEmail:
        "No email available",

      switchToDark:
        "Switch to dark mode",

      switchToLight:
        "Switch to light mode",

      userRights:
        "User Rights",

      userRightsDescription:
        "Manage what each user can add, edit, delete, view, print, or export",

      noMastersAccess:
        "You don't have access to any master forms. Contact your administrator to request access.",


      // ==============================================
      // MASTER ITEMS
      // ==============================================

      mastersItems: {

        ability:
          "Ability",

        abilityDescription:
          "Manage abilities",

        workLocation:
          "Work Location",

        workLocationDescription:
          "Manage work locations",

        announcementType:
          "Announcement Type",

        announcementTypeDescription:
          "Manage announcement types",

        advertisingMedia:
          "Advertising Media",

        advertisingMediaDescription:
          "Manage advertising media",

        advertisingPurpose:
          "Advertising Purpose",

        advertisingPurposeDescription:
          "Manage advertising purposes",

        requirements:
          "Requirements",

        requirementsDescription:
          "Manage requirements",

        jobFunctions:
          "Job Functions",

        jobFunctionsDescription:
          "Manage job functions",

        ksa:
          "KSA",

        ksaDescription:
          "Manage knowledge, skills and abilities",

        ksaCategory:
          "KSA Category",

        ksaCategoryDescription:
          "Manage KSA categories",

        positionGrades:
          "Position Grades",

        positionGradesDescription:
          "Manage position grades",

        meetingType:
          "Meeting Type",

        meetingTypeDescription:
          "Manage meeting types",

        meetingLocation:
          "Meeting Location",

        meetingLocationDescription:
          "Manage meeting locations",

        languages:
          "Languages",

        languagesDescription:
          "Manage languages",

        officeType:
          "Office Type",

        officeTypeDescription:
          "Manage office types",

        officeLevel:
          "Office Level",

        officeLevelDescription:
          "Manage office levels",

        roleInOffense:
          "Role in Offense",

        roleInOffenseDescription:
          "Manage roles in offense",

        hobbies:
          "Hobbies",

        hobbiesDescription:
          "Manage hobbies",

      },

    },


    // ==================================================
    // DASHBOARD
    // ==================================================

    dashboard: {

      pageTitle:
        "Dashboard",

      pageDescription:
        "Welcome to the dashboard. Manage your application from one place.",

      companyName:
        "Devendra Management System",

      welcomeBack:
        "Welcome Back!",

      welcomeDescription:
        "Access important features, manage users, and stay up to date with your organization.",

      quickAccessTitle:
        "Quick Access",

      quickAccessDescription:
        "Access frequently used features quickly.",

      registerUserTitle:
        "Register User",

      registerUserDescription:
        "Create and register a new user in the system.",

      registerUserAction:
        "Register User",

      financialYearTitle:
        "Financial Year",

      financialYearDescription:
        "Manage financial year settings and information.",

      financialYearAction:
        "Manage Financial Year",

    },


    // ==================================================
    // OVERVIEW
    // ==================================================

    overview: {

      title:
        "Overview",

      description:
        "Get a complete overview of your organization and HR operations.",

      demoData:
        "Demo data for presentation purposes",


      kpis: {

        totalEmployees: {

          title:
            "Total Employees",

          description:
            "Total employees in the organization",

        },

        activeEmployees: {

          title:
            "Active Employees",

          description:
            "Currently active employees",

        },

        departments: {

          title:
            "Departments",

          description:
            "Active departments across the organization",

        },

        openPositions: {

          title:
            "Open Positions",

          description:
            "Currently available job positions",

        },

      },


      organizationSummary: {

        title:
          "Organization Summary",

        description:
          "Current organization performance and data status",

        employeeCapacity:
          "Employee Capacity",

        systemCompletion:
          "System Completion",

        hrDataUpdated:
          "HR Data Updated",

      },


      recentActivity: {

        title:
          "Recent Activity",

        description:
          "Latest updates across your organization",

        viewAll:
          "View All",

      },


      activities: {

        newEmployee: {

          title:
            "New Employee Added",

          description:
            "A new employee has been successfully added to the system.",

          time:
            "2 minutes ago",

        },


        financialYearUpdated: {

          title:
            "Financial Year Updated",

          description:
            "Financial year settings have been updated successfully.",

          time:
            "1 hour ago",

        },


        newPosition: {

          title:
            "New Position Created",

          description:
            "A new job position has been added to the organization.",

          time:
            "3 hours ago",

        },


        masterDataUpdated: {

          title:
            "Master Data Updated",

          description:
            "Organization master information has been updated.",

          time:
            "Yesterday",

        },

      },

    },


    // ==================================================
    // FINANCIAL YEAR
    // ==================================================

    financialYear: {

      pageTitle:
        "Financial Year",

      pageDescription:
        "Configure the start and end dates for your organization's financial year.",

      financialSetup:
        "Financial Setup",

      setupTitle:
        "Financial Year Setup",

      setupDescription:
        "Set the financial year period for your organization.",

      startOfFinancialYear:
        "Start of Financial Year",

      endOfFinancialYear:
        "End of Financial Year",

      endDateError:
        "End date must be later than the start date",

      savedSuccessfully:
        "Financial Year saved successfully!",

      saving:
        "Saving...",

      saveFinancialYear:
        "Save Financial Year",

    },


    // ==================================================
    // USER LIST
    // ==================================================

    userList: {

      pageTitle:
        "User Management",

      pageDescription:
        "Manage application users and their access to Synergy ERP.",

      refresh:
        "Refresh",

      addUser:
        "Add User",

      activeUsers:
        "Active Users",

      currentlyActive:
        "Currently active in the system",

      records:
        "Records",

      usersShown:
        "Users shown in this list",

      userList:
        "User List",

      userListDescription:
        "Registered users and their current access status.",

      searchUsers:
        "Search users...",

      loadingUsers:
        "Loading users...",

      noUsersMatch:
        "No users match your search",

      noActiveUsers:
        "No active users found",

      tryDifferentSearch:
        "Try searching with a different name, email, or ID.",

      addUserToStart:
        "Add a user to get started.",

      id:
        "ID",

      user:
        "User",

      email:
        "Email",

      role:
        "Role",

      status:
        "Status",

      action:
        "Action",

      userId:
        "User ID",

      unnamedUser:
        "Unnamed User",

      defaultUserRole:
        "user",

      active:
        "Active",

      inactive:
        "Inactive",

      deactivate:
        "Deactivate",

      showing:
        "Showing",

      singularUser:
        "user",

      pluralUsers:
        "users",

      activeUsersFooter:
        "Active users:",

      deactivateUserTitle:
        "Deactivate User?",

      deactivateQuestion:
        "Are you sure you want to deactivate",

      deactivateDescription:
        "The user will no longer appear in the active user list, but their record will remain in the database.",

      cancel:
        "Cancel",

      deactivateUser:
        "Deactivate User",

      deactivating:
        "Deactivating...",

      authTokenError:
        "Authentication token not found. Please log in again.",

      failedLoadUsers:
        "Failed to load users",

      failedDeactivateUser:
        "Failed to deactivate user",

      somethingWentWrong:
        "Something went wrong",

    },

  },


  // ==================================================
  // HINDI
  // ==================================================

  hi: {

    // ==================================================
    // HEADER
    // ==================================================

    header: {

      dashboard:
        "डैशबोर्ड",

      overview:
        "अवलोकन",

      users:
        "उपयोगकर्ता",

      usersDescription:
        "उपयोगकर्ताओं और वित्तीय वर्षों का प्रबंधन करें",

      userManagement:
        "उपयोगकर्ता प्रबंधन",

      userManagementDescription:
        "सिस्टम उपयोगकर्ताओं और अनुमतियों का प्रबंधन करें",

      financialYear:
        "वित्तीय वर्ष",

      financialYearDescription:
        "वित्तीय वर्ष की सेटिंग्स प्रबंधित करें",

      masters:
        "मास्टर्स",

      mastersTitle:
        "मास्टर प्रबंधन",

      mastersDescription:
        "मास्टर डेटा और सिस्टम कॉन्फ़िगरेशन प्रबंधित करें",

      notifications:
        "सूचनाएँ",

      settings:
        "सेटिंग्स",

      myProfile:
        "मेरी प्रोफ़ाइल",

      logout:
        "लॉग आउट",

      noEmail:
        "कोई ईमेल उपलब्ध नहीं है",

      switchToDark:
        "डार्क मोड पर जाएँ",

      switchToLight:
        "लाइट मोड पर जाएँ",

      userRights:
        "उपयोगकर्ता अधिकार",

      userRightsDescription:
        "प्रत्येक उपयोगकर्ता क्या जोड़ सकता है, संपादित कर सकता है, हटा सकता है, देख सकता है, प्रिंट कर सकता है, या निर्यात कर सकता है, यह प्रबंधित करें",

      noMastersAccess:
        "आपके पास किसी भी मास्टर फॉर्म तक पहुँच नहीं है। पहुँच के लिए अपने व्यवस्थापक से संपर्क करें।",


      mastersItems: {

        ability:
          "क्षमता",

        abilityDescription:
          "क्षमताओं का प्रबंधन करें",

        workLocation:
          "कार्य स्थान",

        workLocationDescription:
          "कार्य स्थानों का प्रबंधन करें",

        announcementType:
          "घोषणा प्रकार",

        announcementTypeDescription:
          "घोषणा प्रकारों का प्रबंधन करें",

        advertisingMedia:
          "विज्ञापन माध्यम",

        advertisingMediaDescription:
          "विज्ञापन माध्यमों का प्रबंधन करें",

        advertisingPurpose:
          "विज्ञापन उद्देश्य",

        advertisingPurposeDescription:
          "विज्ञापन उद्देश्यों का प्रबंधन करें",

        requirements:
          "आवश्यकताएँ",

        requirementsDescription:
          "आवश्यकताओं का प्रबंधन करें",

        jobFunctions:
          "कार्य कार्य",

        jobFunctionsDescription:
          "कार्य कार्यों का प्रबंधन करें",

        ksa:
          "ज्ञान, कौशल और क्षमताएँ",

        ksaDescription:
          "ज्ञान, कौशल और क्षमताओं का प्रबंधन करें",

        ksaCategory:
          "KSA श्रेणी",

        ksaCategoryDescription:
          "KSA श्रेणियों का प्रबंधन करें",

        positionGrades:
          "पद ग्रेड",

        positionGradesDescription:
          "पद ग्रेड का प्रबंधन करें",

        meetingType:
          "बैठक प्रकार",

        meetingTypeDescription:
          "बैठक प्रकारों का प्रबंधन करें",

        meetingLocation:
          "बैठक स्थान",

        meetingLocationDescription:
          "बैठक स्थानों का प्रबंधन करें",

        languages:
          "भाषाएँ",

        languagesDescription:
          "भाषाओं का प्रबंधन करें",

        officeType:
          "कार्यालय प्रकार",

        officeTypeDescription:
          "कार्यालय प्रकारों का प्रबंधन करें",

        officeLevel:
          "कार्यालय स्तर",

        officeLevelDescription:
          "कार्यालय स्तरों का प्रबंधन करें",

        roleInOffense:
          "अपराध में भूमिका",

        roleInOffenseDescription:
          "अपराध में भूमिकाओं का प्रबंधन करें",

        hobbies:
          "शौक",

        hobbiesDescription:
          "शौक का प्रबंधन करें",

      },

    },


    // ==================================================
    // DASHBOARD
    // ==================================================

    dashboard: {

      pageTitle:
        "डैशबोर्ड",

      pageDescription:
        "डैशबोर्ड में आपका स्वागत है। अपने एप्लिकेशन को एक ही स्थान से प्रबंधित करें।",

      companyName:
        "देवेंद्र प्रबंधन प्रणाली",

      welcomeBack:
        "वापस स्वागत है!",

      welcomeDescription:
        "महत्वपूर्ण सुविधाओं तक पहुँचें, उपयोगकर्ताओं का प्रबंधन करें और अपने संगठन की जानकारी से अपडेट रहें।",

      quickAccessTitle:
        "त्वरित पहुँच",

      quickAccessDescription:
        "अक्सर उपयोग की जाने वाली सुविधाओं तक जल्दी पहुँचें।",

      registerUserTitle:
        "उपयोगकर्ता पंजीकृत करें",

      registerUserDescription:
        "सिस्टम में एक नया उपयोगकर्ता बनाएँ और पंजीकृत करें।",

      registerUserAction:
        "उपयोगकर्ता पंजीकृत करें",

      financialYearTitle:
        "वित्तीय वर्ष",

      financialYearDescription:
        "वित्तीय वर्ष की सेटिंग्स और जानकारी प्रबंधित करें।",

      financialYearAction:
        "वित्तीय वर्ष प्रबंधित करें",

    },


    // ==================================================
    // OVERVIEW
    // ==================================================

    overview: {

      title:
        "अवलोकन",

      description:
        "अपने संगठन और HR संचालन का संपूर्ण अवलोकन प्राप्त करें।",

      demoData:
        "प्रस्तुति के लिए डेमो डेटा",


      kpis: {

        totalEmployees: {

          title:
            "कुल कर्मचारी",

          description:
            "संगठन में कुल कर्मचारियों की संख्या",

        },

        activeEmployees: {

          title:
            "सक्रिय कर्मचारी",

          description:
            "वर्तमान में सक्रिय कर्मचारी",

        },

        departments: {

          title:
            "विभाग",

          description:
            "संगठन में सक्रिय विभाग",

        },

        openPositions: {

          title:
            "खुली रिक्तियाँ",

          description:
            "वर्तमान में उपलब्ध नौकरी पद",

        },

      },


      organizationSummary: {

        title:
          "संगठन सारांश",

        description:
          "वर्तमान संगठन प्रदर्शन और डेटा स्थिति",

        employeeCapacity:
          "कर्मचारी क्षमता",

        systemCompletion:
          "सिस्टम पूर्णता",

        hrDataUpdated:
          "HR डेटा अपडेट",

      },


      recentActivity: {

        title:
          "हाल की गतिविधि",

        description:
          "आपके संगठन में नवीनतम अपडेट",

        viewAll:
          "सभी देखें",

      },


      activities: {

        newEmployee: {

          title:
            "नया कर्मचारी जोड़ा गया",

          description:
            "एक नया कर्मचारी सफलतापूर्वक सिस्टम में जोड़ा गया है।",

          time:
            "2 मिनट पहले",

        },


        financialYearUpdated: {

          title:
            "वित्तीय वर्ष अपडेट किया गया",

          description:
            "वित्तीय वर्ष की सेटिंग्स सफलतापूर्वक अपडेट की गई हैं।",

          time:
            "1 घंटा पहले",

        },


        newPosition: {

          title:
            "नई पोजीशन बनाई गई",

          description:
            "संगठन में एक नया नौकरी पद जोड़ा गया है।",

          time:
            "3 घंटे पहले",

        },


        masterDataUpdated: {

          title:
            "मास्टर डेटा अपडेट किया गया",

          description:
            "संगठन की मास्टर जानकारी अपडेट की गई है।",

          time:
            "कल",

        },

      },

    },


    // ==================================================
    // FINANCIAL YEAR
    // ==================================================

    financialYear: {

      pageTitle:
        "वित्तीय वर्ष",

      pageDescription:
        "अपने संगठन के वित्तीय वर्ष की प्रारंभ और समाप्ति तिथियाँ कॉन्फ़िगर करें।",

      financialSetup:
        "वित्तीय सेटअप",

      setupTitle:
        "वित्तीय वर्ष सेटअप",

      setupDescription:
        "अपने संगठन के लिए वित्तीय वर्ष की अवधि निर्धारित करें।",

      startOfFinancialYear:
        "वित्तीय वर्ष की शुरुआत",

      endOfFinancialYear:
        "वित्तीय वर्ष का अंत",

      endDateError:
        "समाप्ति तिथि प्रारंभ तिथि के बाद होनी चाहिए",

      savedSuccessfully:
        "वित्तीय वर्ष सफलतापूर्वक सहेजा गया!",

      saving:
        "सहेजा जा रहा है...",

      saveFinancialYear:
        "वित्तीय वर्ष सहेजें",

    },


    // ==================================================
    // USER LIST
    // ==================================================

    userList: {

      pageTitle:
        "उपयोगकर्ता प्रबंधन",

      pageDescription:
        "एप्लिकेशन उपयोगकर्ताओं और Synergy ERP तक उनकी पहुँच का प्रबंधन करें।",

      refresh:
        "रीफ्रेश करें",

      addUser:
        "उपयोगकर्ता जोड़ें",

      activeUsers:
        "सक्रिय उपयोगकर्ता",

      currentlyActive:
        "वर्तमान में सिस्टम में सक्रिय",

      records:
        "रिकॉर्ड",

      usersShown:
        "इस सूची में दिखाए गए उपयोगकर्ता",

      userList:
        "उपयोगकर्ता सूची",

      userListDescription:
        "पंजीकृत उपयोगकर्ता और उनकी वर्तमान पहुँच स्थिति।",

      searchUsers:
        "उपयोगकर्ता खोजें...",

      loadingUsers:
        "उपयोगकर्ता लोड हो रहे हैं...",

      noUsersMatch:
        "आपकी खोज से कोई उपयोगकर्ता मेल नहीं खाता",

      noActiveUsers:
        "कोई सक्रिय उपयोगकर्ता नहीं मिला",

      tryDifferentSearch:
        "किसी अलग नाम, ईमेल या ID से खोजने का प्रयास करें।",

      addUserToStart:
        "शुरू करने के लिए एक उपयोगकर्ता जोड़ें।",

      id:
        "आईडी",

      user:
        "उपयोगकर्ता",

      email:
        "ईमेल",

      role:
        "भूमिका",

      status:
        "स्थिति",

      action:
        "कार्रवाई",

      userId:
        "उपयोगकर्ता आईडी",

      unnamedUser:
        "बिना नाम का उपयोगकर्ता",

      defaultUserRole:
        "उपयोगकर्ता",

      active:
        "सक्रिय",

      inactive:
        "निष्क्रिय",

      deactivate:
        "निष्क्रिय करें",

      showing:
        "दिखाए जा रहे हैं",

      singularUser:
        "उपयोगकर्ता",

      pluralUsers:
        "उपयोगकर्ता",

      activeUsersFooter:
        "सक्रिय उपयोगकर्ता:",

      deactivateUserTitle:
        "उपयोगकर्ता निष्क्रिय करें?",

      deactivateQuestion:
        "क्या आप वास्तव में निष्क्रिय करना चाहते हैं",

      deactivateDescription:
        "उपयोगकर्ता अब सक्रिय उपयोगकर्ता सूची में दिखाई नहीं देगा, लेकिन उसका रिकॉर्ड डेटाबेस में बना रहेगा।",

      cancel:
        "रद्द करें",

      deactivateUser:
        "उपयोगकर्ता निष्क्रिय करें",

      deactivating:
        "निष्क्रिय किया जा रहा है...",

      authTokenError:
        "प्रमाणीकरण टोकन नहीं मिला। कृपया पुनः लॉग इन करें।",

      failedLoadUsers:
        "उपयोगकर्ताओं को लोड करने में विफल",

      failedDeactivateUser:
        "उपयोगकर्ता को निष्क्रिय करने में विफल",

      somethingWentWrong:
        "कुछ गलत हो गया",

    },

  },

};


// ==================================================
// GET VALUE USING DOT NOTATION
// ==================================================

function getTranslationByKey(
  object,
  key
) {

  if (!object || !key) {

    return undefined;

  }


  return String(key)
    .split(".")
    .reduce(
      (
        currentValue,
        currentKey
      ) => {

        if (
          currentValue &&
          typeof currentValue === "object"
        ) {

          return currentValue[currentKey];

        }


        return undefined;

      },
      object
    );

}


// ==================================================
// TRANSLATION PROVIDER
// ==================================================

export function TranslationProvider({
  children,
}) {


  // ==================================================
  // LANGUAGE
  // ==================================================

  const {
    language,
  } = useLanguage();


  // ==================================================
  // TRANSLATION FUNCTION
  // ==================================================

  const t = (
    key,
    fallback
  ) => {


    const currentTranslations =
      translationsData[language] ||
      translationsData.en;


    const translation =
      getTranslationByKey(
        currentTranslations,
        key
      );


    if (
      typeof translation === "string"
    ) {

      return translation;

    }


    const englishTranslation =
      getTranslationByKey(
        translationsData.en,
        key
      );


    if (
      typeof englishTranslation === "string"
    ) {

      return englishTranslation;

    }


    if (
      fallback !== undefined
    ) {

      return fallback;

    }


    return key;

  };


  // ==================================================
  // CONTEXT VALUE
  // ==================================================

  const value = {

    language,

    t,

  };


  // ==================================================
  // PROVIDER
  // ==================================================

  return (

    <TranslationContext.Provider
      value={value}
    >

      {children}

    </TranslationContext.Provider>

  );

}


// ==================================================
// USE TRANSLATION
// ==================================================

export function useTranslation() {

  const context =
    useContext(
      TranslationContext
    );


  if (!context) {

    throw new Error(
      "useTranslation must be used inside TranslationProvider"
    );

  }


  return context;

}


// ==================================================
// OPTIONAL EXPORT
// ==================================================

export {
  translationsData,
};
