import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  UserRound,
  Wallet,
  Clock3,
  CalendarRange,
  Timer,
  ShieldCheck,
  Landmark,
  StickyNote,
  CalendarDays,
  Save,
  ArrowLeft,
  Trash2,
  Search,
  Plus,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  RotateCcw,
  RefreshCw,
  Printer,
  Download,
  HelpCircle,
  DoorOpen,
  PencilLine,
  ListChecks,
  ClipboardList,
  Percent,
  MapPin,
  X,
  AlertCircle,
} from "lucide-react";

import { Can } from "../../components/Permissions";


// ==================================================
// API
//
// Salary Structure uses the real API endpoints and the same
// generic lookup pattern used by SalaryEmployeeMaster.
// DB-backed fields load all suggestions on focus and filter locally.
// ==================================================

const API_BASE_URL =
  "http://127.0.0.1:8000/api";


// ==================================================
// FIELD TYPE MAPS
// Used to coerce formData -> JSON types on save.
// ==================================================

const NUMERIC_FIELDS = [
  "pkSalStructureId",
  "fkEmpId",
  "PaidHoliday",
  "BufferLateEarlyMinutes",
  "BufferDaysAllowedPerMonth",
  "BreakDuringOvertimeMinutes",
  "fkReportTo1EmpId",
  "fkReportTo2EmpId",
  // SlabTDS / LTimeROff are Integer columns in model.py, not text --
  // the legacy form stores ddITType.SelectedValue and
  // Convert.ToDecimal(ddLeaving.Text), both numeric. These used to sit
  // in the string bucket, which sent whatever the API had loaded them
  // as straight back on save; an integer value round-tripped fine, but
  // the render mismatch below is why they need to move here too.
  "IncomeTaxSlab",
  "LeavingTimeRounding",
];

const FLOAT_FIELDS = [
  "Basic",
  "DailySalary",
  "Allowance",
  "TravelAllowance",
  "HousingAllowance",
  "DearnessAllowance",
  "Incentive",
  "EducationAllowance",
  "MedicalAllowance",
  "OtherAllowance",
  "GrossSalary",
  "OvertimeI",
  "OvertimeII",
  "LastYearExtraWorkingHour",
  "NoticeRetentionAmount",
  "SickLeave",
  "PaidCasualLeave",
  "UnpaidCasualLeave",
  "WorkingHoursPerDay",
  "ConsiderHoursPerRestDay",
  "PenaltyPerAbsentDay",
  "Latitude",
  "Longitude",
  "TDSDeductionPercent",
  "MonthlyDeduction",
];

const BOOLEAN_FIELDS = [
  "RestDay1Variant",
  "AdjustmentExtraWorkingHour",
  "WorkingHoursVariant",
  "ExcludeRestDayFromOT",
  "CalcProfessionalTax",
  "CalcProvidentFund",
  "CalcProvidentFundAsPerSetting",
  "CalcESIC",
  "CalcTDS",
  "SandwichRuleForLeaves",
  "SwipingScanningForMealBreak",

  // Additional Allowance dialog — Overtime Calculation group
  "OTIncludeAllowance",
  "OTIncludeTravelAllowance",
  "OTIncludeHousingAllowance",
  "OTIncludeDearnessAllowance",
  "OTIncludeIncentive",
  "OTIncludeEducationAllowance",
  "OTIncludeMedicalAllowance",
  "OTIncludeOtherAllowance",

  // Additional Allowance dialog — Provident Fund Calculation group
  "PFIncludeAllowance",
  "PFIncludeTravelAllowance",
  "PFIncludeHousingAllowance",
  "PFIncludeIncentive",
  "PFIncludeEducationAllowance",
  "PFIncludeMedicalAllowance",
  "PFIncludeOtherAllowance",

  // Additional Allowance dialog — other rules
  "GovtHolidaysPartOfAllowances",
  "RestDaysPartOfAllowances",
  "IncentiveOnlyIfOvertimeFulfilled",
  "OtherOnlyIfOvertimePerformed",
];

const DATE_FIELDS = ["SalaryStart", "SalaryEnd"];

const WEEKDAY_OPTIONS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Attendance Rules is now a real lookup master (table
// "attendance-rules", backed by SalAttendanceRules) via
// LookupComboField below, same as Accounts/Designation — see the
// "Employee & Period" section. Income Tax Slab is still a static
// placeholder list — the legacy screen implies a real lookup master
// for it too, but that one doesn't exist in this app yet.
// ddITType has FIVE items (UiComboBoxItem18-22) and the legacy form
// stores ddITType.SelectedValue directly into SlabTDS, an Integer
// column -- so this is a small numeric code, not descriptive text.
// The actual code/label pairs live in the form's .resx, which isn't
// in the uploaded source, so these five codes and labels are a
// placeholder shape (right count, right type) rather than confirmed
// values -- confirm against `SELECT DISTINCT SlabTDS FROM SalStructure`
// or the .resx before this goes live.
const INCOME_TAX_SLAB_OPTIONS = [
  { value: 1, label: "Slab 1" },
  { value: 2, label: "Slab 2" },
  { value: 3, label: "Slab 3" },
  { value: 4, label: "Slab 4" },
  { value: 5, label: "Slab 5" },
];

// The legacy ddAllowance / ddTAllowance / ... comboboxes carry exactly
// these five entries plus a blank. CalGrossSalary in frmSalStructure
// switches on the DISPLAY TEXT below, so the `calc` key is what drives
// the maths and must not be renamed.
//
// `value` is what lands in the TAllowance / TTravelling / ... columns
// (String(5) in model.py), so every code here is <= 5 chars. The legacy
// form stores ddAllowance.SelectedValue, whose codes live in the form's
// .resx and are NOT in the uploaded source — CONFIRM these against
// `SELECT DISTINCT TAllowance FROM SalStructure` before going live, or
// existing rows will read back with a blank type.
//
// There is no "% of Basic" type in the legacy form. It was never an
// option; the old "Perc" value here had no counterpart in CalGrossSalary.
const ALLOWANCE_TYPE_OPTIONS = [
  { value: "Fixed", calc: "Fixed", label: "Fixed" },
  { value: "Hrly", calc: "Hourly", label: "Hourly" },
  { value: "Daily", calc: "Daily", label: "Daily" },
  { value: "NPD", calc: "No. of Present Days", label: "No. of Present Days" },
  { value: "Frmla", calc: "As per formula", label: "As per formula" },
];

const ALLOWANCE_TYPE_CALC = ALLOWANCE_TYPE_OPTIONS.reduce(
  (map, option) => {
    map[option.value] = option.calc;
    return map;
  },
  {}
);

// ddST — two items only. Monthly is the designer default.
const BASIC_TYPE_OPTIONS = ["Monthly", "Hourly"];

// ddOTCI / ddOTCII. Forced to "/hrs" whenever Basic is hourly.
const OVERTIME_TYPE_OPTIONS = ["/hrs", "As per formula"];

// ddRule. Rules V–X are rejected by ddRule_SelectedValueChanged with
// "Attendance Rule X is not configured in the system." and the previous
// value is restored.
const UNCONFIGURED_ATTENDANCE_RULES = [
  "Rule V",
  "Rule VI",
  "Rule VII",
  "Rule VIII",
  "Rule IX",
  "Rule X",
];

// Hard caps taken one-for-one from the legacy *_Validating handlers.
const LEGACY_LIMITS = {
  SickLeave: { max: 60, label: "Sick Leave", message: "Sick Leave should not exceed 60." },
  PaidHoliday: { max: 50, label: "Paid Holiday", message: "Paid Holiday should not exceed 50." },
  PaidCasualLeave: { max: 50, label: "Paid Casual Leave", message: "Paid Casual Leave should not exceed 50." },
  UnpaidCasualLeave: { max: 50, label: "Unpaid Casual Leave", message: "Unpaid Casual Leave should not exceed 50." },
  WorkingHoursPerDay: { max: 12, label: "Working Hours", message: "Working Hours shouldn’t exceed 12 hrs a day." },
  ConsiderHoursPerRestDay: { max: 12, label: "Working Hours for Rest Day", message: "Working Hours for Rest Day shouldn’t exceed 12 hrs a day." },
  BreakDuringOvertimeMinutes: { max: 120, label: "Break during Overtime", message: "Break during Overtime shouldn’t exceed 120 min." },
  LastYearExtraWorkingHour: { max: 1000, label: "Last Year (Extra Working Hour)", message: "Last Year (Extra Working Hour) should be less than 1000 hours." },
};

// Legacy blurs every one of these back to a concrete value rather than
// leaving it blank ("" -> "0", working hours "" -> "8").
const BLANK_COERCIONS = {
  PaidHoliday: "0",
  SickLeave: "0",
  PaidCasualLeave: "0",
  UnpaidCasualLeave: "0",
  ConsiderHoursPerRestDay: "0",
  BreakDuringOvertimeMinutes: "0",
  LastYearExtraWorkingHour: "0",
  PenaltyPerAbsentDay: "0",
  TDSDeductionPercent: "0",
  MonthlyDeduction: "0",
  WorkingHoursPerDay: "8",
};

// Drives the two big checkbox groups in the "Additional Allowance"
// dialog. Overtime group has one row per allowance (8); Provident
// Fund group skips Dearness Allowance since it's already part of the
// PF baseline ("...Basic Salary and Dearness Allowance...") rather
// than a togglable component of it.
const OVERTIME_INCLUDE_FIELDS = [
  { key: "OTIncludeAllowance", label: "Allowance" },
  { key: "OTIncludeTravelAllowance", label: "Travelling Allowance" },
  { key: "OTIncludeHousingAllowance", label: "Housing Allowance" },
  { key: "OTIncludeDearnessAllowance", label: "Dearness Allowance" },
  { key: "OTIncludeIncentive", label: "Incentive" },
  { key: "OTIncludeEducationAllowance", label: "Education Allowance" },
  { key: "OTIncludeMedicalAllowance", label: "Medical Allowance" },
  { key: "OTIncludeOtherAllowance", label: "Other" },
];

const PF_INCLUDE_FIELDS = [
  { key: "PFIncludeAllowance", label: "Allowance" },
  { key: "PFIncludeTravelAllowance", label: "Travelling Allowance" },
  { key: "PFIncludeHousingAllowance", label: "Housing Allowance" },
  { key: "PFIncludeIncentive", label: "Incentive" },
  { key: "PFIncludeEducationAllowance", label: "Education Allowance" },
  { key: "PFIncludeMedicalAllowance", label: "Medical Allowance" },
  { key: "PFIncludeOtherAllowance", label: "Other" },
];

// ddLeaving has FIVE items (UiComboBoxItem86-90) and SaveRecords does
// `Rs.Save.Fields("LTimeROff").Value = Convert.ToDecimal(ddLeaving.Text)`
// -- LTimeROff is Integer in model.py, so ddLeaving.Text is itself a
// number (almost certainly minutes), not a rounding-rule description.
// The five actual figures aren't in the uploaded source (same .resx
// gap as the income-tax slab above) -- these five are a reasonable
// guess at typical rounding minutes, not confirmed values.
const LEAVING_TIME_ROUNDING_OPTIONS = [
  { value: 0, label: "No Rounding" },
  { value: 5, label: "Nearest 5 Minutes" },
  { value: 10, label: "Nearest 10 Minutes" },
  { value: 15, label: "Nearest 15 Minutes" },
  { value: 30, label: "Nearest 30 Minutes" },
];

// Drives the repeated "amount + type" allowance rows so the eight
// near-identical fields in the legacy form don't need eight
// hand-written blocks. Each entry maps to formData[key] /
// formData[key + "Type"].
const ALLOWANCE_FIELDS = [
  { key: "Allowance", label: "Allowance" },
  { key: "TravelAllowance", label: "Travelling Allowance" },
  { key: "HousingAllowance", label: "Housing Allowance" },
  { key: "DearnessAllowance", label: "Dearness Allowance" },
  { key: "Incentive", label: "Incentive" },
  { key: "EducationAllowance", label: "Education Allowance" },
  { key: "MedicalAllowance", label: "Medical Allowance" },
  { key: "OtherAllowance", label: "Other" },
];


// ==================================================
// CHILD GRID — PAID HOLIDAYS
// Maps to the "Paid Holiday / Holiday Date" grid on the top-right
// of the legacy window — a per-structure list of specific dated
// holidays, separate from the numeric "Paid Holiday ... /during
// period" entitlement field.
// ==================================================

// (The legacy form has no "add a holiday" affordance at all — holidays
// come from the SalHolidays master and are only ticked here.)


// ==================================================
// EMPTY FORM
// ==================================================

const EMPTY_FORM = {
  pkSalStructureId: "",
  fkEmpId: "",

  SalaryStart: "",
  SalaryEnd: "",

  Basic: "",
  BasicType: "Monthly",
  DailySalary: "",
  GrossSalary: "",

  // Legacy leaves every allowance TYPE blank until an amount > 0 is
  // entered, at which point *_Validating fills in "Fixed". Defaulting
  // them to "Fixed" up front is what made every new structure save a
  // type against a blank amount.
  Allowance: "",
  AllowanceType: "",
  TravelAllowance: "",
  TravelAllowanceType: "",
  HousingAllowance: "",
  HousingAllowanceType: "",
  DearnessAllowance: "",
  DearnessAllowanceType: "",
  Incentive: "",
  IncentiveType: "",
  EducationAllowance: "",
  EducationAllowanceType: "",
  MedicalAllowance: "",
  MedicalAllowanceType: "",
  OtherAllowance: "",
  OtherAllowanceType: "",

  OvertimeI: "",
  OvertimeIType: "/hrs",
  OvertimeII: "",
  OvertimeIIType: "/hrs",

  RestDay1: "Sunday",
  RestDay1Variant: false,
  RestDay2: "",

  AdjustmentExtraWorkingHour: false,
  LastYearExtraWorkingHour: 0,

  NoticeRetentionAmount: "",
  SuppliedTo: "",
  ManpowerAgency: "",

  PaidHoliday: 0,
  SickLeave: 0,
  PaidCasualLeave: 0,
  UnpaidCasualLeave: 0,

  WorkingHoursPerDay: 8,
  WorkingHoursVariant: false,
  ConsiderHoursPerRestDay: 8,
  ExcludeRestDayFromOT: false,

  // EmptyFields: ncLT = "15", ncLTD = "5", ncOTB = "0", ncPenalty = "0".
  BufferLateEarlyMinutes: 15,
  BufferDaysAllowedPerMonth: 5,
  BreakDuringOvertimeMinutes: 0,
  PenaltyPerAbsentDay: 0,

  CalcProfessionalTax: false,
  CalcProvidentFund: false,
  CalcProvidentFundAsPerSetting: false,
  CalcESIC: false,
  CalcTDS: false,
  IncomeTaxSlab: "",

  AttendanceRules: "",

  fkSalAcctId: "",
  fkLoanAcctId: "",
  fkNoticeAcctId: "",
  fkIncentiveAcctId: "",

  Remarks: "",

  SandwichRuleForLeaves: true,
  SwipingScanningForMealBreak: true,

  fkReportTo1EmpId: "",
  fkReportTo2EmpId: "",

  // Additional Allowance dialog
  OTIncludeAllowance: false,
  OTIncludeTravelAllowance: false,
  OTIncludeHousingAllowance: false,
  OTIncludeDearnessAllowance: false,
  OTIncludeIncentive: false,
  OTIncludeEducationAllowance: false,
  OTIncludeMedicalAllowance: false,
  OTIncludeOtherAllowance: false,

  PFIncludeAllowance: false,
  PFIncludeTravelAllowance: false,
  PFIncludeHousingAllowance: false,
  PFIncludeIncentive: false,
  PFIncludeEducationAllowance: false,
  PFIncludeMedicalAllowance: false,
  PFIncludeOtherAllowance: false,

  GovtHolidaysPartOfAllowances: false,
  RestDaysPartOfAllowances: false,
  IncentiveOnlyIfOvertimeFulfilled: false,
  OtherOnlyIfOvertimePerformed: false,

  LeavingTimeRounding: "",
  Latitude: 0,
  Longitude: 0,

  fkAllowanceDesId: "",
  TDSDeductionPercent: 0,
  MonthlyDeduction: 0,
  DeductionDescription: "",
};


// ==================================================
// GROSS SALARY — PORT OF CalGrossSalary()
// ==================================================
// Straight transliteration of frmSalStructure.CalGrossSalary. Every
// branch, every constant and every order of operations is the legacy
// one; the only change is reading from formData instead of the Janus
// controls.
//
// Notes carried over verbatim from the original:
//   * a component only contributes when BOTH its amount and its type
//     are non-blank AND the amount is > 0
//   * the 365 / (365 - 52) / 12 factors are literal in the original —
//     they are not derived from the real month length
//   * ConsiderHoursPerRestDay (ncWRD) > 0 is the switch between the
//     "with rest days" and "without rest days" factor on every row
// ==================================================

const num = (value) => {
  if (value === "" || value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const isFilled = (value) =>
  value !== "" && value !== null && value !== undefined;

function calcGrossSalary(data) {

  let gross = 0;

  const wh = num(data.WorkingHoursPerDay);
  const wrd = num(data.ConsiderHoursPerRestDay);

  // --- Basic (ncBasic / ddST / ncDaily) ---
  if (isFilled(data.Basic) && isFilled(data.BasicType)) {

    const basic = num(data.Basic);

    if (basic > 0) {

      if (data.BasicType === "Hourly") {

        if (isFilled(data.DailySalary)) {
          gross = wrd > 0
            ? (num(data.DailySalary) * 365) / 12
            : (num(data.DailySalary) * (365 - 52)) / 12;
        } else if (wrd > 0) {
          gross = basic * wh * (365 / 12);
        } else {
          gross = basic * wh * ((365 - 52) / 12);
        }

      } else if (data.BasicType === "Monthly") {
        gross = basic;
      }

    }

  }

  // --- The eight allowance rows, all identical in the original ---
  for (const field of ALLOWANCE_FIELDS) {

    const amountRaw = data[field.key];
    const typeCode = data[`${field.key}Type`];

    if (!isFilled(amountRaw) || !isFilled(typeCode)) continue;

    const amount = num(amountRaw);
    if (amount <= 0) continue;

    switch (ALLOWANCE_TYPE_CALC[typeCode]) {

      case "Fixed":
      case "No. of Present Days":
      case "As per formula":
        gross += amount;
        break;

      case "Hourly":
        gross += amount * wh * ((365 - 52) / 12);
        if (wrd > 0) {
          gross += amount * wrd * (52 / 12);
        }
        break;

      case "Daily":
        gross += wrd > 0
          ? amount * (365 / 12)
          : amount * ((365 - 52) / 12);
        break;

      default:
        break;

    }

  }

  return gross;

}

// Fields that make the legacy form re-run CalGrossSalary() on validate.
const GROSS_INPUT_FIELDS = new Set([
  "Basic",
  "BasicType",
  "DailySalary",
  "WorkingHoursPerDay",
  "ConsiderHoursPerRestDay",
  ...ALLOWANCE_FIELDS.map((field) => field.key),
  ...ALLOWANCE_FIELDS.map((field) => `${field.key}Type`),
]);


// ==================================================
// VALIDATION ERROR POPUP
// ==================================================
// Every setError() call in this form -- legacy validation, interlock
// messages (duplicate rest day, an unconfigured attendance rule),
// blur-cap violations, and save/load/delete failures -- funnels into
// this one dialog instead of a banner that can sit off-screen on a
// long form. Styled to match the Add Account / delete-confirm dialogs
// already used elsewhere in this app.
function ValidationErrorModal({ message, onClose }) {

  if (!message) return null;

  return (

    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4"
      onMouseDown={onClose}
    >

      <div
        className="w-full max-w-md rounded-2xl border border-theme-border bg-card p-6 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertCircle size={20} />
          </div>

          <div className="flex-1 pt-1">
            <h3 className="text-base font-semibold text-theme-text">
              Can’t Save
            </h3>
            <p className="mt-1 text-sm text-theme-muted">{message}</p>
          </div>

        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="h-10 rounded-xl bg-theme-primary px-5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            OK
          </button>
        </div>

      </div>

    </div>

  );

}


// ==================================================
// API ERROR FORMATTING
// FastAPI's 422 body is {"detail": [{loc, msg, type}, ...]} — an
// array of objects, not a string. new Error(data.detail) on that
// stringifies to "[object Object],[object Object],...". This turns
// it into one readable line per field instead.
// ==================================================

function formatApiError(data, fallback) {

  const detail = data?.detail;

  if (!detail) return fallback;

  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {

    return detail
      .map((item) => {

        if (typeof item === "string") return item;

        const field = Array.isArray(item?.loc)
          ? item.loc[item.loc.length - 1]
          : null;

        return field ? `${field}: ${item.msg}` : item?.msg;

      })
      .filter(Boolean)
      .join("; ");

  }

  return fallback;

}


// ==================================================
// SALARY STRUCTURE MASTER
// ==================================================

export default function SalaryStructureMaster() {

  const navigate = useNavigate();
  const { id: routeStructureId } = useParams();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [mode, setMode] = useState("create");
  const [lookupId, setLookupId] = useState("");

  // Paid holidays are NOT free entry. The legacy grid (grPH) is fed by
  // FillHolidays(), which lists rows from the SalHolidays master falling
  // between Salary Start and Salary End and lets the user tick which of
  // them this structure pays. Dates are never typed in here.
  const [holidays, setHolidays] = useState([]);
  const [holidaysLoading, setHolidaysLoading] = useState(false);
  const [holidaysUnavailable, setHolidaysUnavailable] = useState(false);
  const [selectedHolidayIds, setSelectedHolidayIds] = useState(new Set());

  const [structureIds, setStructureIds] = useState([]);
  const [structureIdsLoading, setStructureIdsLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const [showAdditionalAllowance, setShowAdditionalAllowance] = useState(false);


  // ==================================================
  // AUTH HEADERS
  // ==================================================

  const getAuthHeaders = () => {

    const token = localStorage.getItem("access_token");

    if (!token) {
      throw new Error("Authentication token not found.");
    }

    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

  };


  // ==================================================
  // RECORD NAVIGATION (First / Prior / Next / Last)
  // Same pattern as SalaryEmployeeMaster — loaded once, reused for
  // the session, refreshed by the toolbar's Refresh button.
  // ==================================================

  const fetchStructureIds = async () => {

    setStructureIdsLoading(true);

    try {

      const response = await fetch(
        `${API_BASE_URL}/salary-structures`,
        { headers: getAuthHeaders() }
      );

      if (!response.ok) return;

      const data = await response.json();

      const ids = (data.structures || data || [])
        .map((row) => Number(row.pkSalStructureId))
        .filter((value) => !Number.isNaN(value))
        .sort((a, b) => a - b);

      setStructureIds(ids);

    } catch {

      // Non-fatal — the app already runs without this endpoint;
      // navigation buttons just stay disabled until it exists.

    } finally {

      setStructureIdsLoading(false);

    }

  };

  useEffect(() => {

    fetchStructureIds();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentRecordIndex = structureIds.indexOf(
    Number(formData.pkSalStructureId)
  );

  const goToStructure = (id) => {

    if (id === undefined || id === null) return;

    navigate(`/salary-structure/${id}`);

  };

  const goFirst = () => goToStructure(structureIds[0]);

  const goPrior = () =>
    goToStructure(
      currentRecordIndex > 0
        ? structureIds[currentRecordIndex - 1]
        : structureIds[0]
    );

  const goNext = () =>
    goToStructure(
      currentRecordIndex >= 0 &&
        currentRecordIndex < structureIds.length - 1
        ? structureIds[currentRecordIndex + 1]
        : structureIds[structureIds.length - 1]
    );

  const goLast = () =>
    goToStructure(structureIds[structureIds.length - 1]);

  const isAtFirst =
    structureIds.length === 0 || currentRecordIndex <= 0;

  const isAtLast =
    structureIds.length === 0 ||
    currentRecordIndex === -1 ||
    currentRecordIndex >= structureIds.length - 1;


  // ==================================================
  // NEW / LOAD / DELETE
  // ==================================================

  const handleNew = () => {

    setFormData(EMPTY_FORM);
    setMode("create");
    setLookupId("");
    setHolidays([]);
    setSelectedHolidayIds(new Set());
    setHolidaysUnavailable(false);
    setError("");
    setSuccess("");
    setValidationErrors({});

    if (routeStructureId) {
      navigate("/salary-structure");
    }

  };

  const loadStructure = async (structureId) => {

    if (!structureId) {
      setError("Enter a Salary Structure ID to load.");
      return;
    }

    setError("");
    setSuccess("");
    setLookupLoading(true);

    try {

      const response = await fetch(
        `${API_BASE_URL}/salary-structures/${structureId}`,
        { headers: getAuthHeaders() }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(formatApiError(data, "Salary structure not found."));
      }

      const structure = data.structure;
      const nextForm = { ...EMPTY_FORM };

      for (const key of Object.keys(EMPTY_FORM)) {

        if (DATE_FIELDS.includes(key)) {
          nextForm[key] = structure[key]
            ? String(structure[key]).slice(0, 10)
            : "";
          continue;
        }

        if (BOOLEAN_FIELDS.includes(key)) {
          nextForm[key] = Boolean(structure[key]);
          continue;
        }

        // Stringify everything else. React inputs/selects are all
        // controlled with string state here regardless of the field's
        // real type -- buildPayload does the parseInt/parseFloat/bool
        // coercion on the way back out. This is what IncomeTaxSlab and
        // LeavingTimeRounding needed: both are Integer columns, and the
        // API returns them as numbers, which a <select> can't match
        // against its (string) option values -- the field would look
        // blank while formData quietly still held the number, and
        // saving without touching it would send that number straight
        // into a field the schema was declared as text, failing
        // validation. Coercing everything to a string here closes that
        // class of bug for any field, not just these two.
        nextForm[key] =
          structure[key] === null || structure[key] === undefined
            ? ""
            : String(structure[key]);

      }

      setFormData(nextForm);
      setValidationErrors({});
      setTouchedFields({});
      setMode("edit");
      setLookupId(String(structureId));

      // Which master holidays this structure has ticked. The grid itself
      // is rebuilt from the master by the FillHolidays effect below; this
      // only records the selection.
      setSelectedHolidayIds(
        new Set(
          (structure.paid_holidays || [])
            .map((row) => String(row.pkSHId ?? row.fkSHId ?? ""))
            .filter(Boolean)
        )
      );

    } catch (err) {

      setError(err.message || "Failed to load salary structure.");

    } finally {

      setLookupLoading(false);

    }

  };

  useEffect(() => {

    if (routeStructureId) {
      loadStructure(routeStructureId);
    } else {
      handleNew();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeStructureId]);

  const handleLoad = () => {

    if (!lookupId) return;

    navigate(`/salary-structure/${lookupId}`);

  };

  const handleDelete = async () => {

    if (mode !== "edit" || !formData.pkSalStructureId) return;

    if (
      !window.confirm(
        `Delete salary structure #${formData.pkSalStructureId}? This cannot be undone.`
      )
    ) {
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {

      const response = await fetch(
        `${API_BASE_URL}/salary-structures/${formData.pkSalStructureId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {

        const data = await response.json().catch(() => ({}));

        throw new Error(
          formatApiError(data, "Failed to delete salary structure.")
        );

      }

      setSuccess("Salary structure deleted.");
      fetchStructureIds();
      handleNew();

    } catch (err) {

      setError(err.message || "Failed to delete salary structure.");

    } finally {

      setLoading(false);

    }

  };


  // ==================================================
  // VALIDATION
  // ==================================================

  const validateForm = (data = formData, holidayRows = holidays) => {

    const errors = {};

    const required = (field, message) => {
      if (data[field] === null || data[field] === undefined || String(data[field]).trim() === "") {
        errors[field] = message;
      }
    };

    const numberValue = (field) => {
      const raw = data[field];
      if (raw === "" || raw === null || raw === undefined) return null;
      const value = Number(raw);
      return Number.isFinite(value) ? value : NaN;
    };

    const nonNegative = (field, label) => {
      const value = numberValue(field);
      if (value !== null && (!Number.isFinite(value) || value < 0)) {
        errors[field] = `${label} must be a valid number greater than or equal to 0.`;
      }
    };

    const positive = (field, label) => {
      const value = numberValue(field);
      if (value !== null && (!Number.isFinite(value) || value <= 0)) {
        errors[field] = `${label} must be greater than 0.`;
      }
    };

    // ==================================================
    // ValidateFields() — legacy order and wording
    // ==================================================
    // frmSalStructure.ValidateFields runs these checks strictly in
    // sequence and stops at the first failure. The messages below are the
    // legacy strings verbatim, including the "enter\\select" phrasing.

    required("fkEmpId", "Please enter\\select Employee.");
    required("SalaryStart", "Please enter\\select Salary Start Date.");
    required("Basic", "Please enter Basic Salary.");

    // Each overtime / provident-fund inclusion flag requires the
    // allowance it refers to actually to have a value.
    const INCLUSION_REQUIREMENTS = [
      ["OTIncludeAllowance", "Allowance", "Please enter Allowance."],
      ["PFIncludeAllowance", "Allowance", "Please enter Allowance."],
      ["OTIncludeTravelAllowance", "TravelAllowance", "Please enter Travelling Allowance."],
      ["PFIncludeTravelAllowance", "TravelAllowance", "Please enter Travelling Allowance."],
      ["OTIncludeHousingAllowance", "HousingAllowance", "Please enter Housing Allowance."],
      ["PFIncludeHousingAllowance", "HousingAllowance", "Please enter Housing Allowance."],
      ["OTIncludeDearnessAllowance", "DearnessAllowance", "Please enter Dearness Allowance."],
      ["OTIncludeIncentive", "Incentive", "Please enter Incentive."],
      ["PFIncludeIncentive", "Incentive", "Please enter Incentive."],
      ["OTIncludeEducationAllowance", "EducationAllowance", "Please enter Education Allowance."],
      ["PFIncludeEducationAllowance", "EducationAllowance", "Please enter Education Allowance."],
      ["OTIncludeMedicalAllowance", "MedicalAllowance", "Please enter Medical Allowance."],
      ["PFIncludeMedicalAllowance", "MedicalAllowance", "Please enter Medical Allowance."],
      ["OTIncludeOtherAllowance", "OtherAllowance", "Please enter Other Allowance."],
      ["PFIncludeOtherAllowance", "OtherAllowance", "Please enter Other Allowance."],
    ];

    for (const [flag, amountField, message] of INCLUSION_REQUIREMENTS) {
      if (data[flag] && !isFilled(data[amountField])) {
        errors[amountField] = message;
      }
    }

    // Gross must be present AND non-zero.
    if (!isFilled(data.GrossSalary) || num(data.GrossSalary) === 0) {
      errors.GrossSalary = "Please enter Gross Salary.";
    }

    // A notice retention ACCOUNT demands an amount...
    if (isFilled(data.fkNoticeAcctId)) {
      if (!isFilled(data.NoticeRetentionAmount) || num(data.NoticeRetentionAmount) === 0) {
        errors.NoticeRetentionAmount = "Please enter Notice Retention Amount.";
      }
    }

    // ...and Overtime II cannot stand on its own.
    if (isFilled(data.OvertimeII) && !isFilled(data.OvertimeI)) {
      errors.OvertimeI = "Overtime I is empty while you entered value in Overtime II.";
    }

    // TDS requires a slab.
    if (data.CalcTDS && !isFilled(data.IncomeTaxSlab)) {
      errors.IncomeTaxSlab = "Please select Income Tax Slab.";
    }

    required("SalaryEnd", "Please enter\\select Salary End Date.");
    required("fkSalAcctId", "Please enter\\select Salary Account.");
    required("fkLoanAcctId", "Please enter\\select Loan/Advance Account.");

    // ...and an amount demands an account, the mirror of the rule above.
    if (isFilled(data.NoticeRetentionAmount) && num(data.NoticeRetentionAmount) > 0) {
      if (!isFilled(data.fkNoticeAcctId)) {
        errors.fkNoticeAcctId = "Please enter\\select Notice Retention Account.";
      }
    }

    // Second reporting line cannot be filled without the first.
    if (isFilled(data.fkReportTo2EmpId) && !isFilled(data.fkReportTo1EmpId)) {
      errors.fkReportTo1EmpId =
        "Please enter\\select First Reporting To as Second Reporting To is selected.";
    }

    // Caps from the individual *_Validating handlers.
    for (const [field, limit] of Object.entries(LEGACY_LIMITS)) {
      if (isFilled(data[field]) && num(data[field]) > limit.max) {
        errors[field] = limit.message;
      }
    }

    required("AttendanceRules", "Please select Attendance Rule.");

    // Salary period: start may equal end, but can never be after end.
    if (data.SalaryStart && data.SalaryEnd) {
      const startDate = new Date(`${data.SalaryStart}T00:00:00`);
      const endDate = new Date(`${data.SalaryEnd}T00:00:00`);

      if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        errors.SalaryStart = "Enter valid salary period dates.";
        errors.SalaryEnd = "Enter valid salary period dates.";
      } else if (startDate > endDate) {
        errors.SalaryStart = "Salary Start cannot be after Salary End.";
        errors.SalaryEnd = "Salary End cannot be before Salary Start.";
      }
    }

    // Basic and all monetary/rate inputs cannot be negative.
    positive("Basic", "Basic salary");
    nonNegative("DailySalary", "Daily Salary");
    nonNegative("OvertimeI", "Overtime I");
    nonNegative("OvertimeII", "Overtime II");
    nonNegative("LastYearExtraWorkingHour", "Last Year Extra Working Hour");
    nonNegative("NoticeRetentionAmount", "Notice Retention Amount");
    nonNegative("PaidHoliday", "Paid Holiday");
    nonNegative("SickLeave", "Sick Leave");
    nonNegative("PaidCasualLeave", "Paid Casual Leave");
    nonNegative("UnpaidCasualLeave", "Unpaid Casual Leave");
    nonNegative("BufferLateEarlyMinutes", "Late/Early Buffer");
    nonNegative("BufferDaysAllowedPerMonth", "Buffer Days Allowed Per Month");
    nonNegative("BreakDuringOvertimeMinutes", "Break During Overtime");
    nonNegative("PenaltyPerAbsentDay", "Penalty Per Absent Day");
    nonNegative("TDSDeductionPercent", "TDS Deduction");
    nonNegative("MonthlyDeduction", "Monthly Deduction");

    for (const field of ALLOWANCE_FIELDS) {
      nonNegative(field.key, field.label);
    }

    // Working-hour values. 24 hours/day is the practical upper bound;
    // negative hours are never valid.
    // Legacy caps working hours at 12 a day, not 24, and rest-day hours
    // are allowed to be 0 (that is the "no rest-day working" case that
    // CalGrossSalary branches on).
    const workingHours = numberValue("WorkingHoursPerDay");
    if (workingHours === null || !Number.isFinite(workingHours) || workingHours <= 0 || workingHours > 12) {
      errors.WorkingHoursPerDay = "Working Hours shouldn’t exceed 12 hrs a day.";
    }

    const restHours = numberValue("ConsiderHoursPerRestDay");
    if (restHours !== null && (!Number.isFinite(restHours) || restHours < 0 || restHours > 12)) {
      errors.ConsiderHoursPerRestDay = "Working Hours for Rest Day shouldn’t exceed 12 hrs a day.";
    }

    // Minute buffers are whole minutes.
    for (const [field, label] of [
      ["BufferLateEarlyMinutes", "Late/Early Buffer"],
      ["BufferDaysAllowedPerMonth", "Buffer Days Allowed Per Month"],
      ["BreakDuringOvertimeMinutes", "Break During Overtime"],
    ]) {
      const value = numberValue(field);
      if (value !== null && Number.isFinite(value) && !Number.isInteger(value)) {
        errors[field] = `${label} must be a whole number.`;
      }
    }

    // TDS is a percentage.
    const tds = numberValue("TDSDeductionPercent");
    if (tds !== null && Number.isFinite(tds) && tds > 100) {
      errors.TDSDeductionPercent = "TDS Deduction cannot be greater than 100%.";
    }

    // Geographic coordinates.
    const latitude = numberValue("Latitude");
    const longitude = numberValue("Longitude");
    if (latitude !== null && Number.isFinite(latitude) && (latitude < -90 || latitude > 90)) {
      errors.Latitude = "Latitude must be between -90 and 90.";
    }
    if (longitude !== null && Number.isFinite(longitude) && (longitude < -180 || longitude > 180)) {
      errors.Longitude = "Longitude must be between -180 and 180.";
    }

    // Reporting To cannot point back to the same employee, and the two
    // reporting employees should not be identical to each other.
    if (data.fkEmpId && data.fkReportTo1EmpId && String(data.fkEmpId) === String(data.fkReportTo1EmpId)) {
      errors.fkReportTo1EmpId = "Reporting To cannot be the same as the selected Employee.";
    }
    if (data.fkEmpId && data.fkReportTo2EmpId && String(data.fkEmpId) === String(data.fkReportTo2EmpId)) {
      errors.fkReportTo2EmpId = "Reporting To cannot be the same as the selected Employee.";
    }
    if (data.fkReportTo1EmpId && data.fkReportTo2EmpId && String(data.fkReportTo1EmpId) === String(data.fkReportTo2EmpId)) {
      errors.fkReportTo2EmpId = "Reporting To 1 and Reporting To 2 must be different employees.";
    }

    // Two rest days cannot be the same when Rest Day II is supplied.
    if (data.RestDay1 && data.RestDay2 && data.RestDay1 === data.RestDay2) {
      errors.RestDay2 = "Rest Day II must be different from Rest Day I.";
    }

    // Paid-holiday child rows must be valid dates, unique, and inside the
    // salary structure period.
    const holidayDates = new Set();
    holidayRows.forEach((row, index) => {
      if (!row.HolidayDate) return;

      const date = new Date(`${row.HolidayDate}T00:00:00`);
      if (Number.isNaN(date.getTime())) {
        errors[`HolidayDate_${index}`] = `Paid Holiday row ${index + 1} has an invalid date.`;
        return;
      }

      if (data.SalaryStart && row.HolidayDate < data.SalaryStart) {
        errors[`HolidayDate_${index}`] = `Paid Holiday row ${index + 1} is before Salary Start.`;
      } else if (data.SalaryEnd && row.HolidayDate > data.SalaryEnd) {
        errors[`HolidayDate_${index}`] = `Paid Holiday row ${index + 1} is after Salary End.`;
      }

      if (holidayDates.has(row.HolidayDate)) {
        errors[`HolidayDate_${index}`] = `Paid Holiday row ${index + 1} is duplicated.`;
      }
      holidayDates.add(row.HolidayDate);
    });

    return errors;
  };

  // ==================================================
  // LIVE / FIELD-AWARE VALIDATION
  // ==================================================
  // Validation is deliberately scoped to the field being edited.
  // We do NOT run the entire form validator on every keystroke, because
  // that makes unrelated blank fields show warnings while the user is
  // still filling the form.

  const validateLiveField = (fieldName, data, holidayRows) => {

    const errors = {};

    const raw = data[fieldName];
    const isBlank = raw === null || raw === undefined || String(raw).trim() === "";
    const numberValue = (field) => {
      const value = data[field];
      if (value === "" || value === null || value === undefined) return null;
      const number = Number(value);
      return Number.isFinite(number) ? number : NaN;
    };

    const nonNegative = (field, label) => {
      const value = numberValue(field);
      if (value !== null && (!Number.isFinite(value) || value < 0)) {
        errors[field] = `${label} must be a valid number greater than or equal to 0.`;
      }
    };

    const positive = (field, label) => {
      const value = numberValue(field);
      if (value !== null && (!Number.isFinite(value) || value <= 0)) {
        errors[field] = `${label} must be greater than 0.`;
      }
    };

    const required = (field, message) => {
      if (data[field] === null || data[field] === undefined || String(data[field]).trim() === "") {
        errors[field] = message;
      }
    };

    // Required fields: warn only after that field has actually been edited.
    const requiredMessages = {
      fkEmpId: "Employee is required.",
      SalaryStart: "Salary Start is required.",
      SalaryEnd: "Salary End is required.",
      AttendanceRules: "Attendance Rules is required.",
      fkSalAcctId: "Salary Account is required.",
      fkLoanAcctId: "Loan/Advance Account is required.",
      Basic: "Basic salary is required.",
    };

    if (requiredMessages[fieldName]) {
      required(fieldName, requiredMessages[fieldName]);
    }

    // Salary dates are a dependency pair. Changing either date validates
    // only the two dates, never unrelated fields.
    if (fieldName === "SalaryStart" || fieldName === "SalaryEnd") {
      if (data.SalaryStart && data.SalaryEnd) {
        const startDate = new Date(`${data.SalaryStart}T00:00:00`);
        const endDate = new Date(`${data.SalaryEnd}T00:00:00`);

        if (Number.isNaN(startDate.getTime())) {
          errors.SalaryStart = "Enter a valid Salary Start date.";
        }
        if (Number.isNaN(endDate.getTime())) {
          errors.SalaryEnd = "Enter a valid Salary End date.";
        }

        if (!Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime()) && startDate > endDate) {
          errors.SalaryEnd = "Salary End cannot be before Salary Start.";
        }
      }
    }

    // Basic.
    if (fieldName === "Basic") {
      positive("Basic", "Basic salary");
    }

    // Individual non-negative numeric fields.
    const nonNegativeFields = {
      DailySalary: "Daily Salary",
      OvertimeI: "Overtime I",
      OvertimeII: "Overtime II",
      LastYearExtraWorkingHour: "Last Year Extra Working Hour",
      NoticeRetentionAmount: "Notice Retention Amount",
      PaidHoliday: "Paid Holiday",
      SickLeave: "Sick Leave",
      PaidCasualLeave: "Paid Casual Leave",
      UnpaidCasualLeave: "Unpaid Casual Leave",
      BufferLateEarlyMinutes: "Late/Early Buffer",
      BufferDaysAllowedPerMonth: "Buffer Days Allowed Per Month",
      BreakDuringOvertimeMinutes: "Break During Overtime",
      PenaltyPerAbsentDay: "Penalty Per Absent Day",
      TDSDeductionPercent: "TDS Deduction",
      MonthlyDeduction: "Monthly Deduction",
      Latitude: "Latitude",
      Longitude: "Longitude",
    };

    if (nonNegativeFields[fieldName]) {
      nonNegative(fieldName, nonNegativeFields[fieldName]);
    }

    // Allowances validate independently. There is no percentage type in
    // the legacy form, so the only live rule is "not negative".
    const allowance = ALLOWANCE_FIELDS.find((item) => item.key === fieldName);
    if (allowance) {
      nonNegative(fieldName, allowance.label);
    }

    if (fieldName === "WorkingHoursPerDay") {
      const value = numberValue(fieldName);
      if (value !== null && (!Number.isFinite(value) || value <= 0 || value > 24)) {
        errors.WorkingHoursPerDay = "Working Hours must be greater than 0 and no more than 24 hours.";
      }
    }

    if (fieldName === "ConsiderHoursPerRestDay") {
      const value = numberValue(fieldName);
      if (value !== null && (!Number.isFinite(value) || value <= 0 || value > 24)) {
        errors.ConsiderHoursPerRestDay = "Consider Hours must be greater than 0 and no more than 24 hours.";
      }
    }

    const wholeNumberFields = {
      BufferLateEarlyMinutes: "Late/Early Buffer",
      BufferDaysAllowedPerMonth: "Buffer Days Allowed Per Month",
      BreakDuringOvertimeMinutes: "Break During Overtime",
    };
    if (wholeNumberFields[fieldName]) {
      const value = numberValue(fieldName);
      if (value !== null && Number.isFinite(value) && !Number.isInteger(value)) {
        errors[fieldName] = `${wholeNumberFields[fieldName]} must be a whole number.`;
      }
    }

    if (fieldName === "TDSDeductionPercent") {
      const value = numberValue(fieldName);
      if (value !== null && Number.isFinite(value) && value > 100) {
        errors.TDSDeductionPercent = "TDS Deduction cannot be greater than 100%.";
      }
    }

    if (fieldName === "Latitude") {
      const value = numberValue(fieldName);
      if (value !== null && Number.isFinite(value) && (value < -90 || value > 90)) {
        errors.Latitude = "Latitude must be between -90 and 90.";
      }
    }

    if (fieldName === "Longitude") {
      const value = numberValue(fieldName);
      if (value !== null && Number.isFinite(value) && (value < -180 || value > 180)) {
        errors.Longitude = "Longitude must be between -180 and 180.";
      }
    }

    // Reporting fields form one dependency group.
    if (fieldName === "fkEmpId" || fieldName === "fkReportTo1EmpId" || fieldName === "fkReportTo2EmpId") {
      if (data.fkEmpId && data.fkReportTo1EmpId && String(data.fkEmpId) === String(data.fkReportTo1EmpId)) {
        errors.fkReportTo1EmpId = "Reporting To cannot be the same as the selected Employee.";
      }
      if (data.fkEmpId && data.fkReportTo2EmpId && String(data.fkEmpId) === String(data.fkReportTo2EmpId)) {
        errors.fkReportTo2EmpId = "Reporting To cannot be the same as the selected Employee.";
      }
      if (data.fkReportTo1EmpId && data.fkReportTo2EmpId && String(data.fkReportTo1EmpId) === String(data.fkReportTo2EmpId)) {
        errors.fkReportTo2EmpId = "Reporting To 1 and Reporting To 2 must be different employees.";
      }
    }

    // Rest days form one dependency group.
    if (fieldName === "RestDay1" || fieldName === "RestDay2") {
      if (data.RestDay1 && data.RestDay2 && data.RestDay1 === data.RestDay2) {
        errors.RestDay2 = "Rest Day II must be different from Rest Day I.";
      }
    }

    // Holiday dates are validated when a holiday is added, not while the
    // user is typing into an unrelated field.
    if (fieldName === "SalaryStart" || fieldName === "SalaryEnd") {
      holidayRows.forEach((row, index) => {
        if (!row.HolidayDate) return;
        if (data.SalaryStart && row.HolidayDate < data.SalaryStart) {
          errors[`HolidayDate_${index}`] = `Paid Holiday row ${index + 1} is before Salary Start.`;
        } else if (data.SalaryEnd && row.HolidayDate > data.SalaryEnd) {
          errors[`HolidayDate_${index}`] = `Paid Holiday row ${index + 1} is after Salary End.`;
        }
      });
    }

    return errors;
  };

  // ==================================================
  // LEGACY FIELD INTERLOCKS
  // ==================================================
  // frmSalStructure wires these through *_Validating / *_CheckedChanged
  // handlers that mutate OTHER controls. They are not validation — a
  // field genuinely changes the value of a different field — so they run
  // inside handleChange before state is committed.

  const applyLegacyInterlocks = (name, next, previous) => {

    // ddST_Validating: Monthly makes Daily Salary read-only and blank;
    // Hourly derives it as Basic x Working Hours.
    if (name === "BasicType") {
      if (next.BasicType === "Monthly") {
        next.DailySalary = "";
        next.WorkingHoursVariant = false;          // cbVariant
      } else if (num(next.Basic) > 0) {
        next.DailySalary = num(next.Basic) * num(next.WorkingHoursPerDay);
      } else {
        next.DailySalary = "";
      }
    }

    // ncBasic_Validating: same derivation when Basic changes on an
    // hourly structure. Basic <= 0 blanks itself.
    if (name === "Basic") {
      if (isFilled(next.Basic) && num(next.Basic) <= 0) {
        next.Basic = "";
      }
      if (next.BasicType !== "Monthly") {
        next.DailySalary =
          isFilled(next.Basic) && num(next.Basic) > 0
            ? num(next.Basic) * num(next.WorkingHoursPerDay)
            : "";
      }
    }

    // ncDaily_Validating: Daily is the driver in the other direction.
    if (name === "DailySalary") {
      const hours = num(next.WorkingHoursPerDay);
      next.Basic =
        isFilled(next.DailySalary) && num(next.DailySalary) > 0 && hours > 0
          ? num(next.DailySalary) / hours
          : "";
    }

    // ncWH_Validating: re-derives Basic from Daily when Daily is visible.
    if (name === "WorkingHoursPerDay") {
      const hours = num(next.WorkingHoursPerDay);
      if (next.BasicType !== "Monthly" && num(next.DailySalary) > 0 && hours > 0) {
        next.Basic = num(next.DailySalary) / hours;
      }
    }

    // nc<Allowance>_Validating / dd<Allowance>_Validating: an amount > 0
    // with no type gets "Fixed"; an amount <= 0 or blank clears BOTH the
    // amount and the type.
    for (const field of ALLOWANCE_FIELDS) {
      if (name !== field.key && name !== `${field.key}Type`) continue;

      const amount = next[field.key];

      if (isFilled(amount)) {
        if (num(amount) > 0) {
          if (!isFilled(next[`${field.key}Type`])) {
            next[`${field.key}Type`] = "Fixed";
          }
        } else {
          next[field.key] = "";
          next[`${field.key}Type`] = "";
        }
      } else {
        next[`${field.key}Type`] = "";
      }
    }

    // ncOTI_Validating / ncOTII_Validating: entering an overtime rate
    // switches off the extra-working-hour adjustment and the variant, and
    // zeroes the carried-forward hours. A value <= 0 blanks itself.
    if (name === "OvertimeI" || name === "OvertimeII") {
      if (isFilled(next[name])) {
        if (num(next[name]) > 0) {
          next.AdjustmentExtraWorkingHour = false;
          next.WorkingHoursVariant = false;
          next.LastYearExtraWorkingHour = 0;
        } else {
          next[name] = "";
        }
      }
    }

    // ddOTCI_Validating / ddOTCII_Validating: an hourly Basic cannot use
    // a formula-based overtime rate.
    if (name === "OvertimeIType" || name === "OvertimeIIType") {
      if (next.BasicType === "Hourly" && next[name] !== "/hrs") {
        next[name] = "/hrs";
      }
    }

    // cbEWHour_CheckedChanged: clears both overtime rates and the variant.
    if (name === "AdjustmentExtraWorkingHour" && next.AdjustmentExtraWorkingHour) {
      next.OvertimeI = "";
      next.OvertimeII = "";
      next.WorkingHoursVariant = false;
    }

    // ncLYEWHour_Validating: a carried-forward balance clears the rates.
    if (name === "LastYearExtraWorkingHour") {
      if (num(next.LastYearExtraWorkingHour) > 0) {
        next.OvertimeI = "";
        next.OvertimeII = "";
      }
    }

    // cbVariant_CheckedChanged: only legal on an hourly structure with no
    // overtime rates and no EWH adjustment, and it forces Rule I.
    if (name === "WorkingHoursVariant" && next.WorkingHoursVariant) {
      if (
        next.BasicType !== "Hourly" ||
        isFilled(next.OvertimeI) ||
        isFilled(next.OvertimeII) ||
        next.AdjustmentExtraWorkingHour
      ) {
        next.WorkingHoursVariant = false;
      } else {
        next.AttendanceRules = "Rule I";
      }
    }

    // ddRule_SelectedValueChanged: anything other than Rule I drops the
    // variant; Rules V-X are not configured and revert.
    if (name === "AttendanceRules") {
      if (UNCONFIGURED_ATTENDANCE_RULES.includes(String(next.AttendanceRules).trim())) {
        setError(
          `Attendance Rule ${String(next.AttendanceRules).trim()} is not configured in the system.`
        );
        next.AttendanceRules = previous.AttendanceRules;
      } else if (next.AttendanceRules !== "Rule I") {
        next.WorkingHoursVariant = false;
      }
    }

    // cbTDS_CheckedChanged: the slab is disabled and cleared when TDS is off.
    if (name === "CalcTDS" && !next.CalcTDS) {
      next.IncomeTaxSlab = "";
    }

    // ddRDI_Validating / ddRDII_Validating: the legacy form CLEARS Rest
    // Day II on a clash rather than flagging the field.
    if (name === "RestDay1" || name === "RestDay2") {
      if (
        isFilled(next.RestDay1) &&
        isFilled(next.RestDay2) &&
        next.RestDay1 === next.RestDay2
      ) {
        setError("Both rest day can’t be same.");
        next.RestDay2 = "";
      }
    }

    return next;

  };


  // ==================================================
  // BLUR COERCION
  // ==================================================
  // Legacy *_Validating handlers rewrite a blank or non-positive entry
  // back to a concrete default and cap the value. Blur is the closest
  // web equivalent to WinForms Validating.

  const handleBlur = (event) => {

    const { name } = event.target;

    const limit = LEGACY_LIMITS[name];
    const coercion = BLANK_COERCIONS[name];

    if (!limit && coercion === undefined) return;

    setFormData((previous) => {

      const raw = previous[name];
      let value = raw;

      if (coercion !== undefined) {
        if (!isFilled(raw) || num(raw) <= 0) {
          value = coercion;
        }
      }

      if (limit && num(value) > limit.max) {
        setError(limit.message);
        return previous;
      }

      if (value === raw) return previous;

      const next = { ...previous, [name]: value };

      if (GROSS_INPUT_FIELDS.has(name)) {
        next.GrossSalary = calcGrossSalary(next);
      }

      return next;

    });

  };


  const handleChange = (event) => {

    const { name, value, type, checked } = event.target;
    // LookupComboField hands back the raw pk (an integer for
    // attendance-rules, and possibly designations etc.), whereas real DOM
    // events always give strings. Every field here is string state --
    // buildPayload does the typed coercion -- so normalise at the door.
    // Otherwise a number reaches the API in a `str` field and Pydantic
    // rejects it with "Input should be a valid string".
    const nextValue =
      type === "checkbox"
        ? checked
        : typeof value === "number"
          ? String(value)
          : value;
    const nextFormData = applyLegacyInterlocks(
      name,
      { ...formData, [name]: nextValue },
      formData
    );

    // ncGrossSalary_Validating, non-PF branch: typing a gross directly
    // pushes it into Basic and clears every allowance. (The PF branch,
    // which splits the gross across components using the percentages in
    // TempTable rows 1181-1189, needs a backend endpoint that does not
    // exist yet.)
    if (name === "GrossSalary") {

      if (isFilled(nextValue) && num(nextValue) > 0) {
        nextFormData.Basic = num(nextValue);
      } else {
        nextFormData.GrossSalary = "0";
        nextFormData.Basic = "";
      }

      for (const field of ALLOWANCE_FIELDS) {
        nextFormData[field.key] = "";
        nextFormData[`${field.key}Type`] = "";
      }

    } else if (GROSS_INPUT_FIELDS.has(name)) {
      nextFormData.GrossSalary = calcGrossSalary(nextFormData);
    }

    const nextTouched = {
      ...touchedFields,
      [name]: true,
    };

    const liveErrors = validateLiveField(name, nextFormData, holidays);
    const nextErrors = { ...validationErrors };

    // Remove old errors for this field/dependency group before applying
    // the newly calculated result. This makes errors disappear immediately
    // after the user fixes the value.
    const fieldsToClear = new Set([name]);
    if (name === "SalaryStart" || name === "SalaryEnd") {
      fieldsToClear.add("SalaryStart");
      fieldsToClear.add("SalaryEnd");
      holidays.forEach((_, index) => fieldsToClear.add(`HolidayDate_${index}`));
    }
    if (name === "fkEmpId" || name === "fkReportTo1EmpId" || name === "fkReportTo2EmpId") {
      fieldsToClear.add("fkReportTo1EmpId");
      fieldsToClear.add("fkReportTo2EmpId");
    }
    if (name === "RestDay1" || name === "RestDay2") {
      fieldsToClear.add("RestDay2");
    }
    if (name.endsWith("Type")) {
      fieldsToClear.add(name.slice(0, -4));
    }

    fieldsToClear.forEach((field) => delete nextErrors[field]);
    Object.assign(nextErrors, liveErrors);

    setFormData(nextFormData);
    setTouchedFields(nextTouched);
    setValidationErrors(nextErrors);
    // An interlock message (rest-day clash, unconfigured rule) already
    // explains what just happened — don't overwrite it with a generic
    // field error for the same keystroke.
    const interlockMessage = Object.values(liveErrors)[0];
    if (interlockMessage) {
      setError(interlockMessage);
    }
    setSuccess("");

  };

  // ==================================================
  // PAID HOLIDAYS — CHILD GRID
  // ==================================================

  // ==================================================
  // FillHolidays() — PORT
  // ==================================================
  // Legacy pulls SalHolidays rows between the two salary dates and shows
  // them with a tick box; with no dates the grid is empty. Nothing in the
  // form creates a holiday — that lives in the Holidays master.

  const fetchHolidays = useCallback(async (from, to) => {

    if (!from || !to) {
      setHolidays([]);
      setHolidaysUnavailable(false);
      return;
    }

    setHolidaysLoading(true);

    try {

      const response = await fetch(
        `${API_BASE_URL}/salary-holidays?from=${from}&to=${to}`,
        { headers: getAuthHeaders() }
      );

      if (!response.ok) {
        setHolidays([]);
        setHolidaysUnavailable(true);
        return;
      }

      const data = await response.json();
      const rows = Array.isArray(data) ? data : data.holidays || [];

      setHolidays(
        rows.map((row) => ({
          pkSHId: String(row.pkSHId),
          PaidHoliday: row.PaidHoliday || "",
          HolidayDate: row.HolidayDate
            ? String(row.HolidayDate).slice(0, 10)
            : "",
        }))
      );

      setHolidaysUnavailable(false);

    } catch {

      setHolidays([]);
      setHolidaysUnavailable(true);

    } finally {

      setHolidaysLoading(false);

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {

    fetchHolidays(formData.SalaryStart, formData.SalaryEnd);

  }, [formData.SalaryStart, formData.SalaryEnd, fetchHolidays]);

  const toggleHoliday = (pkSHId) => {

    setSelectedHolidayIds((previous) => {
      const next = new Set(previous);
      if (next.has(pkSHId)) {
        next.delete(pkSHId);
      } else {
        next.add(pkSHId);
      }
      return next;
    });

  };


  // ==================================================
  // GROSS SALARY
  // ==================================================
  // Gross is a real, editable field in the legacy form (ncGrossSalary),
  // not a derived display. calcGrossSalary() rewrites it whenever one of
  // its inputs changes, exactly as the legacy *_Validating handlers call
  // CalGrossSalary(); typing into it directly runs the reverse split in
  // handleChange.

  const grossSalary = num(formData.GrossSalary);


  // ==================================================
  // BUILD PAYLOAD
  // ==================================================

  const buildPayload = () => {

    const payload = {};

    for (const [key, value] of Object.entries(formData)) {

      if (key === "pkSalStructureId") continue;

      if (NUMERIC_FIELDS.includes(key)) {
        payload[key] = value === "" ? null : parseInt(value, 10);
        continue;
      }

      if (FLOAT_FIELDS.includes(key)) {
        payload[key] = value === "" ? null : parseFloat(value);
        continue;
      }

      if (BOOLEAN_FIELDS.includes(key)) {
        payload[key] = Boolean(value);
        continue;
      }

      // DATE_FIELDS (SalaryStart/SalaryEnd) are the one case in this
      // bucket where "" genuinely needs to become null rather than
      // stay a string -- an empty string isn't a valid datetime,
      // where it IS a valid string.
      if (DATE_FIELDS.includes(key)) {
        payload[key] = value === "" ? null : `${value}T00:00:00`;
        continue;
      }

      // Everything else here is a plain string field. Several of
      // them (Remarks, AttendanceRules, fkSalAcctId, fkLoanAcctId,
      // RestDay2...) are non-Optional `str` in SalStructureCreateRequest
      // -- sending null for those fails validation ("Input should be
      // a valid string"), where an empty string is always accepted
      // by both `str` and `str | None`. So leave blanks as "".
      payload[key] = value;

    }

    payload.GrossSalary = grossSalary;

    // SalSelHolidays rows: the ticked master holidays, by id. (route.py
    // still pops paid_holidays and discards it — the SalHolidays /
    // SalSelHolidays tables have no model or endpoint yet.)
    payload.paid_holidays = holidays
      .filter((row) => selectedHolidayIds.has(row.pkSHId))
      .map((row) => ({
        pkSHId: row.pkSHId,
        HolidayDate: row.HolidayDate,
      }));

    return payload;

  };


  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");

    const errors = validateForm(formData, holidays);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstField = Object.keys(errors)[0];
      const firstError = errors[firstField];
      setError(firstError);
      return;
    }

    setLoading(true);

    try {

      const payload = buildPayload();
      let response;

      if (mode === "create") {

        response = await fetch(`${API_BASE_URL}/salary-structures`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });

      } else {

        response = await fetch(
          `${API_BASE_URL}/salary-structures/${formData.pkSalStructureId}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
          }
        );

      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          formatApiError(data, "Failed to save salary structure.")
        );
      }

      setSuccess(
        mode === "create"
          ? "Salary structure created."
          : "Salary structure updated."
      );

      fetchStructureIds();

      if (mode === "create" && data.structure?.pkSalStructureId) {
        navigate(`/salary-structure/${data.structure.pkSalStructureId}`);
      }

    } catch (err) {

      setError(err.message || "Failed to save salary structure.");

    } finally {

      setLoading(false);

    }

  };


  // ==================================================
  // COMPONENT
  // ==================================================

  return (

    <div className="w-full space-y-6">

      <ValidationErrorModal message={error} onClose={() => setError("")} />


      {/* ==================================================
          RECORD TOOLBAR
          Mirrors the legacy Salary Structure window's button
          rail (First/Prior/Next/Last, Add, Edit, Del, Undo,
          Save, Refr., Print, Exp., Help, Exit) plus the two
          "Yes" checkbox clusters that sat top-right of that
          window (Sandwich Rule for Leaves, Swiping/Scanning
          for Meal Break).
      ================================================== */}

      <div className="overflow-hidden rounded-2xl border border-theme-border bg-card shadow-sm">

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-theme-border px-4 py-3">

          <div className="flex flex-wrap items-center gap-1">

            <ToolbarButton
              icon={ChevronsLeft}
              label="First"
              onClick={goFirst}
              disabled={isAtFirst || structureIdsLoading}
            />

            <ToolbarButton
              icon={ChevronLeft}
              label="Prior"
              onClick={goPrior}
              disabled={isAtFirst || structureIdsLoading}
            />

            <ToolbarButton
              icon={ChevronRight}
              label="Next"
              onClick={goNext}
              disabled={isAtLast || structureIdsLoading}
            />

            <ToolbarButton
              icon={ChevronsRight}
              label="Last"
              onClick={goLast}
              disabled={isAtLast || structureIdsLoading}
            />

            <ToolbarDivider />

            <ToolbarButton icon={Plus} label="Add" onClick={handleNew} />

            <ToolbarButton
              icon={PencilLine}
              label="Edit"
              active={mode === "edit"}
              disabled
              title="Loaded records open directly in edit mode"
            />

            <Can module="salary_structure" action="delete">

              <ToolbarButton
                icon={Trash2}
                label="Del"
                tone="danger"
                onClick={handleDelete}
                disabled={mode !== "edit"}
              />

            </Can>

            <ToolbarButton
              icon={RotateCcw}
              label="Undo"
              onClick={() =>
                mode === "edit"
                  ? loadStructure(formData.pkSalStructureId)
                  : handleNew()
              }
            />

            <Can
              module="salary_structure"
              action={mode === "create" ? "add" : "edit"}
            >

              <ToolbarButton
                icon={Save}
                label="Save"
                form="salary-structure-form"
                type="submit"
                disabled={loading}
              />

            </Can>

            <ToolbarButton
              icon={Percent}
              label="Addl. Allowance"
              onClick={() => setShowAdditionalAllowance(true)}
              active={showAdditionalAllowance}
            />

            <ToolbarDivider />

            <ToolbarButton
              icon={RefreshCw}
              label="Refr."
              onClick={() => {

                fetchStructureIds();

                if (mode === "edit") {
                  loadStructure(formData.pkSalStructureId);
                }

              }}
            />

            <ToolbarButton
              icon={Printer}
              label="Print"
              disabled
              title="Printing isn't wired up yet"
            />

            <ToolbarButton
              icon={Download}
              label="Exp."
              disabled
              title="Export isn't wired up yet"
            />

            <ToolbarButton
              icon={HelpCircle}
              label="Help"
              onClick={() =>
                window.alert(
                  "Use First/Prior/Next/Last to browse salary structures, " +
                    "Add for a new record, and Save to keep changes. " +
                    "Del removes the currently loaded structure."
                )
              }
            />

            <ToolbarButton
              icon={DoorOpen}
              label="Exit"
              onClick={() => navigate("/salary-structures")}
            />

          </div>

          {/* SANDWICH RULE / MEAL BREAK — top-right checkbox
              clusters from the legacy window. Both default Yes. */}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">

            <CheckboxField
              label="Sandwich Rule for Leaves *"
              name="SandwichRuleForLeaves"
              checked={formData.SandwichRuleForLeaves}
              onChange={handleChange}
            />

            <CheckboxField
              label="Swiping/Scanning for Meal Break *"
              name="SwipingScanningForMealBreak"
              checked={formData.SwipingScanningForMealBreak}
              onChange={handleChange}
            />

          </div>

        </div>


        {/* STRUCTURE / LIST TABS */}

        <div className="flex items-center gap-1 px-4 pt-3">

          <div className="inline-flex items-center justify-center gap-2 rounded-t-lg border-b-2 border-theme-primary px-4 py-2 text-sm font-semibold text-theme-primary">
            <ClipboardList size={15} />
            Salary Structure
          </div>

          <Link
            to="/salary-structures"
            className="inline-flex items-center justify-center gap-2 rounded-t-lg border-b-2 border-transparent px-4 py-2 text-sm font-semibold text-theme-muted transition hover:text-theme-primary"
          >
            <ListChecks size={15} />
            List
          </Link>

        </div>


        {/* RECORD SUMMARY + LOOKUP */}

        <div className="flex flex-col gap-3 border-t border-theme-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-theme-muted">
            {mode === "edit"
              ? `Editing Salary Structure #${formData.pkSalStructureId}` +
                (currentRecordIndex >= 0
                  ? ` (record ${currentRecordIndex + 1} of ${structureIds.length})`
                  : "")
              : "Creating a new salary structure record."}
          </p>

          <div className="flex flex-wrap items-center gap-2">

            <div className="relative">

              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-theme-faint"
              />

              <input
                type="number"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                placeholder="Jump to Structure ID"
                className="h-10 w-52 rounded-xl border border-theme-border bg-[var(--erp-background)] pl-9 pr-3 text-sm text-theme-text outline-none focus:border-theme-primary"
                onKeyDown={(e) => e.key === "Enter" && handleLoad()}
              />

            </div>

            <button
              type="button"
              onClick={handleLoad}
              disabled={lookupLoading}
              className="h-10 rounded-xl bg-theme-primary px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {lookupLoading ? "Loading…" : "Load"}
            </button>

          </div>

        </div>

      </div>


      {/* ALERTS */}

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {Object.keys(validationErrors).length > 1 && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-semibold">Please fix the following:</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            {Object.values(validationErrors).map((message, index) => (
              <li key={`${message}-${index}`}>{message}</li>
            ))}
          </ul>
        </div>
      )}


      <form id="salary-structure-form" onSubmit={handleSubmit} className="space-y-6">


        {/* ==================================================
            EMPLOYEE & PERIOD
        ================================================== */}

        <SectionCard
          icon={UserRound}
          title="Employee & Period"
          description="Who this structure applies to, and for how long."
        >

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* ddEmployee_Validating rejects any change once a structure
                is loaded: "You cannot change Employee as you are in Edit
                Mode." */}
            <EmployeePickerField
              label="Employee *"
              name="fkEmpId"
              value={formData.fkEmpId}
              displayValue={formData.fkEmpId}
              onChange={handleChange}
              disabled={mode === "edit"}
            />

            <DateField
              label="Salary Start *"
              name="SalaryStart"
              value={formData.SalaryStart}
              onChange={handleChange}
              max={formData.SalaryEnd || undefined}
              error={validationErrors.SalaryStart}
            />

            <DateField
              label="Salary End *"
              name="SalaryEnd"
              value={formData.SalaryEnd}
              onChange={handleChange}
              min={formData.SalaryStart || undefined}
              error={validationErrors.SalaryEnd}
            />

            <LookupComboField
              label="Attendance Rules *"
              name="AttendanceRules"
              table="attendance-rules"
              value={formData.AttendanceRules}
              onChange={handleChange}
            />

            <EmployeePickerField
              label="1) Reporting To"
              name="fkReportTo1EmpId"
              value={formData.fkReportTo1EmpId}
              displayValue={formData.fkReportTo1EmpId}
              onChange={handleChange}
              excludeEmpId={formData.fkEmpId}
            />

            <EmployeePickerField
              label="2) Reporting To"
              name="fkReportTo2EmpId"
              value={formData.fkReportTo2EmpId}
              displayValue={formData.fkReportTo2EmpId}
              onChange={handleChange}
              excludeEmpId={formData.fkEmpId}
            />

          </div>

        </SectionCard>


        {/* ==================================================
            BASIC & ALLOWANCES
        ================================================== */}

        <SectionCard
          icon={Wallet}
          title="Basic & Allowances"
          description="Pay components that make up Gross Salary."
        >

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <div>

              <label className="mb-2 block text-sm font-semibold text-theme-text">
                Basic *
              </label>

              <div className="flex gap-2">

                <NumberField
                  name="Basic"
                  value={formData.Basic}
                  onChange={handleChange}
                  wrapperClassName="flex-1 min-w-0"
                />

                <select
                  name="BasicType"
                  value={formData.BasicType}
                  onChange={handleChange}
                  className={`${inputClass} flex-1 min-w-0 cursor-pointer`}
                >
                  {BASIC_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

              </div>

            </div>

            <NumberField
              label="Daily Salary"
              name="DailySalary"
              value={formData.DailySalary}
              onChange={handleChange}
              onBlur={handleBlur}
              readOnly={formData.BasicType === "Monthly"}
              hint={`if ${num(formData.WorkingHoursPerDay).toFixed(2)} working hrs. in a day.`}
            />

            <NumberField
              label="Gross Salary"
              name="GrossSalary"
              value={formData.GrossSalary}
              onChange={handleChange}
              error={validationErrors.GrossSalary}
              hint={
                formData.BasicType === "Hourly"
                  ? "Recalculated from Basic, hours and allowances."
                  : undefined
              }
            />

          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {ALLOWANCE_FIELDS.map((field) => (

              <div key={field.key}>

                <label className="mb-2 block text-sm font-semibold text-theme-text">
                  {field.label}
                </label>

                <div className="flex gap-2">

                  <NumberField
                    name={field.key}
                    value={formData[field.key]}
                    onChange={handleChange}
                    wrapperClassName="flex-1 min-w-0"
                  />

                  <select
                    name={`${field.key}Type`}
                    value={formData[`${field.key}Type`]}
                    onChange={handleChange}
                    title={ALLOWANCE_TYPE_CALC[formData[`${field.key}Type`]] || ""}
                    className={`${inputClass} flex-1 min-w-0 cursor-pointer`}
                  >
                    <option value="" />
                    {ALLOWANCE_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                </div>

              </div>

            ))}

          </div>

        </SectionCard>


        {/* ==================================================
            OVERTIME & REST DAY
        ================================================== */}

        <SectionCard
          icon={Clock3}
          title="Overtime & Rest Day"
          description="Overtime rates, weekly rest days, and extra-hour adjustments."
        >

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {[
              { key: "OvertimeI", label: "Overtime I" },
              { key: "OvertimeII", label: "Overtime II" },
            ].map((row) => (

              <div key={row.key}>

                <label className="mb-2 block text-sm font-semibold text-theme-text">
                  {row.label}
                </label>

                <div className="flex gap-2">

                  <NumberField
                    name={row.key}
                    value={formData[row.key]}
                    onChange={handleChange}
                    wrapperClassName="flex-1 min-w-0"
                  />

                  {/* ddOTCI / ddOTCII — locked to "/hrs" while Basic is
                      hourly, per the legacy Validating handler. */}
                  <select
                    name={`${row.key}Type`}
                    value={formData[`${row.key}Type`]}
                    onChange={handleChange}
                    disabled={formData.BasicType === "Hourly"}
                    title={
                      formData.BasicType === "Hourly"
                        ? "Basic Salary is on hourly basis. You can’t apply formula for overtime."
                        : undefined
                    }
                    className={`${inputClass} flex-1 min-w-0 cursor-pointer disabled:opacity-60`}
                  >
                    {OVERTIME_TYPE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                </div>

              </div>

            ))}

            <div>

              <label className="mb-2 block text-sm font-semibold text-theme-text">
                Rest Day I
              </label>

              <div className="flex items-center gap-3">

                <select
                  name="RestDay1"
                  value={formData.RestDay1}
                  onChange={handleChange}
                  className={`${inputClass} flex-1 cursor-pointer`}
                >
                  {WEEKDAY_OPTIONS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>

                <CheckboxField
                  label="Variant"
                  name="RestDay1Variant"
                  checked={formData.RestDay1Variant}
                  onChange={handleChange}
                />

              </div>

            </div>

            <SelectField
              label="Rest Day II"
              name="RestDay2"
              value={formData.RestDay2}
              onChange={handleChange}
              options={["", ...WEEKDAY_OPTIONS]}
            />

            <div>

              <label className="mb-2 block text-sm font-semibold text-theme-text">
                Adjustment
              </label>

              <div className="flex h-11 items-center">

                <CheckboxField
                  label="Extra Working Hour"
                  name="AdjustmentExtraWorkingHour"
                  checked={formData.AdjustmentExtraWorkingHour}
                  onChange={handleChange}
                />

              </div>

            </div>

            <NumberField
              label="Last Year"
              name="LastYearExtraWorkingHour"
              value={formData.LastYearExtraWorkingHour}
              onChange={handleChange}
              onBlur={handleBlur}
              error={validationErrors.LastYearExtraWorkingHour}
              hint="Extra Working Hour"
            />

          </div>

        </SectionCard>


        {/* ==================================================
            LEAVE ENTITLEMENTS
        ================================================== */}

        <SectionCard
          icon={CalendarRange}
          title="Leave Entitlements"
          description="Annual leave allowances for this structure."
        >

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <NumberField
              label="Paid Holiday"
              name="PaidHoliday"
              value={formData.PaidHoliday}
              onChange={handleChange}
              onBlur={handleBlur}
              error={validationErrors.PaidHoliday}
              hint="/during period"
            />

            <NumberField
              label="Sick Leave"
              name="SickLeave"
              value={formData.SickLeave}
              onChange={handleChange}
              onBlur={handleBlur}
              error={validationErrors.SickLeave}
              hint="/year"
            />

            <NumberField
              label="Paid Casual Leave"
              name="PaidCasualLeave"
              value={formData.PaidCasualLeave}
              onChange={handleChange}
              onBlur={handleBlur}
              error={validationErrors.PaidCasualLeave}
              hint="/year"
            />

            <NumberField
              label="Unpaid Casual Leave"
              name="UnpaidCasualLeave"
              value={formData.UnpaidCasualLeave}
              onChange={handleChange}
              onBlur={handleBlur}
              error={validationErrors.UnpaidCasualLeave}
              hint="/year"
            />

          </div>

        </SectionCard>


        {/* ==================================================
            WORKING HOURS & BUFFERS
        ================================================== */}

        <SectionCard
          icon={Timer}
          title="Working Hours & Buffers"
          description="Day/rest-day hour definitions, attendance buffers, and absence penalty."
        >

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <div>

              <label className="mb-2 block text-sm font-semibold text-theme-text">
                Working
              </label>

              <div className="flex items-center gap-3">

                <NumberField
                  name="WorkingHoursPerDay"
                  value={formData.WorkingHoursPerDay}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={validationErrors.WorkingHoursPerDay}
                  hint="hrs equal to 1 Day"
                  wrapperClassName="flex-1"
                />

                <CheckboxField
                  label="Variant"
                  name="WorkingHoursVariant"
                  checked={formData.WorkingHoursVariant}
                  onChange={handleChange}
                />

              </div>

            </div>

            <NumberField
              label="Consider"
              name="ConsiderHoursPerRestDay"
              value={formData.ConsiderHoursPerRestDay}
              onChange={handleChange}
              onBlur={handleBlur}
              error={validationErrors.ConsiderHoursPerRestDay}
              hint="hrs equal to 1 Rest Day"
            />

            <div className="flex items-end pb-2.5">

              <CheckboxField
                label="Exclude Rest Day from Overtime calculation"
                name="ExcludeRestDayFromOT"
                checked={formData.ExcludeRestDayFromOT}
                onChange={handleChange}
              />

            </div>

            <NumberField
              label="Buffer"
              name="BufferLateEarlyMinutes"
              value={formData.BufferLateEarlyMinutes}
              onChange={handleChange}
              hint="min allowed, if come late/go early"
            />

            <NumberField
              label="Buffer"
              name="BufferDaysAllowedPerMonth"
              value={formData.BufferDaysAllowedPerMonth}
              onChange={handleChange}
              hint="days allowed in a month"
            />

            <NumberField
              label="Break"
              name="BreakDuringOvertimeMinutes"
              value={formData.BreakDuringOvertimeMinutes}
              onChange={handleChange}
              onBlur={handleBlur}
              error={validationErrors.BreakDuringOvertimeMinutes}
              hint="min during Overtime"
            />

            <NumberField
              label="Penalty"
              name="PenaltyPerAbsentDay"
              value={formData.PenaltyPerAbsentDay}
              onChange={handleChange}
              onBlur={handleBlur}
              error={validationErrors.PenaltyPerAbsentDay}
              hint="/day for each Absent"
            />

          </div>

        </SectionCard>


        {/* ==================================================
            STATUTORY DEDUCTIONS
        ================================================== */}

        <SectionCard
          icon={ShieldCheck}
          title="Statutory Deductions"
          description="Which statutory calculations apply to this structure."
        >

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <CheckboxField
              label="1. Professional Tax"
              name="CalcProfessionalTax"
              checked={formData.CalcProfessionalTax}
              onChange={handleChange}
            />

            <div className="flex flex-wrap items-center gap-4">

              <CheckboxField
                label="2. Provident Fund"
                name="CalcProvidentFund"
                checked={formData.CalcProvidentFund}
                onChange={handleChange}
              />

              <CheckboxField
                label="Calculate as per Setting"
                name="CalcProvidentFundAsPerSetting"
                checked={formData.CalcProvidentFundAsPerSetting}
                onChange={handleChange}
              />

            </div>

            <CheckboxField
              label="3. ESIC"
              name="CalcESIC"
              checked={formData.CalcESIC}
              onChange={handleChange}
            />

            <div className="flex flex-wrap items-center gap-3">

              <CheckboxField
                label="4. TDS"
                name="CalcTDS"
                checked={formData.CalcTDS}
                onChange={handleChange}
              />

              <select
                name="IncomeTaxSlab"
                value={formData.IncomeTaxSlab}
                onChange={handleChange}
                disabled={!formData.CalcTDS}
                className={`${inputClass} w-56 cursor-pointer disabled:cursor-not-allowed`}
              >

                <option value="">Income Tax Slab…</option>

                {INCOME_TAX_SLAB_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}

              </select>

            </div>

          </div>

        </SectionCard>


        {/* ==================================================
            ACCOUNTS
            Salary/Loan/Notice/Incentive accounts all reuse the
            existing generic "accounts" lookup (AcctAccount) —
            the same one already wired for Cash Account on the
            Salary Employee form.
        ================================================== */}

        <SectionCard
          icon={Landmark}
          title="Accounts"
          description="Ledger accounts this structure posts against."
        >

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <LookupComboField
              label="Salary Account *"
              name="fkSalAcctId"
              table="accounts"
              value={formData.fkSalAcctId}
              onChange={handleChange}
            />

            <LookupComboField
              label="Loan/Advance Account *"
              name="fkLoanAcctId"
              table="accounts"
              value={formData.fkLoanAcctId}
              onChange={handleChange}
            />

            <LookupComboField
              label="Notice Retention Account"
              name="fkNoticeAcctId"
              table="accounts"
              value={formData.fkNoticeAcctId}
              onChange={handleChange}
            />

            <LookupComboField
              label="Incentive Account"
              name="fkIncentiveAcctId"
              table="accounts"
              value={formData.fkIncentiveAcctId}
              onChange={handleChange}
            />

          </div>

        </SectionCard>


        {/* ==================================================
            PAID HOLIDAYS (CHILD GRID)
        ================================================== */}

        <SectionCard
          icon={CalendarDays}
          title="Paid Holidays"
          description="Holidays from the Holidays master that fall inside this salary period. Tick the ones this structure pays."
        >

          {!formData.SalaryStart || !formData.SalaryEnd ? (

            <p className="text-sm text-theme-faint">
              Set Salary Start and Salary End to list the holidays in that period.
            </p>

          ) : holidaysLoading ? (

            <p className="text-sm text-theme-faint">Loading holidays…</p>

          ) : holidaysUnavailable ? (

            <p className="text-sm text-theme-faint">
              The Holidays master isn’t available from the API yet, so no
              holidays can be selected for this structure.
            </p>

          ) : holidays.length === 0 ? (

            <p className="text-sm text-theme-faint">
              No holidays fall between {formData.SalaryStart} and {formData.SalaryEnd}.
            </p>

          ) : (

            <div className="overflow-hidden rounded-xl border border-theme-border">

              <table className="w-full text-sm">

                <thead>
                  <tr className="bg-theme-primary-soft text-left text-theme-text">
                    <th className="w-16 px-4 py-2 font-semibold">Paid</th>
                    <th className="px-4 py-2 font-semibold">Holiday</th>
                    <th className="px-4 py-2 font-semibold">Date</th>
                  </tr>
                </thead>

                <tbody>

                  {holidays.map((row) => (

                    <tr key={row.pkSHId} className="border-t border-theme-border">

                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedHolidayIds.has(row.pkSHId)}
                          onChange={() => toggleHoliday(row.pkSHId)}
                          className="h-4 w-4 cursor-pointer accent-[var(--erp-primary)]"
                        />
                      </td>

                      <td className="px-4 py-2 text-theme-text">
                        {row.PaidHoliday || "—"}
                      </td>

                      <td className="px-4 py-2 text-theme-text">
                        {row.HolidayDate}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </SectionCard>


        {/* ==================================================
            NOTICE, AGENCY & REMARKS
        ================================================== */}

        <SectionCard
          icon={StickyNote}
          title="Notice, Agency & Remarks"
          description="Notice retention, manpower sourcing, and free-text notes."
        >

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <div>

              <label className="mb-2 block text-sm font-semibold text-theme-text">
                Notice Retention Amount
              </label>

              <input
                type="number"
                step="0.01"
                name="NoticeRetentionAmount"
                value={formData.NoticeRetentionAmount}
                onChange={handleChange}
                className={`${inputClass} font-semibold text-red-600`}
              />

            </div>

            <LookupComboField
              label="Supplied To"
              name="SuppliedTo"
              table="contacts"
              value={formData.SuppliedTo}
              onChange={handleChange}
              placeholder="Select supplied-to contact…"
            />

            <LookupComboField
              label="Manpower Agency"
              name="ManpowerAgency"
              table="contacts"
              value={formData.ManpowerAgency}
              onChange={handleChange}
              placeholder="Select manpower agency…"
            />

            <div className="sm:col-span-2 lg:col-span-3">

              <TextAreaField
                label="Remarks"
                name="Remarks"
                value={formData.Remarks}
                onChange={handleChange}
              />

            </div>

          </div>

        </SectionCard>

        {/* ==================================================
            BOTTOM FORM ACTIONS
        ================================================== */}

        <div className="flex flex-col gap-3 rounded-2xl border border-theme-border bg-card px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">

          <button
            type="button"
            onClick={() => navigate("/salary-structures")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-theme-surface px-5 text-sm font-semibold text-theme-text transition hover:bg-theme-primary-soft"
          >
            <ArrowLeft size={16} />
            Back to List
          </button>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            <button
              type="button"
              onClick={() =>
                mode === "edit"
                  ? loadStructure(formData.pkSalStructureId)
                  : handleNew()
              }
              disabled={loading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-theme-border bg-card px-5 text-sm font-semibold text-theme-text transition hover:bg-theme-primary-soft disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw size={16} />
              Reset
            </button>

            <Can
              module="salary_structure"
              action={mode === "create" ? "add" : "edit"}
            >
              <button
                type="submit"
                form="salary-structure-form"
                disabled={loading}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-theme-primary px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={17} />
                {loading
                  ? "Saving…"
                  : mode === "create"
                    ? "Save Salary Structure"
                    : "Save Changes"}
              </button>
            </Can>

          </div>

        </div>

      </form>


      {/* ==================================================
          ADDITIONAL ALLOWANCE MODAL
          Opened from the "Addl. Allowance" toolbar button — rules
          for which pay components feed into Overtime and Provident
          Fund calculations, plus a handful of related location and
          deduction fields. Same as the Additional Information modal
          on the Salary Employee form: a UI grouping only, still part
          of the same formData/save flow — OK just closes the dialog,
          Save on the main toolbar is what persists it.
      ================================================== */}

      {showAdditionalAllowance && (

        <div
          className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8"
          onClick={() => setShowAdditionalAllowance(false)}
        >

          <div
            onClick={(event) => event.stopPropagation()}
            className="my-4 w-full max-w-4xl overflow-hidden rounded-2xl border border-theme-border bg-card shadow-2xl"
          >

            <div className="flex items-center justify-between border-b border-theme-border px-6 py-4">

              <div>

                <h2 className="text-lg font-semibold text-theme-text">
                  Additional Allowance
                </h2>

                <p className="mt-0.5 text-sm text-theme-muted">
                  Overtime and Provident Fund calculation rules, plus
                  leaving-time, location and deduction details.
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowAdditionalAllowance(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-theme-muted transition hover:bg-theme-primary-soft hover:text-theme-primary"
              >
                <X size={18} />
              </button>

            </div>

            <div className="max-h-[75vh] space-y-6 overflow-y-auto p-6">


              {/* OVERTIME CALCULATION */}

              <SectionCard
                icon={Clock3}
                title="Overtime Calculation"
                description="Which pay components count toward Basic Salary for overtime calculation."
              >

                <div className="grid grid-cols-1 gap-3">

                  {OVERTIME_INCLUDE_FIELDS.map((field) => (

                    <RuleCheckbox
                      key={field.key}
                      name={field.key}
                      checked={formData[field.key]}
                      onChange={handleChange}
                      colorClass="text-red-600"
                      label={`Make ${field.label} part of Basic Salary for Overtime Calculation`}
                    />

                  ))}

                </div>

              </SectionCard>


              {/* PROVIDENT FUND CALCULATION */}

              <SectionCard
                icon={ShieldCheck}
                title="Provident Fund Calculation"
                description="Which pay components count toward Basic Salary and Dearness Allowance for PF calculation."
              >

                <div className="grid grid-cols-1 gap-3">

                  {PF_INCLUDE_FIELDS.map((field) => (

                    <RuleCheckbox
                      key={field.key}
                      name={field.key}
                      checked={formData[field.key]}
                      onChange={handleChange}
                      colorClass="text-blue-600"
                      label={`Make ${field.label} part of Basic Salary and Dearness Allowance for Provident Fund Calculation`}
                    />

                  ))}

                </div>

              </SectionCard>


              {/* OTHER RULES */}

              <SectionCard
                icon={ClipboardList}
                title="Other Rules"
                description="Additional conditions on holidays, rest days and conditional components."
              >

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                  <CheckboxField
                    label="Make Government Holidays part of All Allowances Calculation"
                    name="GovtHolidaysPartOfAllowances"
                    checked={formData.GovtHolidaysPartOfAllowances}
                    onChange={handleChange}
                  />

                  <CheckboxField
                    label="Make Rest Days part of All Allowances Calculation"
                    name="RestDaysPartOfAllowances"
                    checked={formData.RestDaysPartOfAllowances}
                    onChange={handleChange}
                  />

                  <CheckboxField
                    label="Incentive Applicable only if Overtime Rule Fulfill"
                    name="IncentiveOnlyIfOvertimeFulfilled"
                    checked={formData.IncentiveOnlyIfOvertimeFulfilled}
                    onChange={handleChange}
                  />

                  <CheckboxField
                    label="Other Only if Overtime Perform"
                    name="OtherOnlyIfOvertimePerformed"
                    checked={formData.OtherOnlyIfOvertimePerformed}
                    onChange={handleChange}
                  />

                </div>

              </SectionCard>


              {/* LOCATION & DEDUCTION */}

              <SectionCard
                icon={MapPin}
                title="Location & Deduction"
                description="Leaving-time rounding, geolocation, and manual deduction details."
              >

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <SelectField
                    label="Leaving Time (Rounding Off)"
                    name="LeavingTimeRounding"
                    value={formData.LeavingTimeRounding}
                    onChange={handleChange}
                    options={LEAVING_TIME_ROUNDING_OPTIONS}
                  />

                  <LookupComboField
                    label="Designation"
                    name="fkAllowanceDesId"
                    table="designations"
                    value={formData.fkAllowanceDesId}
                    onChange={handleChange}
                  />

                  <NumberField
                    label="Latitude"
                    name="Latitude"
                    value={formData.Latitude}
                    onChange={handleChange}
                    step="0.000001"
                  />

                  <NumberField
                    label="TDS Deduction"
                    name="TDSDeductionPercent"
                    value={formData.TDSDeductionPercent}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    hint="%"
                  />

                  <NumberField
                    label="Longitude"
                    name="Longitude"
                    value={formData.Longitude}
                    onChange={handleChange}
                    step="0.000001"
                  />

                  <NumberField
                    label="Monthly Deduction"
                    name="MonthlyDeduction"
                    value={formData.MonthlyDeduction}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <div className="sm:col-span-2">

                    <TextField
                      label="Deduction Description"
                      name="DeductionDescription"
                      value={formData.DeductionDescription}
                      onChange={handleChange}
                    />

                  </div>

                </div>

              </SectionCard>

            </div>

            <div className="flex justify-end border-t border-theme-border px-6 py-4">

              <button
                type="button"
                onClick={() => setShowAdditionalAllowance(false)}
                className="h-10 rounded-xl bg-theme-primary px-6 text-sm font-semibold text-white transition hover:opacity-90"
              >
                OK
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}


// ==================================================
// FIELD PRIMITIVES
// ==================================================

const inputClass = `
  h-11
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
  focus:border-theme-primary
  focus:ring-2
  focus:ring-theme-primary-soft
  disabled:cursor-not-allowed
  disabled:opacity-60
`;

function TextField({ label, ...props }) {

  return (

    <div>

      <label className="mb-2 block text-sm font-semibold text-theme-text">
        {label}
      </label>

      <input type="text" className={inputClass} {...props} />

    </div>

  );

}

function NumberField({ label, hint, error, wrapperClassName, ...props }) {

  return (

    <div className={wrapperClassName}>

      {label && (
        <label className="mb-2 block text-sm font-semibold text-theme-text">
          {label}
        </label>
      )}

      <div className="flex items-center gap-2">

        <input
          type="number"
          step="0.01"
          className={`${inputClass} ${
            error ? "border-red-400" : ""
          } ${props.readOnly ? "bg-theme-primary-soft/40 text-theme-muted" : ""}`}
          {...props}
        />

        {hint && (
          <span className="whitespace-nowrap text-xs text-theme-faint">
            {hint}
          </span>
        )}

      </div>

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}

    </div>

  );

}

function TextAreaField({ label, name, value, onChange }) {

  return (

    <div>

      <label className="mb-2 block text-sm font-semibold text-theme-text">
        {label}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        className={`${inputClass} h-auto resize-none py-3`}
      />

    </div>

  );

}

function DateField({ label, name, value, onChange, min, max, error }) {

  return (

    <div>

      <label className="mb-2 block text-sm font-semibold text-theme-text">
        {label}
      </label>

      <div className="relative">

        <CalendarDays
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-faint"
        />

        <input
          type="date"
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          aria-invalid={Boolean(error)}
          className={`${inputClass} pl-10 ${error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""}`}
        />

      </div>

      {error && (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      )}

    </div>

  );

}

function SelectField({ label, name, value, onChange, options }) {

  const normalized = options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option
  );

  return (

    <div>

      <label className="mb-2 block text-sm font-semibold text-theme-text">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`${inputClass} cursor-pointer`}
      >

        <option value="">Select…</option>

        {normalized.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}

      </select>

    </div>

  );

}


// ==================================================
// LOOKUP COMBO FIELD
// Reused as-is from SalaryEmployeeMaster.jsx — same generic
// /api/lookups/{table} endpoint, same create-on-the-fly flow.
// ==================================================

function LookupComboField({
  label,
  name,
  value,
  onChange,
  table,
  placeholder,
  disabled,
}) {

  const [options, setOptions] = useState([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [allowCreate, setAllowCreate] = useState(true);
  const [notice, setNotice] = useState("");
  const [menuRect, setMenuRect] = useState(null);

  // Account quick-create dialog. Accounts are a real 70+ column legacy
  // master, so they cannot safely use the generic one-field creator.
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountCode, setAccountCode] = useState("");
  const [accountGroup, setAccountGroup] = useState("");
  const [accountGroups, setAccountGroups] = useState([]);
  const [accountGroupsLoading, setAccountGroupsLoading] = useState(false);

  const inputRef = useRef(null);

  const openMenu = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setMenuRect({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setOpen(true);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  };

  useEffect(() => {
    let cancelled = false;

    const loadOptions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/lookups/${table}`,
          { headers: getAuthHeaders() }
        );
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled) {
          setOptions(data.options || []);
          setAllowCreate(Boolean(data.allow_create));
        }
      } catch {
        // Non-fatal — the field falls back to plain typing.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadOptions();
    return () => { cancelled = true; };
  }, [table]);

  useEffect(() => {
    const match = options.find(
      (option) => String(option.value) === String(value)
    );
    setQuery(match ? match.label : value || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const trimmedQuery = String(query ?? "").trim();

  const filtered = trimmedQuery
    ? options.filter((option) =>
        option.label.toLowerCase().includes(trimmedQuery.toLowerCase())
      )
    : options;

  const exactMatch = options.find(
    (option) => option.label.toLowerCase() === trimmedQuery.toLowerCase()
  );

  const selectOption = (option) => {
    onChange({ target: { name, value: option.value, type: "text" } });
    setQuery(option.label);
    setOpen(false);
    setNotice("");
  };

  const openAccountCreate = async () => {
    setOpen(false);
    setNotice("");
    setAccountName(trimmedQuery);
    setAccountCode("");
    setAccountGroup("");
    setShowAccountDialog(true);
    setAccountGroupsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/accounts/groups`,
        { headers: getAuthHeaders() }
      );
      const data = await response.json();
      if (!response.ok) {
        setNotice(formatApiError(data, "Could not load account groups."));
        return;
      }
      setAccountGroups(data.groups || []);
      if (data.groups?.length === 1) {
        setAccountGroup(String(data.groups[0].value));
      }
    } catch {
      setNotice("Could not load account groups — check your connection.");
    } finally {
      setAccountGroupsLoading(false);
    }
  };

  const handleAddNew = async () => {
    if (table === "accounts") {
      openAccountCreate();
      return;
    }

    setAdding(true);
    setNotice("");

    try {
      const response = await fetch(`${API_BASE_URL}/lookups/${table}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ label: trimmedQuery }),
      });

      const data = await response.json();

      if (!response.ok) {
        setNotice(formatApiError(data, "Could not add this value."));
        return;
      }

      setOptions((previous) => [...previous, data.option]);
      selectOption(data.option);
    } catch {
      setNotice("Could not add this value — check your connection.");
    } finally {
      setAdding(false);
    }
  };

  const handleCreateAccount = async () => {
    const cleanName = accountName.trim();
    const cleanCode = accountCode.trim();

    if (!cleanName) {
      setNotice("Account Name is required.");
      return;
    }

    if (!cleanCode) {
      setNotice("Account Code is required.");
      return;
    }

    if (!accountGroup) {
      setNotice("Account Group is required.");
      return;
    }

    setAdding(true);
    setNotice("");

    try {
      const response = await fetch(`${API_BASE_URL}/accounts/quick-create`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          account: cleanName,
          acct_code: cleanCode,
          fk_grp_id: Number(accountGroup),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setNotice(formatApiError(data, "Could not create account."));
        return;
      }

      if (data.option) {
        setOptions((previous) => [...previous, data.option]);
        selectOption(data.option);
      }

      setShowAccountDialog(false);
      setAccountName("");
      setAccountCode("");
      setAccountGroup("");
    } catch {
      setNotice("Could not create account — check your connection.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-semibold text-theme-text">
        {label}
      </label>

      <input
        ref={inputRef}
        type="text"
        className={inputClass}
        placeholder={placeholder}
        value={query}
        disabled={disabled}
        onChange={(event) => {
          setQuery(event.target.value);
          openMenu();
          setNotice("");
          onChange({ target: { name, value: "", type: "text" } });
        }}
        onFocus={openMenu}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />

      {open && !disabled && menuRect && createPortal(
        <div
          style={{
            position: "absolute",
            top: menuRect.top,
            left: menuRect.left,
            width: menuRect.width,
          }}
          className="z-50 mt-1 max-h-56 overflow-y-auto rounded-xl border border-theme-border bg-card shadow-lg"
        >
          {loading && (
            <div className="px-3 py-2 text-sm text-theme-faint">Loading…</div>
          )}

          {!loading && filtered.map((option) => (
            <button
              type="button"
              key={option.value}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-theme-primary-soft"
              onMouseDown={() => selectOption(option)}
            >
              {option.label}
            </button>
          ))}

          {!loading && !exactMatch && trimmedQuery && allowCreate && (
            <button
              type="button"
              className="block w-full px-3 py-2 text-left text-sm font-medium text-theme-primary hover:bg-theme-primary-soft"
              onMouseDown={handleAddNew}
              disabled={adding}
            >
              {adding ? "Adding…" : `+ Add "${trimmedQuery}" as new ${label}`}
            </button>
          )}

          {!loading && filtered.length === 0 && (!trimmedQuery || !allowCreate) && (
            <div className="px-3 py-2 text-sm text-theme-faint">No matches</div>
          )}
        </div>,
        document.body
      )}

      {notice && <p className="mt-1 text-xs text-red-500">{notice}</p>}

      {showAccountDialog && table === "accounts" && createPortal(
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
          onMouseDown={() => setShowAccountDialog(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-theme-border bg-card p-5 shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-theme-text">Add New Account</h3>
                <p className="text-xs text-theme-faint">Create it in the real AcctAccount master.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAccountDialog(false)}
                className="text-theme-faint hover:text-theme-text"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-theme-text">Account Name *</label>
                <input
                  className={inputClass}
                  value={accountName}
                  onChange={(event) => setAccountName(event.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-theme-text">Account Code *</label>
                <input
                  className={inputClass}
                  value={accountCode}
                  onChange={(event) => setAccountCode(event.target.value)}
                  placeholder="e.g. SALARY"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-theme-text">Account Group *</label>
                <select
                  className={`${inputClass} cursor-pointer`}
                  value={accountGroup}
                  onChange={(event) => setAccountGroup(event.target.value)}
                  disabled={accountGroupsLoading}
                >
                  <option value="">{accountGroupsLoading ? "Loading groups…" : "Select account group…"}</option>
                  {accountGroups.map((group) => (
                    <option key={group.value} value={group.value}>
                      {group.label}
                    </option>
                  ))}
                </select>
              </div>

              {notice && <p className="text-sm text-red-500">{notice}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAccountDialog(false)}
                  className="rounded-xl border border-theme-border px-4 py-2 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateAccount}
                  disabled={adding || accountGroupsLoading}
                  className="rounded-xl bg-theme-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {adding ? "Creating…" : "Create Account"}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}


// ==================================================
// EMPLOYEE PICKER FIELD
// Reused (with the .trim() crash fix applied to
// SalaryEmployeeMaster.jsx already baked in) for Employee and
// both Reporting To fields — all self-referencing links to
// SalEmployee.pkEmpId via /api/salary-employees/search.
// ==================================================

function EmployeePickerField({
  label,
  name,
  value,
  displayValue,
  onChange,
  excludeEmpId,
  placeholder,
  disabled = false,
}) {

  const [employees, setEmployees] = useState([]);
  const [query, setQuery] = useState(
    displayValue == null || displayValue === "" ? "" : String(displayValue)
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [menuRect, setMenuRect] = useState(null);
  const inputRef = useRef(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  };

  useEffect(() => {
    setQuery(
      displayValue == null || displayValue === "" ? "" : String(displayValue)
    );
  }, [displayValue]);

  const loadEmployees = async () => {
    if (loaded || loading) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/salary-employees`,
        { headers: getAuthHeaders() }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(formatApiError(data, "Could not load employees."));
      }

      setEmployees(data.employees || []);
      setLoaded(true);
    } catch {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const openPicker = async () => {

    if (disabled) return;

    if (inputRef.current) {
      inputRef.current.focus();

      const rect = inputRef.current.getBoundingClientRect();

      setMenuRect({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setOpen(true);
    await loadEmployees();
  };

  const trimmedQuery = String(query ?? "").trim().toLowerCase();

  const filtered = employees.filter((employee) => {
    if (String(employee.pkEmpId) === String(excludeEmpId)) return false;

    if (!trimmedQuery) return true;

    const haystack = [
      employee.Employee,
      employee.EmpCode,
      employee.pkEmpId,
    ]
      .filter((part) => part !== null && part !== undefined)
      .map((part) => String(part).toLowerCase());

    return haystack.some((part) => part.includes(trimmedQuery));
  });

  const selectEmployee = (employee) => {
    onChange({
      target: {
        name,
        value: employee.pkEmpId,
        type: "text",
      },
    });

    setQuery(
      `${employee.Employee || ""}${
        employee.EmpCode ? ` (${employee.EmpCode})` : ""
      }`
    );

    setOpen(false);
  };

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-semibold text-theme-text">
        {label}
      </label>

      <input
        ref={inputRef}
        type="text"
        disabled={disabled}
        title={
          disabled
            ? "You cannot change Employee as you are in Edit Mode."
            : undefined
        }
        className={`${inputClass} disabled:cursor-not-allowed disabled:bg-theme-primary-soft/40`}
        placeholder={placeholder || "Select or type to filter employees…"}
        value={query}
        onFocus={openPicker}
        onChange={(event) => {
          setQuery(event.target.value);

          if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();

            setMenuRect({
              top: rect.bottom + window.scrollY + 4,
              left: rect.left + window.scrollX,
              width: rect.width,
            });
          }

          setOpen(true);
          onChange({
            target: { name, value: "", type: "text" },
          });
          loadEmployees();
        }}
        onBlur={() => setTimeout(() => setOpen(false), 180)}
      />

      {open && menuRect && createPortal(

        <div
          style={{
            position: "absolute",
            top: menuRect.top,
            left: menuRect.left,
            width: menuRect.width,
          }}
          className="z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border border-theme-border bg-card shadow-lg"
        >
          {loading && (
            <div className="px-3 py-2 text-sm text-theme-faint">
              Loading employees…
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="px-3 py-2 text-sm text-theme-faint">
              {employees.length === 0
                ? "No employees found"
                : "No matching employees"}
            </div>
          )}

          {!loading &&
            filtered.map((employee) => (
              <button
                type="button"
                key={employee.pkEmpId}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-theme-primary-soft"
                onMouseDown={() => selectEmployee(employee)}
              >
                <span className="font-medium">{employee.Employee}</span>
                {employee.EmpCode ? ` (${employee.EmpCode})` : ""}
              </button>
            ))}
        </div>,

        document.body

      )}
    </div>
  );

}


// ==================================================
// TOOLBAR / SECTION PRIMITIVES
// ==================================================

function SectionCard({ icon: Icon, title, description, children }) {

  return (

    <div className="overflow-hidden rounded-2xl border border-theme-border bg-card shadow-sm">

      <div className="flex items-center gap-3 border-b border-theme-border px-6 py-5">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-theme-primary-soft text-theme-primary">
          <Icon size={20} />
        </div>

        <div>

          <h2 className="text-lg font-semibold text-theme-text">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm text-theme-muted">
              {description}
            </p>
          )}

        </div>

      </div>

      <div className="p-6">
        {children}
      </div>

    </div>

  );

}

function ToolbarButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  active,
  tone = "default",
  title,
  form,
  type = "button",
}) {

  const toneClass =
    tone === "danger"
      ? "text-theme-danger hover:bg-theme-danger-soft"
      : active
      ? "bg-theme-primary-soft text-theme-primary"
      : "text-theme-text hover:bg-theme-primary-soft";

  return (

    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled}
      title={title || label}
      className={`flex flex-col items-center gap-1 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${toneClass}`}
    >

      <Icon size={17} />

      {label}

    </button>

  );

}

function ToolbarDivider() {

  return <div className="mx-1 h-8 w-px shrink-0 bg-theme-border" />;

}

function CheckboxField({ label, name, checked, onChange }) {

  return (

    <label className="flex cursor-pointer items-center gap-2.5">

      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-theme-border text-theme-primary focus:ring-theme-primary-soft"
      />

      <span className="text-sm font-medium text-theme-text">
        {label}
      </span>

    </label>

  );

}

function RuleCheckbox({ label, name, checked, onChange, colorClass }) {

  return (

    <label className="flex cursor-pointer items-start gap-2.5">

      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 rounded border-theme-border text-theme-primary focus:ring-theme-primary-soft"
      />

      <span className={`text-sm font-medium ${colorClass}`}>
        {label}
      </span>

    </label>

  );

}