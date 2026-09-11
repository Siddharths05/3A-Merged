import { useState } from "react";

import {
  Target,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";


export default function AdvertisingPurpose() {

  // ==================================================
  // STATE
  // ==================================================

  const [
    advertisingPurpose,
    setAdvertisingPurpose,
  ] = useState("");

  const [
    advertisingPurposes,
    setAdvertisingPurposes,
  ] = useState([]);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==================================================
  // HANDLE INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {

    setAdvertisingPurpose(e.target.value);

    setError("");

    setSuccess("");

  };


  // ==================================================
  // SAVE ADVERTISING PURPOSE
  // ==================================================

  const handleSave = () => {

    const value =
      advertisingPurpose.trim();


    // ================================================
    // EMPTY VALIDATION
    // ================================================

    if (!value) {

      setError(
        "Please enter an advertising purpose."
      );

      return;

    }


    // ================================================
    // DUPLICATE VALIDATION
    // ================================================

    const alreadyExists =
      advertisingPurposes.some(
        (item) =>
          item.toLowerCase() ===
          value.toLowerCase()
      );


    if (alreadyExists) {

      setError(
        "This advertising purpose already exists."
      );

      return;

    }


    // ================================================
    // SAVE
    // ================================================

    setAdvertisingPurposes((prev) => [
      ...prev,
      value,
    ]);


    setAdvertisingPurpose("");


    setError("");


    setSuccess(
      "Advertising purpose saved successfully."
    );

  };


  // ==================================================
  // HANDLE KEY DOWN
  // ==================================================

  const handleKeyDown = (e) => {

    if (e.key === "Enter") {

      e.preventDefault();

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
          Advertising Purpose
        </h1>


        <p
          className="
            mt-1
            text-sm
            text-theme-muted
          "
        >
          Manage and configure advertising purposes.
        </p>

      </div>



      {/* ==================================================
          ADD ADVERTISING PURPOSE
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


        {/* ================================================
            CARD HEADER
        ================================================ */}

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
              Add Advertising Purpose
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Enter a new advertising purpose to add it to the list.
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

            <Target size={21} />

          </div>

        </div>



        {/* ================================================
            FORM
        ================================================ */}

        <div
          className="
            space-y-6
            p-6
          "
        >


          <div className="max-w-xl">


            {/* LABEL */}

            <label
              htmlFor="advertisingPurpose"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-theme-text
              "
            >
              Advertising Purpose
            </label>


            {/* INPUT */}

            <input
              id="advertisingPurpose"
              type="text"
              value={advertisingPurpose}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              maxLength={30}
              placeholder="Enter advertising purpose"
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



          {/* ================================================
              ERROR MESSAGE
          ================================================ */}

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



          {/* ================================================
              SUCCESS MESSAGE
          ================================================ */}

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
                {success}
              </span>

            </div>

          )}



          {/* ================================================
              ACTION AREA
          ================================================ */}

          <div
            className="
              flex
              items-center
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
              Save Advertising Purpose
            </button>

          </div>

        </div>

      </div>



      {/* ==================================================
          SAVED ADVERTISING PURPOSES
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


        {/* ================================================
            TABLE HEADER
        ================================================ */}

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
              Saved Advertising Purposes
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Advertising purposes currently available in the system.
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

            <Target size={21} />

          </div>

        </div>



        {/* ================================================
            EMPTY STATE
        ================================================ */}

        {advertisingPurposes.length === 0 ? (

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

              <Target size={26} />

            </div>


            <p
              className="
                mt-4
                font-medium
                text-theme-text
              "
            >
              No advertising purposes found
            </p>


            <p
              className="
                mt-1
                text-sm
                text-theme-faint
              "
            >
              Add an advertising purpose to get started.
            </p>

          </div>

        ) : (

          /* ================================================
              TABLE
          ================================================ */

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
                      w-20
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
                    #
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
                    Advertising Purpose
                  </th>

                </tr>

              </thead>



              <tbody
                className="
                  divide-y
                  divide-theme-border
                "
              >

                {advertisingPurposes.map(
                  (item, index) => (

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

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

}