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
# REAL COLUMNS: pkabid, abilities, updated_at, deleted_at
# (Python attribute names kept the same as before so
#  route.py and AbilityMaster.jsx need NO changes)
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


    updated_at = Column(
        "updated_at",
        DateTime,
        nullable=True,
        server_default=func.now(),
        onupdate=func.now(),
    )


    deleted_at = Column(
        "deleted_at",
        DateTime,
        nullable=True,
        default=None,
    )


# ==================================================
# LOCATION SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hrlocation
# REAL COLUMNS: pkhlid, location, updated_at, deleted_at
# (Python attribute names kept the same as before so
#  route.py and WorkLocation.jsx need NO changes)
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


    updated_at = Column(
        "updated_at",
        DateTime,
        nullable=True,
        server_default=func.now(),
        onupdate=func.now(),
    )


    deleted_at = Column(
        "deleted_at",
        DateTime,
        nullable=True,
        default=None,
    )


# ==================================================
# HOBBY SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hrhobby
# REAL COLUMNS: pkhid, hobby, updated_at, deleted_at
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


    updated_at = Column(
        "updated_at",
        DateTime,
        nullable=True,
        server_default=func.now(),
        onupdate=func.now(),
    )


    deleted_at = Column(
        "deleted_at",
        DateTime,
        nullable=True,
        default=None,
    )


# ==================================================
# JOB FUNCTION SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hrjobfunction
# REAL COLUMNS: pkjfid, jobfunction, updated_at, deleted_at
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


    updated_at = Column(
        "updated_at",
        DateTime,
        nullable=True,
        server_default=func.now(),
        onupdate=func.now(),
    )


    deleted_at = Column(
        "deleted_at",
        DateTime,
        nullable=True,
        default=None,
    )


# ==================================================
# ANNOUNCEMENT TYPE SQLALCHEMY MODEL
# MAPPED TO REAL TABLE: hrannouncementtype
# REAL COLUMNS: pkatid, announcementtype, updated_at, deleted_at
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


    updated_at = Column(
        "updated_at",
        DateTime,
        nullable=True,
        server_default=func.now(),
        onupdate=func.now(),
    )


    deleted_at = Column(
        "deleted_at",
        DateTime,
        nullable=True,
        default=None,
    )


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
# GENERIC: "module" is a free-text string, so adding
# a new master/section never requires a migration.
# One row per (user, module) pair.
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

    """
    Returns { module: { add, edit, delete, view, print, export } }
    for every module this user has a row for. Modules with no
    row are simply absent — the frontend should treat a missing
    module as all-False ("deny by default").
    """

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

    """
    rights_list: list of dicts, each shaped like
    { "module": str, "add": bool, "edit": bool, "delete": bool,
      "view": bool, "print": bool, "export": bool }

    Upserts every module in the list inside one transaction —
    either all rows save, or none do.
    """

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
# MATCHES route.py
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
# route.py sends password_hash
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
# route.py sends the USER OBJECT
# ==================================================

def update_user(

    db: Session,

    user: User,

    **update_data,

):

    if not user:

        return None


    # ==============================================
    # UPDATE PROVIDED FIELDS
    # ==============================================

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
# OPTIONAL FUNCTION
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
# OPTIONAL FUNCTION
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

        "updated_at": (
            ability.updated_at.isoformat()
            if ability.updated_at
            else None
        ),

        "deleted_at": (
            ability.deleted_at.isoformat()
            if ability.deleted_at
            else None
        ),

    }


# ==================================================
# ABILITY FUNCTIONS
# ==================================================

def get_abilities(

    db: Session,

):

    return (

        db.query(Ability)

        .filter(

            Ability.deleted_at.is_(None),

        )

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

            Ability.deleted_at.is_(None),

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

            Ability.deleted_at.is_(None),

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

            Ability.deleted_at.is_(None),

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

        deleted_at=None,

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


def deactivate_ability(

    db: Session,

    ability_id: int,

):

    ability = get_ability_by_id(

        db,

        ability_id,

    )


    if not ability:

        return None


    ability.deleted_at = datetime.utcnow()


    try:

        db.commit()

        db.refresh(ability)

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

        "updated_at": (
            location.updated_at.isoformat()
            if location.updated_at
            else None
        ),

        "deleted_at": (
            location.deleted_at.isoformat()
            if location.deleted_at
            else None
        ),

    }


# ==================================================
# LOCATION FUNCTIONS
# ==================================================

def get_locations(

    db: Session,

):

    return (

        db.query(Location)

        .filter(

            Location.deleted_at.is_(None),

        )

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

            Location.deleted_at.is_(None),

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

            Location.deleted_at.is_(None),

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

            Location.deleted_at.is_(None),

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

        deleted_at=None,

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


def deactivate_location(

    db: Session,

    location_id: int,

):

    location = get_location_by_id(

        db,

        location_id,

    )


    if not location:

        return None


    location.deleted_at = datetime.utcnow()


    try:

        db.commit()

        db.refresh(location)

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

        "updated_at": (
            hobby.updated_at.isoformat()
            if hobby.updated_at
            else None
        ),

        "deleted_at": (
            hobby.deleted_at.isoformat()
            if hobby.deleted_at
            else None
        ),

    }


# ==================================================
# HOBBY FUNCTIONS
# ==================================================

def get_hobbies(

    db: Session,

):

    return (

        db.query(Hobby)

        .filter(

            Hobby.deleted_at.is_(None),

        )

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

            Hobby.deleted_at.is_(None),

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

            Hobby.deleted_at.is_(None),

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

            Hobby.deleted_at.is_(None),

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

        deleted_at=None,

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


def deactivate_hobby(

    db: Session,

    hobby_id: int,

):

    hobby = get_hobby_by_id(

        db,

        hobby_id,

    )


    if not hobby:

        return None


    hobby.deleted_at = datetime.utcnow()


    try:

        db.commit()

        db.refresh(hobby)

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

        "updated_at": (
            announcement_type.updated_at.isoformat()
            if announcement_type.updated_at
            else None
        ),

        "deleted_at": (
            announcement_type.deleted_at.isoformat()
            if announcement_type.deleted_at
            else None
        ),

    }


# ==================================================
# ANNOUNCEMENT TYPE FUNCTIONS
# ==================================================

def get_announcement_types(

    db: Session,

):

    return (

        db.query(AnnouncementType)

        .filter(

            AnnouncementType.deleted_at.is_(None),

        )

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

            AnnouncementType.deleted_at.is_(None),

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

            AnnouncementType.deleted_at.is_(None),

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

            AnnouncementType.deleted_at.is_(None),

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

        deleted_at=None,

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


def deactivate_announcement_type(

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


    announcement_type.deleted_at = datetime.utcnow()


    try:

        db.commit()

        db.refresh(announcement_type)

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