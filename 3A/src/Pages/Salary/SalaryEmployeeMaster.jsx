import {
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
  IdCard,
  CalendarDays,
  MapPin,
  Landmark,
  ShieldCheck,
  Users,
  Contact,
  KeyRound,
  BellRing,
  Image as ImageIcon,
  Save,
  Loader2,
  Trash2,
  Search,
  Plus,
  Eye,
  EyeOff,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Phone,
  FileText,
  Upload,
  ExternalLink,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronDown,
  RotateCcw,
  RefreshCw,
  Printer,
  Download,
  HelpCircle,
  DoorOpen,
  Paperclip,
  PencilLine,
  ClipboardList,
  ListChecks,
  X,
} from "lucide-react";

import { Can } from "../../components/Permissions";


// ==================================================
// API
// ==================================================

const API_BASE_URL =
  "http://127.0.0.1:8000/api";


// ==================================================
// FIELD TYPE MAPS
// Used to coerce formData -> the correct JSON types
// before sending to SalEmployeeCreateRequest /
// SalEmployeeUpdateRequest.
// ==================================================

const NUMERIC_FIELDS = [
  "pkEmpId",
  "fkMDocId",
  "Height",
  "fkRGId",
  "fkCSId",
  "fkSTId",
  "fkREmpId",
  "fkW1EmpId",
  "fkW2EmpId",
];

const FLOAT_FIELDS = [
  "Weight",
];

const BOOLEAN_FIELDS = [
  "Male",
  "Married",
  "SB",
  "AttType",
  "Messaging",
  "Geolocation",
  "InformPF",
  "InformESIC",
];

const DATE_FIELDS = [
  "DOJ",
  "DOB",
  "Anni",
  "DOL",
];

const TEXT_LIMITS = {
  EmpCode: 30,
  fkTitId: 5,
  Employee: 50,
  fkQualId: 5,
  PAddress: 255,
  NAddress: 255,
  fkDepId: 5,
  fkDegId: 5,
  fkBnkId: 10,
  AccountNo: 20,
  PFNo: 25,
  ESICNo: 25,
  PANNo: 25,
  BloodGrp: 6,
  WP: 50,
  Aadhar: 50,
  CVCopy: 50,
  LECopy: 50,
  UserName: 15,
  Password: 10,
  Question: 50,
  Answer: 50,
  Ext: 10,
  fkUserId: 5,
  LastStatus: 10,
  RTGS: 20,
  SAddress: 30,
  fkSetId: 5,
  Type: 20,
  Mark: 50,
  Experience: 5,
  Police: 50,
  AddPolice: 255,
  ContPolice: 25,
  Personality1: 50,
  fkP1DesId: 5,
  P1Address: 255,
  P1Contact: 25,
  Personality2: 50,
  fkP2DesId: 5,
  P2Address: 255,
  P2Contact: 25,
  fkAcctId: 10,
  Employment: 3,
};

const REQUIRED_TEXT_DEFAULTS = {
  EmpCode: "EMP",
  Employee: "Employee",
  PAddress: "N/A",
  NAddress: "N/A",
  BloodGrp: "N/A",
  WP: "N/A",
  CVCopy: "N/A",
  LECopy: "N/A",
  UserName: "employee",
  Password: "password",
  Question: "N/A",
  Answer: "N/A",
  Ext: "N/A",
  fkUserId: "ADM01",
  LastStatus: "Active",
  SAddress: "N/A",
  Type: "ALL",
  Mark: "N/A",
  Police: "N/A",
  AddPolice: "N/A",
  ContPolice: "N/A",
  Personality1: "N/A",
  P1Address: "N/A",
  P1Contact: "N/A",
  Personality2: "N/A",
  P2Address: "N/A",
  P2Contact: "N/A",
  Employment: "FT",
};

// ==================================================
// STATUTORY IDENTIFIER VALIDATION
// PFNo (UAN), PANNo, Aadhar, ESICNo, AccountNo and RTGS (IFSC) are
// all optional, but when a value IS entered it must match the real
// format -- mirrors the field_validators in schema.py exactly so the
// user sees the same rule client-side instead of only on submit.
// Uniqueness itself can only be checked server-side (needs the DB).
//
// Note: UAN here is 10 digits per this deployment's spec -- the
// official UIDAI/EPFO UAN format is actually 12 digits. Flag if that
// 10 was meant to be 12.
// ==================================================

const IDENTIFIER_VALIDATORS = {
  PANNo: {
    label: "PAN",
    hint: "10 characters, e.g. ABCDE1234F",
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
    normalize: (value) => value.toUpperCase().replace(/\s+/g, ""),
  },
  Aadhar: {
    label: "Aadhar number",
    hint: "12 digits",
    pattern: /^[0-9]{12}$/,
    normalize: (value) => value.replace(/\D/g, ""),
  },
  ESICNo: {
    label: "ESIC number",
    hint: "17 digits",
    pattern: /^[0-9]{17}$/,
    normalize: (value) => value.replace(/\D/g, ""),
  },
  PFNo: {
    label: "UAN (PF No.)",
    hint: "10 digits",
    pattern: /^[0-9]{10}$/,
    normalize: (value) => value.replace(/\D/g, ""),
  },
  RTGS: {
    label: "IFSC code",
    hint: "e.g. HDFC0001234",
    pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
    normalize: (value) => value.toUpperCase().replace(/\s+/g, ""),
  },
  AccountNo: {
    label: "Bank account number",
    hint: "9–18 digits",
    pattern: /^[0-9]{9,18}$/,
    normalize: (value) => value.replace(/\D/g, ""),
  },
};

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
// FastAPI's 422 body is {"detail": [{loc, msg, type}, ...]} -- an
// array of objects, not a string, so `new Error(data.detail)` would
// show "[object Object]". Rules enforced on the whole request body
// (leaving date / witnesses in schema.py) report against "body" with
// a "Value error, " prefix; both are stripped so the popup reads
// like the client-side message for the same rule.
// ==================================================

function formatApiError(data, fallback) {

  const detail = data?.detail;

  if (!detail) return fallback;

  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {

    const message = detail
      .map((item) => {

        if (typeof item === "string") return item;

        const text = String(item?.msg ?? "").replace(/^Value error,\s*/i, "");

        if (!text) return "";

        const field = Array.isArray(item?.loc)
          ? item.loc[item.loc.length - 1]
          : null;

        return field && field !== "body" ? `${field}: ${text}` : text;

      })
      .filter(Boolean)
      .join("; ");

    return message || fallback;

  }

  return fallback;

}


// ==================================================
// CROSS-FIELD RULES
// Leaving Date must not be before Joining Date, and Witness 1 /
// Witness 2 must be different employees. One implementation is
// shared by live validation (handleChange) and the save check
// (validateLegacyRules), so the inline message, the summary list
// and the "Can't Save" popup can never disagree. schema.py enforces
// the same two rules server-side.
//
// Errors are keyed by the field they render under: DOL for the
// dates, fkW2EmpId for the witnesses.
// ==================================================

const DATE_RANGE_FIELDS = ["DOJ", "DOL"];

const WITNESS_FIELDS = ["fkW1EmpId", "fkW2EmpId"];

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// Ids can arrive as numbers (picker) or strings (loaded record), so
// compare them numerically where possible instead of by type.
const isSameEmployeeId = (first, second) => {

  const a = String(first ?? "").trim();
  const b = String(second ?? "").trim();

  if (!a || !b) return false;

  const numericA = Number(a);
  const numericB = Number(b);

  return Number.isFinite(numericA) && Number.isFinite(numericB)
    ? numericA === numericB
    : a === b;

};

const validateCrossFields = (data) => {

  const errors = {};

  const joining = String(data.DOJ ?? "").trim();
  const leaving = String(data.DOL ?? "").trim();

  // ISO yyyy-mm-dd strings sort the same as the dates they represent.
  if (
    ISO_DATE_PATTERN.test(joining) &&
    ISO_DATE_PATTERN.test(leaving) &&
    leaving < joining
  ) {
    errors.DOL = `Please enter\\select Leaving Date equal to or greater then Joining Date = ${joining}.`;
  }

  if (isSameEmployeeId(data.fkW1EmpId, data.fkW2EmpId)) {
    errors.fkW2EmpId = "Witness 1 and Witness 2 cannot be the same employee.";
  }

  return errors;

};

const validateIdentifierField = (name, rawValue) => {

  const config = IDENTIFIER_VALIDATORS[name];

  if (!config) return "";

  const trimmed = (rawValue || "").trim();

  if (!trimmed) return "";

  return config.pattern.test(trimmed)
    ? ""
    : `${config.label} must be ${config.hint}`;

};

// ==================================================
// CONTACT NUMBER / E-MAIL VALIDATION
// Mirrors the _validate_phone / _validate_phone_or_email
// helpers in schema.py so the rule is identical on both
// sides. Covers:
//
//   ContPolice  -> Police Station "Contact No."
//   P1Contact   -> Personality 1 "Contact No."
//   P2Contact   -> Personality 2 "Contact No."
//   SalEmpContact.Contact -> the "Phone, Fax, E-Mail" grid
//
// The grid column is the interesting one: it holds either a
// number or an e-mail depending on the row's Contact Mode
// (ContMOC). The server only gets the mode *code*, so it
// accepts either shape; here we have the resolved mode
// *label*, so we apply the tighter per-mode rule -- an
// "E-Mail" row must contain an e-mail, a "Mobile" row must
// contain a number. If the mode isn't picked yet (or isn't
// recognisable as either), we fall back to "phone or e-mail"
// so the user isn't blocked by a mode we don't know about.
//
// The "N/A" sentinel allowance exists because
// REQUIRED_TEXT_DEFAULTS below ships "N/A" for the three
// SalEmployee columns when they're left blank -- see the
// note on _BLANK_SENTINELS in schema.py.
// ==================================================

const BLANK_SENTINELS = new Set([
  "", "N/A", "NA", "-", "--", "NONE", "NIL",
]);

const PHONE_PATTERN = /^\+?[0-9]{7,15}$/;

const EMAIL_PATTERN =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;

const PHONE_HINT = "7–15 digits, optional leading +";
const EMAIL_HINT = "e.g. name@company.com";

const stripPhoneFormatting = (value) =>
  String(value || "").trim().replace(/[\s\-().]/g, "");

const isBlankSentinel = (value) =>
  BLANK_SENTINELS.has(String(value || "").trim().toUpperCase());

const looksLikePhone = (value) =>
  PHONE_PATTERN.test(stripPhoneFormatting(value));

const looksLikeEmail = (value) =>
  EMAIL_PATTERN.test(String(value || "").trim());

// The three plain phone-only columns on SalEmployee.
const PHONE_FIELDS = {
  ContPolice: "Police station contact no.",
  P1Contact: "Personality 1 contact no.",
  P2Contact: "Personality 2 contact no.",
};

const validatePhoneField = (name, rawValue) => {

  const label = PHONE_FIELDS[name];

  if (!label) return "";

  const trimmed = (rawValue || "").trim();

  if (isBlankSentinel(trimmed)) return "";

  return looksLikePhone(trimmed)
    ? ""
    : `${label} must be a valid phone number (${PHONE_HINT})`;

};

// Decide, from a ContMOC label like "Mobile" / "Office No." /
// "E-Mail" / "Fax", which shape the row's Contact should be.
// Returns "email", "phone" or "any".
const contactModeKind = (modeLabel) => {

  const text = String(modeLabel || "").toLowerCase();

  if (!text) return "any";

  if (
    text.includes("mail") ||
    text.includes("e-mail") ||
    text.includes("email")
  ) {
    return "email";
  }

  if (
    text.includes("phone") ||
    text.includes("mobile") ||
    text.includes("cell") ||
    text.includes("fax") ||
    text.includes("tel") ||
    text.includes("no.") ||
    text.includes("number") ||
    text.includes("epabx") ||
    text.includes("land")
  ) {
    return "phone";
  }

  return "any";

};

// ==================================================
// EXPERIENCE — PORT OF ncYExperience / ncMExperience
// ==================================================
// SaveRecords' exact three branches:
//   both filled -> "{years}.{months}"
//   years only  -> "{years}"
//   months only -> "0.{months}"
// Loading a record splits on "." the same way LoadRecords does; a
// value with no "." is read as years-only, matching the legacy
// ELSE branch (ncYExperience.Value = the raw text, months blank).

function parseExperience(value) {

  const text = (value ?? "").toString().trim();

  if (!text) return { years: "", months: "" };

  if (text.includes(".")) {
    const [years, months] = text.split(".");
    return { years: years || "", months: months || "" };
  }

  return { years: text, months: "" };

}

function formatExperience(years, months) {

  const y = (years ?? "").toString().trim();
  const m = (months ?? "").toString().trim();

  if (y !== "" && m !== "") return `${y}.${m}`;
  if (y !== "") return y;
  if (m !== "") return `0.${m}`;
  return "";

}


const validateContactValue = (modeLabel, rawValue) => {

  const trimmed = (rawValue || "").trim();

  if (isBlankSentinel(trimmed)) return "";

  const kind = contactModeKind(modeLabel);

  if (kind === "email") {

    return looksLikeEmail(trimmed)
      ? ""
      : `Enter a valid e-mail address (${EMAIL_HINT})`;

  }

  if (kind === "phone") {

    return looksLikePhone(trimmed)
      ? ""
      : `Enter a valid phone number (${PHONE_HINT})`;

  }

  return looksLikePhone(trimmed) || looksLikeEmail(trimmed)
    ? ""
    : "Enter a valid phone number or e-mail address";

};

const contactPlaceholderFor = (modeLabel) => {

  const kind = contactModeKind(modeLabel);

  if (kind === "email") return "name@company.com";

  if (kind === "phone") return "+91 98765 43210";

  return "Number or e-mail address";

};


const requiredDefault = (key, employeeId) => {

  if (key === "EmpCode") {

    return `EMP${employeeId || ""}`;

  }

  if (key === "UserName") {

    return `emp${employeeId || ""}`;

  }

  return REQUIRED_TEXT_DEFAULTS[key] || "";

};

const limitText = (key, value) => {

  const maxLength = TEXT_LIMITS[key];

  if (!maxLength || value === null || value === undefined) {

    return value;

  }

  return String(value).slice(0, maxLength);

};


// ==================================================
// EMPTY FORM
// ==================================================

// ==================================================
// CHILD GRID ROW TEMPLATES
//
// These map to the legacy child tables that hang off
// SalEmployee:
//   SalEmpContact   -> "Phone, Fax, E-Mail" grid
//   SalEmpRelation  -> relatives grid
//   SalEmpDocuments -> certificates/licenses grid
//
// The FK code fields on the relatives grid (fkRelId, fkQuaId,
// fkDesId, fkSchId) are wired to the generic lookup combobox
// (LookupComboField) the same way the main form's Title field
// is: fkRelId -> "relations" (ContRelationship), fkQuaId ->
// "qualifications", fkDesId -> "designations", fkSchId ->
// "banks" (both Bank Name and School/College read from the
// same ContCommon table). MS (marital status) isn't a foreign
// key in SalEmpRelation -- it's a plain string column -- so it
// stays a fixed dropdown rather than a DB-backed lookup.
//
// fkDTId (documents grid) still points at a master table that
// doesn't exist in this app yet, so it remains a plain input
// for now. fkMOCId (contact grid) is wired to the "contact-
// modes" lookup below -- picker only, no inline "add new" (see
// the ContMOC comment in model.py for why).
// ==================================================

const EMPTY_CONTACT_ROW = {
  fkMOCId: "",
  Contact: "",
  Ext: "",
};

const EMPTY_RELATION_ROW = {
  RelativeName: "",
  fkRelId: "",
  MS: "",
  DOB: "",
  fkQuaId: "",
  fkDesId: "",
  fkSchId: "",
};


const EMPTY_FORM = {

  pkEmpId: "",
  EmpCode: "",
  fkTitId: "",
  Employee: "",
  DOJ: "",
  DOB: "",
  Photo: "",
  fkQualId: "",
  Male: true,
  Married: false,
  Anni: "",
  PAddress: "",
  NAddress: "",
  fkDepId: "",
  fkDegId: "",
  fkBnkId: "",
  AccountNo: "",
  PFNo: "",
  ESICNo: "",
  PANNo: "",
  DOL: "",
  BloodGrp: "",
  WP: "",
  Aadhar: "",
  CVCopy: "",
  LECopy: "",
  fkMDocId: "",
  UserName: "",
  Password: "",
  Question: "",
  Answer: "",
  Ext: "",
  RTGS: "",
  SAddress: "",
  SB: false,
  // EmptyFields: ddType.Text = "Office Staff",
  // ddAttendance.Text = "Daily Attendance" (AttType true).
  Type: "Office Staff",
  AttType: true,
  Height: "",
  Weight: "",
  fkRGId: "",
  fkCSId: "",
  fkSTId: "",
  Mark: "",
  Experience: "",
  fkREmpId: "",
  Police: "",
  AddPolice: "",
  ContPolice: "",
  fkW1EmpId: "",
  fkW2EmpId: "",
  Personality1: "",
  fkP1DesId: "",
  P1Address: "",
  P1Contact: "",
  Personality2: "",
  fkP2DesId: "",
  P2Address: "",
  P2Contact: "",
  Messaging: true,
  fkAcctId: "",
  Geolocation: true,
  Employment: "",
  InformPF: false,
  InformESIC: false,

};


// ==================================================
// SALARY EMPLOYEE MASTER
// ==================================================

export default function SalaryEmployeeMaster() {


  // ==================================================
  // ROUTE PARAM (edit mode) / NAVIGATION
  // /salary-employee            -> create mode
  // /salary-employee/:id        -> edit mode, loads
  //                                that employee on
  //                                mount automatically
  // ==================================================

  const { id: routeEmployeeId } =
    useParams();

  const navigate =
    useNavigate();


  // ==================================================
  // STATE
  // ==================================================

  const [formData, setFormData] =
    useState(EMPTY_FORM);

  const [mode, setMode] =
    useState("create");

  const [lookupId, setLookupId] =
    useState("");

  const [photoPreview, setPhotoPreview] =
    useState(null);

  // ==================================================
  // CHILD GRID STATE
  //
  // Contacts and relatives are edited locally and written
  // as a full replacement set when the employee is saved,
  // so they work in create mode too (they're synced right
  // after the employee row exists).
  //
  // Documents are different: each row owns a real file, so
  // they upload immediately and therefore need a saved
  // employee to attach to.
  // ==================================================

  const [contactRows, setContactRows] =
    useState([]);

  // Resolved ContMOC *labels* per contact row, keyed by row
  // index. contactRows only carries fkMOCId (the code), but
  // validating the Contact column needs the human label
  // ("E-Mail" vs "Mobile") -- LookupComboField hands it back
  // via onOptionResolved. Index-keyed rather than stored on
  // the row itself so it never leaks into the save payload.
  const [contactModeLabels, setContactModeLabels] =
    useState({});

  const [relationRows, setRelationRows] =
    useState([]);

  const [documents, setDocuments] =
    useState([]);

  const [childLoading, setChildLoading] =
    useState(false);

  const [childError, setChildError] =
    useState("");

  const [documentUploading, setDocumentUploading] =
    useState(false);

  const [documentDraft, setDocumentDraft] =
    useState({
      fkDTId: "",
      ValidUntil: "",
    });

  // ==================================================
  // RECORD NAVIGATION (First / Prior / Next / Last)
  //
  // Loaded once and reused for the whole session on this
  // page — good enough for a First/Prior/Next/Last rail.
  // For very large employee counts this should switch to
  // a paged "next id after X" endpoint instead.
  // ==================================================

  const [employeeIds, setEmployeeIds] =
    useState([]);

  const [employeeIdsLoading, setEmployeeIdsLoading] =
    useState(false);

  // Which attach flavor the "Addl." dropdown is currently
  // mid-upload for — drives whether the uploaded document's
  // name also gets written into CVCopy or LECopy.

  const [attachMenuOpen, setAttachMenuOpen] =
    useState(false);

  const [attachKind, setAttachKind] =
    useState(null);

  // "Addl." toolbar button — shows the grouped Additional
  // Information dialog (see the ADDITIONAL INFORMATION
  // section near the end of the JSX below).

  const [showAdditionalInfo, setShowAdditionalInfo] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [lookupLoading, setLookupLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [fieldErrors, setFieldErrors] =
    useState({});


  // ==================================================
  // AUTH HEADERS
  // ==================================================

  const getAuthHeaders = () => {

    const token =
      localStorage.getItem("access_token");

    if (!token) {

      throw new Error(
        "Authentication token not found."
      );

    }

    return {

      Authorization: `Bearer ${token}`,

      Accept: "application/json",

      "Content-Type": "application/json",

    };

  };


  // Multipart uploads and file downloads must NOT carry a
  // JSON Content-Type — the browser sets its own boundary
  // for FormData, and overriding it breaks the upload.

  const getAuthOnlyHeaders = () => {

    const token =
      localStorage.getItem("access_token");

    if (!token) {

      throw new Error(
        "Authentication token not found."
      );

    }

    return {

      Authorization: `Bearer ${token}`,

    };

  };


  // ==================================================
  // SUGGEST NEXT EMPLOYEE ID ON MOUNT
  // pkEmpId is a plain integer primary key (not a
  // SERIAL column), so the caller has to supply it.
  // We suggest the next free number but leave it
  // editable, matching the legacy screen.
  // ==================================================

  useEffect(() => {

    if (routeEmployeeId) return;

    const suggestNextId = async () => {

      try {

        const response = await fetch(
          `${API_BASE_URL}/salary-employees`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) return;

        const data = await response.json();

        const maxId = (data.employees || []).reduce(
          (max, employee) =>
            Math.max(max, employee.pkEmpId || 0),
          0
        );

        setFormData((previous) => ({
          ...previous,
          pkEmpId: String(maxId + 1),
        }));

      } catch {

        // Non-fatal — the field just stays blank
        // and the user can type an id manually.

      }

    };

    suggestNextId();

  }, [routeEmployeeId]);


  // ==================================================
  // HANDLE CHANGE
  // ==================================================

  const handleChange = (event) => {

    const { name, value, type, checked } =
      event.target;

    let nextValue = type === "checkbox" ? checked : value;

    if (IDENTIFIER_VALIDATORS[name] && typeof nextValue === "string") {

      nextValue = IDENTIFIER_VALIDATORS[name].normalize(nextValue);

    }

    setFormData((previous) => ({
      ...previous,
      [name]: nextValue,
    }));

    if (IDENTIFIER_VALIDATORS[name]) {

      setFieldErrors((previous) => ({
        ...previous,
        [name]: validateIdentifierField(name, nextValue),
      }));

    }

    // Phone-only columns (police / personality contact nos.).
    // Deliberately NOT normalized the way identifiers are --
    // the DB stores whatever formatting the user typed, and
    // rewriting it mid-keystroke fights the cursor.
    if (PHONE_FIELDS[name]) {

      setFieldErrors((previous) => ({
        ...previous,
        [name]: validatePhoneField(name, nextValue),
      }));

    }

    // Joining/Leaving date and the two witnesses depend on each other, so
    // changing either side re-checks the pair and clears a stale message
    // as soon as the clash is fixed. Shown inline only -- the "Can't Save"
    // popup is reserved for the save attempt, otherwise it would fire on
    // every partial year typed into a date box.
    if (
      DATE_RANGE_FIELDS.includes(name) ||
      WITNESS_FIELDS.includes(name)
    ) {

      const crossErrors = validateCrossFields({
        ...formData,
        [name]: nextValue,
      });

      setFieldErrors((previous) => {

        const next = { ...previous };

        if (DATE_RANGE_FIELDS.includes(name)) {
          delete next.DOL;
          if (crossErrors.DOL) next.DOL = crossErrors.DOL;
        }

        if (WITNESS_FIELDS.includes(name)) {
          delete next.fkW2EmpId;
          if (crossErrors.fkW2EmpId) next.fkW2EmpId = crossErrors.fkW2EmpId;
        }

        return next;

      });

    }

    setError("");
    setSuccess("");

  };


  const handleRadioBool = (name, value) => {

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // ==================================================
  // PHOTO
  //
  // formData.Photo always holds BARE base64 (no data: URL
  // prefix); photoPreview holds the full data: URL used for
  // <img src>. The backend decodes the base64 into real
  // image bytes and returns a data: URL on read.
  //
  // Payload convention agreed with route.py:
  //   ""   -> clear the photo
  //   null -> field not supplied, leave existing photo alone
  //
  // Still worth doing eventually: a real multipart upload
  // endpoint, so large images aren't shipped as base64 JSON.
  // ==================================================

  const stripDataUrlPrefix = (value) => {

    if (!value) return "";

    const text = String(value);

    return text.startsWith("data:")
      ? text.slice(text.indexOf(",") + 1)
      : text;

  };


  const handlePhotoSelect = (event) => {

    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {

      setPhotoPreview(reader.result);

      setFormData((previous) => ({
        ...previous,
        Photo: reader.result.split(",")[1] || "",
      }));

    };

    reader.readAsDataURL(file);

  };

  const handlePhotoClear = () => {

    setPhotoPreview(null);

    setFormData((previous) => ({
      ...previous,
      Photo: "",
    }));

  };


  // ==================================================
  // CHILD GRIDS — CONTACTS & RELATIVES
  // ==================================================

  const addContactRow = () => {

    setContactRows((previous) => [
      ...previous,
      { ...EMPTY_CONTACT_ROW },
    ]);

  };

  const updateContactRow = (index, field, value) => {

    setContactRows((previous) =>
      previous.map((row, rowIndex) =>
        rowIndex === index
          ? { ...row, [field]: value }
          : row
      )
    );

  };

  const removeContactRow = (index) => {

    setContactRows((previous) =>
      previous.filter(
        (_, rowIndex) => rowIndex !== index
      )
    );

    // Labels are index-keyed, so removing row N has to shift
    // every label above N down one -- otherwise the row that
    // moves up inherits the deleted row's mode and gets
    // validated against the wrong rule.
    setContactModeLabels((previous) => {

      const next = {};

      Object.keys(previous).forEach((key) => {

        const rowIndex = Number(key);

        if (rowIndex < index) {
          next[rowIndex] = previous[key];
        } else if (rowIndex > index) {
          next[rowIndex - 1] = previous[key];
        }

      });

      return next;

    });

  };


  const setContactModeLabel = (index, label) => {

    setContactModeLabels((previous) =>
      previous[index] === label
        ? previous
        : { ...previous, [index]: label }
    );

  };


  // ==================================================
  // CONTACT GRID VALIDATION
  // Recomputed from contactRows + contactModeLabels rather
  // than held in its own state, so it can never drift out of
  // sync with the rows it describes.
  // ==================================================

  const contactRowErrors = contactRows.map((row, index) =>
    validateContactValue(
      contactModeLabels[index],
      row.Contact
    )
  );

  const hasContactRowErrors = contactRowErrors.some(Boolean);

  const addRelationRow = () => {

    setRelationRows((previous) => [
      ...previous,
      { ...EMPTY_RELATION_ROW },
    ]);

  };

  const updateRelationRow = (index, field, value) => {

    setRelationRows((previous) =>
      previous.map((row, rowIndex) =>
        rowIndex === index
          ? { ...row, [field]: value }
          : row
      )
    );

  };

  const removeRelationRow = (index) => {

    setRelationRows((previous) =>
      previous.filter(
        (_, rowIndex) => rowIndex !== index
      )
    );

  };


  // ==================================================
  // LOAD CHILD RECORDS
  // ==================================================

  const loadChildRecords = async (employeeId) => {

    if (!employeeId) return;

    setChildError("");
    setChildLoading(true);

    try {

      const [
        contactResponse,
        relationResponse,
        documentResponse,
      ] = await Promise.all([

        fetch(
          `${API_BASE_URL}/salary-employees/${employeeId}/contacts`,
          { headers: getAuthHeaders() }
        ),

        fetch(
          `${API_BASE_URL}/salary-employees/${employeeId}/relations`,
          { headers: getAuthHeaders() }
        ),

        fetch(
          `${API_BASE_URL}/salary-employees/${employeeId}/documents`,
          { headers: getAuthHeaders() }
        ),

      ]);

      if (contactResponse.ok) {

        const data = await contactResponse.json();

        setContactRows(
          (data.contacts || []).map((row) => ({
            fkMOCId: row.fkMOCId ?? "",
            Contact: row.Contact ?? "",
            Ext: row.Ext ?? "",
          }))
        );

      }

      if (relationResponse.ok) {

        const data = await relationResponse.json();

        setRelationRows(
          (data.relations || []).map((row) => ({
            RelativeName: row.RelativeName ?? "",
            fkRelId: row.fkRelId ?? "",
            MS: row.MS ?? "",
            DOB: row.DOB
              ? String(row.DOB).slice(0, 10)
              : "",
            fkQuaId: row.fkQuaId ?? "",
            fkDesId: row.fkDesId ?? "",
            fkSchId: row.fkSchId ?? "",
          }))
        );

      }

      if (documentResponse.ok) {

        const data = await documentResponse.json();

        setDocuments(data.documents || []);

      }

    } catch (err) {

      setChildError(
        "Could not load contacts, relatives or documents."
      );

    } finally {

      setChildLoading(false);

    }

  };


  // ==================================================
  // SYNC CHILD ROWS
  //
  // Sent as a full replacement set: whatever is in the
  // grid becomes the complete list for this employee.
  // Rows with nothing typed in them are dropped rather
  // than saved as blanks.
  // ==================================================

  const syncChildRows = async (employeeId) => {

    const contactPayload = contactRows
      .filter((row) =>
        (row.Contact || "").trim() !== ""
      )
      .map((row, index) => ({
        fkMOCId: row.fkMOCId?.trim() || null,
        Contact: row.Contact.trim(),
        Ext: row.Ext?.trim() || null,
        SrNo: index + 1,
      }));

    const relationPayload = relationRows
      .filter((row) =>
        (row.RelativeName || "").trim() !== ""
      )
      .map((row) => ({
        RelativeName: row.RelativeName.trim(),
        fkRelId: row.fkRelId?.trim() || null,
        MS: row.MS?.trim() || null,
        DOB: row.DOB || null,
        fkQuaId: row.fkQuaId?.trim() || null,
        fkDesId: row.fkDesId?.trim() || null,
        fkSchId: row.fkSchId?.trim() || null,
      }));

    const responses = await Promise.all([

      fetch(
        `${API_BASE_URL}/salary-employees/${employeeId}/contacts`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ rows: contactPayload }),
        }
      ),

      fetch(
        `${API_BASE_URL}/salary-employees/${employeeId}/relations`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ rows: relationPayload }),
        }
      ),

    ]);

    const failed = responses.find(
      (response) => !response.ok
    );

    if (failed) {

      const data = await failed
        .json()
        .catch(() => ({}));

      throw new Error(
        data.detail ||
          "Employee saved, but contacts/relatives could not be saved."
      );

    }

  };


  // ==================================================
  // DOCUMENTS
  // ==================================================

  // ==================================================
  // "ADDL." ATTACHMENTS  (Attach Curriculum Vitae / Offer
  // Letter — mirrors the paperclip menu next to
  // Qualification in the legacy form)
  //
  // These reuse the same document-upload endpoint as the
  // Certificates section below, then also write the
  // uploaded file's display name into CVCopy / LECopy —
  // those two columns only ever held a filename reference,
  // never the file itself, even in the legacy app.
  // ==================================================

  const handleAttachUpload = async (event, kind) => {

    const file = event.target.files?.[0];

    event.target.value = "";

    setAttachMenuOpen(false);

    if (!file) return;

    if (mode !== "edit" || !formData.pkEmpId) {

      setChildError(
        "Save the employee first, then attach a CV or offer letter."
      );

      return;

    }

    setChildError("");
    setAttachKind(kind);

    try {

      const body = new FormData();

      body.append("file", file);

      const response = await fetch(
        `${API_BASE_URL}/salary-employees/${formData.pkEmpId}/documents`,
        {
          method: "POST",
          headers: getAuthOnlyHeaders(),
          body,
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.detail || "Upload failed."
        );

      }

      setDocuments((previous) => [
        ...previous,
        data.document,
      ]);

      const fieldName =
        kind === "cv" ? "CVCopy" : "LECopy";

      setFormData((previous) => ({
        ...previous,
        [fieldName]: data.document.DisplayName || file.name,
      }));

      setSuccess(
        (kind === "cv"
          ? "CV uploaded. "
          : "Offer letter uploaded. ") +
          "Remember to Save to keep the filename reference."
      );

    } catch (err) {

      setChildError(
        err.message || "Could not upload the file."
      );

    } finally {

      setAttachKind(null);

    }

  };


  const handleDocumentUpload = async (event) => {

    const file = event.target.files?.[0];

    // Reset the input so re-picking the same file fires
    // change again.
    event.target.value = "";

    if (!file) return;

    if (mode !== "edit" || !formData.pkEmpId) {

      setChildError(
        "Save the employee first, then attach documents."
      );

      return;

    }

    setChildError("");
    setDocumentUploading(true);

    try {

      const body = new FormData();

      body.append("file", file);

      if (documentDraft.fkDTId) {

        body.append("fkDTId", documentDraft.fkDTId);

      }

      if (documentDraft.ValidUntil) {

        body.append("ValidUntil", documentDraft.ValidUntil);

      }

      const response = await fetch(
        `${API_BASE_URL}/salary-employees/${formData.pkEmpId}/documents`,
        {
          method: "POST",
          headers: getAuthOnlyHeaders(),
          body,
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.detail || "Upload failed."
        );

      }

      setDocuments((previous) => [
        ...previous,
        data.document,
      ]);

      setDocumentDraft({
        fkDTId: "",
        ValidUntil: "",
      });

    } catch (err) {

      setChildError(
        err.message || "Could not upload the document."
      );

    } finally {

      setDocumentUploading(false);

    }

  };


  // Open a stored document in a new tab. The endpoint needs
  // the bearer token, so a plain <a href> won't work — fetch
  // the file, wrap it in an object URL, and open that.

  const handleDocumentOpen = async (document_) => {

    setChildError("");

    try {

      const response = await fetch(
        `${API_BASE_URL}/salary-employees/${formData.pkEmpId}` +
          `/documents/${document_.pkDEmpId}/file`,
        {
          headers: getAuthOnlyHeaders(),
        }
      );

      if (!response.ok) {

        const data = await response
          .json()
          .catch(() => ({}));

        throw new Error(
          data.detail ||
            "The file could not be opened."
        );

      }

      const blob = await response.blob();

      const objectUrl = URL.createObjectURL(blob);

      const opened = window.open(
        objectUrl,
        "_blank",
        "noopener"
      );

      if (!opened) {

        setChildError(
          "Your browser blocked the popup. Allow popups to view documents."
        );

      }

      // Give the new tab time to read the blob before the
      // URL is released.
      setTimeout(
        () => URL.revokeObjectURL(objectUrl),
        60000
      );

    } catch (err) {

      setChildError(
        err.message || "The file could not be opened."
      );

    }

  };


  const handleDocumentDelete = async (document_) => {

    if (
      !window.confirm(
        "Remove this document? The file will be deleted."
      )
    ) {

      return;

    }

    setChildError("");

    try {

      const response = await fetch(
        `${API_BASE_URL}/salary-employees/${formData.pkEmpId}` +
          `/documents/${document_.pkDEmpId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {

        const data = await response
          .json()
          .catch(() => ({}));

        throw new Error(
          data.detail || "Could not delete the document."
        );

      }

      setDocuments((previous) =>
        previous.filter(
          (row) => row.pkDEmpId !== document_.pkDEmpId
        )
      );

    } catch (err) {

      setChildError(
        err.message || "Could not delete the document."
      );

    }

  };


  // ==================================================
  // RESET / NEW
  // ==================================================

  const handleNew = () => {

    setFormData(EMPTY_FORM);
    setFieldErrors({});
    setMode("create");
    setLookupId("");
    setPhotoPreview(null);
    setContactRows([]);
    setRelationRows([]);
    setDocuments([]);
    setChildError("");
    setDocumentDraft({
      fkDTId: "",
      ValidUntil: "",
    });
    setError("");
    setSuccess("");

    if (routeEmployeeId) {

      navigate("/salary-employee");

    }

  };


  // ==================================================
  // LOAD EXISTING EMPLOYEE
  // ==================================================

  const loadEmployee = async (employeeId) => {

    if (!employeeId) {

      setError("Enter an Employee ID to load.");
      return;

    }

    setError("");
    setSuccess("");
    setLookupLoading(true);

    try {

      const response = await fetch(
        `${API_BASE_URL}/salary-employees/${employeeId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.detail || "Employee not found."
        );

      }

      const employee = data.employee;

      const nextForm = { ...EMPTY_FORM };

      for (const key of Object.keys(EMPTY_FORM)) {

        // The backend returns Photo as a data: URL. Keep the
        // bare base64 in formData (that's what the API expects
        // back on save) and use the full URL for the preview.

        if (key === "Photo") {

          nextForm[key] = stripDataUrlPrefix(employee.Photo);

          continue;

        }

        if (DATE_FIELDS.includes(key)) {

          nextForm[key] = employee[key]
            ? String(employee[key]).slice(0, 10)
            : "";

          continue;

        }

        if (BOOLEAN_FIELDS.includes(key)) {

          nextForm[key] = Boolean(employee[key]);

          continue;

        }

        nextForm[key] =
          employee[key] === null ||
          employee[key] === undefined
            ? ""
            : employee[key];

      }

      setFormData(nextForm);
      setFieldErrors({});
      setMode("edit");
      setPhotoPreview(employee.Photo || null);
      setLookupId(String(employeeId));

      loadChildRecords(employeeId);

    } catch (err) {

      setError(err.message || "Failed to load employee.");

    } finally {

      setLookupLoading(false);

    }

  };


  // Manual "Employee ID" box in the toolbar — jumps to
  // the edit URL for that id, which the effect below
  // then loads. Keeps the URL as the single source of
  // truth for which employee is being edited.

  const handleLoad = () => {

    if (!lookupId) {

      setError("Enter an Employee ID to load.");
      return;

    }

    navigate(`/salary-employee/${lookupId}`);

  };


  // Auto-load whenever the route's :id changes — this is
  // what makes the "Edit" action on the employee list work.

  useEffect(() => {

    if (!routeEmployeeId) return;

    loadEmployee(routeEmployeeId);

  }, [routeEmployeeId]);


  // Loaded once so First/Prior/Next/Last have something to
  // step through, and refreshed by the toolbar's Refresh
  // button after a save that adds/removes a record.

  const fetchEmployeeIds = async () => {

    setEmployeeIdsLoading(true);

    try {

      const response = await fetch(
        `${API_BASE_URL}/salary-employees`,
        { headers: getAuthHeaders() }
      );

      if (!response.ok) return;

      const data = await response.json();

      const ids = (data.employees || data || [])
        .map((row) => Number(row.pkEmpId))
        .filter((value) => !Number.isNaN(value))
        .sort((a, b) => a - b);

      setEmployeeIds(ids);

    } catch {

      // Non-fatal — the navigation buttons just stay
      // disabled if this fails.

    } finally {

      setEmployeeIdsLoading(false);

    }

  };

  useEffect(() => {

    fetchEmployeeIds();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const currentRecordIndex = employeeIds.indexOf(
    Number(formData.pkEmpId)
  );

  const goToEmployee = (id) => {

    if (id === undefined || id === null) return;

    navigate(`/salary-employee/${id}`);

  };

  const goFirst = () =>
    goToEmployee(employeeIds[0]);

  const goPrior = () =>
    goToEmployee(
      currentRecordIndex > 0
        ? employeeIds[currentRecordIndex - 1]
        : employeeIds[0]
    );

  const goNext = () =>
    goToEmployee(
      currentRecordIndex >= 0 &&
        currentRecordIndex < employeeIds.length - 1
        ? employeeIds[currentRecordIndex + 1]
        : employeeIds[employeeIds.length - 1]
    );

  const goLast = () =>
    goToEmployee(employeeIds[employeeIds.length - 1]);

  const isAtFirst =
    employeeIds.length === 0 ||
    currentRecordIndex <= 0;

  const isAtLast =
    employeeIds.length === 0 ||
    currentRecordIndex === -1 ||
    currentRecordIndex >= employeeIds.length - 1;


  // ==================================================
  // BUILD PAYLOAD
  // ==================================================

  const buildPayload = () => {

    const payload = {};
    const employeeId = formData.pkEmpId;

    for (const [key, value] of Object.entries(formData)) {

      if (key === "Photo") {

        // Always send a string: the loaded photo is re-sent
        // unchanged on edit, and "" means an explicit clear.
        payload[key] = value || "";
        continue;

      }

      if (NUMERIC_FIELDS.includes(key)) {

        payload[key] =
          value === "" || value === null || value === undefined
            ? null
            : parseInt(value, 10);

        continue;

      }

      if (FLOAT_FIELDS.includes(key)) {

        payload[key] =
          value === "" || value === null || value === undefined
            ? null
            : parseFloat(value);

        continue;

      }

      if (BOOLEAN_FIELDS.includes(key)) {

        payload[key] = Boolean(value);
        continue;

      }

      if (DATE_FIELDS.includes(key)) {

        // DOJ used to fall back to today when left blank, which meant a
        // record the legacy form would have refused to save went through
        // with a made-up joining date. It is a hard requirement in
        // ValidateFields, so send exactly what the user entered.
        payload[key] = value || null;

        continue;

      }

      if (Object.hasOwn(REQUIRED_TEXT_DEFAULTS, key)) {

        const nextValue =
          value === "" || value === null || value === undefined
            ? requiredDefault(key, employeeId)
            : value;

        payload[key] = limitText(key, nextValue);
        continue;

      }

      payload[key] = value === ""
        ? null
        : limitText(key, value);

    }

    payload.EmpCode = limitText(
      "EmpCode",
      payload.EmpCode || requiredDefault("EmpCode", employeeId)
    );

    payload.UserName = limitText(
      "UserName",
      payload.UserName || requiredDefault("UserName", employeeId)
    );

    payload.Password = limitText(
      "Password",
      payload.Password || requiredDefault("Password", employeeId)
    );

    payload.fkUserId = limitText(
      "fkUserId",
      payload.fkUserId || requiredDefault("fkUserId", employeeId)
    );

    payload.LastStatus = limitText(
      "LastStatus",
      payload.LastStatus || requiredDefault("LastStatus", employeeId)
    );

    payload.Type = limitText(
      "Type",
      payload.Type || requiredDefault("Type", employeeId)
    );

    payload.Employment = limitText(
      "Employment",
      payload.Employment || requiredDefault("Employment", employeeId)
    );

    return payload;

  };


  // ==================================================
  // SUBMIT
  // ==================================================

  // ==================================================
  // ValidateFields() — PORT
  // ==================================================
  // frmEmployee.ValidateFields is short: Employee Code, Joining Date and
  // Employee Name are the only hard requirements, then the child grids
  // and the login pair. Returns the first legacy message, or "" if the
  // record is savable. Order matches the original so the same entry
  // produces the same complaint.
  //
  // The EmpCode / DOJ-DOL overlap checks ("Joining Date ... is
  // overlapping with some existing record", "Please enter Leaving Date of
  // X where Joining Date is Y") and the UsernamePassword uniqueness check
  // all query the database and need backend support; they are not
  // reproduced here.

  // Returns { field, message } so the caller can scroll to what's
  // wrong, not just show the message. The message text, and the order
  // and conditions under which each fires, are unchanged from before --
  // this only adds a target to scroll to. Returns null when everything
  // passes.
  const validateLegacyRules = () => {

    const text = (value) =>
      value === null || value === undefined ? "" : String(value).trim();

    if (!text(formData.EmpCode)) {
      return { field: "EmpCode", message: "Please enter Employee Code." };
    }

    if (!text(formData.DOJ)) {
      return { field: "DOJ", message: "Please enter\\select Joining Date." };
    }

    if (!text(formData.Employee)) {
      return { field: "Employee", message: "Please enter Employee Name." };
    }

    // dtDOJ_Validating / dtDOL_Validating, and the witness pair
    // (validateCrossFields is the single source for both rules).
    const crossErrors = validateCrossFields(formData);

    if (crossErrors.DOL) {
      return { field: "DOL", message: crossErrors.DOL };
    }

    if (crossErrors.fkW2EmpId) {
      return { field: "fkW2EmpId", message: crossErrors.fkW2EmpId };
    }

    // dtDOB_Validating — the employee must be over 18.
    if (text(formData.DOB)) {

      const birth = new Date(`${formData.DOB}T00:00:00`);

      if (!Number.isNaN(birth.getTime())) {

        const today = new Date();
        let years = today.getFullYear() - birth.getFullYear();
        const monthDelta = today.getMonth() - birth.getMonth();

        if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) {
          years -= 1;
        }

        if (years < 18) {
          return { field: "DOB", message: "Make sure Employee should be above 18 yrs." };
        }

      }

    }

    // grMOC rows: both columns are mandatory on any row that exists.
    for (let index = 0; index < contactRows.length; index += 1) {
      const row = contactRows[index];
      if (!text(row.fkMOCId) && !text(row.Contact)) continue;
      if (!text(row.fkMOCId)) {
        return { field: `contact-mocid-${index}`, message: "Please enter\\select Title." };
      }
      if (!text(row.Contact)) {
        return { field: `contact-detail-${index}`, message: "Please enter Contact Detail." };
      }
    }

    // grRelation rows: same, for name and relationship.
    for (let index = 0; index < relationRows.length; index += 1) {
      const row = relationRows[index];
      const hasAnything = Object.values(row).some((value) => text(value));
      if (!hasAnything) continue;
      if (!text(row.RelativeName)) {
        return { field: `relation-name-${index}`, message: "Please enter\\select Relative Name." };
      }
      if (!text(row.fkRelId)) {
        return { field: `relation-relid-${index}`, message: "Please enter\\select Relationship." };
      }
    }

    // tbUser_Validating / tbPassword_Validating — length floors, but only
    // when a value has actually been entered.
    if (text(formData.UserName) && text(formData.UserName).length < 6) {
      return { field: "UserName", message: "Please enter minimum 6 characters." };
    }

    if (text(formData.Password) && text(formData.Password).length < 4) {
      return { field: "Password", message: "Please enter minimum 4 characters." };
    }

    // tbPKE1_Validating / tbPKE2_Validating
    if (
      text(formData.Personality1) &&
      text(formData.Personality2) &&
      text(formData.Personality1) === text(formData.Personality2)
    ) {
      return {
        field: "Personality2",
        message: "Personality Name 1 and Personality Name 2 are same, Please change it.",
      };
    }

    return null;

  };


  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.pkEmpId) {

      setError("Employee ID is required.");
      return;

    }

    // Put every cross-field problem under its field, even though the
    // popup below only reports the first failure.
    const crossFieldErrors = validateCrossFields(formData);

    setFieldErrors((previous) => {

      const next = { ...previous };

      delete next.DOL;
      delete next.fkW2EmpId;

      return { ...next, ...crossFieldErrors };

    });

    const legacyError = validateLegacyRules();

    if (legacyError) {

      setError(legacyError.message);
      return;

    }

    const identifierErrors = Object.keys(IDENTIFIER_VALIDATORS).reduce(
      (accumulated, fieldName) => {

        const message = validateIdentifierField(
          fieldName,
          formData[fieldName]
        );

        if (message) accumulated[fieldName] = message;

        return accumulated;

      },
      {}
    );

    if (Object.keys(identifierErrors).length > 0) {

      setFieldErrors((previous) => ({
        ...previous,
        ...identifierErrors,
      }));

      setError(
        "Please fix the highlighted statutory ID fields before saving."
      );
      return;

    }

    // Phone-only columns. Checked here as well as on change so
    // a value restored from an existing record -- never typed
    // in this session, so never passed through handleChange --
    // still gets caught before it's sent back.
    const phoneErrors = Object.keys(PHONE_FIELDS).reduce(
      (accumulated, fieldName) => {

        const message = validatePhoneField(
          fieldName,
          formData[fieldName]
        );

        if (message) accumulated[fieldName] = message;

        return accumulated;

      },
      {}
    );

    if (Object.keys(phoneErrors).length > 0) {

      setFieldErrors((previous) => ({
        ...previous,
        ...phoneErrors,
      }));

      setError(
        "Please fix the highlighted contact number fields before saving."
      );
      return;

    }

    if (hasContactRowErrors) {

      setError(
        "Please fix the highlighted rows in Contact Details before saving."
      );
      return;

    }

    setLoading(true);

    try {

      const payload = buildPayload();

      let response;

      if (mode === "create") {

        response = await fetch(
          `${API_BASE_URL}/salary-employees`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
          }
        );

      } else {

        const updatePayload = { ...payload };
        delete updatePayload.pkEmpId;

        response = await fetch(
          `${API_BASE_URL}/salary-employees/${formData.pkEmpId}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(updatePayload),
          }
        );

      }

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          formatApiError(data, "Failed to save employee.")
        );

      }

      const savedId =
        mode === "create"
          ? data.employee.pkEmpId
          : formData.pkEmpId;

      // Contacts and relatives are written after the parent
      // row exists — required in create mode, since they FK
      // to pkEmpId. A failure here is reported separately so
      // it's clear the employee itself did save.

      await syncChildRows(savedId);

      setSuccess(
        mode === "create"
          ? "Employee created successfully."
          : "Employee updated successfully."
      );

      if (mode === "create") {

        setMode("edit");

        navigate(
          `/salary-employee/${data.employee.pkEmpId}`,
          { replace: true }
        );

      }

    } catch (err) {

      setError(err.message || "Something went wrong.");

    } finally {

      setLoading(false);

    }

  };


  // ==================================================
  // DELETE
  // ==================================================

  const handleDelete = async () => {

    if (mode !== "edit") return;

    if (
      !window.confirm(
        "Delete this employee? This cannot be undone."
      )
    ) {

      return;

    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {

      const response = await fetch(
        `${API_BASE_URL}/salary-employees/${formData.pkEmpId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {

        const data = await response.json();

        throw new Error(
          data.detail || "Failed to delete employee."
        );

      }

      setSuccess("Employee deleted successfully.");

      navigate("/salary-employees");

    } catch (err) {

      setError(err.message || "Something went wrong.");

    } finally {

      setLoading(false);

    }

  };


  // ==================================================
  // COMPONENT
  // ==================================================

  // fieldErrors keeps a "" entry for every identifier that has been
  // cleared, so only real messages count.
  const fieldErrorMessages = Object.values(fieldErrors).filter(Boolean);

  return (

    <div className="w-full space-y-6">

      <ValidationErrorModal message={error} onClose={() => setError("")} />


      {/* ==================================================
          RECORD TOOLBAR
          Mirrors the legacy Employee window's button rail
          (First/Prior/Next/Last, Add, Edit, Del, Undo,
          Save, Addl., Refr., Print, Exp., Help, Exit) as a
          modern icon toolbar, plus the two checkbox+dropdown
          clusters that sat top-right of that window.
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

        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-4
            border-b
            border-theme-border
            px-4
            py-3
          "
        >

          {/* NAVIGATION + RECORD ACTIONS */}

          <div className="flex flex-wrap items-center gap-1">

            <ToolbarButton
              icon={ChevronsLeft}
              label="First"
              onClick={goFirst}
              disabled={isAtFirst || employeeIdsLoading}
            />

            <ToolbarButton
              icon={ChevronLeft}
              label="Prior"
              onClick={goPrior}
              disabled={isAtFirst || employeeIdsLoading}
            />

            <ToolbarButton
              icon={ChevronRight}
              label="Next"
              onClick={goNext}
              disabled={isAtLast || employeeIdsLoading}
            />

            <ToolbarButton
              icon={ChevronsRight}
              label="Last"
              onClick={goLast}
              disabled={isAtLast || employeeIdsLoading}
            />

            <ToolbarDivider />

            <ToolbarButton
              icon={Plus}
              label="Add"
              onClick={handleNew}
            />

            <ToolbarButton
              icon={PencilLine}
              label="Edit"
              active={mode === "edit"}
              disabled
              title="Loaded records open directly in edit mode"
            />

            <Can module="salary_employee" action="delete">

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
                  ? loadEmployee(formData.pkEmpId)
                  : handleNew()
              }
            />

            <Can
              module="salary_employee"
              action={mode === "create" ? "add" : "edit"}
            >

              <ToolbarButton
                icon={Save}
                label="Save"
                form="salary-employee-form"
                type="submit"
                disabled={loading}
              />

            </Can>

            <ToolbarDivider />

            {/* ADDL. — opens the "Additional Information"
                dialog (Skin Tone/Religion/Caste, Police
                Station, Witnesses, Personalities, Login Info,
                Leaving Notifications, Certificates), matching
                the legacy form's Addl. button. The CV / Offer
                Letter attach menu lives next to Qualification
                instead, matching the legacy paperclip icon. */}

            <ToolbarButton
              icon={ClipboardList}
              label="Addl."
              onClick={() => setShowAdditionalInfo(true)}
              active={showAdditionalInfo}
            />

            <ToolbarButton
              icon={RefreshCw}
              label="Refr."
              onClick={() => {

                fetchEmployeeIds();

                if (mode === "edit") {

                  loadEmployee(formData.pkEmpId);

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
                  "Use First/Prior/Next/Last to browse employees, " +
                    "Add for a new record, and Save to keep changes. " +
                    "Del removes the currently loaded employee."
                )
              }
            />

            <ToolbarButton
              icon={DoorOpen}
              label="Exit"
              onClick={() => navigate("/salary-employees")}
            />

          </div>


          {/* AUTO MESSAGING / TYPE + GEOLOCATION / ATTENDANCE
              — moved up from Employment Details to match the
              legacy window's top-right cluster. */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-6
              gap-y-2
            "
          >

            <div className="flex items-center gap-2">

              <CheckboxField
                label="Auto Messaging"
                name="Messaging"
                checked={formData.Messaging}
                onChange={handleChange}
              />

              <select
                name="Type"
                value={formData.Type}
                onChange={handleChange}
                className="
                  h-9
                  rounded-lg
                  border
                  border-theme-border
                  bg-[var(--erp-background)]
                  px-2
                  text-sm
                  text-theme-text
                  outline-none
                  focus:border-theme-primary
                "
              >

                <option value="">Type…</option>

                {[
                  "Office Staff",
                  "Worker",
                  "Contractor",
                  "Service Incharge",
                  "Factory",
                  "Factory Staff",
                  "Project",
                  "Temporary",
                ].map((option) => (

                  <option key={option} value={option}>
                    {option}
                  </option>

                ))}

              </select>

            </div>

            <div className="flex items-center gap-2">

              <CheckboxField
                label="Geolocation Tracking"
                name="Geolocation"
                checked={formData.Geolocation}
                onChange={handleChange}
              />

              <select
                value={formData.AttType ? "daily" : "monthly"}
                onChange={(event) =>
                  handleRadioBool(
                    "AttType",
                    event.target.value === "daily"
                  )
                }
                className="
                  h-9
                  rounded-lg
                  border
                  border-theme-border
                  bg-[var(--erp-background)]
                  px-2
                  text-sm
                  text-theme-text
                  outline-none
                  focus:border-theme-primary
                "
              >

                <option value="daily">Daily Attendance</option>
                <option value="monthly">Monthly Attendance</option>

              </select>

            </div>

          </div>

        </div>


        {/* ==================================================
            EMPLOYEE / LIST TABS
            The legacy window keeps the form and the browse
            grid as two tabs of one window. Here they're two
            routes, but styled and behaved as the same tab
            pair so the mental model matches.
        ================================================== */}

        <div className="flex items-center gap-1 px-4 pt-3">

          <div
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-t-lg
              border-b-2
              border-theme-primary
              px-4
              py-2
              text-sm
              font-semibold
              text-theme-primary
            "
          >

            <ClipboardList size={15} />
            Employee

          </div>

          <Link
            to="/salary-employees"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-t-lg
              border-b-2
              border-transparent
              px-4
              py-2
              text-sm
              font-semibold
              text-theme-muted
              transition
              hover:text-theme-primary
            "
          >

            <ListChecks size={15} />
            List

          </Link>

        </div>


        {/* RECORD SUMMARY + LOOKUP */}

        <div
          className="
            flex
            flex-col
            gap-3
            border-t
            border-theme-border
            px-4
            py-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <p className="text-sm text-theme-muted">

            {mode === "edit"
              ? `Editing Employee #${formData.pkEmpId}` +
                (currentRecordIndex >= 0
                  ? ` (record ${currentRecordIndex + 1} of ${employeeIds.length})`
                  : "")
              : "Creating a new salary employee record."}

          </p>

          <div className="flex flex-wrap items-center gap-2">

            <div className="relative">

              <Search
                size={16}
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-theme-faint
                "
              />

              <input
                type="number"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                placeholder="Jump to Employee ID"
                className="
                  h-10
                  w-44
                  rounded-xl
                  border
                  border-theme-border
                  bg-card
                  pl-9
                  pr-3
                  text-sm
                  text-theme-text
                  outline-none
                  focus:border-theme-primary
                  focus:ring-2
                  focus:ring-theme-primary-soft
                "
              />

            </div>

            <button
              type="button"
              onClick={handleLoad}
              disabled={lookupLoading}
              className="
                h-10
                rounded-xl
                border
                border-theme-border
                bg-card
                px-4
                text-sm
                font-semibold
                text-theme-text
                transition
                hover:border-theme-primary
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {lookupLoading ? "Loading…" : "Go"}

            </button>

          </div>

        </div>

      </div>


      {/* ==================================================
          STATUS BANNERS
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

          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>

        </div>

      )}

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

          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <span>{success}</span>

        </div>

      )}


      {fieldErrorMessages.length > 1 && (

        <div
          className="
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

          <p className="font-semibold">Please fix the following:</p>

          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            {fieldErrorMessages.map((message, index) => (
              <li key={`${message}-${index}`}>{message}</li>
            ))}
          </ul>

        </div>

      )}


      {/* noValidate: the Joining/Leaving date inputs carry min/max, and
          native constraint validation would otherwise swallow the save
          with a browser tooltip instead of the "Can't Save" popup. The
          two required inputs (Employee ID, Name) are already checked in
          handleSubmit / validateLegacyRules. */}
      <form
        id="salary-employee-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6"
      >


        {/* ==================================================
            PHOTOGRAPH + IDENTITY
        ================================================== */}

        <SectionCard
          icon={UserRound}
          title="Personal Information"
          description="Core identity details for the employee record."
        >

          <div className="flex flex-col gap-6 sm:flex-row">


            {/* PHOTOGRAPH */}

            <div className="flex shrink-0 flex-col items-center gap-3">

              <div
                className="
                  flex
                  h-32
                  w-28
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  border
                  border-theme-border
                  bg-theme-primary-soft
                "
              >

                {photoPreview ? (

                  <img
                    src={photoPreview}
                    alt="Employee"
                    className="h-full w-full object-cover"
                  />

                ) : (

                  <ImageIcon
                    size={28}
                    className="text-theme-primary"
                  />

                )}

              </div>

              <div className="flex gap-2">

                <label
                  className="
                    cursor-pointer
                    rounded-lg
                    border
                    border-theme-border
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-theme-text
                    transition
                    hover:border-theme-primary
                  "
                >

                  Select

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />

                </label>

                <button
                  type="button"
                  onClick={handlePhotoClear}
                  className="
                    rounded-lg
                    border
                    border-theme-border
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-theme-muted
                    transition
                    hover:border-theme-primary
                  "
                >

                  Clear

                </button>

              </div>

            </div>


            {/* IDENTITY GRID */}

            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">

              <TextField
                label="Employee ID *"
                name="pkEmpId"
                type="number"
                value={formData.pkEmpId}
                onChange={handleChange}
                required
                disabled={mode === "edit"}
              />

              <TextField
                label="Employee Code *"
                name="EmpCode"
                value={formData.EmpCode}
                onChange={handleChange}
              />

              <LookupComboField
                label="Title"
                name="fkTitId"
                table="titles"
                placeholder="Mr / Mrs / Ms"
                value={formData.fkTitId}
                onChange={handleChange}
                matchIgnorePunctuation
              />

              <TextField
                label="Name *"
                name="Employee"
                value={formData.Employee}
                onChange={handleChange}
                required
              />

              <DateField
                label="Date of Birth"
                name="DOB"
                value={formData.DOB}
                onChange={handleChange}
              />

              <div>

                <label className="mb-2 block text-sm font-semibold text-theme-text">
                  Qualification
                </label>

                <div className="flex gap-2">

                  <LookupComboField
                    name="fkQualId"
                    table="qualifications"
                    value={formData.fkQualId}
                    onChange={handleChange}
                    hideLabel
                    wrapperClassName="relative flex-1"
                  />

                  <div className="relative shrink-0">

                    <button
                      type="button"
                      onClick={() =>
                        setAttachMenuOpen((open) => !open)
                      }
                      disabled={mode !== "edit"}
                      title={
                        mode !== "edit"
                          ? "Save the employee first"
                          : "Attach CV / Offer Letter"
                      }
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        gap-0.5
                        rounded-xl
                        border
                        border-theme-border
                        text-theme-text
                        transition
                        hover:border-theme-primary
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >

                      <Paperclip size={16} />
                      <ChevronDown size={11} />

                    </button>

                    {attachMenuOpen && (

                      <div
                        className="
                          absolute
                          right-0
                          top-full
                          z-20
                          mt-1
                          w-56
                          overflow-hidden
                          rounded-xl
                          border
                          border-theme-border
                          bg-card
                          py-1
                          shadow-lg
                        "
                      >

                        <label
                          className="
                            flex
                            cursor-pointer
                            items-center
                            gap-2
                            px-3
                            py-2
                            text-sm
                            text-theme-text
                            transition
                            hover:bg-theme-primary-soft
                          "
                        >

                          {attachKind === "cv" ? (

                            <Loader2 size={15} className="animate-spin" />

                          ) : (

                            <FileText size={15} />

                          )}

                          Attach Curriculum Vitae

                          <input
                            type="file"
                            className="hidden"
                            disabled={attachKind !== null}
                            onChange={(event) =>
                              handleAttachUpload(event, "cv")
                            }
                          />

                        </label>

                        <label
                          className="
                            flex
                            cursor-pointer
                            items-center
                            gap-2
                            px-3
                            py-2
                            text-sm
                            text-theme-text
                            transition
                            hover:bg-theme-primary-soft
                          "
                        >

                          {attachKind === "offer" ? (

                            <Loader2 size={15} className="animate-spin" />

                          ) : (

                            <FileText size={15} />

                          )}

                          Attach Offer Letter

                          <input
                            type="file"
                            className="hidden"
                            disabled={attachKind !== null}
                            onChange={(event) =>
                              handleAttachUpload(event, "offer")
                            }
                          />

                        </label>

                      </div>

                    )}

                  </div>

                </div>

              </div>

              <RadioGroupField
                label="Gender *"
                name="Male"
                value={formData.Male}
                onChange={handleRadioBool}
                options={[
                  { label: "Male", value: true },
                  { label: "Female", value: false },
                ]}
              />

              <RadioGroupField
                label="Marital Status *"
                name="Married"
                value={formData.Married}
                onChange={handleRadioBool}
                options={[
                  { label: "Married", value: true },
                  { label: "Unmarried", value: false },
                ]}
              />

              <DateField
                label="Anniversary"
                name="Anni"
                value={formData.Anni}
                onChange={handleChange}
              />

              <SelectField
                label="Blood Group *"
                name="BloodGrp"
                value={formData.BloodGrp}
                onChange={handleChange}
                options={[
                  "A+", "A-", "B+", "B-",
                  "AB+", "AB-", "O+", "O-",
                ]}
              />

              <TextField
                label="Height (cm)"
                name="Height"
                type="number"
                step="1"
                value={formData.Height}
                onChange={handleChange}
              />

              <TextField
                label="Weight (kg)"
                name="Weight"
                type="number"
                step="0.01"
                value={formData.Weight}
                onChange={handleChange}
              />

              {/* Skin Tone, Religion, Caste/Sub-Caste,
                  Identification Mark, Total Experience and
                  Referred By now live in the Additional
                  Information dialog (Addl. button), matching
                  the legacy form's grouping. */}

            </div>

          </div>

        </SectionCard>


        {/* ==================================================
            EMPLOYMENT DETAILS
        ================================================== */}

        <SectionCard
          icon={IdCard}
          title="Employment Details"
          description="Joining, department and work assignment details."
        >

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <DateField
              label="Joining Date *"
              name="DOJ"
              value={formData.DOJ}
              onChange={handleChange}
              max={formData.DOL || undefined}
            />

            <DateField
              label="Leaving Date"
              name="DOL"
              value={formData.DOL}
              onChange={handleChange}
              min={formData.DOJ || undefined}
              error={fieldErrors.DOL}
            />

            <LookupComboField
              label="Department"
              name="fkDepId"
              table="departments"
              value={formData.fkDepId}
              onChange={handleChange}
            />

            <LookupComboField
              label="Designation"
              name="fkDegId"
              table="designations"
              value={formData.fkDegId}
              onChange={handleChange}
            />

            <TextField
              label="Work Place *"
              name="WP"
              value={formData.WP}
              onChange={handleChange}
            />

            <TextField
              label="Employment Type *"
              name="Employment"
              placeholder="FT / PT / CON"
              value={formData.Employment}
              onChange={handleChange}
              maxLength={3}
              hint="3-character code — confirm the real code set"
            />

            {/* Type, Attendance, Auto Messaging and
                Geolocation Tracking now live in the toolbar
                above (matching the legacy window's top-right
                cluster) rather than duplicated here. */}

          </div>

        </SectionCard>


        {/* ==================================================
            ADDRESS
        ================================================== */}

        <SectionCard
          icon={MapPin}
          title="Address"
          description="Resident, native and short mailing address."
        >

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <TextAreaField
              label="Resident Address *"
              name="PAddress"
              value={formData.PAddress}
              onChange={handleChange}
            />

            <TextAreaField
              label="Native Address *"
              name="NAddress"
              value={formData.NAddress}
              onChange={handleChange}
            />

            <div className="sm:col-span-2">

              <TextField
                label="Short Address *"
                name="SAddress"
                value={formData.SAddress}
                onChange={handleChange}
              />

            </div>

          </div>

        </SectionCard>


        {/* ==================================================
            STATUTORY & BANK DETAILS
        ================================================== */}

        <SectionCard
          icon={Landmark}
          title="Statutory & Bank Details"
          description="Compliance numbers and payout account."
        >

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <TextField
              label="Universal Account No. (UAN) *"
              name="PFNo"
              value={formData.PFNo}
              onChange={handleChange}
              error={fieldErrors.PFNo}
              hint={!fieldErrors.PFNo ? IDENTIFIER_VALIDATORS.PFNo.hint : undefined}
              placeholder="10 digits"
              maxLength={10}
            />

            <TextField
              label="ESIC No. *"
              name="ESICNo"
              value={formData.ESICNo}
              onChange={handleChange}
              error={fieldErrors.ESICNo}
              hint={!fieldErrors.ESICNo ? IDENTIFIER_VALIDATORS.ESICNo.hint : undefined}
              placeholder="17 digits"
              maxLength={17}
            />

            <TextField
              label="Permanent Account No. (PAN) *"
              name="PANNo"
              value={formData.PANNo}
              onChange={handleChange}
              error={fieldErrors.PANNo}
              hint={!fieldErrors.PANNo ? IDENTIFIER_VALIDATORS.PANNo.hint : undefined}
              placeholder="ABCDE1234F"
              maxLength={10}
            />

            <TextField
              label="Aadhar No. *"
              name="Aadhar"
              value={formData.Aadhar}
              onChange={handleChange}
              error={fieldErrors.Aadhar}
              hint={!fieldErrors.Aadhar ? IDENTIFIER_VALIDATORS.Aadhar.hint : undefined}
              placeholder="12 digits"
              maxLength={12}
            />

            <LookupComboField
              label="Bank Name"
              name="fkBnkId"
              table="banks"
              value={formData.fkBnkId}
              onChange={handleChange}
            />

            <TextField
              label="Account No. *"
              name="AccountNo"
              value={formData.AccountNo}
              onChange={handleChange}
              error={fieldErrors.AccountNo}
              hint={!fieldErrors.AccountNo ? IDENTIFIER_VALIDATORS.AccountNo.hint : undefined}
              placeholder="9–18 digits"
              maxLength={18}
            />

            <div className="flex items-end pb-2.5">

              <CheckboxField
                label="Same Bank"
                name="SB"
                checked={formData.SB}
                onChange={handleChange}
              />

            </div>

            <TextField
              label="RTGS / NEFT / IFSC *"
              name="RTGS"
              value={formData.RTGS}
              onChange={handleChange}
              error={fieldErrors.RTGS}
              hint={!fieldErrors.RTGS ? IDENTIFIER_VALIDATORS.RTGS.hint : undefined}
              placeholder="HDFC0001234"
              maxLength={11}
            />

            <LookupComboField
              label="Cash Account"
              name="fkAcctId"
              table="accounts"
              value={formData.fkAcctId}
              onChange={handleChange}
            />

            <LookupComboField
              label="Medical Document Ref."
              name="fkMDocId"
              table="documents"
              value={formData.fkMDocId}
              onChange={handleChange}
            />

            <TextField
              label="CV Copy *"
              name="CVCopy"
              placeholder="Filename or reference"
              value={formData.CVCopy}
              onChange={handleChange}
            />

            <TextField
              label="License Copy *"
              name="LECopy"
              placeholder="Filename or reference"
              value={formData.LECopy}
              onChange={handleChange}
            />

          </div>

        </SectionCard>


        {/* Nearest Police Station, Witnesses, Personalities,
            Login Information and Leaving Notifications now
            live in the Additional Information dialog (Addl.
            toolbar button), matching the legacy form's
            grouping. */}


        {/* ==================================================
            CHILD GRID ERROR
            Kept separate from the main form error so it's
            clear the employee record itself is fine.
        ================================================== */}

        {childError && (

          <div
            className="
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-theme-danger/30
              bg-theme-danger-soft
              px-5
              py-4
              text-sm
              text-theme-danger
            "
          >

            <AlertCircle size={18} className="mt-0.5 shrink-0" />

            <span>{childError}</span>

          </div>

        )}


        {/* ==================================================
            CONTACT DETAILS  (SalEmpContact)
        ================================================== */}

        <SectionCard
          icon={Phone}
          title="Contact Details"
          description="Phone, fax and e-mail entries for this employee."
        >

          <div className="space-y-3">

            {contactRows.length === 0 && (

              <p className="text-sm text-theme-muted">
                No contact rows yet.
              </p>

            )}

            {contactRows.map((row, index) => (

              <div
                key={index}
                className="
                  grid
                  grid-cols-1
                  gap-3
                  rounded-xl
                  border
                  border-theme-border
                  p-4
                  sm:grid-cols-[1fr_2fr_1fr_auto]
                  sm:items-end
                "
              >

                <LookupComboField
                  label="Contact Mode"
                  name="fkMOCId"
                  id={`contact-mocid-${index}`}
                  table="contact-modes"
                  placeholder="e.g. Mobile, E-Mail, Office No."
                  value={row.fkMOCId}
                  onChange={(event) =>
                    updateContactRow(
                      index,
                      "fkMOCId",
                      event.target.value
                    )
                  }
                  onOptionResolved={(label) =>
                    setContactModeLabel(index, label)
                  }
                />

                <TextField
                  label="Contact Detail"
                  id={`contact-detail-${index}`}
                  value={row.Contact}
                  maxLength={50}
                  placeholder={contactPlaceholderFor(
                    contactModeLabels[index]
                  )}
                  error={contactRowErrors[index]}
                  hint={
                    contactRowErrors[index]
                      ? undefined
                      : contactModeKind(
                          contactModeLabels[index]
                        ) === "email"
                        ? EMAIL_HINT
                        : contactModeKind(
                            contactModeLabels[index]
                          ) === "phone"
                          ? PHONE_HINT
                          : undefined
                  }
                  onChange={(event) =>
                    updateContactRow(
                      index,
                      "Contact",
                      event.target.value
                    )
                  }
                />

                <TextField
                  label="Ext."
                  value={row.Ext}
                  maxLength={10}
                  onChange={(event) =>
                    updateContactRow(
                      index,
                      "Ext",
                      event.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() => removeContactRow(index)}
                  title="Remove row"
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    text-theme-danger
                    transition
                    hover:bg-theme-danger-soft
                  "
                >

                  <Trash2 size={16} />

                </button>

              </div>

            ))}

            <button
              type="button"
              onClick={addContactRow}
              className="
                inline-flex
                h-10
                items-center
                gap-2
                rounded-xl
                border
                border-theme-border
                px-4
                text-sm
                font-semibold
                text-theme-primary
                transition
                hover:bg-theme-primary-soft
              "
            >

              <Plus size={16} />
              Add Contact

            </button>

          </div>

        </SectionCard>


        {/* ==================================================
            RELATIVES  (SalEmpRelation)
        ================================================== */}

        <SectionCard
          icon={Users}
          title="Family / Relatives"
          description="Relatives, their qualification and occupation details."
        >

          <div className="space-y-3">

            {relationRows.length === 0 && (

              <p className="text-sm text-theme-muted">
                No relatives added yet.
              </p>

            )}

            {relationRows.map((row, index) => (

              <div
                key={index}
                className="
                  rounded-xl
                  border
                  border-theme-border
                  p-4
                "
              >

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    lg:grid-cols-3
                  "
                >

                  <TextField
                    label="Relative Name"
                    id={`relation-name-${index}`}
                    value={row.RelativeName}
                    maxLength={50}
                    onChange={(event) =>
                      updateRelationRow(
                        index,
                        "RelativeName",
                        event.target.value
                      )
                    }
                  />

                  <LookupComboField
                    label="Relationship"
                    name="fkRelId"
                    id={`relation-relid-${index}`}
                    table="relations"
                    placeholder="e.g. Son, Spouse, Father"
                    value={row.fkRelId}
                    onChange={(event) =>
                      updateRelationRow(
                        index,
                        "fkRelId",
                        event.target.value
                      )
                    }
                  />

                  <SelectField
                    label="Marital Status"
                    value={row.MS}
                    onChange={(event) =>
                      updateRelationRow(
                        index,
                        "MS",
                        event.target.value
                      )
                    }
                    options={[
                      "Single",
                      "Married",
                      "Widower",
                      "Widow",
                      "Divorced",
                    ]}
                  />

                  <DateField
                    label="Date of Birth"
                    value={row.DOB}
                    onChange={(event) =>
                      updateRelationRow(
                        index,
                        "DOB",
                        event.target.value
                      )
                    }
                  />

                  <LookupComboField
                    label="Qualification"
                    name="fkQuaId"
                    table="qualifications"
                    value={row.fkQuaId}
                    onChange={(event) =>
                      updateRelationRow(
                        index,
                        "fkQuaId",
                        event.target.value
                      )
                    }
                  />

                  <LookupComboField
                    label="Occupation"
                    name="fkDesId"
                    table="designations"
                    value={row.fkDesId}
                    onChange={(event) =>
                      updateRelationRow(
                        index,
                        "fkDesId",
                        event.target.value
                      )
                    }
                  />

                  <LookupComboField
                    label="School / College"
                    name="fkSchId"
                    // fkSchId points at ContCommon (pkContId) -- the same
                    // organizations table the Bank Name field already
                    // reads/writes via the "banks" lookup slug, so no
                    // separate master table is needed for schools.
                    table="banks"
                    value={row.fkSchId}
                    onChange={(event) =>
                      updateRelationRow(
                        index,
                        "fkSchId",
                        event.target.value
                      )
                    }
                  />

                </div>

                <div className="mt-3 flex justify-end">

                  <button
                    type="button"
                    onClick={() => removeRelationRow(index)}
                    className="
                      inline-flex
                      h-9
                      items-center
                      gap-2
                      rounded-lg
                      px-3
                      text-sm
                      font-semibold
                      text-theme-danger
                      transition
                      hover:bg-theme-danger-soft
                    "
                  >

                    <Trash2 size={15} />
                    Remove

                  </button>

                </div>

              </div>

            ))}

            <button
              type="button"
              onClick={addRelationRow}
              className="
                inline-flex
                h-10
                items-center
                gap-2
                rounded-xl
                border
                border-theme-border
                px-4
                text-sm
                font-semibold
                text-theme-primary
                transition
                hover:bg-theme-primary-soft
              "
            >

              <Plus size={16} />
              Add Relative

            </button>

          </div>

        </SectionCard>


        {/* Certificates / Licenses (documents) now live in
            the Additional Information dialog too. */}


        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div
          className="
            flex
            flex-col-reverse
            items-stretch
            justify-end
            gap-3
            border-t
            border-theme-border
            pt-6
            sm:flex-row
            sm:items-center
          "
        >

          {mode === "edit" && (

            <Can module="salary_employee" action="delete">

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-theme-danger/30
                  bg-theme-danger-soft
                  px-5
                  text-sm
                  font-semibold
                  text-theme-danger
                  transition
                  hover:opacity-90
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                <Trash2 size={16} />
                Delete

              </button>

            </Can>

          )}

          <Can
            module="salary_employee"
            action={mode === "create" ? "add" : "edit"}
          >

            <button
              type="submit"
              disabled={loading}
              className="
                group
                inline-flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-theme-primary
                px-6
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:opacity-90
                hover:shadow-md
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {loading ? (

                <Loader2 size={17} className="animate-spin" />

              ) : (

                <Save size={17} />

              )}

              {loading
                ? "Saving…"
                : mode === "create"
                  ? "Save Employee"
                  : "Update Employee"}

            </button>

          </Can>

        </div>

      </form>

      {/* ==================================================
          ADDITIONAL INFORMATION MODAL
          Opened from the "Addl." toolbar button — groups the
          fields the legacy app kept in its own Additional
          Information window, separate from the main Employee
          tab: Skin Tone/Religion/Caste, Nearest Police
          Station, Witnesses, Personalities Know Employee,
          Login Information, Leaving Notifications and
          Certificates/Licenses.

          This is a UI grouping only — everything here is
          still part of the same formData/save flow as the
          main form, so closing with OK doesn't save by
          itself; Save on the main toolbar still does that.
      ================================================== */}

      {showAdditionalInfo && (

        <div
          className="
            fixed
            inset-0
            z-40
            flex
            items-start
            justify-center
            overflow-y-auto
            bg-black/40
            p-4
            sm:p-8
          "
          onClick={() => setShowAdditionalInfo(false)}
        >

          <div
            onClick={(event) => event.stopPropagation()}
            className="
              my-4
              w-full
              max-w-5xl
              overflow-hidden
              rounded-2xl
              border
              border-theme-border
              bg-card
              shadow-2xl
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-theme-border
                px-6
                py-4
              "
            >

              <div>

                <h2 className="text-lg font-semibold text-theme-text">
                  Additional Information
                </h2>

                <p className="mt-0.5 text-sm text-theme-muted">
                  Background, references, login and document
                  details for this employee.
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowAdditionalInfo(false)}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  text-theme-muted
                  transition
                  hover:bg-theme-primary-soft
                  hover:text-theme-primary
                "
              >

                <X size={18} />

              </button>

            </div>

            <div className="max-h-[75vh] space-y-6 overflow-y-auto p-6">


              {/* ==================================================
                  BACKGROUND
                  (Skin Tone, Religion, Caste, Identification
                  Mark, Total Experience, Referred By — moved
                  here from Personal Information)
              ================================================== */}

              <SectionCard
                icon={UserRound}
                title="Background"
                description="Physical description and how this employee was referred."
              >

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  <LookupComboField
                    label="Skin Tone"
                    name="fkSTId"
                    table="skin-tones"
                    value={formData.fkSTId}
                    onChange={handleChange}
                  />

                  <LookupComboField
                    label="Religion"
                    name="fkRGId"
                    table="religions"
                    value={formData.fkRGId}
                    onChange={handleChange}
                  />

                  <LookupComboField
                    label="Caste / Sub-Caste"
                    name="fkCSId"
                    table="castes"
                    value={formData.fkCSId}
                    onChange={handleChange}
                  />

                  <TextField
                    label="Identification Mark *"
                    name="Mark"
                    value={formData.Mark}
                    onChange={handleChange}
                  />

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-theme-text">
                      Total Experience
                    </label>

                    {/* ncYExperience / ncMExperience -- SaveRecords writes
                        this as "{years}.{months}" (e.g. "3.6"), just
                        years, or "0.{months}" -- never English words. The
                        Experience column is String(500) but the route
                        layer caps it at 5 chars to match ncYExperience/
                        ncMExperience's own 2-digit MaxLength ("99.99"),
                        so anything wordier than the dotted format gets
                        silently clipped on save. ncMExperience_Validating
                        also rolls anything over 11 months into years
                        rather than just capping the input. */}
                    <div className="flex items-center gap-2">

                      <input
                        type="number"
                        min="0"
                        value={parseExperience(formData.Experience).years}
                        onChange={(event) => {

                          const { months } = parseExperience(formData.Experience);
                          const years = event.target.value;

                          setFormData((previous) => ({
                            ...previous,
                            Experience: formatExperience(years, months),
                          }));

                        }}
                        className={`${inputClass} w-20`}
                      />

                      <span className="text-sm text-theme-muted">Year</span>

                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={parseExperience(formData.Experience).months}
                        onChange={(event) => {

                          const { years } = parseExperience(formData.Experience);

                          // ncMExperience_Validating: > 11 rolls over into
                          // years rather than being capped or rejected.
                          const rawMonths = Number(event.target.value) || 0;
                          const carryYears = Math.floor(rawMonths / 12);
                          const months = rawMonths - carryYears * 12;
                          const nextYears = (Number(years) || 0) + carryYears;

                          setFormData((previous) => ({
                            ...previous,
                            Experience: formatExperience(nextYears, months),
                          }));

                        }}
                        className={`${inputClass} w-20`}
                      />

                      <span className="text-sm text-theme-muted">Month</span>

                    </div>

                  </div>

                  <EmployeePickerField
                    label="Referred By"
                    name="fkREmpId"
                    value={formData.fkREmpId}
                    displayValue={formData.fkREmpId}
                    excludeEmpId={formData.pkEmpId}
                    onChange={handleChange}
                  />

                </div>

              </SectionCard>


            {/* ==================================================
                NEAREST POLICE STATION
            ================================================== */}

            <SectionCard
              icon={ShieldCheck}
              title="Nearest Police Station"
              description="Verification details for background checks."
            >

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <TextField
                  label="Police Station *"
                  name="Police"
                  value={formData.Police}
                  onChange={handleChange}
                />

                <TextField
                  label="Contact No. *"
                  name="ContPolice"
                  value={formData.ContPolice}
                  onChange={handleChange}
                  error={fieldErrors.ContPolice}
                  hint={!fieldErrors.ContPolice ? PHONE_HINT : undefined}
                  placeholder="+91 98765 43210"
                />

                <div className="sm:col-span-2">

                  <TextAreaField
                    label="Address *"
                    name="AddPolice"
                    value={formData.AddPolice}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </SectionCard>


            {/* ==================================================
                WITNESSES AT TIME OF LEAVING
            ================================================== */}

            <SectionCard
              icon={Users}
              title="Witnesses at the Time of Leaving"
              description="Reference employee IDs for the two witnesses."
            >

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <EmployeePickerField
                  label="Witness 1"
                  name="fkW1EmpId"
                  value={formData.fkW1EmpId}
                  displayValue={formData.fkW1EmpId}
                  excludeEmpId={formData.pkEmpId}
                  onChange={handleChange}
                />

                <EmployeePickerField
                  label="Witness 2"
                  name="fkW2EmpId"
                  value={formData.fkW2EmpId}
                  displayValue={formData.fkW2EmpId}
                  excludeEmpId={formData.pkEmpId}
                  onChange={handleChange}
                  error={fieldErrors.fkW2EmpId}
                />

              </div>

            </SectionCard>


            {/* ==================================================
                PERSONALITIES KNOW EMPLOYEE
            ================================================== */}

            <SectionCard
              icon={Contact}
              title="Personalities Know Employee"
              description="Two personal references and how to reach them."
            >

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

                <div className="space-y-4">

                  <p className="text-sm font-semibold text-theme-text">
                    Personality 1
                  </p>

                  <TextField
                    label="Name *"
                    name="Personality1"
                    value={formData.Personality1}
                    onChange={handleChange}
                  />

                  <LookupComboField
                    label="Designation"
                    name="fkP1DesId"
                    table="designations"
                    value={formData.fkP1DesId}
                    onChange={handleChange}
                  />

                  <TextAreaField
                    label="Address *"
                    name="P1Address"
                    value={formData.P1Address}
                    onChange={handleChange}
                  />

                  <TextField
                    label="Contact No. *"
                    name="P1Contact"
                    value={formData.P1Contact}
                    onChange={handleChange}
                    error={fieldErrors.P1Contact}
                    hint={!fieldErrors.P1Contact ? PHONE_HINT : undefined}
                    placeholder="+91 98765 43210"
                  />

                </div>

                <div className="space-y-4">

                  <p className="text-sm font-semibold text-theme-text">
                    Personality 2
                  </p>

                  <TextField
                    label="Name *"
                    name="Personality2"
                    value={formData.Personality2}
                    onChange={handleChange}
                  />

                  <LookupComboField
                    label="Designation"
                    name="fkP2DesId"
                    table="designations"
                    value={formData.fkP2DesId}
                    onChange={handleChange}
                  />

                  <TextAreaField
                    label="Address *"
                    name="P2Address"
                    value={formData.P2Address}
                    onChange={handleChange}
                  />

                  <TextField
                    label="Contact No. *"
                    name="P2Contact"
                    value={formData.P2Contact}
                    onChange={handleChange}
                    error={fieldErrors.P2Contact}
                    hint={!fieldErrors.P2Contact ? PHONE_HINT : undefined}
                    placeholder="+91 98765 43210"
                  />

                </div>

              </div>

            </SectionCard>


            {/* ==================================================
                LOGIN INFORMATION
            ================================================== */}

            <SectionCard
              icon={KeyRound}
              title="Login Information"
              description="Portal access credentials for this employee."
            >

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <TextField
                  label="Username *"
                  name="UserName"
                  value={formData.UserName}
                  onChange={handleChange}
                />

                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-theme-text
                    "
                  >

                    Password *

                  </label>

                  <div className="relative">

                    <input
                      type={showPassword ? "text" : "password"}
                      name="Password"
                      value={formData.Password}
                      onChange={handleChange}
                      className="
                        h-11
                        w-full
                        rounded-xl
                        border
                        border-theme-border
                        bg-[var(--erp-background)]
                        px-4
                        pr-11
                        text-sm
                        text-theme-text
                        outline-none
                        transition-all
                        focus:border-theme-primary
                        focus:ring-2
                        focus:ring-theme-primary-soft
                      "
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="
                        absolute
                        right-3.5
                        top-1/2
                        -translate-y-1/2
                        text-theme-muted
                        transition
                        hover:text-theme-primary
                      "
                    >

                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}

                    </button>

                  </div>

                </div>

                <TextField
                  label="Security Question *"
                  name="Question"
                  placeholder="e.g. What is your favorite food?"
                  value={formData.Question}
                  onChange={handleChange}
                />

                <TextField
                  label="Answer *"
                  name="Answer"
                  value={formData.Answer}
                  onChange={handleChange}
                />

                <TextField
                  label="Extension *"
                  name="Ext"
                  value={formData.Ext}
                  onChange={handleChange}
                />

              </div>

            </SectionCard>


            {/* ==================================================
                LEAVING NOTIFICATIONS
            ================================================== */}

            <SectionCard
              icon={BellRing}
              title="Leaving Notifications"
              description="Automated notices to send when this employee leaves."
            >

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">

                <CheckboxField
                  label="Inform Universal Account No. (UAN) about Leaving"
                  name="InformPF"
                  checked={formData.InformPF}
                  onChange={handleChange}
                />

                <CheckboxField
                  label="Inform Employees' State Insurance Scheme (ESIC) about Leaving"
                  name="InformESIC"
                  checked={formData.InformESIC}
                  onChange={handleChange}
                />

              </div>

            </SectionCard>




            {/* ==================================================
                DOCUMENTS  (SalEmpDocuments)

                Unlike the two grids above, these upload straight
                away rather than on save — each row owns a real
                file, so the employee must already exist.
            ================================================== */}

            <SectionCard
              icon={FileText}
              title="Certificates / Licenses"
              description="Documents produced in original, with an optional expiry date."
            >

              {mode === "create" ? (

                <p className="text-sm text-theme-muted">
                  Save the employee first — documents attach to a
                  saved record.
                </p>

              ) : (

                <div className="space-y-4">

                  {/* UPLOAD ROW */}

                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-4
                      rounded-xl
                      border
                      border-dashed
                      border-theme-border
                      p-4
                      sm:grid-cols-[1fr_1fr_auto]
                      sm:items-end
                    "
                  >

                    <TextField
                      label="Document Type Code"
                      value={documentDraft.fkDTId}
                      inputMode="numeric"
                      placeholder="e.g. 1"
                      onChange={(event) =>
                        setDocumentDraft((previous) => ({
                          ...previous,
                          fkDTId: event.target.value.replace(
                            /[^0-9]/g,
                            ""
                          ),
                        }))
                      }
                    />

                    <DateField
                      label="Valid Until"
                      value={documentDraft.ValidUntil}
                      onChange={(event) =>
                        setDocumentDraft((previous) => ({
                          ...previous,
                          ValidUntil: event.target.value,
                        }))
                      }
                    />

                    <label
                      className="
                        inline-flex
                        h-11
                        cursor-pointer
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-theme-primary
                        px-5
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:opacity-90
                      "
                    >

                      {documentUploading ? (

                        <Loader2 size={16} className="animate-spin" />

                      ) : (

                        <Upload size={16} />

                      )}

                      {documentUploading ? "Uploading" : "Choose File"}

                      <input
                        type="file"
                        className="hidden"
                        disabled={documentUploading}
                        onChange={handleDocumentUpload}
                      />

                    </label>

                  </div>


                  {/* DOCUMENT LIST */}

                  {childLoading ? (

                    <p className="text-sm text-theme-muted">
                      Loading documents…
                    </p>

                  ) : documents.length === 0 ? (

                    <p className="text-sm text-theme-muted">
                      No documents attached yet.
                    </p>

                  ) : (

                    <div className="space-y-2">

                      {documents.map((document_) => (

                        <div
                          key={document_.pkDEmpId}
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-3
                            rounded-xl
                            border
                            border-theme-border
                            px-4
                            py-3
                          "
                        >

                          <FileText
                            size={18}
                            className="shrink-0 text-theme-primary"
                          />

                          <div className="min-w-0 flex-1">

                            <p className="truncate text-sm font-medium text-theme-text">
                              {document_.DisplayName || "Document"}
                            </p>

                            <p className="text-xs text-theme-faint">

                              {document_.fkDTId
                                ? `Type ${document_.fkDTId}`
                                : "No type"}

                              {document_.ValidUntil
                                ? ` · Valid until ${String(
                                    document_.ValidUntil
                                  ).slice(0, 10)}`
                                : ""}

                            </p>

                          </div>

                          {/* Flags a row whose file is gone from
                              storage, instead of offering a link
                              that would just fail. */}

                          {document_.FileExists === false && (

                            <span
                              className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-lg
                                bg-theme-danger-soft
                                px-2
                                py-1
                                text-xs
                                font-semibold
                                text-theme-danger
                              "
                            >

                              <AlertTriangle size={13} />
                              File missing

                            </span>

                          )}

                          <button
                            type="button"
                            onClick={() =>
                              handleDocumentOpen(document_)
                            }
                            disabled={document_.FileExists === false}
                            title="Open"
                            className="
                              inline-flex
                              h-9
                              items-center
                              gap-2
                              rounded-lg
                              px-3
                              text-sm
                              font-semibold
                              text-theme-primary
                              transition
                              hover:bg-theme-primary-soft
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >

                            <ExternalLink size={15} />
                            Open

                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDocumentDelete(document_)
                            }
                            title="Remove"
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              text-theme-danger
                              transition
                              hover:bg-theme-danger-soft
                            "
                          >

                            <Trash2 size={15} />

                          </button>

                        </div>

                      ))}

                    </div>

                  )}

                </div>

              )}

            </SectionCard>




            </div>


            <div
              className="
                flex
                justify-end
                border-t
                border-theme-border
                px-6
                py-4
              "
            >

              <button
                type="button"
                onClick={() => setShowAdditionalInfo(false)}
                className="
                  h-10
                  rounded-xl
                  bg-theme-primary
                  px-6
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:opacity-90
                "
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
// SECTION CARD
// ==================================================

function SectionCard({ icon: Icon, title, description, children }) {

  return (

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

      <div
        className="
          flex
          items-center
          gap-3
          border-b
          border-theme-border
          px-6
          py-5
        "
      >

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


// ==================================================
// TOOLBAR PRIMITIVES
// ==================================================

function ToolbarButton({
  icon: Icon,
  trailingIcon: TrailingIcon,
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
      className={`
        flex
        flex-col
        items-center
        gap-1
        rounded-xl
        px-2.5
        py-1.5
        text-[11px]
        font-semibold
        transition
        disabled:cursor-not-allowed
        disabled:opacity-40
        ${toneClass}
      `}
    >

      <span className="flex items-center gap-0.5">

        <Icon size={17} />

        {TrailingIcon && <TrailingIcon size={12} />}

      </span>

      {label}

    </button>

  );

}

function ToolbarDivider() {

  return (

    <div
      className="
        mx-1
        h-8
        w-px
        shrink-0
        bg-theme-border
      "
    />

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

function TextField({ label, error, hint, ...props }) {

  return (

    <div>

      <label className="mb-2 block text-sm font-semibold text-theme-text">
        {label}
      </label>

      <input
        type="text"
        className={
          error
            ? `${inputClass} border-red-500 focus:border-red-500 focus:ring-red-200`
            : inputClass
        }
        {...props}
      />

      {error ? (

        <p className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>

      ) : hint ? (

        <p className="mt-1 text-xs text-theme-faint">
          {hint}
        </p>

      ) : null}

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
          className="
            pointer-events-none
            absolute
            left-3.5
            top-1/2
            -translate-y-1/2
            text-theme-faint
          "
        />

        <input
          type="date"
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          aria-invalid={Boolean(error)}
          className={
            error
              ? `${inputClass} pl-10 border-red-500 focus:border-red-500 focus:ring-red-200`
              : `${inputClass} pl-10`
          }
        />

      </div>

      {error && (

        <p className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>

      )}

    </div>

  );

}

function SelectField({ label, name, value, onChange, options }) {

  const normalized = options.map((option) =>
    typeof option === "string"
      ? { label: option, value: option }
      : option
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
// Reusable creatable combobox for every fk*Id field backed by
// a legacy lookup master (see LOOKUP_TABLE_CONFIG in model.py /
// GET+POST /api/lookups/{table} in route.py). Loads the option
// list once, filters client-side as the admin types, and shows
// an "Add '{typed value}' as new {label}?" affordance when
// nothing matches — the inline create-on-the-fly flow.
// ==================================================

// Case-insensitive AND punctuation/spacing-insensitive compare key,
// e.g. "mr", "Mr", "MR." and "M R" all normalize to "mr" so they're
// treated as the same value. Used by LookupComboField when
// matchIgnorePunctuation is set, so an existing DB row like "Mr."
// is matched (and its exact stored spelling reused) instead of a
// near-duplicate being created.
const normalizeLookupLabel = (value) =>
  (value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();

function LookupComboField({
  label,
  name,
  id,
  value,
  onChange,
  table,
  placeholder,
  disabled,
  hideLabel,
  wrapperClassName,
  // When true, matching against existing options ignores case AND
  // punctuation/spacing (see normalizeLookupLabel above) rather than
  // just case. Opt-in per field -- currently only the Title combo
  // uses it, so other lookup fields keep their previous exact-
  // punctuation matching behavior.
  matchIgnorePunctuation,
  // Optional callback fired with the resolved option *label*
  // whenever the bound value maps onto a loaded option (and
  // with "" when it doesn't). The contact grid needs this
  // because validating a row's Contact depends on whether its
  // mode is an e-mail mode or a phone mode, and only the
  // label carries that -- the parent stores the code.
  onOptionResolved,
}) {

  const [options, setOptions] = useState([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [allowCreate, setAllowCreate] = useState(true);
  const [notice, setNotice] = useState("");
  const [menuRect, setMenuRect] = useState(null);

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

    return () => {
      cancelled = true;
    };

  }, [table]);

  useEffect(() => {

    const match = options.find(
      (option) => String(option.value) === String(value)
    );

    setQuery(match ? match.label : value || "");

    // Depends on `options` too, not just `value` -- on first
    // render the options list is still loading, so a value
    // restored from an existing record would otherwise never
    // resolve to a label.
    if (onOptionResolved) {

      onOptionResolved(match ? match.label : "");

    }

  }, [value, options]); // eslint-disable-line react-hooks/exhaustive-deps

  const trimmedQuery = query.trim();

  const filtered = trimmedQuery
    ? options.filter((option) =>
        option.label.toLowerCase().includes(trimmedQuery.toLowerCase())
      )
    : options;

  const exactMatch = options.find((option) =>
    matchIgnorePunctuation
      ? normalizeLookupLabel(option.label) ===
        normalizeLookupLabel(trimmedQuery)
      : option.label.toLowerCase() === trimmedQuery.toLowerCase()
  );

  const selectOption = (option) => {

    onChange({
      target: { name, value: option.value, type: "text" },
    });

    setQuery(option.label);
    setOpen(false);
    setNotice("");

  };

  const handleAddNew = async () => {

    setAdding(true);
    setNotice("");

    try {

      const response = await fetch(
        `${API_BASE_URL}/lookups/${table}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ label: trimmedQuery }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setNotice(data.detail || "Could not add this value.");
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

  return (

    <div className={wrapperClassName || "relative"}>

      {!hideLabel && (
        <label className="mb-2 block text-sm font-semibold text-theme-text">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        id={id}
        type="text"
        className={inputClass}
        placeholder={placeholder}
        value={query}
        disabled={disabled}
        onChange={(event) => {

          setQuery(event.target.value);
          openMenu();
          setNotice("");

          // Clear the stored fk value while typing so a stale
          // selection is never silently kept once the text no
          // longer matches it.
          onChange({
            target: { name, value: "", type: "text" },
          });

        }}
        onFocus={openMenu}
        onBlur={() => setTimeout(() => {

          // Leaving the field with text that matches an existing
          // option (ignoring case/punctuation, when enabled) should
          // resolve to that option automatically -- e.g. typing
          // "mr" and tabbing away links to the existing "Mr." row
          // instead of leaving the fk value blank.
          if (matchIgnorePunctuation && exactMatch) {
            selectOption(exactMatch);
          }

          setOpen(false);

        }, 150)}
      />

      {open && !disabled && menuRect && createPortal(

        <div
          style={{
            position: "absolute",
            top: menuRect.top,
            left: menuRect.left,
            width: menuRect.width,
          }}
          className="
            z-50 mt-1 max-h-56 overflow-y-auto
            rounded-xl border border-theme-border bg-card
            shadow-lg
          "
        >

          {loading && (
            <div className="px-3 py-2 text-sm text-theme-faint">
              Loading…
            </div>
          )}

          {!loading &&
            filtered.map((option) => (
              <button
                type="button"
                key={option.value}
                className="
                  block w-full px-3 py-2 text-left text-sm
                  hover:bg-theme-primary-soft
                "
                onMouseDown={() => selectOption(option)}
              >
                {option.label}
              </button>
            ))}

          {!loading && !exactMatch && trimmedQuery && allowCreate && (
            <button
              type="button"
              className="
                block w-full px-3 py-2 text-left text-sm font-medium
                text-theme-primary hover:bg-theme-primary-soft
              "
              onMouseDown={handleAddNew}
              disabled={adding}
            >
              {adding
                ? "Adding…"
                : `+ Add "${trimmedQuery}" as new ${label}`}
            </button>
          )}

          {!loading &&
            filtered.length === 0 &&
            (!trimmedQuery || !allowCreate) && (
              <div className="px-3 py-2 text-sm text-theme-faint">
                No matches
              </div>
            )}

        </div>,

        document.body

      )}

      {notice && (
        <p className="mt-1 text-xs text-red-500">{notice}</p>
      )}

    </div>

  );

}


// ==================================================
// EMPLOYEE PICKER FIELD
// Search-only combobox for the self-referencing fkREmpId /
// fkW1EmpId / fkW2EmpId fields — these point at real employee
// records, not a lookup master, so there's no "add new"
// affordance here, just a debounced name/code search.
// ==================================================

function EmployeePickerField({
  label,
  name,
  value,
  displayValue,
  onChange,
  excludeEmpId,
  placeholder,
  error,
}) {

  const [query, setQuery] = useState(displayValue || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {

    const token = localStorage.getItem("access_token");

    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };

  };

  useEffect(() => {

    setQuery(displayValue == null || displayValue === "" ? "" : String(displayValue));

  }, [displayValue]);

  useEffect(() => {

    const trimmed = String(query ?? "").trim();

    if (trimmed.length < 2) {

      setResults([]);
      return;

    }

    let cancelled = false;

    const timer = setTimeout(async () => {

      setLoading(true);

      try {

        const params = new URLSearchParams({ q: trimmed });

        if (excludeEmpId) params.set("exclude", excludeEmpId);

        const response = await fetch(
          `${API_BASE_URL}/salary-employees/search?${params}`,
          { headers: getAuthHeaders() }
        );

        if (!response.ok) return;

        const data = await response.json();

        if (!cancelled) setResults(data.employees || []);

      } catch {

        // Non-fatal — the field just shows no matches.

      } finally {

        if (!cancelled) setLoading(false);

      }

    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };

  }, [query, excludeEmpId]);

  const selectEmployee = (employee) => {

    onChange({
      target: { name, value: employee.pkEmpId, type: "text" },
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
        type="text"
        aria-invalid={Boolean(error)}
        className={
          error
            ? `${inputClass} border-red-500 focus:border-red-500 focus:ring-red-200`
            : inputClass
        }
        placeholder={placeholder || "Search by name or code…"}
        value={query}
        onChange={(event) => {

          setQuery(event.target.value);
          setOpen(true);

          onChange({
            target: { name, value: "", type: "text" },
          });

        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />

      {open && (

        <div
          className="
            absolute z-20 mt-1 max-h-56 w-full overflow-y-auto
            rounded-xl border border-theme-border bg-card
            shadow-lg
          "
        >

          {loading && (
            <div className="px-3 py-2 text-sm text-theme-faint">
              Searching…
            </div>
          )}

          {!loading && results.length === 0 && String(query ?? "").trim().length >= 2 && (
            <div className="px-3 py-2 text-sm text-theme-faint">
              No employees found
            </div>
          )}

          {!loading &&
            results.map((employee) => (
              <button
                type="button"
                key={employee.pkEmpId}
                className="
                  block w-full px-3 py-2 text-left text-sm
                  hover:bg-theme-primary-soft
                "
                onMouseDown={() => selectEmployee(employee)}
              >
                {employee.Employee}
                {employee.EmpCode ? ` (${employee.EmpCode})` : ""}
              </button>
            ))}

        </div>

      )}

      {error && (

        <p className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>

      )}

    </div>

  );

}


function CheckboxField({ label, name, checked, onChange }) {

  return (

    <label className="flex cursor-pointer items-center gap-2.5">

      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="
          h-4
          w-4
          rounded
          border-theme-border
          text-theme-primary
          focus:ring-theme-primary-soft
        "
      />

      <span className="text-sm font-medium text-theme-text">
        {label}
      </span>

    </label>

  );

}

function RadioGroupField({ label, name, value, onChange, options }) {

  return (

    <div>

      <label className="mb-2 block text-sm font-semibold text-theme-text">
        {label}
      </label>

      <div className="flex h-11 items-center gap-5">

        {options.map((option) => (

          <label
            key={String(option.value)}
            className="flex cursor-pointer items-center gap-2"
          >

            <input
              type="radio"
              name={name}
              checked={value === option.value}
              onChange={() => onChange(name, option.value)}
              className="
                h-4
                w-4
                border-theme-border
                text-theme-primary
                focus:ring-theme-primary-soft
              "
            />

            <span className="text-sm font-medium text-theme-text">
              {option.label}
            </span>

          </label>

        ))}

      </div>

    </div>

  );

}