import { useState } from "react";

import {
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";


export default function RoleInOffense() {

  // ==================================================
  // STATE
  // ==================================================

  const [roleInOffense, setRoleInOffense] =
    useState("");

  const [penaltyRangeMin, setPenaltyRangeMin] =
    useState("");

  const [penaltyRangeMax, setPenaltyRangeMax] =
    useState("");

  const [rolesInOffense, setRolesInOffense] =
    useState([]);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==================================================
  // SAVE ROLE IN OFFENSE
  // ==================================================

  const handleSave = () => {

    const role =
      roleInOffense.trim();


    // ================================================
    // VALIDATION
    // ================================================

    if (
      !role ||
      penaltyRangeMin === "" ||
      penaltyRangeMax === ""
    ) {

      setError(
        "Please complete all required fields."
      );

      setSuccess("");

      return;

    }


    const min =
      Number(penaltyRangeMin);

    const max =
      Number(penaltyRangeMax);


    if (
      Number.isNaN(min) ||
      Number.isNaN(max)
    ) {

      setError(
        "Please enter valid penalty amounts."
      );

      setSuccess("");

      return;

    }


    if (min > max) {

      setError(
        "Penalty Range Min. cannot be greater than Max."
      );

      setSuccess("");

      return;

    }


    const alreadyExists =
      rolesInOffense.some(
        (item) =>
          item.roleInOffense.toLowerCase() ===
          role.toLowerCase()
      );


    if (alreadyExists) {

      setError(
        "This Role in Offense already exists."
      );

      setSuccess("");

      return;

    }


    // ================================================
    // SAVE
    // ================================================

    setRolesInOffense([
      ...rolesInOffense,
      {
        roleInOffense: role,
        penaltyRangeMin: min.toFixed(2),
        penaltyRangeMax: max.toFixed(2),
      },
    ]);


    setRoleInOffense("");

    setPenaltyRangeMin("");

    setPenaltyRangeMax("");


    setError("");

    setSuccess(
      "Role in Offense saved successfully."
    );

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
  // HANDLE INPUT CHANGE
  // ==================================================

  const handleRoleChange = (e) => {

    setRoleInOffense(
      e.target.value
    );

    setError("");

    setSuccess("");

  };


  const handleMinChange = (e) => {

    setPenaltyRangeMin(
      e.target.value
    );

    setError("");

    setSuccess("");

  };


  const handleMaxChange = (e) => {

    setPenaltyRangeMax(
      e.target.value
    );

    setError("");

    setSuccess("");

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
          Role in Offense
        </h1>


        <p
          className="
            mt-1
            text-sm
            text-theme-muted
          "
        >
          Manage roles in offense and penalty ranges.
        </p>

      </div>



      {/* ==================================================
          ADD ROLE IN OFFENSE
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
              Add Role in Offense
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Enter a role and define its applicable penalty range.
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

            <ShieldAlert size={21} />

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


          {/* ROLE IN OFFENSE */}

          <div className="max-w-xl">


            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-theme-text
              "
            >
              Role in Offense
              <span className="ml-1 text-theme-danger">
                *
              </span>
            </label>


            <input
              type="text"
              value={roleInOffense}
              onChange={handleRoleChange}
              onKeyDown={handleKeyDown}
              maxLength={30}
              placeholder="Enter role in offense"
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


            <div
              className="
                mt-2
                flex
                items-center
                justify-between
                text-xs
                text-theme-faint
              "
            >

              <span>
                Maximum 30 characters.
              </span>


              <span>
                {roleInOffense.length}/30
              </span>

            </div>

          </div>



          {/* ==================================================
              PENALTY RANGE
          ================================================== */}

          <div>


            <label
              className="
                mb-3
                block
                text-sm
                font-semibold
                text-theme-text
              "
            >
              Penalty Range
              <span className="ml-1 text-theme-danger">
                *
              </span>
            </label>


            <div
              className="
                grid
                grid-cols-1
                gap-4
                md:grid-cols-2
              "
            >


              {/* MINIMUM */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-medium
                    text-theme-muted
                  "
                >
                  Minimum Penalty
                </label>


                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={penaltyRangeMin}
                  onChange={handleMinChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter minimum penalty"
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

              </div>



              {/* MAXIMUM */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-medium
                    text-theme-muted
                  "
                >
                  Maximum Penalty
                </label>


                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={penaltyRangeMax}
                  onChange={handleMaxChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter maximum penalty"
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

              </div>

            </div>

          </div>



          {/* ==================================================
              ERROR
          ================================================== */}

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



          {/* ==================================================
              SUCCESS
          ================================================== */}

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
              Save Role in Offense
            </button>

          </div>

        </div>

      </div>



      {/* ==================================================
          SAVED ROLES IN OFFENSE
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
              Saved Roles in Offense
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Roles in offense currently available in the system.
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

            <ShieldAlert size={21} />

          </div>

        </div>



        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {rolesInOffense.length === 0 && (

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

              <ShieldAlert size={26} />

            </div>


            <p
              className="
                mt-4
                font-medium
                text-theme-text
              "
            >
              No roles in offense found
            </p>


            <p
              className="
                mt-1
                text-sm
                text-theme-faint
              "
            >
              Add a role in offense to get started.
            </p>

          </div>

        )}



        {/* ==================================================
            TABLE
        ================================================== */}

        {rolesInOffense.length > 0 && (

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
                    Role in Offense
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
                    Penalty Range Min.
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
                    Penalty Range Max.
                  </th>

                </tr>

              </thead>



              <tbody
                className="
                  divide-y
                  divide-theme-border
                "
              >

                {rolesInOffense.map(
                  (item, index) => (

                    <tr
                      key={index}
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
                        {item.roleInOffense}
                      </td>


                      <td
                        className="
                          px-6
                          py-4
                          text-sm
                          text-theme-text
                        "
                      >
                        {item.penaltyRangeMin}
                      </td>


                      <td
                        className="
                          px-6
                          py-4
                          text-sm
                          text-theme-text
                        "
                      >
                        {item.penaltyRangeMax}
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