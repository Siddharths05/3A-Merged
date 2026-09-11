import {
  Languages,
  Loader2,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useLanguage,
} from "../context/LanguageContext";


// ==================================================
// LANGUAGE SWITCHER
// ==================================================

export default function LanguageSwitcher() {

  // ==================================================
  // LANGUAGE CONTEXT
  // ==================================================

  const {
    language,
    changeLanguage,
  } = useLanguage();


  // ==================================================
  // STATE
  // ==================================================

  const [
    isChangingLanguage,
    setIsChangingLanguage,
  ] = useState(false);


  // ==================================================
  // HANDLE LANGUAGE CHANGE
  // ==================================================

  const handleLanguageChange = async (
    event
  ) => {

    const selectedLanguage =
      event.target.value;


    // ================================================
    // PREVENT DUPLICATE CHANGE
    // ================================================

    if (
      selectedLanguage === language
    ) {

      return;

    }


    try {

      setIsChangingLanguage(true);


      // ==============================================
      // CHANGE LANGUAGE
      // ==============================================

      changeLanguage(
        selectedLanguage
      );


    } catch (error) {

      console.error(
        "Language change failed:",
        error
      );


    } finally {

      setIsChangingLanguage(false);

    }

  };


  // ==================================================
  // COMPONENT
  // ==================================================

  return (

    <div className="flex items-center gap-2">

      {/* ============================================= */}
      {/* LANGUAGE ICON */}
      {/* ============================================= */}

      <div
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          text-theme-primary
          transition
          hover:bg-theme-primary-soft
        "
      >

        {isChangingLanguage ? (

          <Loader2
            size={19}
            className="animate-spin"
          />

        ) : (

          <Languages size={19} />

        )}

      </div>


      {/* ============================================= */}
      {/* LANGUAGE SELECT */}
      {/* ============================================= */}

      <select
        value={language}
        onChange={handleLanguageChange}
        disabled={isChangingLanguage}
        aria-label="Select Language"
        title="Select Language"
        className="
          h-10
          cursor-pointer
          rounded-xl
          border
          border-theme-border
          bg-card
          px-3
          text-sm
          font-medium
          text-theme-text
          outline-none
          transition-all
          duration-200
          hover:border-theme-primary
          focus:border-theme-primary
          focus:ring-2
          focus:ring-theme-primary-soft
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >

        {/* =========================================== */}
        {/* ENGLISH */}
        {/* =========================================== */}

        <option value="en">
          English
        </option>


        {/* =========================================== */}
        {/* HINDI */}
        {/* =========================================== */}

        <option value="hi">
          हिन्दी
        </option>

      </select>

    </div>

  );

}