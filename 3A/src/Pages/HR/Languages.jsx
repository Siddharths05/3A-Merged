import { useState } from "react";

import { Languages as LanguagesIcon } from "lucide-react";


export default function Languages() {

  // ==================================================
  // STATE
  // ==================================================

  const [language, setLanguage] =
    useState("");

  const [languages, setLanguages] =
    useState([]);


  // ==================================================
  // SAVE LANGUAGE
  // ==================================================

  const handleSave = () => {

    const trimmedLanguage =
      language.trim();


    if (!trimmedLanguage) {
      return;
    }


    const alreadyExists =
      languages.some(
        (item) =>
          item.toLowerCase() ===
          trimmedLanguage.toLowerCase()
      );


    if (alreadyExists) {
      return;
    }


    setLanguages([
      ...languages,
      trimmedLanguage,
    ]);


    setLanguage("");

  };


  // ==================================================
  // HANDLE ENTER KEY
  // ==================================================

  const handleKeyDown = (e) => {

    if (e.key === "Enter") {

      handleSave();

    }

  };


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
          Languages
        </h1>


        <p
          className="
            mt-1
            text-sm
            text-theme-muted
          "
        >
          Create and manage languages available in the system.
        </p>

      </div>



      {/* ==================================================
          ADD LANGUAGE
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


        {/* CARD HEADER */}

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
              Add Language
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Enter a language to add it to the master list.
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

            <LanguagesIcon size={21} />

          </div>

        </div>



        {/* FORM */}

        <div
          className="
            space-y-6
            p-6
          "
        >


          <div className="max-w-xl">


            {/* LANGUAGE LABEL */}

            <label
              htmlFor="language"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-theme-text
              "
            >
              Language
            </label>



            {/* LANGUAGE INPUT */}

            <input
              id="language"
              type="text"
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
              onKeyDown={handleKeyDown}
              maxLength={30}
              placeholder="Enter language"
              className="
                h-12
                w-full
                rounded-xl
                border
                border-theme-border
                bg-[var(--erp-background)]
                px-4
                text-sm
                text-theme-text
                outline-none
                transition-all
                placeholder:text-theme-faint
                focus:border-theme-primary
                focus:ring-2
                focus:ring-theme-primary-soft
              "
            />


            <p
              className="
                mt-2
                text-xs
                text-theme-faint
              "
            >
              Maximum 30 characters.
            </p>


          </div>



          {/* ACTIONS */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
              border-t
              border-theme-border
              pt-6
            "
          >

            <button
              type="button"
              onClick={handleSave}
              className="
                inline-flex
                h-11
                items-center
                justify-center
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
              "
            >
              Save Language
            </button>

          </div>


        </div>

      </div>



      {/* ==================================================
          SAVED LANGUAGES
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


        {/* TABLE HEADER */}

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
              Saved Languages
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Languages currently available in the system.
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

            <LanguagesIcon size={21} />

          </div>

        </div>



        {/* EMPTY STATE */}

        {languages.length === 0 && (

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              py-16
              text-center
            "
          >

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-theme-primary-soft
                text-theme-primary
              "
            >

              <LanguagesIcon size={26} />

            </div>


            <p
              className="
                mt-4
                font-medium
                text-theme-text
              "
            >
              No languages found
            </p>


            <p
              className="
                mt-1
                text-sm
                text-theme-faint
              "
            >
              Add a language to get started.
            </p>

          </div>

        )}



        {/* TABLE */}

        {languages.length > 0 && (

          <div className="overflow-x-auto">

            <table className="w-full">


              <thead>

                <tr
                  className="
                    border-b
                    border-theme-border
                    bg-[var(--erp-background)]
                  "
                >

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-theme-muted
                    "
                  >
                    ID
                  </th>


                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-theme-muted
                    "
                  >
                    Language
                  </th>

                </tr>

              </thead>



              <tbody
                className="
                  divide-y
                  divide-theme-border
                "
              >

                {languages.map((item, index) => (

                  <tr
                    key={`${item}-${index}`}
                    className="
                      transition-colors
                      hover:bg-theme-primary-soft/40
                    "
                  >

                    <td
                      className="
                        px-6
                        py-4
                        text-sm
                        text-theme-muted
                      "
                    >
                      {index + 1}
                    </td>


                    <td
                      className="
                        px-6
                        py-4
                        text-sm
                        font-medium
                        text-theme-text
                      "
                    >
                      {item}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

}