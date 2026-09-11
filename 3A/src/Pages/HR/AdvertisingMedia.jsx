import { useState } from "react";

import {
  Radio,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";


export default function AdvertisingMedia() {

  // ==================================================
  // STATE
  // ==================================================

  const [
    advertisingMedia,
    setAdvertisingMedia,
  ] = useState("");

  const [
    advertisingMedias,
    setAdvertisingMedias,
  ] = useState([]);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==================================================
  // HANDLE INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {

    setAdvertisingMedia(e.target.value);

    setError("");

    setSuccess("");

  };


  // ==================================================
  // SAVE ADVERTISING MEDIA
  // ==================================================

  const handleSave = () => {

    const value =
      advertisingMedia.trim();


    // ================================================
    // EMPTY VALIDATION
    // ================================================

    if (!value) {

      setError(
        "Please enter an advertising media."
      );

      return;

    }


    // ================================================
    // DUPLICATE VALIDATION
    // ================================================

    const alreadyExists =
      advertisingMedias.some(
        (item) =>
          item.toLowerCase() ===
          value.toLowerCase()
      );


    if (alreadyExists) {

      setError(
        "This advertising media already exists."
      );

      return;

    }


    // ================================================
    // SAVE
    // ================================================

    setAdvertisingMedias((prev) => [
      ...prev,
      value,
    ]);


    setAdvertisingMedia("");


    setError("");


    setSuccess(
      "Advertising media saved successfully."
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
          Advertising Media
        </h1>


        <p
          className="
            mt-1
            text-sm
            text-theme-muted
          "
        >
          Manage and configure advertising media sources.
        </p>

      </div>



      {/* ==================================================
          ADD ADVERTISING MEDIA
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
              Add Advertising Media
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Enter a new advertising media to add it to the list.
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

            <Radio size={21} />

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
              htmlFor="advertisingMedia"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-theme-text
              "
            >
              Advertising Media
            </label>


            {/* INPUT */}

            <input
              id="advertisingMedia"
              type="text"
              value={advertisingMedia}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              maxLength={30}
              placeholder="Enter advertising media"
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
              ACTIONS
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
              Save Advertising Media
            </button>

          </div>

        </div>

      </div>



      {/* ==================================================
          SAVED ADVERTISING MEDIA
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
              Saved Advertising Media
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Advertising media currently available in the system.
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

            <Radio size={21} />

          </div>

        </div>



        {/* ================================================
            EMPTY STATE
        ================================================ */}

        {advertisingMedias.length === 0 ? (

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

              <Radio size={26} />

            </div>


            <p
              className="
                mt-4
                font-medium
                text-theme-text
              "
            >
              No advertising media found
            </p>


            <p
              className="
                mt-1
                text-sm
                text-theme-faint
              "
            >
              Add an advertising media to get started.
            </p>

          </div>

        ) : (

          /* ================================================
              TABLE
          ================================================ */

          <div className="overflow-x-auto">

            <table className="w-full min-w-162">

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
                    Advertising Media
                  </th>

                </tr>

              </thead>



              <tbody
                className="
                  divide-y
                  divide-theme-border
                "
              >

                {advertisingMedias.map(
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