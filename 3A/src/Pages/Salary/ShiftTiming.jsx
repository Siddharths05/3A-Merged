import { useState, useEffect } from "react";
import {
  Clock3,
  AlertCircle,
  CheckCircle2,
  Pencil,
  Trash2,
  Download,
  Printer,
} from "lucide-react";
import { usePermissions } from "../../components/Permissions";

// ==================================================
// REAL BACKEND
// TABLE: salshifttiming
// PK: pkSTId
//
// COLUMNS:
// pkstid  -> pkSTId
// shift   -> Shift
// swork   -> StartWork
// ework   -> EndWork
// twork   -> TotalWork
// sbreak  -> StartBreak
// ebreak  -> EndBreak
// tbreak  -> TotalBreak
//
// API:
// GET    /shift-timings
// GET    /shift-timings/{id}
// POST   /shift-timings
// PUT    /shift-timings/{id}
// DELETE /shift-timings/{id}
// GET    /shift-timings/export
// GET    /shift-timings/print
//
// LIST KEY: shift_timings
// ==================================================

const API_BASE_URL = "http://127.0.0.1:8000/api";

// ==================================================
// TOKEN / ERROR HELPERS
// ==================================================

function getToken() {
  return localStorage.getItem("access_token") || "";
}

function getErrorMessage(data, fallback) {
  if (!data) return fallback;

  if (typeof data.detail === "string") {
    return data.detail;
  }

  if (Array.isArray(data.detail) && data.detail[0]?.msg) {
    return data.detail[0].msg;
  }

  return fallback;
}

// ==================================================
// TIME HELPERS
// ==================================================

/**
 * Converts 24-hour HH:MM into a 12-hour display object.
 *
 * Example:
 * 09:00 -> { hour: "09", minute: "00", period: "AM" }
 * 17:30 -> { hour: "05", minute: "30", period: "PM" }
 */
function parse24HourTime(timeValue) {
  if (!timeValue) {
    return {
      hour: "",
      minute: "",
      period: "AM",
    };
  }

  const cleanTime = String(timeValue).slice(0, 5);

  const [hoursString, minutesString] =
    cleanTime.split(":");

  const hours = Number(hoursString);
  const minutes = Number(minutesString);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return {
      hour: "",
      minute: "",
      period: "AM",
    };
  }

  const period = hours >= 12 ? "PM" : "AM";

  let displayHour = hours % 12;

  if (displayHour === 0) {
    displayHour = 12;
  }

  return {
    hour: String(displayHour).padStart(2, "0"),
    minute: String(minutes).padStart(2, "0"),
    period,
  };
}

/**
 * Converts 12-hour values into backend-compatible HH:MM.
 *
 * Example:
 * 09:00 AM -> 09:00
 * 05:30 PM -> 17:30
 * 12:00 AM -> 00:00
 * 12:00 PM -> 12:00
 */
function convertTo24Hour(hour, minute, period) {
  if (!hour || !minute || !period) {
    return "";
  }

  let hours = Number(hour);
  const minutes = Number(minute);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 1 ||
    hours > 12 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return "";
  }

  if (period === "AM") {
    if (hours === 12) {
      hours = 0;
    }
  } else {
    if (hours !== 12) {
      hours += 12;
    }
  }

  return `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}`;
}

/**
 * Converts HH:MM into total minutes.
 */
function timeToMinutes(timeValue) {
  if (!timeValue) {
    return null;
  }

  const [hours, minutes] = String(timeValue)
    .split(":")
    .map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return null;
  }

  return hours * 60 + minutes;
}

/**
 * Calculates duration between two HH:MM values.
 *
 * Supports overnight timing.
 *
 * Examples:
 * 09:00 -> 18:00 = 9.00
 * 09:30 -> 18:00 = 8.50
 * 22:00 -> 06:00 = 8.00
 */
function calculateDuration(startTime, endTime) {
  const startMinutes =
    timeToMinutes(startTime);

  const endMinutes =
    timeToMinutes(endTime);

  if (
    startMinutes === null ||
    endMinutes === null
  ) {
    return "";
  }

  let durationMinutes =
    endMinutes - startMinutes;

  // Overnight timing
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60;
  }

  return (durationMinutes / 60).toFixed(2);
}

// ==================================================
// TIME INPUT COMPONENT
// ==================================================

function TimeInput({
  id,
  hour,
  minute,
  period,
  onHourChange,
  onMinuteChange,
  onPeriodChange,
  onKeyDown,
  disabled,
}) {
  return (
    <div
      className={`flex h-12 w-full overflow-hidden rounded-xl border border-theme-border bg-[var(--erp-background)] transition-all ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "focus-within:border-theme-primary focus-within:ring-2 focus-within:ring-theme-primary-soft"
      }`}
    >
      <input
        id={`${id}-hour`}
        type="text"
        inputMode="numeric"
        maxLength={2}
        value={hour}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "");
          if (
            value === "" ||
            (Number(value) >= 1 && Number(value) <= 12)
          ) {
            onHourChange(value);
          }
        }}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder="HH"
        aria-label="Hour"
        className="w-12 shrink-0 bg-transparent px-2 text-center text-sm font-medium text-theme-text outline-none placeholder:text-theme-faint disabled:cursor-not-allowed"
      />
      <span className="flex items-center text-sm font-semibold text-theme-muted">
        :
      </span>
      <input
        id={`${id}-minute`}
        type="text"
        inputMode="numeric"
        maxLength={2}
        value={minute}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "");
          if (
            value === "" ||
            (Number(value) >= 0 && Number(value) <= 59)
          ) {
            onMinuteChange(value);
          }
        }}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder="MM"
        aria-label="Minute"
        className="w-12 shrink-0 bg-transparent px-2 text-center text-sm font-medium text-theme-text outline-none placeholder:text-theme-faint disabled:cursor-not-allowed"
      />
      <div className="ml-auto flex items-center border-l border-theme-border bg-theme-primary-soft/20">
        <select
          id={`${id}-period`}
          value={period}
          onChange={(e) => onPeriodChange(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          aria-label="AM or PM"
          className="h-full cursor-pointer bg-transparent px-3 text-sm font-semibold text-theme-text outline-none disabled:cursor-not-allowed"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}

// ==================================================
// MAIN COMPONENT
// ==================================================
// MAIN COMPONENT
// ==================================================

export default function ShiftTiming() {
  const { role, can } = usePermissions();

  const isAllowed = (action) =>
    role === "admin" ||
    can("salary_shift_timing", action);

  // ==================================================
  // FORM STATE
  // ==================================================

  const [pkSTId, setPkSTId] = useState("");
  const [shift, setShift] = useState("");

  // Work timing - internally stored as HH:MM
  const [startWork, setStartWork] = useState("");
  const [endWork, setEndWork] = useState("");

  // Work timing - display state
  const [startWorkHour, setStartWorkHour] =
    useState("");
  const [startWorkMinute, setStartWorkMinute] =
    useState("");
  const [startWorkPeriod, setStartWorkPeriod] =
    useState("AM");

  const [endWorkHour, setEndWorkHour] =
    useState("");
  const [endWorkMinute, setEndWorkMinute] =
    useState("");
  const [endWorkPeriod, setEndWorkPeriod] =
    useState("AM");

  const [totalWork, setTotalWork] =
    useState("");

  // Break timing - internally stored as HH:MM
  const [startBreak, setStartBreak] =
    useState("");
  const [endBreak, setEndBreak] =
    useState("");

  // Break timing - display state
  const [startBreakHour, setStartBreakHour] =
    useState("");
  const [startBreakMinute, setStartBreakMinute] =
    useState("");
  const [startBreakPeriod, setStartBreakPeriod] =
    useState("AM");

  const [endBreakHour, setEndBreakHour] =
    useState("");
  const [endBreakMinute, setEndBreakMinute] =
    useState("");
  const [endBreakPeriod, setEndBreakPeriod] =
    useState("AM");

  const [totalBreak, setTotalBreak] =
    useState("");

  // ==================================================
  // LIST / UI STATE
  // ==================================================

  const [shiftTimings, setShiftTimings] =
    useState([]);

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [exporting, setExporting] =
    useState(false);

  const [printing, setPrinting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ==================================================
  // WORK TIME UPDATE
  // ==================================================

  const updateStartWork = (
    hour,
    minute,
    period
  ) => {
    const converted =
      convertTo24Hour(
        hour,
        minute,
        period
      );

    setStartWork(hour && minute ? converted : "");

    if (hour && minute) {
      setTotalWork(
        calculateDuration(
          converted,
          endWork
        )
      );
    } else {
      setTotalWork("");
    }
  };

  const updateEndWork = (
    hour,
    minute,
    period
  ) => {
    const converted =
      convertTo24Hour(
        hour,
        minute,
        period
      );

    setEndWork(hour && minute ? converted : "");

    if (hour && minute) {
      setTotalWork(
        calculateDuration(
          startWork,
          converted
        )
      );
    } else {
      setTotalWork("");
    }
  };

  // ==================================================
  // BREAK TIME UPDATE
  // ==================================================

  const updateStartBreak = (
    hour,
    minute,
    period
  ) => {
    const converted =
      convertTo24Hour(
        hour,
        minute,
        period
      );

    setStartBreak(
      hour && minute ? converted : ""
    );

    if (hour && minute) {
      setTotalBreak(
        calculateDuration(
          converted,
          endBreak
        )
      );
    } else {
      setTotalBreak("");
    }
  };

  const updateEndBreak = (
    hour,
    minute,
    period
  ) => {
    const converted =
      convertTo24Hour(
        hour,
        minute,
        period
      );

    setEndBreak(
      hour && minute ? converted : ""
    );

    if (hour && minute) {
      setTotalBreak(
        calculateDuration(
          startBreak,
          converted
        )
      );
    } else {
      setTotalBreak("");
    }
  };

  // ==================================================
  // PERIOD UPDATE HELPERS
  // ==================================================

  const handleStartWorkPeriodChange = (
    period
  ) => {
    setStartWorkPeriod(period);

    const converted =
      convertTo24Hour(
        startWorkHour,
        startWorkMinute,
        period
      );

    setStartWork(
      startWorkHour && startWorkMinute
        ? converted
        : ""
    );

    if (
      startWorkHour &&
      startWorkMinute
    ) {
      setTotalWork(
        calculateDuration(
          converted,
          endWork
        )
      );
    } else {
      setTotalWork("");
    }

    clearMessages();
  };

  const handleEndWorkPeriodChange = (
    period
  ) => {
    setEndWorkPeriod(period);

    const converted =
      convertTo24Hour(
        endWorkHour,
        endWorkMinute,
        period
      );

    setEndWork(
      endWorkHour && endWorkMinute
        ? converted
        : ""
    );

    if (
      endWorkHour &&
      endWorkMinute
    ) {
      setTotalWork(
        calculateDuration(
          startWork,
          converted
        )
      );
    } else {
      setTotalWork("");
    }

    clearMessages();
  };

  const handleStartBreakPeriodChange = (
    period
  ) => {
    setStartBreakPeriod(period);

    const converted =
      convertTo24Hour(
        startBreakHour,
        startBreakMinute,
        period
      );

    setStartBreak(
      startBreakHour &&
        startBreakMinute
        ? converted
        : ""
    );

    if (
      startBreakHour &&
      startBreakMinute
    ) {
      setTotalBreak(
        calculateDuration(
          converted,
          endBreak
        )
      );
    } else {
      setTotalBreak("");
    }

    clearMessages();
  };

  const handleEndBreakPeriodChange = (
    period
  ) => {
    setEndBreakPeriod(period);

    const converted =
      convertTo24Hour(
        endBreakHour,
        endBreakMinute,
        period
      );

    setEndBreak(
      endBreakHour &&
        endBreakMinute
        ? converted
        : ""
    );

    if (
      endBreakHour &&
      endBreakMinute
    ) {
      setTotalBreak(
        calculateDuration(
          startBreak,
          converted
        )
      );
    } else {
      setTotalBreak("");
    }

    clearMessages();
  };

  // ==================================================
  // FETCH SHIFT TIMINGS
  // ==================================================

  const fetchShiftTimings = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/shift-timings`,
        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`,
          },
        }
      );

      const data =
        await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "Failed to load shift timings"
          )
        );
      }

      setShiftTimings(
        data.shift_timings || []
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to load shift timings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShiftTimings();
  }, []);

  // ==================================================
  // MESSAGE HELPERS
  // ==================================================

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // ==================================================
  // RESET FORM
  // ==================================================

  const resetForm = () => {
    setPkSTId("");
    setShift("");

    setStartWork("");
    setEndWork("");
    setTotalWork("");

    setStartWorkHour("");
    setStartWorkMinute("");
    setStartWorkPeriod("AM");

    setEndWorkHour("");
    setEndWorkMinute("");
    setEndWorkPeriod("AM");

    setStartBreak("");
    setEndBreak("");
    setTotalBreak("");

    setStartBreakHour("");
    setStartBreakMinute("");
    setStartBreakPeriod("AM");

    setEndBreakHour("");
    setEndBreakMinute("");
    setEndBreakPeriod("AM");

    setEditingId(null);
  };

  // ==================================================
  // VALIDATE FORM
  // ==================================================

  const validateForm = () => {
    const trimmedShift =
      shift.trim();

    if (editingId === null) {
      if (!pkSTId.trim()) {
        setError(
          "Please enter a Shift ID."
        );
        return false;
      }

      if (!/^\d+$/.test(pkSTId.trim())) {
        setError(
          "Shift ID must be a valid number."
        );
        return false;
      }
    }

    if (!trimmedShift) {
      setError(
        "Please enter a shift name."
      );
      return false;
    }

    if (trimmedShift.length > 50) {
      setError(
        "Shift name must be 50 characters or fewer."
      );
      return false;
    }

    if (!startWork) {
      setError(
        "Please enter the start work time."
      );
      return false;
    }

    if (!endWork) {
      setError(
        "Please enter the end work time."
      );
      return false;
    }

    if (
      totalWork === "" ||
      Number.isNaN(Number(totalWork)) ||
      Number(totalWork) < 0
    ) {
      setError(
        "Total work could not be calculated."
      );
      return false;
    }

    if (!startBreak) {
      setError(
        "Please enter the start break time."
      );
      return false;
    }

    if (!endBreak) {
      setError(
        "Please enter the end break time."
      );
      return false;
    }

    if (
      totalBreak === "" ||
      Number.isNaN(Number(totalBreak)) ||
      Number(totalBreak) < 0
    ) {
      setError(
        "Total break could not be calculated."
      );
      return false;
    }

    return true;
  };

  // ==================================================
  // SAVE / UPDATE
  // ==================================================

  const handleSave = async () => {
    clearMessages();

    /*
     * Recalculate immediately before saving.
     * This guarantees the backend always receives
     * totals based on the selected times.
     */
    const calculatedTotalWork =
      calculateDuration(
        startWork,
        endWork
      );

    const calculatedTotalBreak =
      calculateDuration(
        startBreak,
        endBreak
      );

    setTotalWork(
      calculatedTotalWork
    );

    setTotalBreak(
      calculatedTotalBreak
    );

    if (
      !calculatedTotalWork ||
      !calculatedTotalBreak
    ) {
      setError(
        "Please complete all time fields before saving."
      );
      return;
    }

    setSaving(true);

    try {
      const isEdit =
        editingId !== null;

      const url = isEdit
        ? `${API_BASE_URL}/shift-timings/${editingId}`
        : `${API_BASE_URL}/shift-timings`;

      const payload = {
        ...(isEdit
          ? {}
          : {
              pkSTId:
                Number(pkSTId.trim()),
            }),

        shift: shift.trim(),

        start_work: startWork,

        end_work: endWork,

        total_work:
          Number(calculatedTotalWork),

        start_break: startBreak,

        end_break: endBreak,

        total_break:
          Number(calculatedTotalBreak),
      };

      const res = await fetch(
        url,
        {
          method: isEdit
            ? "PUT"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${getToken()}`,
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

      const data =
        await res
          .json()
          .catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          getErrorMessage(
            data,
            isEdit
              ? "Failed to update shift timing"
              : "Failed to create shift timing"
          )
        );
      }

      setSuccess(
        isEdit
          ? "Shift timing updated successfully."
          : "Shift timing saved successfully."
      );

      resetForm();

      await fetchShiftTimings();
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // EDIT
  // ==================================================

  const handleEdit = (item) => {
    clearMessages();

    setEditingId(
      item.pkSTId
    );

    setPkSTId(
      item.pkSTId !== null &&
      item.pkSTId !== undefined
        ? String(item.pkSTId)
        : ""
    );

    setShift(
      item.Shift || ""
    );

    // ------------------------------
    // WORK TIME
    // ------------------------------

    const editedStartWork =
      item.StartWork
        ? String(
            item.StartWork
          ).slice(0, 5)
        : "";

    const editedEndWork =
      item.EndWork
        ? String(
            item.EndWork
          ).slice(0, 5)
        : "";

    setStartWork(
      editedStartWork
    );

    setEndWork(
      editedEndWork
    );

    const parsedStartWork =
      parse24HourTime(
        editedStartWork
      );

    const parsedEndWork =
      parse24HourTime(
        editedEndWork
      );

    setStartWorkHour(
      parsedStartWork.hour
    );

    setStartWorkMinute(
      parsedStartWork.minute
    );

    setStartWorkPeriod(
      parsedStartWork.period
    );

    setEndWorkHour(
      parsedEndWork.hour
    );

    setEndWorkMinute(
      parsedEndWork.minute
    );

    setEndWorkPeriod(
      parsedEndWork.period
    );

    setTotalWork(
      editedStartWork &&
      editedEndWork
        ? calculateDuration(
            editedStartWork,
            editedEndWork
          )
        : ""
    );

    // ------------------------------
    // BREAK TIME
    // ------------------------------

    const editedStartBreak =
      item.StartBreak
        ? String(
            item.StartBreak
          ).slice(0, 5)
        : "";

    const editedEndBreak =
      item.EndBreak
        ? String(
            item.EndBreak
          ).slice(0, 5)
        : "";

    setStartBreak(
      editedStartBreak
    );

    setEndBreak(
      editedEndBreak
    );

    const parsedStartBreak =
      parse24HourTime(
        editedStartBreak
      );

    const parsedEndBreak =
      parse24HourTime(
        editedEndBreak
      );

    setStartBreakHour(
      parsedStartBreak.hour
    );

    setStartBreakMinute(
      parsedStartBreak.minute
    );

    setStartBreakPeriod(
      parsedStartBreak.period
    );

    setEndBreakHour(
      parsedEndBreak.hour
    );

    setEndBreakMinute(
      parsedEndBreak.minute
    );

    setEndBreakPeriod(
      parsedEndBreak.period
    );

    setTotalBreak(
      editedStartBreak &&
      editedEndBreak
        ? calculateDuration(
            editedStartBreak,
            editedEndBreak
          )
        : ""
    );
  };

  // ==================================================
  // DELETE
  // ==================================================

  const handleDelete = async (
    id
  ) => {
    if (
      !window.confirm(
        "Delete this shift timing?"
      )
    ) {
      return;
    }

    clearMessages();

    setDeletingId(id);

    try {
      const res = await fetch(
        `${API_BASE_URL}/shift-timings/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${getToken()}`,
          },
        }
      );

      const data =
        await res
          .json()
          .catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          getErrorMessage(
            data,
            "Failed to delete shift timing"
          )
        );
      }

      setSuccess(
        "Shift timing deleted successfully."
      );

      if (
        editingId === id
      ) {
        resetForm();
      }

      await fetchShiftTimings();
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==================================================
  // EXPORT
  // ==================================================

  const handleExport = async () => {
    try {
      setExporting(true);

      clearMessages();

      const token =
        getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const res =
        await fetch(
          `${API_BASE_URL}/shift-timings/export`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (!res.ok) {
        const data =
          await res
            .json()
            .catch(() => ({}));

        throw new Error(
          getErrorMessage(
            data,
            "Failed to export data"
          )
        );
      }

      const blob =
        await res.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      const date =
        new Date()
          .toISOString()
          .slice(0, 10)
          .replace(
            /-/g,
            "_"
          );

      link.download =
        `export_ShiftTiming_${date}.xlsx`;

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      window.URL.revokeObjectURL(
        url
      );

      setSuccess(
        "Excel file downloaded successfully."
      );
    } catch (err) {
      if (
        err instanceof TypeError
      ) {
        setError(
          "Failed to connect to the server. Please make sure the backend is running."
        );
      } else {
        setError(
          err.message ||
            "Failed to export data"
        );
      }
    } finally {
      setExporting(false);
    }
  };

  // ==================================================
  // PRINT
  // ==================================================

  const handlePrint = async () => {
    try {
      setPrinting(true);

      clearMessages();

      const token =
        getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const res =
        await fetch(
          `${API_BASE_URL}/shift-timings/print`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (!res.ok) {
        const data =
          await res
            .json()
            .catch(() => ({}));

        throw new Error(
          getErrorMessage(
            data,
            "Failed to print data"
          )
        );
      }

      const blob =
        await res.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      const date =
        new Date()
          .toISOString()
          .slice(0, 10)
          .replace(
            /-/g,
            "_"
          );

      link.download =
        `print_ShiftTiming_${date}.docx`;

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      window.URL.revokeObjectURL(
        url
      );

      setSuccess(
        "Word file downloaded successfully."
      );
    } catch (err) {
      if (
        err instanceof TypeError
      ) {
        setError(
          "Failed to connect to the server. Please make sure the backend is running."
        );
      } else {
        setError(
          err.message ||
            "Failed to print data"
        );
      }
    } finally {
      setPrinting(false);
    }
  };

  // ==================================================
  // ENTER KEY
  // ==================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (
        (editingId === null &&
          isAllowed("add")) ||
        (editingId !== null &&
          isAllowed("edit"))
      ) {
        handleSave();
      }
    }
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="space-y-8">
      {/* Page header — same pattern as Religion */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-theme-text sm:text-3xl">
          Shift Timing
        </h1>
        <p className="mt-1 text-sm text-theme-muted">
          Create and manage work and break schedules for each shift.
        </p>
      </div>

      {/* Form card */}
      {(isAllowed("add") ||
        (editingId !== null && isAllowed("edit"))) && (
        <div className="overflow-hidden rounded-2xl border border-theme-border bg-card shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-theme-border px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-theme-text">
                {editingId !== null
                  ? "Edit Shift Timing"
                  : "Add Shift Timing"}
              </h2>
              <p className="mt-1 text-sm text-theme-muted">
                {editingId !== null
                  ? "Update shift name, work hours, and break times."
                  : "Enter shift details. Total work and break hours are calculated automatically."}
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-theme-primary-soft text-theme-primary">
              <Clock3 size={21} />
            </div>
          </div>

          <div className="space-y-6 p-6">
            {/* Identity */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {editingId === null && (
                <div>
                  <label
                    htmlFor="pkSTId"
                    className="mb-2 block text-sm font-semibold text-theme-text"
                  >
                    Shift ID
                  </label>
                  <input
                    id="pkSTId"
                    type="text"
                    inputMode="numeric"
                    value={pkSTId}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setPkSTId(value);
                      clearMessages();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter numeric ID"
                    disabled={saving}
                    className="h-12 w-full rounded-xl border border-theme-border bg-[var(--erp-background)] px-4 text-sm text-theme-text outline-none transition-all placeholder:text-theme-faint focus:border-theme-primary focus:ring-2 focus:ring-theme-primary-soft disabled:opacity-60"
                  />
                  <p className="mt-2 text-xs text-theme-faint">
                    Required on create. Use a unique number.
                  </p>
                </div>
              )}

              <div className={editingId === null ? "" : "md:col-span-2 max-w-xl"}>
                <label
                  htmlFor="shift"
                  className="mb-2 block text-sm font-semibold text-theme-text"
                >
                  Shift Name
                </label>
                <input
                  id="shift"
                  type="text"
                  value={shift}
                  onChange={(e) => {
                    setShift(e.target.value);
                    clearMessages();
                  }}
                  onKeyDown={handleKeyDown}
                  maxLength={50}
                  placeholder="e.g. Morning, Evening, Night"
                  disabled={saving}
                  className="h-12 w-full rounded-xl border border-theme-border bg-[var(--erp-background)] px-4 text-sm text-theme-text outline-none transition-all placeholder:text-theme-faint focus:border-theme-primary focus:ring-2 focus:ring-theme-primary-soft disabled:opacity-60"
                />
                <p className="mt-2 text-xs text-theme-faint">
                  Maximum 50 characters.
                </p>
              </div>
            </div>

            {/* Work timing */}
            <div className="rounded-xl border border-theme-border bg-[var(--erp-background)]/40 p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-theme-text">
                  Work Timing
                </h3>
                <p className="mt-1 text-xs text-theme-muted">
                  Start and end of the work period. Total is calculated automatically (overnight supported).
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label
                    htmlFor="startWork-hour"
                    className="mb-2 block text-sm font-semibold text-theme-text"
                  >
                    Start Work
                  </label>
                  <TimeInput
                    id="startWork"
                    hour={startWorkHour}
                    minute={startWorkMinute}
                    period={startWorkPeriod}
                    onHourChange={(value) => {
                      setStartWorkHour(value);
                      updateStartWork(
                        value,
                        startWorkMinute,
                        startWorkPeriod
                      );
                      clearMessages();
                    }}
                    onMinuteChange={(value) => {
                      setStartWorkMinute(value);
                      updateStartWork(
                        startWorkHour,
                        value,
                        startWorkPeriod
                      );
                      clearMessages();
                    }}
                    onPeriodChange={handleStartWorkPeriodChange}
                    onKeyDown={handleKeyDown}
                    disabled={saving}
                  />
                </div>

                <div>
                  <label
                    htmlFor="endWork-hour"
                    className="mb-2 block text-sm font-semibold text-theme-text"
                  >
                    End Work
                  </label>
                  <TimeInput
                    id="endWork"
                    hour={endWorkHour}
                    minute={endWorkMinute}
                    period={endWorkPeriod}
                    onHourChange={(value) => {
                      setEndWorkHour(value);
                      updateEndWork(
                        value,
                        endWorkMinute,
                        endWorkPeriod
                      );
                      clearMessages();
                    }}
                    onMinuteChange={(value) => {
                      setEndWorkMinute(value);
                      updateEndWork(
                        endWorkHour,
                        value,
                        endWorkPeriod
                      );
                      clearMessages();
                    }}
                    onPeriodChange={handleEndWorkPeriodChange}
                    onKeyDown={handleKeyDown}
                    disabled={saving}
                  />
                </div>

                <div>
                  <label
                    htmlFor="totalWork"
                    className="mb-2 block text-sm font-semibold text-theme-text"
                  >
                    Total Work
                  </label>
                  <div className="flex h-12 items-center rounded-xl border border-theme-border bg-theme-primary-soft/40 px-4 text-sm font-semibold text-theme-text">
                    {totalWork ? `${totalWork} hrs` : "—"}
                  </div>
                  <p className="mt-2 text-xs text-theme-faint">
                    Auto-calculated
                  </p>
                </div>
              </div>
            </div>

            {/* Break timing */}
            <div className="rounded-xl border border-theme-border bg-[var(--erp-background)]/40 p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-theme-text">
                  Break Timing
                </h3>
                <p className="mt-1 text-xs text-theme-muted">
                  Start and end of the break. Total is calculated automatically.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label
                    htmlFor="startBreak-hour"
                    className="mb-2 block text-sm font-semibold text-theme-text"
                  >
                    Start Break
                  </label>
                  <TimeInput
                    id="startBreak"
                    hour={startBreakHour}
                    minute={startBreakMinute}
                    period={startBreakPeriod}
                    onHourChange={(value) => {
                      setStartBreakHour(value);
                      updateStartBreak(
                        value,
                        startBreakMinute,
                        startBreakPeriod
                      );
                      clearMessages();
                    }}
                    onMinuteChange={(value) => {
                      setStartBreakMinute(value);
                      updateStartBreak(
                        startBreakHour,
                        value,
                        startBreakPeriod
                      );
                      clearMessages();
                    }}
                    onPeriodChange={handleStartBreakPeriodChange}
                    onKeyDown={handleKeyDown}
                    disabled={saving}
                  />
                </div>

                <div>
                  <label
                    htmlFor="endBreak-hour"
                    className="mb-2 block text-sm font-semibold text-theme-text"
                  >
                    End Break
                  </label>
                  <TimeInput
                    id="endBreak"
                    hour={endBreakHour}
                    minute={endBreakMinute}
                    period={endBreakPeriod}
                    onHourChange={(value) => {
                      setEndBreakHour(value);
                      updateEndBreak(
                        value,
                        endBreakMinute,
                        endBreakPeriod
                      );
                      clearMessages();
                    }}
                    onMinuteChange={(value) => {
                      setEndBreakMinute(value);
                      updateEndBreak(
                        endBreakHour,
                        value,
                        endBreakPeriod
                      );
                      clearMessages();
                    }}
                    onPeriodChange={handleEndBreakPeriodChange}
                    onKeyDown={handleKeyDown}
                    disabled={saving}
                  />
                </div>

                <div>
                  <label
                    htmlFor="totalBreak"
                    className="mb-2 block text-sm font-semibold text-theme-text"
                  >
                    Total Break
                  </label>
                  <div className="flex h-12 items-center rounded-xl border border-theme-border bg-theme-primary-soft/40 px-4 text-sm font-semibold text-theme-text">
                    {totalBreak ? `${totalBreak} hrs` : "—"}
                  </div>
                  <p className="mt-2 text-xs text-theme-faint">
                    Auto-calculated
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-theme-danger/30 bg-theme-danger-soft px-4 py-3 text-sm text-theme-danger">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 border-t border-theme-border pt-6">
              <button
                type="button"
                onClick={handleSave}
                disabled={
                  saving ||
                  (editingId === null && !isAllowed("add")) ||
                  (editingId !== null && !isAllowed("edit"))
                }
                className="inline-flex h-11 items-center justify-center rounded-xl bg-theme-primary px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving…"
                  : editingId !== null
                    ? "Update Shift Timing"
                    : "Save Shift Timing"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    clearMessages();
                  }}
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-theme-border bg-card px-5 text-sm font-semibold text-theme-text transition-all duration-200 hover:bg-theme-primary-soft/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* List card */}
      <div className="overflow-hidden rounded-2xl border border-theme-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-theme-border px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-theme-text">
              Saved Shift Timings
            </h2>
            <p className="mt-1 text-sm text-theme-muted">
              Shift schedules currently available in the system.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAllowed("export") && (
              <button
                type="button"
                onClick={handleExport}
                disabled={
                  loading ||
                  exporting ||
                  printing ||
                  shiftTimings.length === 0
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download size={16} />
                {exporting ? "Exporting…" : "Export"}
              </button>
            )}

            {isAllowed("print") && (
              <button
                type="button"
                onClick={handlePrint}
                disabled={
                  loading ||
                  exporting ||
                  printing ||
                  shiftTimings.length === 0
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Printer size={16} />
                {printing ? "Preparing…" : "Print"}
              </button>
            )}

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-theme-primary-soft text-theme-primary">
              <Clock3 size={21} />
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-theme-muted">
              Loading shift timings…
            </p>
          </div>
        )}

        {!loading && shiftTimings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-theme-primary-soft text-theme-primary">
              <Clock3 size={26} />
            </div>
            <p className="mt-4 font-medium text-theme-text">
              No shift timings found
            </p>
            <p className="mt-1 text-sm text-theme-faint">
              Add a shift timing to get started.
            </p>
          </div>
        )}

        {!loading && shiftTimings.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-theme-border bg-[var(--erp-background)]">
                  <th className="w-20 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-muted">
                    ID
                  </th>
                  <th className="min-w-[140px] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-muted">
                    Shift
                  </th>
                  <th className="min-w-[160px] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-muted">
                    Work
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-muted">
                    Total Work
                  </th>
                  <th className="min-w-[160px] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-muted">
                    Break
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-theme-muted">
                    Total Break
                  </th>
                  {(isAllowed("edit") || isAllowed("delete")) && (
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-theme-muted">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border">
                {shiftTimings.map((item) => {
                  const sw = parse24HourTime(item.StartWork);
                  const ew = parse24HourTime(item.EndWork);
                  const sb = parse24HourTime(item.StartBreak);
                  const eb = parse24HourTime(item.EndBreak);

                  const fmt = (p) =>
                    p.hour
                      ? `${p.hour}:${p.minute} ${p.period}`
                      : "—";

                  return (
                    <tr
                      key={item.pkSTId}
                      className="transition-colors hover:bg-theme-primary-soft/40"
                    >
                      <td className="px-6 py-4 text-sm text-theme-muted">
                        {item.pkSTId}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-theme-text">
                        {item.Shift}
                      </td>
                      <td className="px-6 py-4 text-sm text-theme-text">
                        <span className="whitespace-nowrap">
                          {fmt(sw)}
                          <span className="mx-1.5 text-theme-faint">→</span>
                          {fmt(ew)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-theme-text">
                        {item.TotalWork != null
                          ? `${item.TotalWork} hrs`
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-theme-text">
                        <span className="whitespace-nowrap">
                          {fmt(sb)}
                          <span className="mx-1.5 text-theme-faint">→</span>
                          {fmt(eb)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-theme-text">
                        {item.TotalBreak != null
                          ? `${item.TotalBreak} hrs`
                          : "—"}
                      </td>
                      {(isAllowed("edit") || isAllowed("delete")) && (
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {isAllowed("edit") && (
                              <button
                                type="button"
                                onClick={() => handleEdit(item)}
                                disabled={
                                  saving || deletingId !== null
                                }
                                title="Edit"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-theme-muted transition-colors hover:bg-theme-primary-soft hover:text-theme-primary disabled:opacity-50"
                              >
                                <Pencil size={16} />
                              </button>
                            )}
                            {isAllowed("delete") && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(item.pkSTId)
                                }
                                disabled={
                                  saving ||
                                  deletingId === item.pkSTId
                                }
                                title="Delete"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-theme-muted transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
