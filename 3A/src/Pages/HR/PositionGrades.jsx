import { useState } from "react";
import { Award } from "lucide-react";

export default function PositionGrades() {
  // ==================================================
  // STATE
  // ==================================================

  const [positionGrade, setPositionGrade] = useState("");
  const [payScaleMin, setPayScaleMin] = useState("");
  const [payScaleMax, setPayScaleMax] = useState("");

  const [positionGrades, setPositionGrades] = useState([]);

  // ==================================================
  // SAVE POSITION GRADE
  // ==================================================

  const handleSave = () => {
    const trimmedGrade = positionGrade.trim();

    if (!trimmedGrade) {
      return;
    }

    if (payScaleMin === "" || payScaleMax === "") {
      return;
    }

    const min = Number(payScaleMin);
    const max = Number(payScaleMax);

    if (Number.isNaN(min) || Number.isNaN(max)) {
      return;
    }

    if (min > max) {
      return;
    }

    const alreadyExists = positionGrades.some(
      (item) =>
        item.positionGrade.toLowerCase() ===
        trimmedGrade.toLowerCase()
    );

    if (alreadyExists) {
      return;
    }

    setPositionGrades([
      ...positionGrades,
      {
        positionGrade: trimmedGrade,
        payScaleMin: min.toFixed(2),
        payScaleMax: max.toFixed(2),
      },
    ]);

    setPositionGrade("");
    setPayScaleMin("");
    setPayScaleMax("");
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
          Position Grades
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-theme-muted
          "
        >
          Create and manage position grades and pay scales.
        </p>
      </div>

      {/* ==================================================
          ADD POSITION GRADE
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
              Add Position Grade
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Enter position grade details and define the applicable pay scale.
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
            <Award size={21} />
          </div>
        </div>

        {/* FORM */}

        <div
          className="
            space-y-6
            p-6
          "
        >
          {/* POSITION GRADE */}

          <div className="max-w-xl">
            <label
              htmlFor="positionGrade"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-theme-text
              "
            >
              Position Grade
            </label>

            <input
              id="positionGrade"
              type="text"
              value={positionGrade}
              onChange={(e) => setPositionGrade(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={30}
              placeholder="Enter position grade"
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

          {/* PAY SCALE */}

          <div className="max-w-2xl">
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-theme-text
              "
            >
              Pay Scale
            </label>

            <div
              className="
                grid
                gap-4
                md:grid-cols-2
              "
            >
              {/* MINIMUM */}

              <div>
                <label
                  htmlFor="payScaleMin"
                  className="
                    mb-2
                    block
                    text-xs
                    font-medium
                    text-theme-muted
                  "
                >
                  Minimum Pay
                </label>

                <input
                  id="payScaleMin"
                  type="number"
                  min="0"
                  step="0.01"
                  value={payScaleMin}
                  onChange={(e) => setPayScaleMin(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter minimum pay scale"
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
                  htmlFor="payScaleMax"
                  className="
                    mb-2
                    block
                    text-xs
                    font-medium
                    text-theme-muted
                  "
                >
                  Maximum Pay
                </label>

                <input
                  id="payScaleMax"
                  type="number"
                  min="0"
                  step="0.01"
                  value={payScaleMax}
                  onChange={(e) => setPayScaleMax(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter maximum pay scale"
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
              Save Position Grade
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          SAVED POSITION GRADES
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
              Saved Position Grades
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-theme-muted
              "
            >
              Position grades currently available in the system.
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
            <Award size={21} />
          </div>
        </div>

        {/* EMPTY STATE */}

        {positionGrades.length === 0 && (
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
              <Award size={26} />
            </div>

            <p
              className="
                mt-4
                font-medium
                text-theme-text
              "
            >
              No position grades found
            </p>

            <p
              className="
                mt-1
                text-sm
                text-theme-faint
              "
            >
              Add a position grade to get started.
            </p>
          </div>
        )}

        {/* TABLE */}

        {positionGrades.length > 0 && (
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
                    Position Grade
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
                    Minimum Pay Scale
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
                    Maximum Pay Scale
                  </th>
                </tr>
              </thead>

              <tbody
                className="
                  divide-y
                  divide-theme-border
                "
              >
                {positionGrades.map((item, index) => (
                  <tr
                    key={`${item.positionGrade}-${index}`}
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
                      {item.positionGrade}
                    </td>

                    <td
                      className="
                        px-6
                        py-4
                        text-sm
                        text-theme-text
                      "
                    >
                      {item.payScaleMin}
                    </td>

                    <td
                      className="
                        px-6
                        py-4
                        text-sm
                        text-theme-text
                      "
                    >
                      {item.payScaleMax}
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