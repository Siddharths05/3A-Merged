import { useState } from "react";

import { ClipboardList } from "lucide-react";


export default function Requirements() {

  // ==================================================
  // STATE
  // ==================================================

  const [requirement, setRequirement] =
    useState("");

  const [requirements, setRequirements] =
    useState([]);


  // ==================================================
  // SAVE REQUIREMENT
  // ==================================================

  const handleSave = () => {

    const value =
      requirement.trim();


    if (!value) {
      return;
    }


    const alreadyExists =
      requirements.some(
        (item) =>
          item.toLowerCase() ===
          value.toLowerCase()
      );


    if (alreadyExists) {
      return;
    }


    setRequirements([
      ...requirements,
      value,
    ]);


    setRequirement("");

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
          Requirements
        </h1>


        <p
          className="
            mt-1
            text-sm
            text-theme-muted
          "
        >
          Create and manage job requirements.
        </p>

      </div>



      {/* ==================================================
          ADD REQUIREMENT
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
              Add Requirement
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Enter a new requirement to add it to the master list.
            </p>

          </div>



          {/* ICON */}

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

            <ClipboardList size={21} />

          </div>


        </div>



        {/* ==================================================
            FORM
        ================================================== */}

        <div
          className="
            space-y-6
            p-6
          "
        >


          <div className="max-w-xl">


            <label
              htmlFor="requirement"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-theme-text
              "
            >
              Requirement
            </label>



            <input
              id="requirement"
              type="text"
              value={requirement}
              onChange={(e) =>
                setRequirement(e.target.value)
              }
              onKeyDown={handleKeyDown}
              maxLength={30}
              placeholder="Enter requirement"
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



          {/* ==================================================
              ACTIONS
          ================================================== */}

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
              Save Requirement
            </button>


          </div>


        </div>

      </div>



      {/* ==================================================
          SAVED REQUIREMENTS
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
            TABLE HEADER
        ================================================== */}

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
              Saved Requirements
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Requirements currently available in the system.
            </p>

          </div>



          {/* ICON */}

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

            <ClipboardList size={21} />

          </div>


        </div>



        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {requirements.length === 0 && (

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

              <ClipboardList size={26} />

            </div>



            <p
              className="
                mt-4
                font-medium
                text-theme-text
              "
            >
              No requirements found
            </p>



            <p
              className="
                mt-1
                text-sm
                text-theme-faint
              "
            >
              Add a requirement to get started.
            </p>


          </div>

        )}



        {/* ==================================================
            TABLE
        ================================================== */}

        {requirements.length > 0 && (

          <div className="overflow-x-auto">


            <table className="w-full">


              {/* TABLE HEAD */}

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
                    Requirement
                  </th>


                </tr>

              </thead>



              {/* TABLE BODY */}

              <tbody
                className="
                  divide-y
                  divide-theme-border
                "
              >


                {requirements.map((item, index) => (

                  <tr
                    key={`${item}-${index}`}
                    className="
                      transition-colors
                      hover:bg-theme-primary-soft/40
                    "
                  >


                    {/* ID */}

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



                    {/* REQUIREMENT */}

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