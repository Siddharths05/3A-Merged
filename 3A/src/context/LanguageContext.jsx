import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


// ==================================================
// CREATE CONTEXT
// ==================================================

const LanguageContext =
  createContext();


// ==================================================
// LANGUAGE PROVIDER
// ==================================================

export function LanguageProvider({
  children,
}) {

  // ==================================================
  // LANGUAGE STATE
  // ==================================================

  const [language, setLanguage] =
    useState(() => {

      return (
        localStorage.getItem("language") ||
        "en"
      );

    });


  // ==================================================
  // CHANGE LANGUAGE
  // ==================================================

  const changeLanguage = (
    selectedLanguage
  ) => {

    setLanguage(
      selectedLanguage
    );


    localStorage.setItem(
      "language",
      selectedLanguage
    );

  };


  // ==================================================
  // OPTIONAL: SYNC LANGUAGE ON PAGE LOAD
  // ==================================================

  useEffect(() => {

    const savedLanguage =
      localStorage.getItem("language");


    if (
      savedLanguage &&
      savedLanguage !== language
    ) {

      setLanguage(
        savedLanguage
      );

    }

  }, []);


  // ==================================================
  // CONTEXT VALUE
  // ==================================================

  const value = {

    language,

    changeLanguage,

  };


  // ==================================================
  // PROVIDER
  // ==================================================

  return (

    <LanguageContext.Provider
      value={value}
    >

      {children}

    </LanguageContext.Provider>

  );

}


// ==================================================
// CUSTOM HOOK
// ==================================================

export function useLanguage() {

  const context =
    useContext(LanguageContext);


  if (!context) {

    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );

  }


  return context;

}