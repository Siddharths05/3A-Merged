from datetime import datetime

from pydantic import BaseModel, Field


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


# ==================================================
# SALARY STRUCTURE - CREATE
# ==================================================

class SalStructureCreateRequest(BaseModel):

    pkSSId: int

    fkEmpId: int | None = None

    SalStart: datetime | None = None

    Basic: float | None = None

    BType: str | None = Field(
        default=None,
        max_length=100,
    )

    Allowance: float | None = None
    TAllowance: float | None = None

    Travelling: float | None = None
    TTravelling: float | None = None

    Housing: float | None = None
    THousing: float | None = None

    Daily: float | None = None
    TDaily: float | None = None

    Incentive: float | None = None
    TIncentive: float | None = None

    Education: float | None = None
    TEducation: float | None = None

    Medical: float | None = None
    TMedical: float | None = None

    Other: float | None = None
    TOther: float | None = None

    OTI: float | None = None
    TOTI: float | None = None

    OTII: float | None = None
    TOTII: float | None = None

    RDayI: float | None = None
    RDayII: float | None = None

    PH: float | None = None
    SL: float | None = None
    CL: float | None = None
    UCL: float | None = None

    WH: float | None = None
    RWH: float | None = None

    BL: float | None = None
    BLD: float | None = None

    ARule: bool | None = None
    OTB: bool | None = None

    CalPT: bool | None = None
    CalPF: bool | None = None
    CalESIC: bool | None = None
    CalTDS: bool | None = None

    SlabTDS: bool | None = None
    Revise: bool | None = None
    ScanMB: bool | None = None

    fkSAcctId: str | None = Field(default=None, max_length=100)

    Remarks: str | None = None

    fkUserId: str | None = Field(default=None, max_length=100)

    LastStatus: str | None = Field(default=None, max_length=100)

    OtherBasic: float | None = None

    EOT: bool | None = None

    EWHour: float | None = None
    LYEWHour: float | None = None

    fkLAcctId: str | None = Field(default=None, max_length=100)

    MABasic: float | None = None
    EABasic: float | None = None
    IncentiveBasic: float | None = None
    DABasic: float | None = None
    HABasic: float | None = None
    TABasic: float | None = None
    AllowanceBasic: float | None = None

    fkFContId: int | None = None
    fkTContId: int | None = None

    SalGross: float | None = None

    fkIAcctId: str | None = Field(default=None, max_length=100)

    AbPenalty: float | None = None

    Variant: str | None = Field(default=None, max_length=100)

    PFA: float | None = None
    PFTA: float | None = None
    PFHA: float | None = None
    PFI: float | None = None
    PFEA: float | None = None
    PFMA: float | None = None
    PFOA: float | None = None

    RDVariant: str | None = Field(default=None, max_length=100)

    Retention: float | None = None

    fkEmp1Id: int | None = None
    fkEmp2Id: int | None = None

    fkRAcctId: str | None = Field(default=None, max_length=100)

    SalDaily: float | None = None

    SetPF: bool | None = None

    Sandwich: bool | None = None

    GHA: float | None = None
    RDA: float | None = None

    IORF: bool | None = None
    OAOP: bool | None = None

    LTimeROff: int | None = None

    Latitude: float | None = None
    Longitude: float | None = None
    Radius: float | None = None

    TDSDeduct: int | None = None

    MDeduction: float | None = None

    DedDescription: str | None = None

    fkDesId: str | None = Field(default=None, max_length=100)


# ==================================================
# SALARY STRUCTURE - UPDATE
# ==================================================

class SalStructureUpdateRequest(BaseModel):

    fkEmpId: int | None = None

    SalStart: datetime | None = None

    Basic: float | None = None

    BType: str | None = Field(
        default=None,
        max_length=100,
    )

    Allowance: float | None = None
    TAllowance: float | None = None

    Travelling: float | None = None
    TTravelling: float | None = None

    Housing: float | None = None
    THousing: float | None = None

    Daily: float | None = None
    TDaily: float | None = None

    Incentive: float | None = None
    TIncentive: float | None = None

    Education: float | None = None
    TEducation: float | None = None

    Medical: float | None = None
    TMedical: float | None = None

    Other: float | None = None
    TOther: float | None = None

    OTI: float | None = None
    TOTI: float | None = None

    OTII: float | None = None
    TOTII: float | None = None

    RDayI: float | None = None
    RDayII: float | None = None

    PH: float | None = None
    SL: float | None = None
    CL: float | None = None
    UCL: float | None = None

    WH: float | None = None
    RWH: float | None = None

    BL: float | None = None
    BLD: float | None = None

    ARule: bool | None = None
    OTB: bool | None = None

    CalPT: bool | None = None
    CalPF: bool | None = None
    CalESIC: bool | None = None
    CalTDS: bool | None = None

    SlabTDS: bool | None = None
    Revise: bool | None = None
    ScanMB: bool | None = None

    fkSAcctId: str | None = Field(default=None, max_length=100)

    Remarks: str | None = None

    fkUserId: str | None = Field(default=None, max_length=100)

    LastStatus: str | None = Field(default=None, max_length=100)

    OtherBasic: float | None = None

    EOT: bool | None = None

    EWHour: float | None = None
    LYEWHour: float | None = None

    fkLAcctId: str | None = Field(default=None, max_length=100)

    MABasic: float | None = None
    EABasic: float | None = None
    IncentiveBasic: float | None = None
    DABasic: float | None = None
    HABasic: float | None = None
    TABasic: float | None = None
    AllowanceBasic: float | None = None

    fkFContId: int | None = None
    fkTContId: int | None = None

    SalGross: float | None = None

    fkIAcctId: str | None = Field(default=None, max_length=100)

    AbPenalty: float | None = None

    Variant: str | None = Field(default=None, max_length=100)

    PFA: float | None = None
    PFTA: float | None = None
    PFHA: float | None = None
    PFI: float | None = None
    PFEA: float | None = None
    PFMA: float | None = None
    PFOA: float | None = None

    RDVariant: str | None = Field(default=None, max_length=100)

    Retention: float | None = None

    fkEmp1Id: int | None = None
    fkEmp2Id: int | None = None

    fkRAcctId: str | None = Field(default=None, max_length=100)

    SalDaily: float | None = None

    SetPF: bool | None = None

    Sandwich: bool | None = None

    GHA: float | None = None
    RDA: float | None = None

    IORF: bool | None = None
    OAOP: bool | None = None

    LTimeROff: int | None = None

    Latitude: float | None = None
    Longitude: float | None = None
    Radius: float | None = None

    TDSDeduct: int | None = None

    MDeduction: float | None = None

    DedDescription: str | None = None

    fkDesId: str | None = Field(default=None, max_length=100)
