import re
from datetime import datetime, time
from decimal import Decimal 



from pydantic import BaseModel, Field, field_validator, model_validator


# ==================================================
# LOGIN
# ==================================================

class LoginRequest(BaseModel):

    full_name: str = Field(
        min_length=1,
        max_length=100,
    )

    password: str = Field(
        min_length=1,
        max_length=255,
    )


# ==================================================
# REGISTER
# ==================================================

class RegisterRequest(BaseModel):

    full_name: str = Field(
        min_length=1,
        max_length=100,
    )

    email: str = Field(
        min_length=1,
        max_length=150,
    )

    password: str = Field(
        min_length=1,
        max_length=255,
    )


# ==================================================
# CREATE USER
# ADMIN ONLY
# ==================================================

class CreateUserRequest(BaseModel):

    full_name: str = Field(
        min_length=1,
        max_length=100,
    )

    email: str = Field(
        min_length=1,
        max_length=150,
    )

    password: str = Field(
        min_length=1,
        max_length=255,
    )

    role: str = Field(
        default="user",
        min_length=1,
        max_length=50,
    )


# ==================================================
# UPDATE USER
# ADMIN ONLY
# ==================================================

class UpdateUserRequest(BaseModel):

    full_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    email: str | None = Field(
        default=None,
        min_length=1,
        max_length=150,
    )

    role: str | None = Field(
        default=None,
        min_length=1,
        max_length=50,
    )

    password: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )


# ==================================================
# USER STATUS
# ADMIN ONLY
# ==================================================

class UpdateUserStatusRequest(BaseModel):

    is_active: bool


# ==================================================
# TRANSLATION
# ==================================================

class TranslationRequest(BaseModel):

    text: str = Field(
        min_length=1,
        max_length=5000,
    )

    target_language: str = Field(
        min_length=2,
        max_length=10,
    )


# ==================================================
# ABILITY MASTER
# ==================================================

class AbilityCreateRequest(BaseModel):

    abilities: str = Field(
        min_length=1,
        max_length=200,
    )


class AbilityUpdateRequest(BaseModel):

    abilities: str = Field(
        min_length=1,
        max_length=200,
    )


# ==================================================
# WORK LOCATION MASTER
# ==================================================

class LocationCreateRequest(BaseModel):

    location: str = Field(
        min_length=1,
        max_length=100,
    )


class LocationUpdateRequest(BaseModel):

    location: str = Field(
        min_length=1,
        max_length=100,
    )


# ==================================================
# USER RIGHTS
# ==================================================

class UserRightItem(BaseModel):

    module: str = Field(
        min_length=1,
        max_length=100,
    )

    add: bool = False

    edit: bool = False

    delete: bool = False

    view: bool = False

    print: bool = False

    export: bool = False


class SetUserRightsRequest(BaseModel):

    rights: list[UserRightItem]


# ==================================================
# HOBBY MASTER
# ==================================================

class HobbyCreateRequest(BaseModel):

    hobby: str = Field(
        min_length=1,
        max_length=200,
    )


class HobbyUpdateRequest(BaseModel):

    hobby: str = Field(
        min_length=1,
        max_length=200,
    )


# ==================================================
# ANNOUNCEMENT TYPE MASTER
# ==================================================

class AnnouncementTypeCreateRequest(BaseModel):

    announcement_type: str = Field(
        min_length=1,
        max_length=100,
    )


class AnnouncementTypeUpdateRequest(BaseModel):

    announcement_type: str = Field(
        min_length=1,
        max_length=100,
    )


# ==================================================
# OFFICE LEVEL MASTER
# Real column is `officelevel` varchar(200) — max_length
# matches the DB column exactly, per the user's pgAdmin check.
# ==================================================

class OfficeLevelCreateRequest(BaseModel):

    office_level: str = Field(
        min_length=1,
        max_length=200,
    )


class OfficeLevelUpdateRequest(BaseModel):

    office_level: str = Field(
        min_length=1,
        max_length=200,
    )


# ==================================================
# MEETING TYPE MASTER
# Real column is `meetingtype` varchar(200) — max_length
# matches the DB column exactly, per the user's pgAdmin check.
# ==================================================

class MeetingTypeCreateRequest(BaseModel):

    meeting_type: str = Field(
        min_length=1,
        max_length=200,
    )


class MeetingTypeUpdateRequest(BaseModel):

    meeting_type: str = Field(
        min_length=1,
        max_length=200,
    )


# ==================================================
# LANGUAGE MASTER
# Real column is `language` varchar(200), table hrlanguage,
# PK pklid — per the user.
# ==================================================

class LanguageCreateRequest(BaseModel):

    language: str = Field(
        min_length=1,
        max_length=200,
    )


class LanguageUpdateRequest(BaseModel):

    language: str = Field(
        min_length=1,
        max_length=200,
    )


# ==================================================
# REQUIREMENT MASTER
# Real column is `requirement` varchar(300), table
# hrrequirement, PK pkrid — per the user.
# ==================================================

class RequirementCreateRequest(BaseModel):

    requirement: str = Field(
        min_length=1,
        max_length=300,
    )


class RequirementUpdateRequest(BaseModel):

    requirement: str = Field(
        min_length=1,
        max_length=300,
    )


# ==================================================
# ADVERTISING MEDIA MASTER
# Real column is `advertisingmedia` varchar(200), table
# hradvertisingmedia, PK pkamid — per the user.
# ==================================================

class AdvertisingMediaCreateRequest(BaseModel):

    advertising_media: str = Field(
        min_length=1,
        max_length=200,
    )


class AdvertisingMediaUpdateRequest(BaseModel):

    advertising_media: str = Field(
        min_length=1,
        max_length=200,
    )


# ==================================================
# ADVERTISING PURPOSE MASTER
# Real column is `advertisingpurpose` varchar(200), table
# hradvertisingpurpose, PK pkapid — per the user.
# ==================================================

class AdvertisingPurposeCreateRequest(BaseModel):

    advertising_purpose: str = Field(
        min_length=1,
        max_length=200,
    )


class AdvertisingPurposeUpdateRequest(BaseModel):

    advertising_purpose: str = Field(
        min_length=1,
        max_length=200,
    )


# ==================================================
# OFFICE TYPE MASTER
# Real column is `officetype` varchar(200), table
# hrofficetype, PK pkotid — per the user.
# ==================================================

class OfficeTypeCreateRequest(BaseModel):

    office_type: str = Field(
        min_length=1,
        max_length=200,
    )


class OfficeTypeUpdateRequest(BaseModel):

    office_type: str = Field(
        min_length=1,
        max_length=200,
    )


# ==================================================
# MEETING LOCATION MASTER
# Real column is `meetinglocation` varchar(200), table
# hrmeetinglocation, PK pkmlid — per the user.
# ==================================================

class MeetingLocationCreateRequest(BaseModel):

    meeting_location: str = Field(
        min_length=1,
        max_length=200,
    )


class MeetingLocationUpdateRequest(BaseModel):

    meeting_location: str = Field(
        min_length=1,
        max_length=200,
    )


# ==================================================
# KSA MASTER
# Real column is `ksa` varchar(300), table hrksa,
# PK pksaid — per the user pgAdmin.
# ==================================================

class KSACreateRequest(BaseModel):

    ksa: str = Field(
        min_length=1,
        max_length=300,
    )


class KSAUpdateRequest(BaseModel):

    ksa: str = Field(
        min_length=1,
        max_length=300,
    )


# ==================================================
# KSA CATEGORY MASTER
# Real column is `ksacategory` varchar(200), table
# hrksacategory, PK pkksacid — per the user.
# ==================================================

class KSACategoryCreateRequest(BaseModel):

    ksa_category: str = Field(
        min_length=1,
        max_length=200,
    )


class KSACategoryUpdateRequest(BaseModel):

    ksa_category: str = Field(
        min_length=1,
        max_length=200,
    )


# ==================================================
# POSITION GRADE MASTER
# Real columns: positiongrade varchar(200), minimumpay
# numeric(15,2), maximumpay numeric(15,2), table
# hrpositiongrade, PK pkpgid — per the user.
# ==================================================

class PositionGradeCreateRequest(BaseModel):

    position_grade: str = Field(
        min_length=1,
        max_length=200,
    )

    minimum_pay: float = Field(ge=0)

    maximum_pay: float = Field(ge=0)


class PositionGradeUpdateRequest(BaseModel):

    position_grade: str = Field(
        min_length=1,
        max_length=200,
    )

    minimum_pay: float = Field(ge=0)

    maximum_pay: float = Field(ge=0)


# ==================================================
# ROLE IN OFFENSE MASTER
# Real columns: roleinoffense varchar(200),
# minimumpenalty numeric(15,2), maximumpenalty numeric(15,2),
# table hrroleinoffense, PK pkrioid — per the user.
# ==================================================

class RoleInOffenseCreateRequest(BaseModel):

    role_in_offense: str = Field(
        min_length=1,
        max_length=200,
    )

    minimum_penalty: float = Field(ge=0)

    maximum_penalty: float = Field(ge=0)


class RoleInOffenseUpdateRequest(BaseModel):

    role_in_offense: str = Field(
        min_length=1,
        max_length=200,
    )

    minimum_penalty: float = Field(ge=0)

    maximum_penalty: float = Field(ge=0)


# ==================================================
# JOB FUNCTION MASTER
# Real column is `jobfunction` varchar(200), table
# hrjobfunction, PK pkjfid.
# ==================================================

class JobFunctionCreateRequest(BaseModel):

    job_function: str = Field(
        min_length=1,
        max_length=200,
    )


class JobFunctionUpdateRequest(BaseModel):

    job_function: str = Field(
        min_length=1,
        max_length=200,
    )


# ==================================================
# SALARY — NATURE OF WORK
# TABLE: salnatureofwork — natureofwork varchar(40)
# ==================================================

class NatureOfWorkCreateRequest(BaseModel):

    nature_of_work: str = Field(
        min_length=1,
        max_length=40,
    )


class NatureOfWorkUpdateRequest(BaseModel):

    nature_of_work: str = Field(
        min_length=1,
        max_length=40,
    )


# ==================================================
# SALARY — SCHEDULE TYPE
# TABLE: salscheduletype — type varchar(100)
# ==================================================

class ScheduleTypeCreateRequest(BaseModel):

    schedule_type: str = Field(
        min_length=1,
        max_length=100,
    )


class ScheduleTypeUpdateRequest(BaseModel):

    schedule_type: str = Field(
        min_length=1,
        max_length=100,
    )


# ==================================================
# SALARY — RELIGION
# TABLE: salreligion — religion varchar(50)
# ==================================================

class ReligionCreateRequest(BaseModel):

    religion: str = Field(
        min_length=1,
        max_length=50,
    )


class ReligionUpdateRequest(BaseModel):

    religion: str = Field(
        min_length=1,
        max_length=50,
    )


# ==================================================
# SALARY — CASTES
# TABLE: salcastes — caste varchar(40)
# ==================================================

class CasteCreateRequest(BaseModel):

    caste: str = Field(
        min_length=1,
        max_length=40,
    )


class CasteUpdateRequest(BaseModel):

    caste: str = Field(
        min_length=1,
        max_length=40,
    )


# ==================================================
# SALARY — SKIN TONES
# TABLE: salskintones — colour varchar(25)
# ==================================================

class SkinToneCreateRequest(BaseModel):

    colour: str = Field(
        min_length=1,
        max_length=25,
    )


class SkinToneUpdateRequest(BaseModel):

    colour: str = Field(
        min_length=1,
        max_length=25,
    )


# ==================================================
# SALARY — TASK STATUS
# TABLE: saltaskstatus — status, finish, cancel
# ==================================================

class TaskStatusCreateRequest(BaseModel):

    status: str = Field(
        min_length=1,
        max_length=30,
    )

    finish: bool = False

    cancel: bool = False


class TaskStatusUpdateRequest(BaseModel):

    status: str = Field(
        min_length=1,
        max_length=30,
    )

    finish: bool

    cancel: bool

# ==================================================
# SALARY — SHIFT TIMING MASTER
# TABLE: salshifttiming
#
# Columns:
# pkstid   NUMERIC(18,0) PRIMARY KEY
# shift    VARCHAR(50)
# swork    TIME
# ework    TIME
# twork    NUMERIC(18,2)
# sbreak   TIME
# ebreak   TIME
# tbreak   NUMERIC(18,2)
# ==================================================

class ShiftTimingCreateRequest(BaseModel):

    pkSTId: int

    shift: str = Field(
        min_length=1,
        max_length=50,
    )

    start_work: time

    end_work: time

    total_work: float = Field(
        ge=0,
    )

    start_break: time

    end_break: time

    total_break: float = Field(
        ge=0,
    )


class ShiftTimingUpdateRequest(BaseModel):

    shift: str = Field(
        min_length=1,
        max_length=50,
    )

    start_work: time

    end_work: time

    total_work: float = Field(
        ge=0,
    )

    start_break: time

    end_break: time

    total_break: float = Field(
        ge=0,
    )



    # ==================================================
# SALARY — EMPLOYEE RELATION
# TABLE: SalEmpRelation — relativename varchar(50)
# ==================================================

class EmployeeRelationCreateRequest(BaseModel):
    relative_name: str = Field(
        min_length=1,
        max_length=50,
    )


class EmployeeRelationUpdateRequest(BaseModel):
    relative_name: str = Field(
        min_length=1,
        max_length=50,
    )
# ==================================================
# ANNOUNCEMENT
# ==================================================

class AnnouncementCreateRequest(BaseModel):

    title: str = Field(
        min_length=1,
        max_length=255,
    )

    description: str = Field(
        min_length=1,
    )

    announcement_type_id: int | None = None

    start_date: datetime | None = None

    end_date: datetime | None = None


class AnnouncementUpdateRequest(BaseModel):

    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    description: str | None = Field(
        default=None,
        min_length=1,
    )

    announcement_type_id: int | None = None

    start_date: datetime | None = None

    end_date: datetime | None = None


# ==================================================
# SALARY EMPLOYEE - CREATE
# ==================================================



# ==================================================
# SALARY EMPLOYEE - UPDATE
# ==================================================



# ==================================================
# SALARY STRUCTURE - CREATE
# ==================================================



# ==================================================
# SALARY STRUCTURE - UPDATE
# ==================================================


# ==================================================
# PORTED FROM schema_mine.py — SALARY VALIDATION HELPERS
# ==================================================

# ==================================================
# SALARY EMPLOYEE — STATUTORY IDENTIFIER FORMATS
# Shared by SalEmployeeCreateRequest and SalEmployeeUpdateRequest.
# All six columns are nullable in SalEmployee (see model.py), so an
# empty/omitted value is always valid -- these patterns only apply
# once a value is actually provided. Values are normalized (stripped,
# case-folded) before the pattern check and before being stored, so
# uniqueness checks in route.py compare consistently.
#
# UAN: user-specified as 10 digits for this deployment -- note the
# official UIDAI/EPFO UAN format is actually 12 digits. Flagged here
# in case that 10 was a typo; change UAN_PATTERN if so.
# ==================================================

PAN_PATTERN = re.compile(r"^[A-Z]{5}[0-9]{4}[A-Z]$")
AADHAR_PATTERN = re.compile(r"^[0-9]{12}$")
ESIC_PATTERN = re.compile(r"^[0-9]{17}$")
UAN_PATTERN = re.compile(r"^[0-9]{10}$")
IFSC_PATTERN = re.compile(r"^[A-Z]{4}0[A-Z0-9]{6}$")
ACCOUNT_NO_PATTERN = re.compile(r"^[0-9]{9,18}$")


def _normalize_identifier(value: str | None) -> str | None:

    if value is None:

        return None

    text = value.strip().upper()

    return text or None


def _validate_identifier_pattern(
    value: str | None,
    pattern: re.Pattern,
    field_label: str,
    example: str,
) -> str | None:

    normalized = _normalize_identifier(value)

    if normalized is None:

        return None

    if not pattern.match(normalized):

        raise ValueError(
            f"{field_label} must be in the format {example} "
            f"(got {value!r})"
        )

    return normalized


# ==================================================
# SALARY EMPLOYEE — CONTACT NUMBER / E-MAIL FORMATS
# Shared by the three free-text "Contact No." columns on
# SalEmployee (ContPolice, P1Contact, P2Contact) and by the
# SalEmpContact grid's Contact column.
#
# IMPORTANT — "N/A" SENTINELS:
# SalaryEmployeeMaster.jsx's REQUIRED_TEXT_DEFAULTS sends the
# literal string "N/A" for every one of these columns when the
# user leaves it blank (because the real SalEmployee table
# appears to have them NOT NULL -- see the note in model.py).
# A strict pattern check would therefore 422 on every save of
# an employee with no police / personality contact entered.
# So the sentinels below are treated as "not supplied" and skip
# the check. That is a workaround for the sentinel design, not
# an endorsement of it -- once those columns are confirmed
# nullable, drop _BLANK_SENTINELS and let real blanks be None.
# ==================================================

_BLANK_SENTINELS = {"", "N/A", "NA", "-", "--", "NONE", "NIL"}

# Digits only, after stripping +, spaces, dashes, brackets and
# dots. 7-15 digits covers local landlines through full E.164
# international numbers (ITU-T E.164 caps the subscriber number
# at 15 digits).
_PHONE_STRIP_PATTERN = re.compile(r"[\s\-().]")
PHONE_PATTERN = re.compile(r"^\+?[0-9]{7,15}$")

# Deliberately permissive: one @, a non-empty local part, and a
# dotted domain. Anything stricter starts rejecting valid real
# addresses, and delivery is the only true test of an address.
EMAIL_PATTERN = re.compile(
    r"^[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)+$"
)


def _is_blank_sentinel(value: str | None) -> bool:

    if value is None:

        return True

    return value.strip().upper() in _BLANK_SENTINELS


def _normalize_phone(value: str) -> str:

    return _PHONE_STRIP_PATTERN.sub("", value.strip())


def _validate_phone(
    value: str | None,
    field_label: str,
) -> str | None:
    """
    Phone-only columns (ContPolice, P1Contact, P2Contact).
    Returns the original trimmed text -- NOT the stripped digits --
    so existing formatting like "022-2756 1234" is preserved in the
    DB exactly as the legacy app stored it. Only the check is done
    on the stripped form.
    """

    if value is None:

        return None

    trimmed = value.strip()

    if _is_blank_sentinel(trimmed):

        return trimmed or None

    if not PHONE_PATTERN.match(_normalize_phone(trimmed)):

        raise ValueError(
            f"{field_label} must be a valid phone number "
            f"(7-15 digits, optional leading +) (got {value!r})"
        )

    return trimmed


def _validate_phone_or_email(
    value: str | None,
    field_label: str,
) -> str | None:
    """
    The SalEmpContact grid's single Contact column holds whatever
    the row's mode of contact (fkMOCId) says -- a phone number, a
    fax number or an e-mail address. The server only receives the
    ContMOC *code*, not its label, so it can't tell which mode a
    row is in without a second query. It therefore accepts either
    shape here; the frontend, which does have the resolved mode
    label, applies the tighter per-mode rule (phone vs e-mail).
    """

    if value is None:

        return None

    trimmed = value.strip()

    if _is_blank_sentinel(trimmed):

        return trimmed or None

    if EMAIL_PATTERN.match(trimmed):

        return trimmed

    if PHONE_PATTERN.match(_normalize_phone(trimmed)):

        return trimmed

    raise ValueError(
        f"{field_label} must be a valid phone number "
        f"(7-15 digits, optional leading +) or e-mail address "
        f"(got {value!r})"
    )


# ==================================================
# PORTED FROM schema_mine.py — SALARY EMPLOYEE / STRUCTURE REQUESTS
# ==================================================

# ==================================================
# SALARY EMPLOYEE - SHARED CROSS-FIELD RULES
# Same two rules the Employee form enforces in the browser
# (SalaryEmployeeMaster.jsx -> validateCrossFields). Checked here
# too so a direct API call can't bypass them. Each rule only runs
# when BOTH fields are present, so a partial update that sends just
# one of them isn't rejected.
# ==================================================

def _check_employee_cross_fields(model):

    doj, dol = model.DOJ, model.DOL

    if doj is not None and dol is not None and dol.date() < doj.date():
        raise ValueError(
            "Leaving Date cannot be before Joining Date."
        )

    witness_1, witness_2 = model.fkW1EmpId, model.fkW2EmpId

    if witness_1 is not None and witness_2 is not None and witness_1 == witness_2:
        raise ValueError(
            "Witness 1 and Witness 2 cannot be the same employee."
        )

    return model


# ==================================================
# SALARY EMPLOYEE - CREATE
# ==================================================

class SalEmployeeCreateRequest(BaseModel):

    pkEmpId: int

    EmpCode: str | None = Field(
        default=None,
        max_length=100,
    )

    fkTitId: str | None = Field(
        default=None,
        max_length=100,
    )

    Employee: str | None = Field(
        default=None,
        max_length=255,
    )

    DOJ: datetime | None = None

    DOB: datetime | None = None

    Photo: bytes | None = None

    fkQualId: str | None = Field(
        default=None,
        max_length=100,
    )

    Male: bool | None = None

    Married: bool | None = None

    Anni: datetime | None = None

    PAddress: str | None = None

    NAddress: str | None = None

    fkDepId: str | None = Field(
        default=None,
        max_length=100,
    )

    fkDegId: str | None = Field(
        default=None,
        max_length=100,
    )

    fkBnkId: str | None = Field(
        default=None,
        max_length=100,
    )

    AccountNo: str | None = Field(
        default=None,
        max_length=100,
    )

    PFNo: str | None = Field(
        default=None,
        max_length=100,
    )

    ESICNo: str | None = Field(
        default=None,
        max_length=100,
    )

    PANNo: str | None = Field(
        default=None,
        max_length=100,
    )

    DOL: datetime | None = None

    BloodGrp: str | None = Field(
        default=None,
        max_length=50,
    )

    WP: str | None = Field(
        default=None,
        max_length=100,
    )

    Aadhar: str | None = Field(
        default=None,
        max_length=100,
    )

    CVCopy: str | None = Field(
        default=None,
        max_length=255,
    )

    LECopy: str | None = Field(
        default=None,
        max_length=255,
    )

    fkMDocId: int | None = None

    UserName: str | None = Field(
        default=None,
        max_length=100,
    )

    Password: str | None = Field(
        default=None,
        max_length=255,
    )

    Question: str | None = Field(
        default=None,
        max_length=500,
    )

    Answer: str | None = Field(
        default=None,
        max_length=500,
    )

    Ext: str | None = Field(
        default=None,
        max_length=100,
    )

    fkUserId: str | None = Field(
        default=None,
        max_length=100,
    )

    LastStatus: str | None = Field(
        default=None,
        max_length=100,
    )

    RTGS: str | None = Field(
        default=None,
        max_length=100,
    )

    SAddress: str | None = None

    SB: bool | None = None

    fkSetId: str | None = Field(
        default=None,
        max_length=100,
    )

    Type: str | None = Field(
        default=None,
        max_length=100,
    )

    AttType: bool | None = None

    Height: int | None = None

    Weight: float | None = None

    fkRGId: int | None = None

    fkCSId: int | None = None

    fkSTId: int | None = None

    Mark: str | None = Field(
        default=None,
        max_length=500,
    )

    Experience: str | None = Field(
        default=None,
        max_length=500,
    )

    fkREmpId: int | None = None

    Police: str | None = Field(
        default=None,
        max_length=500,
    )

    AddPolice: str | None = Field(
        default=None,
        max_length=500,
    )

    ContPolice: str | None = Field(
        default=None,
        max_length=500,
    )

    fkW1EmpId: int | None = None

    fkW2EmpId: int | None = None

    Personality1: str | None = Field(
        default=None,
        max_length=255,
    )

    fkP1DesId: str | None = Field(
        default=None,
        max_length=100,
    )

    P1Address: str | None = None

    P1Contact: str | None = Field(
        default=None,
        max_length=100,
    )

    Personality2: str | None = Field(
        default=None,
        max_length=255,
    )

    fkP2DesId: str | None = Field(
        default=None,
        max_length=100,
    )

    P2Address: str | None = None

    P2Contact: str | None = Field(
        default=None,
        max_length=100,
    )

    Messaging: bool | None = None

    fkAcctId: str | None = Field(
        default=None,
        max_length=100,
    )

    Geolocation: bool | None = None

    Employment: str | None = Field(
        default=None,
        max_length=100,
    )

    InformPF: bool | None = None

    InformESIC: bool | None = None

    @field_validator("PANNo")
    @classmethod
    def validate_pan(cls, value):

        return _validate_identifier_pattern(
            value, PAN_PATTERN, "PAN", "ABCDE1234F"
        )

    @field_validator("Aadhar")
    @classmethod
    def validate_aadhar(cls, value):

        return _validate_identifier_pattern(
            value, AADHAR_PATTERN, "Aadhar number", "12 digits"
        )

    @field_validator("ESICNo")
    @classmethod
    def validate_esic(cls, value):

        return _validate_identifier_pattern(
            value, ESIC_PATTERN, "ESIC number", "17 digits"
        )

    @field_validator("PFNo")
    @classmethod
    def validate_uan(cls, value):

        return _validate_identifier_pattern(
            value, UAN_PATTERN, "UAN (PF No.)", "10 digits"
        )

    @field_validator("RTGS")
    @classmethod
    def validate_ifsc(cls, value):

        return _validate_identifier_pattern(
            value, IFSC_PATTERN, "IFSC code", "AAAA0XXXXXX (e.g. HDFC0001234)"
        )

    @field_validator("AccountNo")
    @classmethod
    def validate_account_no(cls, value):

        return _validate_identifier_pattern(
            value, ACCOUNT_NO_PATTERN, "Bank account number", "9-18 digits"
        )

    @field_validator("ContPolice")
    @classmethod
    def validate_police_contact(cls, value):

        return _validate_phone(value, "Police station contact no.")

    @field_validator("P1Contact")
    @classmethod
    def validate_p1_contact(cls, value):

        return _validate_phone(value, "Personality 1 contact no.")

    @field_validator("P2Contact")
    @classmethod
    def validate_p2_contact(cls, value):

        return _validate_phone(value, "Personality 2 contact no.")

    @model_validator(mode="after")
    def validate_leaving_and_witnesses(self):

        return _check_employee_cross_fields(self)


# ==================================================
# SALARY EMPLOYEE - UPDATE
# ==================================================

class SalEmployeeUpdateRequest(BaseModel):

    EmpCode: str | None = Field(default=None, max_length=100)
    fkTitId: str | None = Field(default=None, max_length=100)
    Employee: str | None = Field(default=None, max_length=255)

    DOJ: datetime | None = None
    DOB: datetime | None = None

    Photo: bytes | None = None

    fkQualId: str | None = Field(default=None, max_length=100)

    Male: bool | None = None
    Married: bool | None = None

    Anni: datetime | None = None

    PAddress: str | None = None
    NAddress: str | None = None

    fkDepId: str | None = Field(default=None, max_length=100)
    fkDegId: str | None = Field(default=None, max_length=100)
    fkBnkId: str | None = Field(default=None, max_length=100)

    AccountNo: str | None = Field(default=None, max_length=100)
    PFNo: str | None = Field(default=None, max_length=100)
    ESICNo: str | None = Field(default=None, max_length=100)
    PANNo: str | None = Field(default=None, max_length=100)

    DOL: datetime | None = None

    BloodGrp: str | None = Field(default=None, max_length=50)
    WP: str | None = Field(default=None, max_length=100)
    Aadhar: str | None = Field(default=None, max_length=100)

    CVCopy: str | None = Field(default=None, max_length=255)
    LECopy: str | None = Field(default=None, max_length=255)

    fkMDocId: int | None = None

    UserName: str | None = Field(default=None, max_length=100)
    Password: str | None = Field(default=None, max_length=255)

    Question: str | None = Field(default=None, max_length=500)
    Answer: str | None = Field(default=None, max_length=500)

    Ext: str | None = Field(default=None, max_length=100)

    fkUserId: str | None = Field(default=None, max_length=100)
    LastStatus: str | None = Field(default=None, max_length=100)
    RTGS: str | None = Field(default=None, max_length=100)

    SAddress: str | None = None

    SB: bool | None = None

    fkSetId: str | None = Field(default=None, max_length=100)
    Type: str | None = Field(default=None, max_length=100)

    AttType: bool | None = None

    Height: int | None = None
    Weight: float | None = None

    fkRGId: int | None = None
    fkCSId: int | None = None
    fkSTId: int | None = None

    Mark: str | None = Field(default=None, max_length=500)
    Experience: str | None = Field(default=None, max_length=500)

    fkREmpId: int | None = None

    Police: str | None = Field(default=None, max_length=500)
    AddPolice: str | None = Field(default=None, max_length=500)
    ContPolice: str | None = Field(default=None, max_length=500)

    fkW1EmpId: int | None = None
    fkW2EmpId: int | None = None

    Personality1: str | None = Field(default=None, max_length=255)

    fkP1DesId: str | None = Field(default=None, max_length=100)

    P1Address: str | None = None

    P1Contact: str | None = Field(default=None, max_length=100)

    Personality2: str | None = Field(default=None, max_length=255)

    fkP2DesId: str | None = Field(default=None, max_length=100)

    P2Address: str | None = None

    P2Contact: str | None = Field(default=None, max_length=100)

    Messaging: bool | None = None

    fkAcctId: str | None = Field(default=None, max_length=100)

    Geolocation: bool | None = None

    Employment: str | None = Field(default=None, max_length=100)

    InformPF: bool | None = None
    InformESIC: bool | None = None

    @field_validator("PANNo")
    @classmethod
    def validate_pan(cls, value):

        return _validate_identifier_pattern(
            value, PAN_PATTERN, "PAN", "ABCDE1234F"
        )

    @field_validator("Aadhar")
    @classmethod
    def validate_aadhar(cls, value):

        return _validate_identifier_pattern(
            value, AADHAR_PATTERN, "Aadhar number", "12 digits"
        )

    @field_validator("ESICNo")
    @classmethod
    def validate_esic(cls, value):

        return _validate_identifier_pattern(
            value, ESIC_PATTERN, "ESIC number", "17 digits"
        )

    @field_validator("PFNo")
    @classmethod
    def validate_uan(cls, value):

        return _validate_identifier_pattern(
            value, UAN_PATTERN, "UAN (PF No.)", "10 digits"
        )

    @field_validator("RTGS")
    @classmethod
    def validate_ifsc(cls, value):

        return _validate_identifier_pattern(
            value, IFSC_PATTERN, "IFSC code", "AAAA0XXXXXX (e.g. HDFC0001234)"
        )

    @field_validator("AccountNo")
    @classmethod
    def validate_account_no(cls, value):

        return _validate_identifier_pattern(
            value, ACCOUNT_NO_PATTERN, "Bank account number", "9-18 digits"
        )

    @field_validator("ContPolice")
    @classmethod
    def validate_police_contact(cls, value):

        return _validate_phone(value, "Police station contact no.")

    @field_validator("P1Contact")
    @classmethod
    def validate_p1_contact(cls, value):

        return _validate_phone(value, "Personality 1 contact no.")

    @field_validator("P2Contact")
    @classmethod
    def validate_p2_contact(cls, value):

        return _validate_phone(value, "Personality 2 contact no.")

    @model_validator(mode="after")
    def validate_leaving_and_witnesses(self):

        return _check_employee_cross_fields(self)


# ==================================================
# SALARY STRUCTURE - CREATE
# ==================================================



class PaidHolidayRequest(BaseModel):
    HolidayDate: datetime


class SalStructureCreateRequest(BaseModel):
    fkEmpId: int
    SalaryStart: datetime
    SalaryEnd: datetime | None = None
    Basic: float = 0
    BasicType: str = Field(default="Monthly", max_length=7)
    DailySalary: float | None = None
    GrossSalary: float | None = None
    Allowance: float | None = None
    AllowanceType: str = Field(default="Fixed Amount", max_length=5)
    TravelAllowance: float | None = None
    TravelAllowanceType: str = Field(default="Fixed Amount", max_length=5)
    HousingAllowance: float | None = None
    HousingAllowanceType: str = Field(default="Fixed Amount", max_length=5)
    DearnessAllowance: float | None = None
    DearnessAllowanceType: str = Field(default="Fixed Amount", max_length=5)
    Incentive: float | None = None
    IncentiveType: str = Field(default="Fixed Amount", max_length=5)
    EducationAllowance: float | None = None
    EducationAllowanceType: str = Field(default="Fixed Amount", max_length=5)
    MedicalAllowance: float | None = None
    MedicalAllowanceType: str = Field(default="Fixed Amount", max_length=5)
    OtherAllowance: float | None = None
    OtherAllowanceType: str = Field(default="Fixed Amount", max_length=5)
    OvertimeI: float | None = None
    OvertimeII: float | None = None
    RestDay1: str = Field(default="Sunday", max_length=10)
    RestDay1Variant: bool = False
    RestDay2: str = Field(default="", max_length=10)
    AdjustmentExtraWorkingHour: bool = False
    LastYearExtraWorkingHour: float = 0
    NoticeRetentionAmount: float | None = None
    SuppliedTo: str | None = Field(default=None, max_length=10)
    ManpowerAgency: str | None = Field(default=None, max_length=10)
    PaidHoliday: int = 0
    SickLeave: float = 0
    PaidCasualLeave: float = 0
    UnpaidCasualLeave: float = 0
    WorkingHoursPerDay: float = 8
    WorkingHoursVariant: bool = False
    ConsiderHoursPerRestDay: float = 8
    ExcludeRestDayFromOT: bool = False
    BufferLateEarlyMinutes: int = 0
    BufferDaysAllowedPerMonth: int = 0
    BreakDuringOvertimeMinutes: int = 0
    PenaltyPerAbsentDay: float = 0
    CalcProfessionalTax: bool = False
    CalcProvidentFund: bool = False
    CalcProvidentFundAsPerSetting: bool = True
    CalcESIC: bool = False
    CalcTDS: bool = False
    IncomeTaxSlab: int | None = None
    AttendanceRules: str = Field(default="", max_length=10)
    fkSalAcctId: str = Field(default="", max_length=10)
    fkLoanAcctId: str = Field(default="", max_length=10)
    fkNoticeAcctId: str | None = Field(default=None, max_length=10)
    fkIncentiveAcctId: str | None = Field(default=None, max_length=10)
    Remarks: str = Field(default="", max_length=100)
    SandwichRuleForLeaves: bool = True
    SwipingScanningForMealBreak: bool = True
    fkReportTo1EmpId: int | None = None
    fkReportTo2EmpId: int | None = None
    OTIncludeAllowance: bool = False
    OTIncludeTravelAllowance: bool = False
    OTIncludeHousingAllowance: bool = False
    OTIncludeDearnessAllowance: bool = False
    OTIncludeIncentive: bool = False
    OTIncludeEducationAllowance: bool = False
    OTIncludeMedicalAllowance: bool = False
    OTIncludeOtherAllowance: bool = False
    PFIncludeAllowance: bool = False
    PFIncludeTravelAllowance: bool = False
    PFIncludeHousingAllowance: bool = False
    PFIncludeIncentive: bool = False
    PFIncludeEducationAllowance: bool = False
    PFIncludeMedicalAllowance: bool = False
    PFIncludeOtherAllowance: bool = False
    GovtHolidaysPartOfAllowances: bool = False
    RestDaysPartOfAllowances: bool = False
    IncentiveOnlyIfOvertimeFulfilled: bool = False
    OtherOnlyIfOvertimePerformed: bool = False
    LeavingTimeRounding: int | None = None
    Latitude: float | None = None
    Longitude: float | None = None
    fkAllowanceDesId: str | None = Field(default=None, max_length=5)
    TDSDeductionPercent: float | None = None
    MonthlyDeduction: float | None = None
    DeductionDescription: str | None = Field(default=None, max_length=100)
    paid_holidays: list[PaidHolidayRequest] = Field(default_factory=list)


class SalStructureUpdateRequest(SalStructureCreateRequest):
    fkEmpId: int | None = None
    SalaryStart: datetime | None = None


# ==================================================
# PORTED FROM schema_mine.py — GRIDS, GENERIC LOOKUP, USER-ACCOUNT MAP
# ==================================================

# ==================================================
# SALARY EMPLOYEE — CONTACT GRID
# (legacy table: SalEmpContact)
# ==================================================

class SalEmpContactRow(BaseModel):

    # Mode of contact code (ContMOC). Free text until a
    # master table exists for it.
    fkMOCId: str | None = Field(default=None, max_length=5)

    Contact: str | None = Field(default=None, max_length=50)

    Ext: str | None = Field(default=None, max_length=10)

    SrNo: int | None = None

    @field_validator("Contact")
    @classmethod
    def validate_contact(cls, value):

        return _validate_phone_or_email(value, "Contact detail")


class SalEmpContactListRequest(BaseModel):

    # Full replacement set for this employee's grid.
    rows: list[SalEmpContactRow] = Field(
        default_factory=list,
        max_length=100,
    )


# ==================================================
# SALARY EMPLOYEE — RELATIVES GRID
# (legacy table: SalEmpRelation)
# ==================================================

class SalEmpRelationRow(BaseModel):

    RelativeName: str | None = Field(default=None, max_length=50)

    fkRelId: str | None = Field(default=None, max_length=5)

    DOB: datetime | None = None

    fkQuaId: str | None = Field(default=None, max_length=5)

    fkSchId: str | None = Field(default=None, max_length=10)

    MS: str | None = Field(default=None, max_length=15)

    fkDesId: str | None = Field(default=None, max_length=5)


class SalEmpRelationListRequest(BaseModel):

    rows: list[SalEmpRelationRow] = Field(
        default_factory=list,
        max_length=100,
    )


# ==================================================
# SALARY EMPLOYEE — DOCUMENTS GRID
# (legacy table: SalEmpDocuments)
#
# There's no create-request model here: documents arrive
# as multipart/form-data (the file itself plus form
# fields), so the route declares those directly.
# ==================================================


# ==================================================
# GENERIC LOOKUP MASTER (fk* dropdown "add new" flow)
# One schema for all 12 tables in LOOKUP_TABLE_CONFIG.
# ==================================================

class LookupCreateRequest(BaseModel):

    label: str = Field(
        min_length=1,
        max_length=200,
    )


# ==================================================
# USER ACCOUNT MAP (JWT user -> legacy AppUser code)
# ==================================================

class UserAccountMapRequest(BaseModel):

    fkAppUserId: int

    LegacyUserId: str = Field(
        min_length=1,
        max_length=100,
    )