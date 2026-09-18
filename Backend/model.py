from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    Integer,
    LargeBinary,
    String,
    Text,
    Time,
    func,
)

from sqlalchemy.orm import Session

from database import Base


# ==================================================
# USER SQLALCHEMY MODEL
# ==================================================

class User(Base):

    __tablename__ = "users"


    pkid = Column(
        Integer,
        primary_key=True,
        index=True,
    )


    email = Column(
        String(150),
        unique=True,
        nullable=False,
        index=True,
    )


    password_hash = Column(
        Text,
        nullable=False,
    )


    full_name = Column(
        String(100),
        nullable=False,
    )


    role = Column(
        String(50),
        nullable=False,
        default="user",
    )


    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
    )


    updated_at = Column(
        DateTime,
        nullable=True,
        server_default=func.now(),
        onupdate=func.now(),
    )


    deleted_at = Column(
        DateTime,
        nullable=True,
        default=None,
    )


# ==================================================
# ABILITY SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hrabilities
# REAL COLUMNS: pkabid, abilities
# ==================================================

class Ability(Base):

    __tablename__ = "hrabilities"


    pkABId = Column(
        "pkabid",
        Integer,
        primary_key=True,
        index=True,
    )


    Abilities = Column(
        "abilities",
        String(200),
        nullable=False,
        unique=True,
    )


# ==================================================
# LOCATION SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hrlocation
# REAL COLUMNS: pkhlid, location
# ==================================================

class Location(Base):

    __tablename__ = "hrlocation"


    pkHLId = Column(
        "pkhlid",
        Integer,
        primary_key=True,
        index=True,
    )


    Location = Column(
        "location",
        String(100),
        nullable=False,
        unique=True,
    )


# ==================================================
# HOBBY SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hrhobby
# REAL COLUMNS: pkhid, hobby
# ==================================================

class Hobby(Base):

    __tablename__ = "hrhobby"


    pkHId = Column(
        "pkhid",
        Integer,
        primary_key=True,
        index=True,
    )


    Hobby = Column(
        "hobby",
        String(200),
        nullable=False,
        unique=True,
    )


# ==================================================
# JOB FUNCTION SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hrjobfunction
# REAL COLUMNS: pkjfid, jobfunction
# ==================================================

class JobFunction(Base):

    __tablename__ = "hrjobfunction"


    pkJFId = Column(
        "pkjfid",
        Integer,
        primary_key=True,
        index=True,
    )


    JobFunction = Column(
        "jobfunction",
        String(200),
        nullable=False,
        unique=True,
    )


# ==================================================
# ANNOUNCEMENT TYPE SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hrannouncementtype
# REAL COLUMNS: pkatid, announcementtype
# ==================================================

class AnnouncementType(Base):

    __tablename__ = "hrannouncementtype"


    pkATId = Column(
        "pkatid",
        Integer,
        primary_key=True,
        index=True,
    )


    AnnouncementType = Column(
        "announcementtype",
        String(100),
        nullable=False,
        unique=True,
    )


# ==================================================
# OFFICE LEVEL SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hrofficelevel
# ==================================================

class OfficeLevel(Base):

    __tablename__ = "hrofficelevel"


    pkOLId = Column(
        "pkolid",
        Integer,
        primary_key=True,
        index=True,
    )


    OfficeLevel = Column(
        "officelevel",
        String(200),
        nullable=False,
        unique=True,
    )


# ==================================================
# MEETING TYPE SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hrmeetingtype
# ==================================================

class MeetingType(Base):

    __tablename__ = "hrmeetingtype"


    pkMTId = Column(
        "pkmtid",
        Integer,
        primary_key=True,
        index=True,
    )


    MeetingType = Column(
        "meetingtype",
        String(200),
        nullable=False,
        unique=True,
    )


# ==================================================
# LANGUAGE SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hrlanguage
# ==================================================

class Language(Base):

    __tablename__ = "hrlanguage"


    pkLId = Column(
        "pklid",
        Integer,
        primary_key=True,
        index=True,
    )


    Language = Column(
        "language",
        String(200),
        nullable=False,
        unique=True,
    )


# ==================================================
# REQUIREMENT SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hrrequirement
# ==================================================

class Requirement(Base):

    __tablename__ = "hrrequirement"


    pkRId = Column(
        "pkrid",
        Integer,
        primary_key=True,
        index=True,
    )


    Requirement = Column(
        "requirement",
        String(300),
        nullable=False,
        unique=True,
    )


# ==================================================
# ADVERTISING MEDIA SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hradvertisingmedia
# ==================================================

class AdvertisingMedia(Base):

    __tablename__ = "hradvertisingmedia"


    pkAMId = Column(
        "pkamid",
        Integer,
        primary_key=True,
        index=True,
    )


    AdvertisingMedia = Column(
        "advertisingmedia",
        String(200),
        nullable=False,
        unique=True,
    )


# ==================================================
# ADVERTISING PURPOSE SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hradvertisingpurpose
# ==================================================

class AdvertisingPurpose(Base):

    __tablename__ = "hradvertisingpurpose"


    pkAPId = Column(
        "pkapid",
        Integer,
        primary_key=True,
        index=True,
    )


    AdvertisingPurpose = Column(
        "advertisingpurpose",
        String(200),
        nullable=False,
        unique=True,
    )


# ==================================================
# OFFICE TYPE SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hrofficetype
# ==================================================

class OfficeType(Base):

    __tablename__ = "hrofficetype"


    pkOTId = Column(
        "pkotid",
        Integer,
        primary_key=True,
        index=True,
    )


    OfficeType = Column(
        "officetype",
        String(200),
        nullable=False,
        unique=True,
    )


# ==================================================
# MEETING LOCATION SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hrmeetinglocation
# ==================================================

class MeetingLocation(Base):

    __tablename__ = "hrmeetinglocation"


    pkMLId = Column(
        "pkmlid",
        Integer,
        primary_key=True,
        index=True,
    )


    MeetingLocation = Column(
        "meetinglocation",
        String(200),
        nullable=False,
        unique=True,
    )


# ==================================================
# KSA SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hrksa
# ==================================================

class KSA(Base):

    __tablename__ = "hrksa"


    pkKSAId = Column(
        "pkksaid",
        Integer,
        primary_key=True,
        index=True,
    )


    KSA = Column(
        "ksa",
        String(300),
        nullable=False,
        unique=True,
    )


# ==================================================
# KSA CATEGORY SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hrksacategory
# ==================================================

class KSACategory(Base):

    __tablename__ = "hrksacategory"


    pkKSACId = Column(
        "pkksacid",
        Integer,
        primary_key=True,
        index=True,
    )


    KSACategory = Column(
        "ksacategory",
        String(200),
        nullable=False,
        unique=True,
    )


# ==================================================
# POSITION GRADE SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hrpositiongrade
# ==================================================

class PositionGrade(Base):

    __tablename__ = "hrpositiongrade"


    pkPGId = Column(
        "pkpgid",
        Integer,
        primary_key=True,
        index=True,
    )


    PositionGrade = Column(
        "positiongrade",
        String(200),
        nullable=False,
        unique=True,
    )


    MinimumPay = Column(
        "minimumpay",
        Float,
        nullable=False,
    )


    MaximumPay = Column(
        "maximumpay",
        Float,
        nullable=False,
    )


# ==================================================
# ROLE IN OFFENSE SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hrroleinoffense
# ==================================================

class RoleInOffense(Base):

    __tablename__ = "hrroleinoffense"


    pkRIOId = Column(
        "pkrioid",
        Integer,
        primary_key=True,
        index=True,
    )


    RoleInOffense = Column(
        "roleinoffense",
        String(200),
        nullable=False,
        unique=True,
    )


    MinimumPenalty = Column(
        "minimumpenalty",
        Float,
        nullable=False,
    )


    MaximumPenalty = Column(
        "maximumpenalty",
        Float,
        nullable=False,
    )



# ==================================================
# SALARY — NATURE OF WORK
# TABLE: salnatureofwork
# COLUMNS: pknwid, natureofwork
# ==================================================

class NatureOfWork(Base):

    __tablename__ = "salnatureofwork"


    pkNWId = Column(
        "pknwid",
        Integer,
        primary_key=True,
        index=True,
    )


    NatureOfWork = Column(
        "natureofwork",
        String(40),
        nullable=False,
        unique=True,
    )


# ==================================================
# SALARY — SCHEDULE TYPE
# TABLE: salscheduletype
# COLUMNS: pkstid, type
# ==================================================

class ScheduleType(Base):

    __tablename__ = "salscheduletype"


    pkSTId = Column(
        "pkstid",
        Integer,
        primary_key=True,
        index=True,
    )


    Type = Column(
        "type",
        String(100),
        nullable=False,
        unique=True,
    )


# ==================================================
# SALARY — RELIGION
# TABLE: salreligion
# COLUMNS: pkrgid, religion
# ==================================================

class Religion(Base):

    __tablename__ = "salreligion"


    pkRGId = Column(
        "pkrgid",
        Integer,
        primary_key=True,
        index=True,
    )


    Religion = Column(
        "religion",
        String(50),
        nullable=False,
        unique=True,
    )


# ==================================================
# SALARY — CASTES
# TABLE: salcastes
# COLUMNS: pkcsid, caste
# ==================================================

class Caste(Base):

    __tablename__ = "salcastes"


    pkCSId = Column(
        "pkcsid",
        Integer,
        primary_key=True,
        index=True,
    )


    Caste = Column(
        "caste",
        String(40),
        nullable=False,
        unique=True,
    )


# ==================================================
# SALARY — SKIN TONES
# TABLE: salskintones
# COLUMNS: pkstid, colour
# ==================================================

class SkinTone(Base):

    __tablename__ = "salskintones"


    pkSkinId = Column(
        "pkstid",
        Integer,
        primary_key=True,
        index=True,
    )


    Colour = Column(
        "colour",
        String(25),
        nullable=False,
        unique=True,
    )


# ==================================================
# SALARY — TASK STATUS
# TABLE: saltaskstatus
# COLUMNS: pkstaid, finish, cancel, status
# ==================================================

class TaskStatus(Base):

    __tablename__ = "saltaskstatus"

    pkStaId = Column(
        "pkstaid",
        Integer,
        primary_key=True,
        index=True,
    )

    Finish = Column(
        "finish",
        Boolean,
        nullable=False,
        default=False,
    )

    Cancel = Column(
        "cancel",
        Boolean,
        nullable=False,
        default=False,
    )

    Status = Column(
        "status",
        String(30),
        nullable=False,
    )


# ==================================================
# SALARY — SHIFT TIMING
# TABLE: salshifttiming
# COLUMNS: pkstid numeric(18,0), shift varchar(50),
# swork time, ework time, twork numeric(18,2),
# sbreak time, ebreak time, tbreak numeric(18,2)
#
# NOTE: pkSTId here is a separate class from
# ScheduleType.pkSTId — same attribute name, different
# unrelated model, no FK link between them (confirmed
# with user). twork/tbreak are stored as independent
# entered values here, not auto-computed from the
# start/end pairs — flag if that assumption is wrong.
# The real CREATE TABLE has no UNIQUE constraint on
# `shift`, so unique=True is NOT set on Shift below,
# unlike every other single-field Salary master.
# ==================================================

class ShiftTiming(Base):

    __tablename__ = "salshifttiming"

    pkSTId = Column(
        "pkstid",
        Integer,
        primary_key=True,
        index=True,
    )

    Shift = Column(
        "shift",
        String(50),
        nullable=False,
    )

    StartWork = Column(
        "swork",
        Time,
        nullable=False,
    )

    EndWork = Column(
        "ework",
        Time,
        nullable=False,
    )

    TotalWork = Column(
        "twork",
        Float,
        nullable=False,
    )

    StartBreak = Column(
        "sbreak",
        Time,
        nullable=False,
    )

    EndBreak = Column(
        "ebreak",
        Time,
        nullable=False,
    )

    TotalBreak = Column(
        "tbreak",
        Float,
        nullable=False,
    )


# ==================================================
# SALARY — EMPLOYEE RELATION
# TABLE: salemprelation (mixed-case, quoted — like
# SalaryEmployee/SalaryStructure, NOT lowercase like
# the other 6 Salary masters)
# COLUMNS: pkmrelid numeric(18), relativename varchar(50)
# ==================================================

class EmployeeRelation(Base):

    __tablename__ = "salemprelation"

    pkMRelId = Column(
        "pkmrelid",
        Integer,
        primary_key=True,
        index=True,
    )

    RelativeName = Column(
        "relativename",
        String(50),
        nullable=False,
        unique=True,
    )


# ==================================================
# EMPLOYEE RELATION — SERIALIZER + FUNCTIONS
# ==================================================

def employee_relation_to_dict(item):
    if not item:
        return None
    return {
        "pkMRelId": item.pkMRelId,
        "RelativeName": item.RelativeName,
    }


def get_employee_relations(db: Session):
    return (
        db.query(EmployeeRelation)
        .order_by(EmployeeRelation.pkMRelId)
        .all()
    )


def get_employee_relation_by_id(db: Session, item_id: int):
    return (
        db.query(EmployeeRelation)
        .filter(EmployeeRelation.pkMRelId == item_id)
        .first()
    )


def employee_relation_exists(db: Session, value: str):
    if not value:
        return False
    return (
        db.query(EmployeeRelation)
        .filter(
            func.lower(EmployeeRelation.RelativeName)
            == value.strip().lower(),
        )
        .first()
        is not None
    )


def employee_relation_exists_for_other(db: Session, value: str, item_id: int):
    if not value:
        return False
    return (
        db.query(EmployeeRelation)
        .filter(
            func.lower(EmployeeRelation.RelativeName)
            == value.strip().lower(),
            EmployeeRelation.pkMRelId != item_id,
        )
        .first()
        is not None
    )


def create_employee_relation(db: Session, value: str):
    row = EmployeeRelation(RelativeName=value.strip())
    try:
        db.add(row)
        db.commit()
        db.refresh(row)
        return row
    except Exception:
        db.rollback()
        raise


def update_employee_relation(db: Session, item_id: int, value: str):
    row = get_employee_relation_by_id(db, item_id)
    if not row:
        return None
    row.RelativeName = value.strip()
    try:
        db.commit()
        db.refresh(row)
        return row
    except Exception:
        db.rollback()
        raise


def delete_employee_relation(db: Session, item_id: int):
    row = get_employee_relation_by_id(db, item_id)
    if not row:
        return None
    try:
        db.delete(row)
        db.commit()
        return True
    except Exception:
        db.rollback()
        raise



# ==================================================
# SALARY EMPLOYEE SQLALCHEMY MODEL
# ==================================================

class SalaryEmployee(Base):

    __tablename__ = "SalaryEmployee"


    pkEmpId = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    EmpCode = Column(String(100), nullable=True)

    fkTitId = Column(String(100), nullable=True)

    Employee = Column(String(255), nullable=True)

    DOJ = Column(DateTime, nullable=True)

    DOB = Column(DateTime, nullable=True)

    Photo = Column(
        LargeBinary,
        nullable=True,
    )

    fkQualId = Column(
        String(100),
        nullable=True,
    )

    Male = Column(
        Boolean,
        nullable=True,
    )

    Married = Column(
        Boolean,
        nullable=True,
    )

    Anni = Column(
        DateTime,
        nullable=True,
    )

    PAddress = Column(
        Text,
        nullable=True,
    )

    NAddress = Column(
        Text,
        nullable=True,
    )

    fkDepId = Column(
        String(100),
        nullable=True,
    )

    fkDegId = Column(
        String(100),
        nullable=True,
    )

    fkBnkId = Column(
        String(100),
        nullable=True,
    )

    AccountNo = Column(
        String(100),
        nullable=True,
    )

    PFNo = Column(
        String(100),
        nullable=True,
    )

    ESICNo = Column(
        String(100),
        nullable=True,
    )

    PANNo = Column(
        String(100),
        nullable=True,
    )

    DOL = Column(
        DateTime,
        nullable=True,
    )

    BloodGrp = Column(
        String(50),
        nullable=True,
    )

    WP = Column(
        String(100),
        nullable=True,
    )

    Aadhar = Column(
        String(100),
        nullable=True,
    )

    CVCopy = Column(
        String(255),
        nullable=True,
    )

    LECopy = Column(
        String(255),
        nullable=True,
    )

    fkMDocId = Column(
        Integer,
        nullable=True,
    )

    UserName = Column(
        String(100),
        nullable=True,
    )

    Password = Column(
        String(255),
        nullable=True,
    )

    Question = Column(
        String(500),
        nullable=True,
    )

    Answer = Column(
        String(500),
        nullable=True,
    )

    Ext = Column(
        String(100),
        nullable=True,
    )

    fkUserId = Column(
        String(100),
        nullable=True,
    )

    LastStatus = Column(
        String(100),
        nullable=True,
    )

    RTGS = Column(
        String(100),
        nullable=True,
    )

    SAddress = Column(
        Text,
        nullable=True,
    )

    SB = Column(
        Boolean,
        nullable=True,
    )

    fkSetId = Column(
        String(100),
        nullable=True,
    )

    Type = Column(
        String(100),
        nullable=True,
    )

    AttType = Column(
        Boolean,
        nullable=True,
    )

    Height = Column(
        Integer,
        nullable=True,
    )

    Weight = Column(
        Float,
        nullable=True,
    )

    fkRGId = Column(
        Integer,
        nullable=True,
    )

    fkCSId = Column(
        Integer,
        nullable=True,
    )

    fkSTId = Column(
        Integer,
        nullable=True,
    )

    Mark = Column(
        String(500),
        nullable=True,
    )

    Experience = Column(
        String(500),
        nullable=True,
    )

    fkREmpId = Column(
        Integer,
        nullable=True,
    )

    Police = Column(
        String(500),
        nullable=True,
    )

    AddPolice = Column(
        String(500),
        nullable=True,
    )

    ContPolice = Column(
        String(500),
        nullable=True,
    )

    fkW1EmpId = Column(
        Integer,
        nullable=True,
    )

    fkW2EmpId = Column(
        Integer,
        nullable=True,
    )

    Personality1 = Column(
        String(255),
        nullable=True,
    )

    fkP1DesId = Column(
        String(100),
        nullable=True,
    )

    P1Address = Column(
        Text,
        nullable=True,
    )

    P1Contact = Column(
        String(100),
        nullable=True,
    )

    Personality2 = Column(
        String(255),
        nullable=True,
    )

    fkP2DesId = Column(
        String(100),
        nullable=True,
    )

    P2Address = Column(
        Text,
        nullable=True,
    )

    P2Contact = Column(
        String(100),
        nullable=True,
    )

    Messaging = Column(
        Boolean,
        nullable=True,
    )

    fkAcctId = Column(
        String(100),
        nullable=True,
    )

    Geolocation = Column(
        Boolean,
        nullable=True,
    )

    Employment = Column(
        String(100),
        nullable=True,
    )

    InformPF = Column(
        Boolean,
        nullable=True,
    )

    InformESIC = Column(
        Boolean,
        nullable=True,
    )


# ==================================================
# SALARY STRUCTURE SQLALCHEMY MODEL
# ==================================================

class SalaryStructure(Base):

    __tablename__ = "SalaryStructure"


    pkSSId = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    fkEmpId = Column(Integer, nullable=True)

    SalStart = Column(DateTime, nullable=True)

    Basic = Column(Float, nullable=True)

    BType = Column(String(100), nullable=True)

    Allowance = Column(Float, nullable=True)

    TAllowance = Column(Float, nullable=True)

    Travelling = Column(Float, nullable=True)

    TTravelling = Column(Float, nullable=True)

    Housing = Column(Float, nullable=True)

    THousing = Column(Float, nullable=True)

    Daily = Column(Float, nullable=True)

    TDaily = Column(Float, nullable=True)

    Incentive = Column(Float, nullable=True)

    TIncentive = Column(Float, nullable=True)

    Education = Column(Float, nullable=True)

    TEducation = Column(Float, nullable=True)

    Medical = Column(Float, nullable=True)

    TMedical = Column(Float, nullable=True)

    Other = Column(Float, nullable=True)

    TOther = Column(Float, nullable=True)

    OTI = Column(Float, nullable=True)

    TOTI = Column(Float, nullable=True)

    OTII = Column(Float, nullable=True)

    TOTII = Column(Float, nullable=True)

    RDayI = Column(Float, nullable=True)

    RDayII = Column(Float, nullable=True)

    PH = Column(Float, nullable=True)

    SL = Column(Float, nullable=True)

    CL = Column(Float, nullable=True)

    UCL = Column(Float, nullable=True)

    WH = Column(Float, nullable=True)

    RWH = Column(Float, nullable=True)

    BL = Column(Float, nullable=True)

    BLD = Column(Float, nullable=True)

    ARule = Column(Boolean, nullable=True)

    OTB = Column(Boolean, nullable=True)

    CalPT = Column(Boolean, nullable=True)

    CalPF = Column(Boolean, nullable=True)

    CalESIC = Column(Boolean, nullable=True)

    CalTDS = Column(Boolean, nullable=True)

    SlabTDS = Column(Boolean, nullable=True)

    Revise = Column(Boolean, nullable=True)

    ScanMB = Column(Boolean, nullable=True)

    fkSAcctId = Column(String(100), nullable=True)

    Remarks = Column(Text, nullable=True)

    fkUserId = Column(String(100), nullable=True)

    LastStatus = Column(String(100), nullable=True)

    OtherBasic = Column(Float, nullable=True)

    EOT = Column(Boolean, nullable=True)

    EWHour = Column(Float, nullable=True)

    LYEWHour = Column(Float, nullable=True)

    fkLAcctId = Column(String(100), nullable=True)

    MABasic = Column(Float, nullable=True)

    EABasic = Column(Float, nullable=True)

    IncentiveBasic = Column(Float, nullable=True)

    DABasic = Column(Float, nullable=True)

    HABasic = Column(Float, nullable=True)

    TABasic = Column(Float, nullable=True)

    AllowanceBasic = Column(Float, nullable=True)

    fkFContId = Column(Integer, nullable=True)

    fkTContId = Column(Integer, nullable=True)

    SalGross = Column(Float, nullable=True)

    fkIAcctId = Column(String(100), nullable=True)

    AbPenalty = Column(Float, nullable=True)

    Variant = Column(String(100), nullable=True)

    PFA = Column(Float, nullable=True)

    PFTA = Column(Float, nullable=True)

    PFHA = Column(Float, nullable=True)

    PFI = Column(Float, nullable=True)

    PFEA = Column(Float, nullable=True)

    PFMA = Column(Float, nullable=True)

    PFOA = Column(Float, nullable=True)

    RDVariant = Column(String(100), nullable=True)

    Retention = Column(Float, nullable=True)

    fkEmp1Id = Column(Integer, nullable=True)

    fkEmp2Id = Column(Integer, nullable=True)

    fkRAcctId = Column(String(100), nullable=True)

    SalDaily = Column(Float, nullable=True)

    SetPF = Column(Boolean, nullable=True)

    Sandwich = Column(Boolean, nullable=True)

    GHA = Column(Float, nullable=True)

    RDA = Column(Float, nullable=True)

    IORF = Column(Boolean, nullable=True)

    OAOP = Column(Boolean, nullable=True)

    LTimeROff = Column(Integer, nullable=True)

    Latitude = Column(Float, nullable=True)

    Longitude = Column(Float, nullable=True)

    Radius = Column(Float, nullable=True)

    TDSDeduct = Column(Integer, nullable=True)

    MDeduction = Column(Float, nullable=True)

    DedDescription = Column(Text, nullable=True)

    fkDesId = Column(String(100), nullable=True)


# ==================================================
# USER RIGHT SQLALCHEMY MODEL
# ==================================================

class UserRight(Base):

    __tablename__ = "user_rights"


    pkURId = Column(
        "pkurid",
        Integer,
        primary_key=True,
        index=True,
    )


    fkUserId = Column(
        "fk_user_id",
        Integer,
        nullable=False,
        index=True,
    )


    Module = Column(
        "module",
        String(100),
        nullable=False,
    )


    CanAdd = Column(
        "can_add",
        Boolean,
        nullable=False,
        default=False,
    )


    CanEdit = Column(
        "can_edit",
        Boolean,
        nullable=False,
        default=False,
    )


    CanDelete = Column(
        "can_delete",
        Boolean,
        nullable=False,
        default=False,
    )


    CanView = Column(
        "can_view",
        Boolean,
        nullable=False,
        default=False,
    )


    CanPrint = Column(
        "can_print",
        Boolean,
        nullable=False,
        default=False,
    )


    CanExport = Column(
        "can_export",
        Boolean,
        nullable=False,
        default=False,
    )


    updated_at = Column(
        "updated_at",
        DateTime,
        nullable=True,
        server_default=func.now(),
        onupdate=func.now(),
    )


# ==================================================
# USER SERIALIZER
# ==================================================

def user_to_dict(user):

    if not user:
        return None


    return {

        "pkid": user.pkid,

        "email": user.email,

        "full_name": user.full_name,

        "role": user.role,

        "is_active": user.is_active,

        "updated_at": (
            user.updated_at.isoformat()
            if user.updated_at
            else None
        ),

        "deleted_at": (
            user.deleted_at.isoformat()
            if user.deleted_at
            else None
        ),

    }


# ==================================================
# USER RIGHT SERIALIZER
# ==================================================

def user_right_to_dict(user_right):

    if not user_right:

        return None


    return {

        "module": user_right.Module,

        "add": user_right.CanAdd,

        "edit": user_right.CanEdit,

        "delete": user_right.CanDelete,

        "view": user_right.CanView,

        "print": user_right.CanPrint,

        "export": user_right.CanExport,

    }


# ==================================================
# USER RIGHT FUNCTIONS
# ==================================================

def get_user_rights(

    db: Session,

    user_id: int,

):

    return (

        db.query(UserRight)

        .filter(

            UserRight.fkUserId == user_id,

        )

        .order_by(UserRight.Module)

        .all()

    )


def get_user_rights_map(

    db: Session,

    user_id: int,

):

    rows = get_user_rights(
        db,

        user_id,
    )


    rights_map = {}


    for row in rows:

        rights_map[row.Module] = {

            "add": row.CanAdd,

            "edit": row.CanEdit,

            "delete": row.CanDelete,

            "view": row.CanView,

            "print": row.CanPrint,

            "export": row.CanExport,

        }


    return rights_map


def upsert_user_right(

    db: Session,

    user_id: int,

    module: str,

    can_add: bool,

    can_edit: bool,

    can_delete: bool,

    can_view: bool,

    can_print: bool,

    can_export: bool,

):

    existing = (

        db.query(UserRight)

        .filter(

            UserRight.fkUserId == user_id,

            UserRight.Module == module,

        )

        .first()

    )


    if existing:

        existing.CanAdd = can_add

        existing.CanEdit = can_edit

        existing.CanDelete = can_delete

        existing.CanView = can_view

        existing.CanPrint = can_print

        existing.CanExport = can_export


    else:

        existing = UserRight(

            fkUserId=user_id,

            Module=module,

            CanAdd=can_add,

            CanEdit=can_edit,

            CanDelete=can_delete,

            CanView=can_view,

            CanPrint=can_print,

            CanExport=can_export,

        )

        db.add(existing)


    try:

        db.commit()

        db.refresh(existing)

        return existing


    except Exception:

        db.rollback()

        raise


def set_user_rights_bulk(

    db: Session,

    user_id: int,

    rights_list,

):

    try:

        for item in rights_list:

            existing = (

                db.query(UserRight)

                .filter(

                    UserRight.fkUserId == user_id,

                    UserRight.Module == item["module"],

                )

                .first()

            )


            if existing:

                existing.CanAdd = item.get("add", False)

                existing.CanEdit = item.get("edit", False)

                existing.CanDelete = item.get("delete", False)

                existing.CanView = item.get("view", False)

                existing.CanPrint = item.get("print", False)

                existing.CanExport = item.get("export", False)


            else:

                db.add(
                    UserRight(

                        fkUserId=user_id,

                        Module=item["module"],

                        CanAdd=item.get("add", False),

                        CanEdit=item.get("edit", False),

                        CanDelete=item.get("delete", False),

                        CanView=item.get("view", False),

                        CanPrint=item.get("print", False),

                        CanExport=item.get("export", False),

                    )
                )


        db.commit()

        return get_user_rights(
            db,

            user_id,
        )


    except Exception:

        db.rollback()

        raise


# ==================================================
# USER FUNCTIONS
# ==================================================

def get_user_by_email(

    db: Session,

    email: str,

):

    if not email:

        return None


    return (

        db.query(User)

        .filter(

            func.lower(User.email)
            == email.strip().lower(),

            User.deleted_at.is_(None),

        )

        .first()

    )


def get_user_by_full_name(

    db: Session,

    full_name: str,

):

    if not full_name:

        return None


    return (

        db.query(User)

        .filter(

            func.lower(User.full_name)
            == full_name.strip().lower(),

            User.deleted_at.is_(None),

        )

        .first()

    )


def get_user_by_id(

    db: Session,

    user_id: int,

):

    return (

        db.query(User)

        .filter(

            User.pkid == user_id,

            User.deleted_at.is_(None),

        )

        .first()

    )


def get_active_users(

    db: Session,

):

    return (

        db.query(User)

        .filter(

            User.deleted_at.is_(None),

        )

        .order_by(User.pkid)

        .all()

    )


def get_inactive_users(

    db: Session,

):

    return (

        db.query(User)

        .filter(

            User.deleted_at.is_not(None),

        )

        .order_by(User.pkid)

        .all()

    )


def get_active_user_count(

    db: Session,

):

    return (

        db.query(User)

        .filter(

            User.is_active.is_(True),

            User.deleted_at.is_(None),

        )

        .count()

    )


def email_exists(

    db: Session,

    email: str | None,

):

    if not email:

        return False


    return (

        db.query(User)

        .filter(

            func.lower(User.email)
            == email.strip().lower(),

            User.deleted_at.is_(None),

        )

        .first()

        is not None

    )


def email_exists_for_other_user(

    db: Session,

    email: str | None,

    user_id: int,

):

    if not email:

        return False


    return (

        db.query(User)

        .filter(

            func.lower(User.email)
            == email.strip().lower(),

            User.pkid != user_id,

            User.deleted_at.is_(None),

        )

        .first()

        is not None

    )


def full_name_exists(

    db: Session,

    full_name: str | None,

):

    if not full_name:

        return False


    return (

        db.query(User)

        .filter(

            func.lower(User.full_name)
            == full_name.strip().lower(),

            User.deleted_at.is_(None),

        )

        .first()

        is not None

    )


def full_name_exists_for_other_user(

    db: Session,

    full_name: str | None,

    user_id: int,

):

    if not full_name:

        return False


    return (

        db.query(User)

        .filter(

            func.lower(User.full_name)
            == full_name.strip().lower(),

            User.pkid != user_id,

            User.deleted_at.is_(None),

        )

        .first()

        is not None

    )


# ==================================================
# CREATE USER
# ==================================================

def create_user(

    db: Session,

    email: str,

    password_hash: str,

    full_name: str,

    role: str = "user",

):

    user = User(

        email=email.strip().lower(),

        password_hash=password_hash,

        full_name=full_name.strip(),

        role=role.strip().lower(),

        is_active=True,

        deleted_at=None,

    )


    try:

        db.add(user)

        db.commit()

        db.refresh(user)

        return user


    except Exception:

        db.rollback()

        raise


# ==================================================
# UPDATE USER
# ==================================================

def update_user(

    db: Session,

    user: User,

    **update_data,

):

    if not user:

        return None


    for key, value in update_data.items():

        if not hasattr(user, key):

            continue


        setattr(

            user,

            key,

            value,

        )


    try:

        db.commit()

        db.refresh(user)

        return user


    except Exception:

        db.rollback()

        raise


# ==================================================
# SOFT DELETE USER
# ==================================================

def soft_delete_user(

    db: Session,

    user: User,

):

    if not user:

        return None


    user.is_active = False

    user.deleted_at = datetime.utcnow()


    try:

        db.commit()

        db.refresh(user)

        return user


    except Exception:

        db.rollback()

        raise


# ==================================================
# RESTORE USER
# ==================================================

def restore_user(

    db: Session,

    user_id: int,

):

    user = (

        db.query(User)

        .filter(

            User.pkid == user_id,

            User.deleted_at.is_not(None),

        )

        .first()

    )


    if not user:

        return None


    user.is_active = True

    user.deleted_at = None


    try:

        db.commit()

        db.refresh(user)

        return user


    except Exception:

        db.rollback()

        raise


# ==================================================
# DEACTIVATE USER
# ==================================================

def deactivate_user(

    db: Session,

    user_id: int,

):

    user = get_user_by_id(

        db,

        user_id,

    )


    if not user:

        return None


    user.is_active = False


    try:

        db.commit()

        db.refresh(user)

        return user


    except Exception:

        db.rollback()

        raise


# ==================================================
# ACTIVATE USER
# ==================================================

def activate_user(

    db: Session,

    user_id: int,

):

    user = get_user_by_id(

        db,

        user_id,

    )


    if not user:

        return None


    user.is_active = True


    try:

        db.commit()

        db.refresh(user)

        return user


    except Exception:

        db.rollback()

        raise


# ==================================================
# ABILITY SERIALIZER
# ==================================================

def ability_to_dict(ability):

    if not ability:

        return None


    return {

        "pkABId": ability.pkABId,

        "Abilities": ability.Abilities,

    }


# ==================================================
# ABILITY FUNCTIONS
# ==================================================

def get_abilities(

    db: Session,

):

    return (

        db.query(Ability)

        .order_by(Ability.pkABId)

        .all()

    )


def get_ability_by_id(

    db: Session,

    ability_id: int,

):

    return (

        db.query(Ability)

        .filter(

            Ability.pkABId == ability_id,

        )

        .first()

    )


def ability_exists(

    db: Session,

    abilities: str,

):

    if not abilities:

        return False


    return (

        db.query(Ability)

        .filter(

            func.lower(Ability.Abilities)
            == abilities.strip().lower(),

        )

        .first()

        is not None

    )


def ability_exists_for_other(

    db: Session,

    abilities: str,

    ability_id: int,

):

    if not abilities:

        return False


    return (

        db.query(Ability)

        .filter(

            func.lower(Ability.Abilities)
            == abilities.strip().lower(),

            Ability.pkABId != ability_id,

        )

        .first()

        is not None

    )


def create_ability(

    db: Session,

    abilities: str,

):

    ability = Ability(

        Abilities=abilities.strip(),

    )


    try:

        db.add(ability)

        db.commit()

        db.refresh(ability)

        return ability


    except Exception:

        db.rollback()

        raise


def update_ability(

    db: Session,

    ability_id: int,

    abilities: str,

):

    ability = get_ability_by_id(

        db,

        ability_id,

    )


    if not ability:

        return None


    ability.Abilities = abilities.strip()


    try:

        db.commit()

        db.refresh(ability)

        return ability


    except Exception:

        db.rollback()

        raise


def delete_ability(

    db: Session,

    ability_id: int,

):

    ability = get_ability_by_id(

        db,

        ability_id,

    )


    if not ability:

        return None


    try:

        db.delete(ability)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise


# ==================================================
# LOCATION SERIALIZER
# ==================================================

def location_to_dict(location):

    if not location:

        return None


    return {

        "pkHLId": location.pkHLId,

        "Location": location.Location,

    }


# ==================================================
# LOCATION FUNCTIONS
# ==================================================

def get_locations(

    db: Session,

):

    return (

        db.query(Location)

        .order_by(Location.pkHLId)

        .all()

    )


def get_location_by_id(

    db: Session,

    location_id: int,

):

    return (

        db.query(Location)

        .filter(

            Location.pkHLId == location_id,

        )

        .first()

    )


def location_exists(

    db: Session,

    location: str,

):

    if not location:

        return False


    return (

        db.query(Location)

        .filter(

            func.lower(Location.Location)
            == location.strip().lower(),

        )

        .first()

        is not None

    )


def location_exists_for_other(

    db: Session,

    location: str,

    location_id: int,

):

    if not location:

        return False


    return (

        db.query(Location)

        .filter(

            func.lower(Location.Location)
            == location.strip().lower(),

            Location.pkHLId != location_id,

        )

        .first()

        is not None

    )


def create_location(

    db: Session,

    location: str,

):

    new_location = Location(

        Location=location.strip(),

    )


    try:

        db.add(new_location)

        db.commit()

        db.refresh(new_location)

        return new_location


    except Exception:

        db.rollback()

        raise


def update_location(

    db: Session,

    location_id: int,

    location: str,

):

    existing_location = get_location_by_id(

        db,

        location_id,

    )


    if not existing_location:

        return None


    existing_location.Location = location.strip()


    try:

        db.commit()

        db.refresh(existing_location)

        return existing_location


    except Exception:

        db.rollback()

        raise


def delete_location(

    db: Session,

    location_id: int,

):

    location = get_location_by_id(

        db,

        location_id,

    )


    if not location:

        return None


    try:

        db.delete(location)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise


# ==================================================
# HOBBY SERIALIZER
# ==================================================

def hobby_to_dict(hobby):

    if not hobby:

        return None


    return {

        "pkHId": hobby.pkHId,

        "Hobby": hobby.Hobby,

    }


# ==================================================
# HOBBY FUNCTIONS
# ==================================================

def get_hobbies(

    db: Session,

):

    return (

        db.query(Hobby)

        .order_by(Hobby.pkHId)

        .all()

    )


def get_hobby_by_id(

    db: Session,

    hobby_id: int,

):

    return (

        db.query(Hobby)

        .filter(

            Hobby.pkHId == hobby_id,

        )

        .first()

    )


def hobby_exists(

    db: Session,

    hobby: str,

):

    if not hobby:

        return False


    return (

        db.query(Hobby)

        .filter(

            func.lower(Hobby.Hobby)
            == hobby.strip().lower(),

        )

        .first()

        is not None

    )


def hobby_exists_for_other(

    db: Session,

    hobby: str,

    hobby_id: int,

):

    if not hobby:

        return False


    return (

        db.query(Hobby)

        .filter(

            func.lower(Hobby.Hobby)
            == hobby.strip().lower(),

            Hobby.pkHId != hobby_id,

        )

        .first()

        is not None

    )


def create_hobby(

    db: Session,

    hobby: str,

):

    new_hobby = Hobby(

        Hobby=hobby.strip(),

    )


    try:

        db.add(new_hobby)

        db.commit()

        db.refresh(new_hobby)

        return new_hobby


    except Exception:

        db.rollback()

        raise


def update_hobby(

    db: Session,

    hobby_id: int,

    hobby: str,

):

    existing_hobby = get_hobby_by_id(

        db,

        hobby_id,

    )


    if not existing_hobby:

        return None


    existing_hobby.Hobby = hobby.strip()


    try:

        db.commit()

        db.refresh(existing_hobby)

        return existing_hobby


    except Exception:

        db.rollback()

        raise


def delete_hobby(

    db: Session,

    hobby_id: int,

):

    hobby = get_hobby_by_id(

        db,

        hobby_id,

    )


    if not hobby:

        return None


    try:

        db.delete(hobby)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise


# ==================================================
# ANNOUNCEMENT TYPE SERIALIZER
# ==================================================

def announcement_type_to_dict(announcement_type):

    if not announcement_type:

        return None


    return {

        "pkATId": announcement_type.pkATId,

        "AnnouncementType":
            announcement_type.AnnouncementType,

    }


# ==================================================
# ANNOUNCEMENT TYPE FUNCTIONS
# ==================================================

def get_announcement_types(

    db: Session,

):

    return (

        db.query(AnnouncementType)

        .order_by(AnnouncementType.pkATId)

        .all()

    )


def get_announcement_type_by_id(

    db: Session,

    announcement_type_id: int,

):

    return (

        db.query(AnnouncementType)

        .filter(

            AnnouncementType.pkATId
            == announcement_type_id,

        )

        .first()

    )


def announcement_type_exists(

    db: Session,

    announcement_type: str,

):

    if not announcement_type:

        return False


    return (

        db.query(AnnouncementType)

        .filter(

            func.lower(
                AnnouncementType.AnnouncementType
            )
            == announcement_type.strip().lower(),

        )

        .first()

        is not None

    )


def announcement_type_exists_for_other(

    db: Session,

    announcement_type: str,

    announcement_type_id: int,

):

    if not announcement_type:

        return False


    return (

        db.query(AnnouncementType)

        .filter(

            func.lower(
                AnnouncementType.AnnouncementType
            )
            == announcement_type.strip().lower(),

            AnnouncementType.pkATId
            != announcement_type_id,

        )

        .first()

        is not None

    )


def create_announcement_type(

    db: Session,

    announcement_type: str,

):

    new_announcement_type = AnnouncementType(

        AnnouncementType=announcement_type.strip(),

    )


    try:

        db.add(new_announcement_type)

        db.commit()

        db.refresh(new_announcement_type)

        return new_announcement_type


    except Exception:

        db.rollback()

        raise


def update_announcement_type(

    db: Session,

    announcement_type_id: int,

    announcement_type: str,

):

    existing_announcement_type = (
        get_announcement_type_by_id(

            db,

            announcement_type_id,

        )
    )


    if not existing_announcement_type:

        return None


    existing_announcement_type.AnnouncementType = (
        announcement_type.strip()
    )


    try:

        db.commit()

        db.refresh(existing_announcement_type)

        return existing_announcement_type


    except Exception:

        db.rollback()

        raise


def delete_announcement_type(

    db: Session,

    announcement_type_id: int,

):

    announcement_type = (
        get_announcement_type_by_id(

            db,

            announcement_type_id,

        )
    )


    if not announcement_type:

        return None


    try:

        db.delete(announcement_type)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise


# ==================================================
# OFFICE LEVEL SERIALIZER
# ==================================================

def office_level_to_dict(office_level):

    if not office_level:

        return None


    return {

        "pkOLId": office_level.pkOLId,

        "OfficeLevel": office_level.OfficeLevel,

    }


# ==================================================
# OFFICE LEVEL FUNCTIONS
# ==================================================

def get_office_levels(

    db: Session,

):

    return (

        db.query(OfficeLevel)

        .order_by(OfficeLevel.pkOLId)

        .all()

    )


def get_office_level_by_id(

    db: Session,

    office_level_id: int,

):

    return (

        db.query(OfficeLevel)

        .filter(

            OfficeLevel.pkOLId == office_level_id,

        )

        .first()

    )


def office_level_exists(

    db: Session,

    office_level: str,

):

    if not office_level:

        return False


    return (

        db.query(OfficeLevel)

        .filter(

            func.lower(OfficeLevel.OfficeLevel)
            == office_level.strip().lower(),

        )

        .first()

        is not None

    )


def office_level_exists_for_other(

    db: Session,

    office_level: str,

    office_level_id: int,

):

    if not office_level:

        return False


    return (

        db.query(OfficeLevel)

        .filter(

            func.lower(OfficeLevel.OfficeLevel)
            == office_level.strip().lower(),

            OfficeLevel.pkOLId != office_level_id,

        )

        .first()

        is not None

    )


def create_office_level(

    db: Session,

    office_level: str,

):

    new_office_level = OfficeLevel(

        OfficeLevel=office_level.strip(),

    )


    try:

        db.add(new_office_level)

        db.commit()

        db.refresh(new_office_level)

        return new_office_level


    except Exception:

        db.rollback()

        raise


def update_office_level(

    db: Session,

    office_level_id: int,

    office_level: str,

):

    existing_office_level = get_office_level_by_id(

        db,

        office_level_id,

    )


    if not existing_office_level:

        return None


    existing_office_level.OfficeLevel = office_level.strip()


    try:

        db.commit()

        db.refresh(existing_office_level)

        return existing_office_level


    except Exception:

        db.rollback()

        raise


def delete_office_level(

    db: Session,

    office_level_id: int,

):

    office_level = get_office_level_by_id(

        db,

        office_level_id,

    )


    if not office_level:

        return None


    try:

        db.delete(office_level)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise


# ==================================================
# MEETING TYPE SERIALIZER
# ==================================================

def meeting_type_to_dict(meeting_type):

    if not meeting_type:

        return None


    return {

        "pkMTId": meeting_type.pkMTId,

        "MeetingType": meeting_type.MeetingType,

    }


# ==================================================
# MEETING TYPE FUNCTIONS
# ==================================================

def get_meeting_types(

    db: Session,

):

    return (

        db.query(MeetingType)

        .order_by(MeetingType.pkMTId)

        .all()

    )


def get_meeting_type_by_id(

    db: Session,

    meeting_type_id: int,

):

    return (

        db.query(MeetingType)

        .filter(

            MeetingType.pkMTId == meeting_type_id,

        )

        .first()

    )


def meeting_type_exists(

    db: Session,

    meeting_type: str,

):

    if not meeting_type:

        return False


    return (

        db.query(MeetingType)

        .filter(

            func.lower(MeetingType.MeetingType)
            == meeting_type.strip().lower(),

        )

        .first()

        is not None

    )


def meeting_type_exists_for_other(

    db: Session,

    meeting_type: str,

    meeting_type_id: int,

):

    if not meeting_type:

        return False


    return (

        db.query(MeetingType)

        .filter(

            func.lower(MeetingType.MeetingType)
            == meeting_type.strip().lower(),

            MeetingType.pkMTId != meeting_type_id,

        )

        .first()

        is not None

    )


def create_meeting_type(

    db: Session,

    meeting_type: str,

):

    new_meeting_type = MeetingType(

        MeetingType=meeting_type.strip(),

    )


    try:

        db.add(new_meeting_type)

        db.commit()

        db.refresh(new_meeting_type)

        return new_meeting_type


    except Exception:

        db.rollback()

        raise


def update_meeting_type(

    db: Session,

    meeting_type_id: int,

    meeting_type: str,

):

    existing_meeting_type = get_meeting_type_by_id(

        db,

        meeting_type_id,

    )


    if not existing_meeting_type:

        return None


    existing_meeting_type.MeetingType = meeting_type.strip()


    try:

        db.commit()

        db.refresh(existing_meeting_type)

        return existing_meeting_type


    except Exception:

        db.rollback()

        raise


def delete_meeting_type(

    db: Session,

    meeting_type_id: int,

):

    meeting_type = get_meeting_type_by_id(

        db,

        meeting_type_id,

    )


    if not meeting_type:

        return None


    try:

        db.delete(meeting_type)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise


# ==================================================
# LANGUAGE SERIALIZER
# ==================================================

def language_to_dict(language):

    if not language:

        return None


    return {

        "pkLId": language.pkLId,

        "Language": language.Language,

    }


# ==================================================
# LANGUAGE FUNCTIONS
# ==================================================

def get_languages(

    db: Session,

):

    return (

        db.query(Language)

        .order_by(Language.pkLId)

        .all()

    )


def get_language_by_id(

    db: Session,

    language_id: int,

):

    return (

        db.query(Language)

        .filter(

            Language.pkLId == language_id,

        )

        .first()

    )


def language_exists(

    db: Session,

    language: str,

):

    if not language:

        return False


    return (

        db.query(Language)

        .filter(

            func.lower(Language.Language)
            == language.strip().lower(),

        )

        .first()

        is not None

    )


def language_exists_for_other(

    db: Session,

    language: str,

    language_id: int,

):

    if not language:

        return False


    return (

        db.query(Language)

        .filter(

            func.lower(Language.Language)
            == language.strip().lower(),

            Language.pkLId != language_id,

        )

        .first()

        is not None

    )


def create_language(

    db: Session,

    language: str,

):

    new_language = Language(

        Language=language.strip(),

    )


    try:

        db.add(new_language)

        db.commit()

        db.refresh(new_language)

        return new_language


    except Exception:

        db.rollback()

        raise


def update_language(

    db: Session,

    language_id: int,

    language: str,

):

    existing_language = get_language_by_id(

        db,

        language_id,

    )


    if not existing_language:

        return None


    existing_language.Language = language.strip()


    try:

        db.commit()

        db.refresh(existing_language)

        return existing_language


    except Exception:

        db.rollback()

        raise


def delete_language(

    db: Session,

    language_id: int,

):

    language = get_language_by_id(

        db,

        language_id,

    )


    if not language:

        return None


    try:

        db.delete(language)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise


# ==================================================
# REQUIREMENT SERIALIZER
# ==================================================

def requirement_to_dict(requirement):

    if not requirement:

        return None


    return {

        "pkRId": requirement.pkRId,

        "Requirement": requirement.Requirement,

    }


# ==================================================
# REQUIREMENT FUNCTIONS
# ==================================================

def get_requirements(

    db: Session,

):

    return (

        db.query(Requirement)

        .order_by(Requirement.pkRId)

        .all()

    )


def get_requirement_by_id(

    db: Session,

    requirement_id: int,

):

    return (

        db.query(Requirement)

        .filter(

            Requirement.pkRId == requirement_id,

        )

        .first()

    )


def requirement_exists(

    db: Session,

    requirement: str,

):

    if not requirement:

        return False


    return (

        db.query(Requirement)

        .filter(

            func.lower(Requirement.Requirement)
            == requirement.strip().lower(),

        )

        .first()

        is not None

    )


def requirement_exists_for_other(

    db: Session,

    requirement: str,

    requirement_id: int,

):

    if not requirement:

        return False


    return (

        db.query(Requirement)

        .filter(

            func.lower(Requirement.Requirement)
            == requirement.strip().lower(),

            Requirement.pkRId != requirement_id,

        )

        .first()

        is not None

    )


def create_requirement(

    db: Session,

    requirement: str,

):

    new_requirement = Requirement(

        Requirement=requirement.strip(),

    )


    try:

        db.add(new_requirement)

        db.commit()

        db.refresh(new_requirement)

        return new_requirement


    except Exception:

        db.rollback()

        raise


def update_requirement(

    db: Session,

    requirement_id: int,

    requirement: str,

):

    existing_requirement = get_requirement_by_id(

        db,

        requirement_id,

    )


    if not existing_requirement:

        return None


    existing_requirement.Requirement = requirement.strip()


    try:

        db.commit()

        db.refresh(existing_requirement)

        return existing_requirement


    except Exception:

        db.rollback()

        raise


def delete_requirement(

    db: Session,

    requirement_id: int,

):

    requirement = get_requirement_by_id(

        db,

        requirement_id,

    )


    if not requirement:

        return None


    try:

        db.delete(requirement)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise



# ==================================================
# ADVERTISING MEDIA SERIALIZER
# ==================================================

def advertising_media_to_dict(advertising_media):

    if not advertising_media:

        return None


    return {

        "pkAMId": advertising_media.pkAMId,

        "AdvertisingMedia": advertising_media.AdvertisingMedia,

    }


# ==================================================
# ADVERTISING MEDIA FUNCTIONS
# ==================================================

def get_advertising_medias(

    db: Session,

):

    return (

        db.query(AdvertisingMedia)

        .order_by(AdvertisingMedia.pkAMId)

        .all()

    )


def get_advertising_media_by_id(

    db: Session,

    advertising_media_id: int,

):

    return (

        db.query(AdvertisingMedia)

        .filter(

            AdvertisingMedia.pkAMId == advertising_media_id,

        )

        .first()

    )


def advertising_media_exists(

    db: Session,

    advertising_media: str,

):

    if not advertising_media:

        return False


    return (

        db.query(AdvertisingMedia)

        .filter(

            func.lower(AdvertisingMedia.AdvertisingMedia)
            == advertising_media.strip().lower(),

        )

        .first()

        is not None

    )


def advertising_media_exists_for_other(

    db: Session,

    advertising_media: str,

    advertising_media_id: int,

):

    if not advertising_media:

        return False


    return (

        db.query(AdvertisingMedia)

        .filter(

            func.lower(AdvertisingMedia.AdvertisingMedia)
            == advertising_media.strip().lower(),

            AdvertisingMedia.pkAMId != advertising_media_id,

        )

        .first()

        is not None

    )


def create_advertising_media(

    db: Session,

    advertising_media: str,

):

    new_advertising_media = AdvertisingMedia(

        AdvertisingMedia=advertising_media.strip(),

    )


    try:

        db.add(new_advertising_media)

        db.commit()

        db.refresh(new_advertising_media)

        return new_advertising_media


    except Exception:

        db.rollback()

        raise


def update_advertising_media(

    db: Session,

    advertising_media_id: int,

    advertising_media: str,

):

    existing_advertising_media = get_advertising_media_by_id(

        db,

        advertising_media_id,

    )


    if not existing_advertising_media:

        return None


    existing_advertising_media.AdvertisingMedia = advertising_media.strip()


    try:

        db.commit()

        db.refresh(existing_advertising_media)

        return existing_advertising_media


    except Exception:

        db.rollback()

        raise


def delete_advertising_media(

    db: Session,

    advertising_media_id: int,

):

    advertising_media = get_advertising_media_by_id(

        db,

        advertising_media_id,

    )


    if not advertising_media:

        return None


    try:

        db.delete(advertising_media)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise



# ==================================================
# ADVERTISING PURPOSE SERIALIZER
# ==================================================

def advertising_purpose_to_dict(advertising_purpose):

    if not advertising_purpose:

        return None


    return {

        "pkAPId": advertising_purpose.pkAPId,

        "AdvertisingPurpose": advertising_purpose.AdvertisingPurpose,

    }


# ==================================================
# ADVERTISING PURPOSE FUNCTIONS
# ==================================================

def get_advertising_purposes(

    db: Session,

):

    return (

        db.query(AdvertisingPurpose)

        .order_by(AdvertisingPurpose.pkAPId)

        .all()

    )


def get_advertising_purpose_by_id(

    db: Session,

    advertising_purpose_id: int,

):

    return (

        db.query(AdvertisingPurpose)

        .filter(

            AdvertisingPurpose.pkAPId == advertising_purpose_id,

        )

        .first()

    )


def advertising_purpose_exists(

    db: Session,

    advertising_purpose: str,

):

    if not advertising_purpose:

        return False


    return (

        db.query(AdvertisingPurpose)

        .filter(

            func.lower(AdvertisingPurpose.AdvertisingPurpose)
            == advertising_purpose.strip().lower(),

        )

        .first()

        is not None

    )


def advertising_purpose_exists_for_other(

    db: Session,

    advertising_purpose: str,

    advertising_purpose_id: int,

):

    if not advertising_purpose:

        return False


    return (

        db.query(AdvertisingPurpose)

        .filter(

            func.lower(AdvertisingPurpose.AdvertisingPurpose)
            == advertising_purpose.strip().lower(),

            AdvertisingPurpose.pkAPId != advertising_purpose_id,

        )

        .first()

        is not None

    )


def create_advertising_purpose(

    db: Session,

    advertising_purpose: str,

):

    new_advertising_purpose = AdvertisingPurpose(

        AdvertisingPurpose=advertising_purpose.strip(),

    )


    try:

        db.add(new_advertising_purpose)

        db.commit()

        db.refresh(new_advertising_purpose)

        return new_advertising_purpose


    except Exception:

        db.rollback()

        raise


def update_advertising_purpose(

    db: Session,

    advertising_purpose_id: int,

    advertising_purpose: str,

):

    existing_advertising_purpose = get_advertising_purpose_by_id(

        db,

        advertising_purpose_id,

    )


    if not existing_advertising_purpose:

        return None


    existing_advertising_purpose.AdvertisingPurpose = advertising_purpose.strip()


    try:

        db.commit()

        db.refresh(existing_advertising_purpose)

        return existing_advertising_purpose


    except Exception:

        db.rollback()

        raise


def delete_advertising_purpose(

    db: Session,

    advertising_purpose_id: int,

):

    advertising_purpose = get_advertising_purpose_by_id(

        db,

        advertising_purpose_id,

    )


    if not advertising_purpose:

        return None


    try:

        db.delete(advertising_purpose)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise



# ==================================================
# OFFICE TYPE SERIALIZER
# ==================================================

def office_type_to_dict(office_type):

    if not office_type:

        return None


    return {

        "pkOTId": office_type.pkOTId,

        "OfficeType": office_type.OfficeType,

    }


# ==================================================
# OFFICE TYPE FUNCTIONS
# ==================================================

def get_office_types(

    db: Session,

):

    return (

        db.query(OfficeType)

        .order_by(OfficeType.pkOTId)

        .all()

    )


def get_office_type_by_id(

    db: Session,

    office_type_id: int,

):

    return (

        db.query(OfficeType)

        .filter(

            OfficeType.pkOTId == office_type_id,

        )

        .first()

    )


def office_type_exists(

    db: Session,

    office_type: str,

):

    if not office_type:

        return False


    return (

        db.query(OfficeType)

        .filter(

            func.lower(OfficeType.OfficeType)
            == office_type.strip().lower(),

        )

        .first()

        is not None

    )


def office_type_exists_for_other(

    db: Session,

    office_type: str,

    office_type_id: int,

):

    if not office_type:

        return False


    return (

        db.query(OfficeType)

        .filter(

            func.lower(OfficeType.OfficeType)
            == office_type.strip().lower(),

            OfficeType.pkOTId != office_type_id,

        )

        .first()

        is not None

    )


def create_office_type(

    db: Session,

    office_type: str,

):

    new_office_type = OfficeType(

        OfficeType=office_type.strip(),

    )


    try:

        db.add(new_office_type)

        db.commit()

        db.refresh(new_office_type)

        return new_office_type


    except Exception:

        db.rollback()

        raise


def update_office_type(

    db: Session,

    office_type_id: int,

    office_type: str,

):

    existing_office_type = get_office_type_by_id(

        db,

        office_type_id,

    )


    if not existing_office_type:

        return None


    existing_office_type.OfficeType = office_type.strip()


    try:

        db.commit()

        db.refresh(existing_office_type)

        return existing_office_type


    except Exception:

        db.rollback()

        raise


def delete_office_type(

    db: Session,

    office_type_id: int,

):

    office_type = get_office_type_by_id(

        db,

        office_type_id,

    )


    if not office_type:

        return None


    try:

        db.delete(office_type)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise



# ==================================================
# MEETING LOCATION SERIALIZER
# ==================================================

def meeting_location_to_dict(meeting_location):

    if not meeting_location:

        return None


    return {

        "pkMLId": meeting_location.pkMLId,

        "MeetingLocation": meeting_location.MeetingLocation,

    }


# ==================================================
# MEETING LOCATION FUNCTIONS
# ==================================================

def get_meeting_locations(

    db: Session,

):

    return (

        db.query(MeetingLocation)

        .order_by(MeetingLocation.pkMLId)

        .all()

    )


def get_meeting_location_by_id(

    db: Session,

    meeting_location_id: int,

):

    return (

        db.query(MeetingLocation)

        .filter(

            MeetingLocation.pkMLId == meeting_location_id,

        )

        .first()

    )


def meeting_location_exists(

    db: Session,

    meeting_location: str,

):

    if not meeting_location:

        return False


    return (

        db.query(MeetingLocation)

        .filter(

            func.lower(MeetingLocation.MeetingLocation)
            == meeting_location.strip().lower(),

        )

        .first()

        is not None

    )


def meeting_location_exists_for_other(

    db: Session,

    meeting_location: str,

    meeting_location_id: int,

):

    if not meeting_location:

        return False


    return (

        db.query(MeetingLocation)

        .filter(

            func.lower(MeetingLocation.MeetingLocation)
            == meeting_location.strip().lower(),

            MeetingLocation.pkMLId != meeting_location_id,

        )

        .first()

        is not None

    )


def create_meeting_location(

    db: Session,

    meeting_location: str,

):

    new_meeting_location = MeetingLocation(

        MeetingLocation=meeting_location.strip(),

    )


    try:

        db.add(new_meeting_location)

        db.commit()

        db.refresh(new_meeting_location)

        return new_meeting_location


    except Exception:

        db.rollback()

        raise


def update_meeting_location(

    db: Session,

    meeting_location_id: int,

    meeting_location: str,

):

    existing_meeting_location = get_meeting_location_by_id(

        db,

        meeting_location_id,

    )


    if not existing_meeting_location:

        return None


    existing_meeting_location.MeetingLocation = meeting_location.strip()


    try:

        db.commit()

        db.refresh(existing_meeting_location)

        return existing_meeting_location


    except Exception:

        db.rollback()

        raise


def delete_meeting_location(

    db: Session,

    meeting_location_id: int,

):

    meeting_location = get_meeting_location_by_id(

        db,

        meeting_location_id,

    )


    if not meeting_location:

        return None


    try:

        db.delete(meeting_location)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise



# ==================================================
# KSA SERIALIZER
# ==================================================

def ksa_to_dict(ksa):

    if not ksa:

        return None


    return {

        "pkKSAId": ksa.pkKSAId,

        "KSA": ksa.KSA,

    }


# ==================================================
# KSA FUNCTIONS
# ==================================================

def get_ksas(

    db: Session,

):

    return (

        db.query(KSA)

        .order_by(KSA.pkKSAId)

        .all()

    )


def get_ksa_by_id(

    db: Session,

    ksa_id: int,

):

    return (

        db.query(KSA)

        .filter(

            KSA.pkKSAId == ksa_id,

        )

        .first()

    )


def ksa_exists(

    db: Session,

    ksa: str,

):

    if not ksa:

        return False


    return (

        db.query(KSA)

        .filter(

            func.lower(KSA.KSA)
            == ksa.strip().lower(),

        )

        .first()

        is not None

    )


def ksa_exists_for_other(

    db: Session,

    ksa: str,

    ksa_id: int,

):

    if not ksa:

        return False


    return (

        db.query(KSA)

        .filter(

            func.lower(KSA.KSA)
            == ksa.strip().lower(),

            KSA.pkKSAId != ksa_id,

        )

        .first()

        is not None

    )


def create_ksa(

    db: Session,

    ksa: str,

):

    new_ksa = KSA(

        KSA=ksa.strip(),

    )


    try:

        db.add(new_ksa)

        db.commit()

        db.refresh(new_ksa)

        return new_ksa


    except Exception:

        db.rollback()

        raise


def update_ksa(

    db: Session,

    ksa_id: int,

    ksa: str,

):

    existing_ksa = get_ksa_by_id(

        db,

        ksa_id,

    )


    if not existing_ksa:

        return None


    existing_ksa.KSA = ksa.strip()


    try:

        db.commit()

        db.refresh(existing_ksa)

        return existing_ksa


    except Exception:

        db.rollback()

        raise


def delete_ksa(

    db: Session,

    ksa_id: int,

):

    ksa = get_ksa_by_id(

        db,

        ksa_id,

    )


    if not ksa:

        return None


    try:

        db.delete(ksa)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise



# ==================================================
# KSA CATEGORY SERIALIZER
# ==================================================

def ksa_category_to_dict(ksa_category):

    if not ksa_category:

        return None


    return {

        "pkKSACId": ksa_category.pkKSACId,

        "KSACategory": ksa_category.KSACategory,

    }


# ==================================================
# KSA CATEGORY FUNCTIONS
# ==================================================

def get_ksa_categories(

    db: Session,

):

    return (

        db.query(KSACategory)

        .order_by(KSACategory.pkKSACId)

        .all()

    )


def get_ksa_category_by_id(

    db: Session,

    ksa_category_id: int,

):

    return (

        db.query(KSACategory)

        .filter(

            KSACategory.pkKSACId == ksa_category_id,

        )

        .first()

    )


def ksa_category_exists(

    db: Session,

    ksa_category: str,

):

    if not ksa_category:

        return False


    return (

        db.query(KSACategory)

        .filter(

            func.lower(KSACategory.KSACategory)
            == ksa_category.strip().lower(),

        )

        .first()

        is not None

    )


def ksa_category_exists_for_other(

    db: Session,

    ksa_category: str,

    ksa_category_id: int,

):

    if not ksa_category:

        return False


    return (

        db.query(KSACategory)

        .filter(

            func.lower(KSACategory.KSACategory)
            == ksa_category.strip().lower(),

            KSACategory.pkKSACId != ksa_category_id,

        )

        .first()

        is not None

    )


def create_ksa_category(

    db: Session,

    ksa_category: str,

):

    new_ksa_category = KSACategory(

        KSACategory=ksa_category.strip(),

    )


    try:

        db.add(new_ksa_category)

        db.commit()

        db.refresh(new_ksa_category)

        return new_ksa_category


    except Exception:

        db.rollback()

        raise


def update_ksa_category(

    db: Session,

    ksa_category_id: int,

    ksa_category: str,

):

    existing_ksa_category = get_ksa_category_by_id(

        db,

        ksa_category_id,

    )


    if not existing_ksa_category:

        return None


    existing_ksa_category.KSACategory = ksa_category.strip()


    try:

        db.commit()

        db.refresh(existing_ksa_category)

        return existing_ksa_category


    except Exception:

        db.rollback()

        raise


def delete_ksa_category(

    db: Session,

    ksa_category_id: int,

):

    ksa_category = get_ksa_category_by_id(

        db,

        ksa_category_id,

    )


    if not ksa_category:

        return None


    try:

        db.delete(ksa_category)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise



# ==================================================
# POSITION GRADE SERIALIZER
# ==================================================

def position_grade_to_dict(position_grade):

    if not position_grade:

        return None


    return {

        "pkPGId": position_grade.pkPGId,

        "PositionGrade": position_grade.PositionGrade,

        "MinimumPay": position_grade.MinimumPay,

        "MaximumPay": position_grade.MaximumPay,

    }


# ==================================================
# POSITION GRADE FUNCTIONS
# ==================================================

def get_position_grades(

    db: Session,

):

    return (

        db.query(PositionGrade)

        .order_by(PositionGrade.pkPGId)

        .all()

    )


def get_position_grade_by_id(

    db: Session,

    position_grade_id: int,

):

    return (

        db.query(PositionGrade)

        .filter(

            PositionGrade.pkPGId == position_grade_id,

        )

        .first()

    )


def position_grade_exists(

    db: Session,

    position_grade: str,

):

    if not position_grade:

        return False


    return (

        db.query(PositionGrade)

        .filter(

            func.lower(PositionGrade.PositionGrade)
            == position_grade.strip().lower(),

        )

        .first()

        is not None

    )


def position_grade_exists_for_other(

    db: Session,

    position_grade: str,

    position_grade_id: int,

):

    if not position_grade:

        return False


    return (

        db.query(PositionGrade)

        .filter(

            func.lower(PositionGrade.PositionGrade)
            == position_grade.strip().lower(),

            PositionGrade.pkPGId != position_grade_id,

        )

        .first()

        is not None

    )


def create_position_grade(

    db: Session,

    position_grade: str,

    minimum_pay: float,

    maximum_pay: float,

):

    new_position_grade = PositionGrade(

        PositionGrade=position_grade.strip(),

        MinimumPay=minimum_pay,

        MaximumPay=maximum_pay,

    )


    try:

        db.add(new_position_grade)

        db.commit()

        db.refresh(new_position_grade)

        return new_position_grade


    except Exception:

        db.rollback()

        raise


def update_position_grade(

    db: Session,

    position_grade_id: int,

    position_grade: str,

    minimum_pay: float,

    maximum_pay: float,

):

    existing = get_position_grade_by_id(

        db,

        position_grade_id,

    )


    if not existing:

        return None


    existing.PositionGrade = position_grade.strip()

    existing.MinimumPay = minimum_pay

    existing.MaximumPay = maximum_pay


    try:

        db.commit()

        db.refresh(existing)

        return existing


    except Exception:

        db.rollback()

        raise


def delete_position_grade(

    db: Session,

    position_grade_id: int,

):

    position_grade = get_position_grade_by_id(

        db,

        position_grade_id,

    )


    if not position_grade:

        return None


    try:

        db.delete(position_grade)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise



# ==================================================
# ROLE IN OFFENSE SERIALIZER
# ==================================================

def role_in_offense_to_dict(role_in_offense):

    if not role_in_offense:

        return None


    return {

        "pkRIOId": role_in_offense.pkRIOId,

        "RoleInOffense": role_in_offense.RoleInOffense,

        "MinimumPenalty": role_in_offense.MinimumPenalty,

        "MaximumPenalty": role_in_offense.MaximumPenalty,

    }


# ==================================================
# ROLE IN OFFENSE FUNCTIONS
# ==================================================

def get_role_in_offenses(

    db: Session,

):

    return (

        db.query(RoleInOffense)

        .order_by(RoleInOffense.pkRIOId)

        .all()

    )


def get_role_in_offense_by_id(

    db: Session,

    role_in_offense_id: int,

):

    return (

        db.query(RoleInOffense)

        .filter(

            RoleInOffense.pkRIOId == role_in_offense_id,

        )

        .first()

    )


def role_in_offense_exists(

    db: Session,

    role_in_offense: str,

):

    if not role_in_offense:

        return False


    return (

        db.query(RoleInOffense)

        .filter(

            func.lower(RoleInOffense.RoleInOffense)
            == role_in_offense.strip().lower(),

        )

        .first()

        is not None

    )


def role_in_offense_exists_for_other(

    db: Session,

    role_in_offense: str,

    role_in_offense_id: int,

):

    if not role_in_offense:

        return False


    return (

        db.query(RoleInOffense)

        .filter(

            func.lower(RoleInOffense.RoleInOffense)
            == role_in_offense.strip().lower(),

            RoleInOffense.pkRIOId != role_in_offense_id,

        )

        .first()

        is not None

    )


def create_role_in_offense(

    db: Session,

    role_in_offense: str,

    minimum_penalty: float,

    maximum_penalty: float,

):

    new_item = RoleInOffense(

        RoleInOffense=role_in_offense.strip(),

        MinimumPenalty=minimum_penalty,

        MaximumPenalty=maximum_penalty,

    )


    try:

        db.add(new_item)

        db.commit()

        db.refresh(new_item)

        return new_item


    except Exception:

        db.rollback()

        raise


def update_role_in_offense(

    db: Session,

    role_in_offense_id: int,

    role_in_offense: str,

    minimum_penalty: float,

    maximum_penalty: float,

):

    existing = get_role_in_offense_by_id(

        db,

        role_in_offense_id,

    )


    if not existing:

        return None


    existing.RoleInOffense = role_in_offense.strip()

    existing.MinimumPenalty = minimum_penalty

    existing.MaximumPenalty = maximum_penalty


    try:

        db.commit()

        db.refresh(existing)

        return existing


    except Exception:

        db.rollback()

        raise


def delete_role_in_offense(

    db: Session,

    role_in_offense_id: int,

):

    item = get_role_in_offense_by_id(

        db,

        role_in_offense_id,

    )


    if not item:

        return None


    try:

        db.delete(item)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise



# ==================================================
# NATURE OF WORK — SERIALIZER + FUNCTIONS
# ==================================================

def nature_of_work_to_dict(item):

    if not item:

        return None


    return {

        "pkNWId": item.pkNWId,

        "NatureOfWork": item.NatureOfWork,

    }


def get_nature_of_works(

    db: Session,

):

    return (

        db.query(NatureOfWork)

        .order_by(NatureOfWork.pkNWId)

        .all()

    )


def get_nature_of_work_by_id(

    db: Session,

    item_id: int,

):

    return (

        db.query(NatureOfWork)

        .filter(

            NatureOfWork.pkNWId == item_id,

        )

        .first()

    )


def nature_of_work_exists(

    db: Session,

    value: str,

):

    if not value:

        return False


    return (

        db.query(NatureOfWork)

        .filter(

            func.lower(NatureOfWork.NatureOfWork)
            == value.strip().lower(),

        )

        .first()

        is not None

    )


def nature_of_work_exists_for_other(

    db: Session,

    value: str,

    item_id: int,

):

    if not value:

        return False


    return (

        db.query(NatureOfWork)

        .filter(

            func.lower(NatureOfWork.NatureOfWork)
            == value.strip().lower(),

            NatureOfWork.pkNWId != item_id,

        )

        .first()

        is not None

    )


def create_nature_of_work(

    db: Session,

    value: str,

):

    row = NatureOfWork(

        NatureOfWork=value.strip(),

    )


    try:

        db.add(row)

        db.commit()

        db.refresh(row)

        return row


    except Exception:

        db.rollback()

        raise


def update_nature_of_work(

    db: Session,

    item_id: int,

    value: str,

):

    row = get_nature_of_work_by_id(

        db,

        item_id,

    )


    if not row:

        return None


    row.NatureOfWork = value.strip()


    try:

        db.commit()

        db.refresh(row)

        return row


    except Exception:

        db.rollback()

        raise


def delete_nature_of_work(

    db: Session,

    item_id: int,

):

    row = get_nature_of_work_by_id(

        db,

        item_id,

    )


    if not row:

        return None


    try:

        db.delete(row)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise


# ==================================================
# SCHEDULE TYPE — SERIALIZER + FUNCTIONS
# ==================================================

def schedule_type_to_dict(item):

    if not item:

        return None


    return {

        "pkSTId": item.pkSTId,

        "Type": item.Type,

    }


def get_schedule_types(

    db: Session,

):

    return (

        db.query(ScheduleType)

        .order_by(ScheduleType.pkSTId)

        .all()

    )


def get_schedule_type_by_id(

    db: Session,

    item_id: int,

):

    return (

        db.query(ScheduleType)

        .filter(

            ScheduleType.pkSTId == item_id,

        )

        .first()

    )


def schedule_type_exists(

    db: Session,

    value: str,

):

    if not value:

        return False


    return (

        db.query(ScheduleType)

        .filter(

            func.lower(ScheduleType.Type)
            == value.strip().lower(),

        )

        .first()

        is not None

    )


def schedule_type_exists_for_other(

    db: Session,

    value: str,

    item_id: int,

):

    if not value:

        return False


    return (

        db.query(ScheduleType)

        .filter(

            func.lower(ScheduleType.Type)
            == value.strip().lower(),

            ScheduleType.pkSTId != item_id,

        )

        .first()

        is not None

    )


def create_schedule_type(

    db: Session,

    value: str,

):

    row = ScheduleType(

        Type=value.strip(),

    )


    try:

        db.add(row)

        db.commit()

        db.refresh(row)

        return row


    except Exception:

        db.rollback()

        raise


def update_schedule_type(

    db: Session,

    item_id: int,

    value: str,

):

    row = get_schedule_type_by_id(

        db,

        item_id,

    )


    if not row:

        return None


    row.Type = value.strip()


    try:

        db.commit()

        db.refresh(row)

        return row


    except Exception:

        db.rollback()

        raise


def delete_schedule_type(

    db: Session,

    item_id: int,

):

    row = get_schedule_type_by_id(

        db,

        item_id,

    )


    if not row:

        return None


    try:

        db.delete(row)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise


# ==================================================
# RELIGION — SERIALIZER + FUNCTIONS
# ==================================================

def religion_to_dict(item):

    if not item:

        return None


    return {

        "pkRGId": item.pkRGId,

        "Religion": item.Religion,

    }


def get_religions(

    db: Session,

):

    return (

        db.query(Religion)

        .order_by(Religion.pkRGId)

        .all()

    )


def get_religion_by_id(

    db: Session,

    item_id: int,

):

    return (

        db.query(Religion)

        .filter(

            Religion.pkRGId == item_id,

        )

        .first()

    )


def religion_exists(

    db: Session,

    value: str,

):

    if not value:

        return False


    return (

        db.query(Religion)

        .filter(

            func.lower(Religion.Religion)
            == value.strip().lower(),

        )

        .first()

        is not None

    )


def religion_exists_for_other(

    db: Session,

    value: str,

    item_id: int,

):

    if not value:

        return False


    return (

        db.query(Religion)

        .filter(

            func.lower(Religion.Religion)
            == value.strip().lower(),

            Religion.pkRGId != item_id,

        )

        .first()

        is not None

    )


def create_religion(

    db: Session,

    value: str,

):

    row = Religion(

        Religion=value.strip(),

    )


    try:

        db.add(row)

        db.commit()

        db.refresh(row)

        return row


    except Exception:

        db.rollback()

        raise


def update_religion(

    db: Session,

    item_id: int,

    value: str,

):

    row = get_religion_by_id(

        db,

        item_id,

    )


    if not row:

        return None


    row.Religion = value.strip()


    try:

        db.commit()

        db.refresh(row)

        return row


    except Exception:

        db.rollback()

        raise


def delete_religion(

    db: Session,

    item_id: int,

):

    row = get_religion_by_id(

        db,

        item_id,

    )


    if not row:

        return None


    try:

        db.delete(row)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise


# ==================================================
# CASTE — SERIALIZER + FUNCTIONS
# ==================================================

def caste_to_dict(item):

    if not item:

        return None


    return {

        "pkCSId": item.pkCSId,

        "Caste": item.Caste,

    }


def get_castes(

    db: Session,

):

    return (

        db.query(Caste)

        .order_by(Caste.pkCSId)

        .all()

    )


def get_caste_by_id(

    db: Session,

    item_id: int,

):

    return (

        db.query(Caste)

        .filter(

            Caste.pkCSId == item_id,

        )

        .first()

    )


def caste_exists(

    db: Session,

    value: str,

):

    if not value:

        return False


    return (

        db.query(Caste)

        .filter(

            func.lower(Caste.Caste)
            == value.strip().lower(),

        )

        .first()

        is not None

    )


def caste_exists_for_other(

    db: Session,

    value: str,

    item_id: int,

):

    if not value:

        return False


    return (

        db.query(Caste)

        .filter(

            func.lower(Caste.Caste)
            == value.strip().lower(),

            Caste.pkCSId != item_id,

        )

        .first()

        is not None

    )


def create_caste(

    db: Session,

    value: str,

):

    row = Caste(

        Caste=value.strip(),

    )


    try:

        db.add(row)

        db.commit()

        db.refresh(row)

        return row


    except Exception:

        db.rollback()

        raise


def update_caste(

    db: Session,

    item_id: int,

    value: str,

):

    row = get_caste_by_id(

        db,

        item_id,

    )


    if not row:

        return None


    row.Caste = value.strip()


    try:

        db.commit()

        db.refresh(row)

        return row


    except Exception:

        db.rollback()

        raise


def delete_caste(

    db: Session,

    item_id: int,

):

    row = get_caste_by_id(

        db,

        item_id,

    )


    if not row:

        return None


    try:

        db.delete(row)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise


# ==================================================
# SKIN TONE — SERIALIZER + FUNCTIONS
# ==================================================

def skin_tone_to_dict(item):

    if not item:

        return None


    return {

        "pkSkinId": item.pkSkinId,

        "Colour": item.Colour,

    }


def get_skin_tones(

    db: Session,

):

    return (

        db.query(SkinTone)

        .order_by(SkinTone.pkSkinId)

        .all()

    )


def get_skin_tone_by_id(

    db: Session,

    item_id: int,

):

    return (

        db.query(SkinTone)

        .filter(

            SkinTone.pkSkinId == item_id,

        )

        .first()

    )


def skin_tone_exists(

    db: Session,

    value: str,

):

    if not value:

        return False


    return (

        db.query(SkinTone)

        .filter(

            func.lower(SkinTone.Colour)
            == value.strip().lower(),

        )

        .first()

        is not None

    )


def skin_tone_exists_for_other(

    db: Session,

    value: str,

    item_id: int,

):

    if not value:

        return False


    return (

        db.query(SkinTone)

        .filter(

            func.lower(SkinTone.Colour)
            == value.strip().lower(),

            SkinTone.pkSkinId != item_id,

        )

        .first()

        is not None

    )


def create_skin_tone(

    db: Session,

    value: str,

):

    row = SkinTone(

        Colour=value.strip(),

    )


    try:

        db.add(row)

        db.commit()

        db.refresh(row)

        return row


    except Exception:

        db.rollback()

        raise


def update_skin_tone(

    db: Session,

    item_id: int,

    value: str,

):

    row = get_skin_tone_by_id(

        db,

        item_id,

    )


    if not row:

        return None


    row.Colour = value.strip()


    try:

        db.commit()

        db.refresh(row)

        return row


    except Exception:

        db.rollback()

        raise


def delete_skin_tone(

    db: Session,

    item_id: int,

):

    row = get_skin_tone_by_id(

        db,

        item_id,

    )


    if not row:

        return None


    try:

        db.delete(row)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise


# ==================================================
# TASK STATUS — SERIALIZER + FUNCTIONS
# TABLE: saltaskstatus — status, finish, cancel
# ==================================================

def task_status_to_dict(item):

    if not item:

        return None


    return {

        "pkStaId": item.pkStaId,

        "Status": item.Status,

        "Finish": item.Finish,

        "Cancel": item.Cancel,

    }


def get_task_statuses(

    db: Session,

):

    return (

        db.query(TaskStatus)

        .order_by(TaskStatus.pkStaId)

        .all()

    )


def get_task_status_by_id(

    db: Session,

    item_id: int,

):

    return (

        db.query(TaskStatus)

        .filter(

            TaskStatus.pkStaId == item_id,

        )

        .first()

    )


def create_task_status(

    db: Session,

    status: str,

    finish: bool = False,

    cancel: bool = False,

):

    row = TaskStatus(

        Status=status.strip(),

        Finish=bool(finish),

        Cancel=bool(cancel),

    )


    try:

        db.add(row)

        db.commit()

        db.refresh(row)

        return row


    except Exception:

        db.rollback()

        raise


def update_task_status(

    db: Session,

    item_id: int,

    status: str,

    finish: bool,

    cancel: bool,

):

    row = get_task_status_by_id(

        db,

        item_id,

    )


    if not row:

        return None


    row.Status = status.strip()

    row.Finish = bool(finish)

    row.Cancel = bool(cancel)


    try:

        db.commit()

        db.refresh(row)

        return row


    except Exception:

        db.rollback()

        raise


def delete_task_status(

    db: Session,

    item_id: int,

):

    row = get_task_status_by_id(

        db,

        item_id,

    )


    if not row:

        return None


    try:

        db.delete(row)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise

# ==================================================
# SHIFT TIMING — SERIALIZER + FUNCTIONS
# ==================================================

def shift_timing_to_dict(item):

    if not item:

        return None


    return {

        "pkSTId": item.pkSTId,

        "Shift": item.Shift,

        "StartWork": (
            item.StartWork.isoformat()
            if item.StartWork
            else None
        ),

        "EndWork": (
            item.EndWork.isoformat()
            if item.EndWork
            else None
        ),

        "TotalWork": item.TotalWork,

        "StartBreak": (
            item.StartBreak.isoformat()
            if item.StartBreak
            else None
        ),

        "EndBreak": (
            item.EndBreak.isoformat()
            if item.EndBreak
            else None
        ),

        "TotalBreak": item.TotalBreak,

    }


def get_shift_timings(

    db: Session,

):

    return (

        db.query(ShiftTiming)

        .order_by(ShiftTiming.pkSTId)

        .all()

    )


def get_shift_timing_by_id(

    db: Session,

    item_id: int,

):

    return (

        db.query(ShiftTiming)

        .filter(

            ShiftTiming.pkSTId == item_id,

        )

        .first()

    )


def shift_timing_exists(

    db: Session,

    value: str,

):

    if not value:

        return False


    return (

        db.query(ShiftTiming)

        .filter(

            func.lower(ShiftTiming.Shift)
            == value.strip().lower(),

        )

        .first()

        is not None

    )


def shift_timing_exists_for_other(

    db: Session,

    value: str,

    item_id: int,

):

    if not value:

        return False


    return (

        db.query(ShiftTiming)

        .filter(

            func.lower(ShiftTiming.Shift)
            == value.strip().lower(),

            ShiftTiming.pkSTId != item_id,

        )

        .first()

        is not None

    )


def create_shift_timing(

    db: Session,

    pkSTId: int,

    shift: str,

    start_work,

    end_work,

    total_work: float,

    start_break,

    end_break,

    total_break: float,

):

    row = ShiftTiming(

        pkSTId=pkSTId,

        Shift=shift.strip(),

        StartWork=start_work,

        EndWork=end_work,

        TotalWork=total_work,

        StartBreak=start_break,

        EndBreak=end_break,

        TotalBreak=total_break,

    )


    try:

        db.add(row)

        db.commit()

        db.refresh(row)

        return row


    except Exception:

        db.rollback()

        raise


def update_shift_timing(

    db: Session,

    item_id: int,

    shift: str,

    start_work,

    end_work,

    total_work: float,

    start_break,

    end_break,

    total_break: float,

):

    row = get_shift_timing_by_id(

        db,

        item_id,

    )


    if not row:

        return None


    row.Shift = shift.strip()

    row.StartWork = start_work

    row.EndWork = end_work

    row.TotalWork = total_work

    row.StartBreak = start_break

    row.EndBreak = end_break

    row.TotalBreak = total_break


    try:

        db.commit()

        db.refresh(row)

        return row


    except Exception:

        db.rollback()

        raise


def delete_shift_timing(

    db: Session,

    item_id: int,

):

    row = get_shift_timing_by_id(

        db,

        item_id,

    )


    if not row:

        return None


    try:

        db.delete(row)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise
# ==================================================
# SALARY EMPLOYEE SERIALIZER
# ==================================================

def salary_employee_to_dict(employee):

    if not employee:

        return None


    data = {}


    for column in employee.__table__.columns:

        value = getattr(

            employee,

            column.name,

        )


        if isinstance(value, datetime):

            value = value.isoformat()


        # Don't return binary image data in JSON
        if isinstance(value, bytes):

            value = None


        data[column.name] = value


    return data


# ==================================================
# SALARY EMPLOYEE FUNCTIONS
# ==================================================

def get_salary_employees(

    db: Session,

):

    return (

        db.query(SalaryEmployee)

        .order_by(SalaryEmployee.pkEmpId)

        .all()

    )


def get_salary_employee_by_id(

    db: Session,

    emp_id: int,

):

    return (

        db.query(SalaryEmployee)

        .filter(

            SalaryEmployee.pkEmpId == emp_id

        )

        .first()

    )


def create_salary_employee(

    db: Session,

    employee_data: dict,

):

    employee = SalaryEmployee(

        **employee_data

    )


    try:

        db.add(employee)

        db.commit()

        db.refresh(employee)

        return employee


    except Exception:

        db.rollback()

        raise


def update_salary_employee(

    db: Session,

    employee,

    **employee_data,

):

    if not employee:

        return None


    for key, value in employee_data.items():

        if key == "pkEmpId":

            continue


        if hasattr(employee, key):

            setattr(

                employee,

                key,

                value,

            )


    try:

        db.commit()

        db.refresh(employee)

        return employee


    except Exception:

        db.rollback()

        raise


def delete_salary_employee(

    db: Session,

    employee,

):

    if not employee:

        return False


    try:

        db.delete(employee)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise


# ==================================================
# SALARY STRUCTURE SERIALIZER
# ==================================================

def salary_structure_to_dict(structure):

    if not structure:

        return None


    data = {}


    for column in structure.__table__.columns:

        value = getattr(

            structure,

            column.name,

        )


        if isinstance(value, datetime):

            value = value.isoformat()


        data[column.name] = value


    return data


# ==================================================
# SALARY STRUCTURE FUNCTIONS
# ==================================================

def get_salary_structures(

    db: Session,

):

    return (

        db.query(SalaryStructure)

        .order_by(SalaryStructure.pkSSId)

        .all()

    )


def get_salary_structure_by_id(

    db: Session,

    structure_id: int,

):

    return (

        db.query(SalaryStructure)

        .filter(

            SalaryStructure.pkSSId
            == structure_id

        )

        .first()

    )


def create_salary_structure(

    db: Session,

    structure_data: dict,

):

    structure = SalaryStructure(

        **structure_data

    )


    try:

        db.add(structure)

        db.commit()

        db.refresh(structure)

        return structure


    except Exception:

        db.rollback()

        raise


def update_salary_structure(

    db: Session,

    structure,

    **structure_data,

):

    if not structure:

        return None


    for key, value in structure_data.items():

        if key == "pkSSId":

            continue


        if hasattr(structure, key):

            setattr(

                structure,

                key,

                value,

            )


    try:

        db.commit()

        db.refresh(structure)

        return structure


    except Exception:

        db.rollback()

        raise


def delete_salary_structure(

    db: Session,

    structure,

):

    if not structure:

        return False


    try:

        db.delete(structure)

        db.commit()

        return True


    except Exception:

        db.rollback()

        raise
