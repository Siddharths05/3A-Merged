import { useState } from "react";

import { MapPin } from "lucide-react";


export default function MeetingLocation() {

  // ==================================================
  // STATE
  // ==================================================

  const [meetingLocation, setMeetingLocation] =
    useState("");

  const [meetingLocations, setMeetingLocations] =
    useState([]);


  // ==================================================
  // SAVE MEETING LOCATION
  // ==================================================

  const handleSave = () => {

    const value =
      meetingLocation.trim();


    if (!value) {
      return;
    }


    const alreadyExists =
      meetingLocations.some(
        (item) =>
          item.toLowerCase() ===
          value.toLowerCase()
      );


    if (alreadyExists) {
      return;
    }


    setMeetingLocations([
      ...meetingLocations,
      value,
    ]);


    setMeetingLocation("");

  };


  // ==================================================
  // HANDLE INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {

    setMeetingLocation(
      e.target.value
    );

  };


  // ==================================================
  // HANDLE ENTER KEY
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
          Meeting Location
        </h1>


        <p
          className="
            mt-1
            text-sm
            text-theme-muted
          "
        >
          Create and manage meeting locations.
        </p>

      </div>



      {/* ==================================================
          ADD MEETING LOCATION
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
              Add Meeting Location
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Enter a meeting location to add it to the master list.
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

            <MapPin size={21} />

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


            {/* LABEL */}

            <label
              htmlFor="meetingLocation"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-theme-text
              "
            >
              Meeting Location
            </label>



            {/* INPUT */}

            <input
              id="meetingLocation"
              type="text"
              value={meetingLocation}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              maxLength={30}
              placeholder="Enter meeting location"
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
              Save Meeting Location
            </button>


          </div>

        </div>

      </div>



      {/* ==================================================
          SAVED MEETING LOCATIONS
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
              Saved Meeting Locations
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Meeting locations currently available in the system.
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

            <MapPin size={21} />

          </div>

        </div>



        {/* EMPTY STATE */}

        {meetingLocations.length === 0 && (

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

              <MapPin size={26} />

            </div>


            <p
              className="
                mt-4
                font-medium
                text-theme-text
              "
            >
              No meeting locations found
            </p>


            <p
              className="
                mt-1
                text-sm
                text-theme-faint
              "
            >
              Add a meeting location to get started.
            </p>


          </div>

        )}



        {/* TABLE */}

        {meetingLocations.length > 0 && (

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
                    Meeting Location
                  </th>


                </tr>

              </thead>



              <tbody
                className="
                  divide-y
                  divide-theme-border
                "
              >

                {meetingLocations.map((item, index) => (

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