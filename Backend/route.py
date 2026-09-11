from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from database import get_db

from model import (
    ability_exists,
    ability_exists_for_other,
    ability_to_dict,
    announcement_type_exists,
    announcement_type_exists_for_other,
    announcement_type_to_dict,
    create_ability,
    create_announcement_type,
    create_hobby,
    create_location,
    create_user,
    deactivate_ability,
    deactivate_announcement_type,
    deactivate_hobby,
    deactivate_location,
    get_abilities,
    get_ability_by_id,
    get_active_user_count,
    get_active_users,
    get_announcement_type_by_id,
    get_announcement_types,
    get_hobbies,
    get_hobby_by_id,
    get_location_by_id,
    get_locations,
    get_user_by_email,
    get_user_by_full_name,
    get_user_by_id,
    get_user_rights_map,
    hobby_exists,
    hobby_exists_for_other,
    hobby_to_dict,
    location_exists,
    location_exists_for_other,
    location_to_dict,
    set_user_rights_bulk,
    soft_delete_user,
    update_ability,
    update_announcement_type,
    update_hobby,
    update_location,
    update_user,
    user_right_to_dict,
)

from schema import (
    AbilityCreateRequest,
    AbilityUpdateRequest,
    AnnouncementTypeCreateRequest,
    AnnouncementTypeUpdateRequest,
    CreateUserRequest,
    HobbyCreateRequest,
    HobbyUpdateRequest,
    LocationCreateRequest,
    LocationUpdateRequest,
    LoginRequest,
    RegisterRequest,
    SetUserRightsRequest,
    UpdateUserRequest,
    UpdateUserStatusRequest,
)

from security import (
    create_access_token,
    get_current_user,
    hash_password,
    require_admin,
    require_permission,
    validate_password,
    verify_password,
)


# ==================================================
# ROUTER
# ==================================================

router = APIRouter()


# ==================================================
# REGISTER
# ==================================================

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
)
def register(

    request: RegisterRequest,

    db: Session = Depends(get_db),
):

    # ==============================================
    # NORMALIZE EMAIL / FULL NAME
    # ==============================================

    email = request.email.strip().lower()

    full_name = request.full_name.strip()


    # ==============================================
    # CHECK EMAIL
    # ==============================================

    existing_email_user = get_user_by_email(
        db,
        email,
    )

    if existing_email_user:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )


    # ==============================================
    # CHECK FULL NAME
    # (login is by full name, so it must be unique)
    # ==============================================

    existing_full_name_user = get_user_by_full_name(
        db,
        full_name,
    )

    if existing_full_name_user:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this full name already exists",
        )


    # ==============================================
    # VALIDATE PASSWORD
    # ==============================================

    validate_password(
        request.password
    )


    # ==============================================
    # HASH PASSWORD
    # ==============================================

    password_hash = hash_password(
        request.password
    )


    # ==============================================
    # CREATE USER
    # ==============================================

    user = create_user(

        db=db,

        email=email,

        password_hash=password_hash,

        full_name=full_name,

        role="user",
    )


    # ==============================================
    # RESPONSE
    # ==============================================

    return {

        "message": "User registered successfully",

        "user": {

            "pkid": user.pkid,

            "email": user.email,

            "full_name": user.full_name,

            "role": user.role,

            "is_active": user.is_active,
        },
    }


# ==================================================
# LOGIN
# ==================================================

@router.post(
    "/login",
)
def login(

    request: LoginRequest,

    db: Session = Depends(get_db),
):

    # ==============================================
    # NORMALIZE FULL NAME
    # ==============================================

    full_name = request.full_name.strip()


    # ==============================================
    # GET USER
    # ==============================================

    user = get_user_by_full_name(
        db,
        full_name,
    )

    if not user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid full name or password",
        )


    # ==============================================
    # DELETED USER CHECK
    # ==============================================

    if user.deleted_at is not None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid full name or password",
        )


    # ==============================================
    # ACTIVE USER CHECK
    # ==============================================

    if not user.is_active:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated",
        )


    # ==============================================
    # VERIFY PASSWORD
    # ==============================================

    password_valid = verify_password(

        request.password,

        user.password_hash,
    )

    if not password_valid:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid full name or password",
        )


    # ==============================================
    # CREATE TOKEN
    # ==============================================

    access_token = create_access_token(
        user.pkid
    )


    # ==============================================
    # RESPONSE
    # ==============================================

    return {

        "message": "Login successful",

        "access_token": access_token,

        "token_type": "bearer",

        "user": {

            "pkid": user.pkid,

            "email": user.email,

            "full_name": user.full_name,

            "role": user.role,

            "is_active": user.is_active,
        },
    }


# ==================================================
# GET CURRENT USER
# ==================================================

@router.get(
    "/me",
)
def get_me(

    current_user: dict = Depends(
        get_current_user
    ),
):

    return {

        "user": current_user,
    }


# ==================================================
# GET ALL USERS
# ADMIN ONLY
# ==================================================

@router.get(
    "/users",
)
def get_users(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_admin
    ),
):

    users = get_active_users(
        db
    )

    return {

        "total": len(users),

        "users": [

            {

                "pkid": user.pkid,

                "email": user.email,

                "full_name": user.full_name,

                "role": user.role,

                "is_active": user.is_active,

                "updated_at": user.updated_at,
            }

            for user in users
        ],
    }


# ==================================================
# GET USER COUNT
# ADMIN ONLY
# MUST BE REGISTERED BEFORE /users/{user_id}
# OR "count" WILL BE PARSED AS user_id
# AND FAIL INT VALIDATION (422)
# ==================================================

@router.get(
    "/users/count",
)
def get_user_count(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_admin
    ),
):

    count = get_active_user_count(
        db
    )

    return {

        "count": count,
    }


# ==================================================
# GET USER BY ID
# ADMIN ONLY
# ==================================================

@router.get(
    "/users/{user_id}",
)
def get_user(

    user_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_admin
    ),
):

    user = get_user_by_id(
        db,
        user_id,
    )

    if not user:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return {

        "user": {

            "pkid": user.pkid,

            "email": user.email,

            "full_name": user.full_name,

            "role": user.role,

            "is_active": user.is_active,

            "updated_at": user.updated_at,
        },
    }


# ==================================================
# CREATE USER
# ADMIN ONLY
# ==================================================

@router.post(
    "/users",
    status_code=status.HTTP_201_CREATED,
)
def create_new_user(

    request: CreateUserRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_admin
    ),
):

    # ==============================================
    # NORMALIZE EMAIL / FULL NAME
    # ==============================================

    email = request.email.strip().lower()

    full_name = request.full_name.strip()


    # ==============================================
    # CHECK EMAIL
    # ==============================================

    existing_email_user = get_user_by_email(
        db,
        email,
    )

    if existing_email_user:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )


    # ==============================================
    # CHECK FULL NAME
    # (login is by full name, so it must be unique)
    # ==============================================

    existing_full_name_user = get_user_by_full_name(
        db,
        full_name,
    )

    if existing_full_name_user:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this full name already exists",
        )


    # ==============================================
    # VALIDATE PASSWORD
    # ==============================================

    validate_password(
        request.password
    )


    # ==============================================
    # HASH PASSWORD
    # ==============================================

    password_hash = hash_password(
        request.password
    )


    # ==============================================
    # CREATE USER
    # ==============================================

    user = create_user(

        db=db,

        email=email,

        password_hash=password_hash,

        full_name=full_name,

        role=request.role.strip().lower(),
    )


    return {

        "message": "User created successfully",

        "user": {

            "pkid": user.pkid,

            "email": user.email,

            "full_name": user.full_name,

            "role": user.role,

            "is_active": user.is_active,

            "updated_at": user.updated_at,
        },
    }


# ==================================================
# UPDATE USER
# ADMIN ONLY
# ==================================================

@router.put(
    "/users/{user_id}",
)
def update_existing_user(

    user_id: int,

    request: UpdateUserRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_admin
    ),
):

    # ==============================================
    # GET USER
    # ==============================================

    user = get_user_by_id(
        db,
        user_id,
    )

    if not user:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )


    # ==============================================
    # UPDATE DATA
    # ==============================================

    update_data = {}


    # ==============================================
    # FULL NAME
    # (login is by full name, so it must stay unique)
    # ==============================================

    if request.full_name is not None:

        full_name = request.full_name.strip()

        existing_full_name_user = get_user_by_full_name(
            db,
            full_name,
        )

        if (

            existing_full_name_user

            and existing_full_name_user.pkid != user.pkid

        ):

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this full name already exists",
            )

        update_data["full_name"] = full_name


    # ==============================================
    # EMAIL
    # ==============================================

    if request.email is not None:

        email = request.email.strip().lower()

        existing_user = get_user_by_email(
            db,
            email,
        )

        if (

            existing_user

            and existing_user.pkid != user.pkid

        ):

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        update_data["email"] = email


    # ==============================================
    # ROLE
    # ==============================================

    if request.role is not None:

        update_data["role"] = (
            request.role.strip().lower()
        )


    # ==============================================
    # PASSWORD
    # ==============================================

    if request.password is not None:

        validate_password(
            request.password
        )

        update_data["password_hash"] = (
            hash_password(
                request.password
            )
        )


    # ==============================================
    # UPDATE USER
    # ==============================================

    user = update_user(

        db,

        user,

        **update_data,
    )


    return {

        "message": "User updated successfully",

        "user": {

            "pkid": user.pkid,

            "email": user.email,

            "full_name": user.full_name,

            "role": user.role,

            "is_active": user.is_active,

            "updated_at": user.updated_at,
        },
    }


# ==================================================
# ACTIVATE / DEACTIVATE USER
# ADMIN ONLY
# ==================================================

@router.patch(
    "/users/{user_id}/status",
)
def update_user_status(

    user_id: int,

    request: UpdateUserStatusRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_admin
    ),
):

    user = get_user_by_id(
        db,
        user_id,
    )

    if not user:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )


    # ==============================================
    # UPDATE STATUS
    # ==============================================

    user.is_active = request.is_active

    user = update_user(
        db,
        user,
    )


    return {

        "message": (
            "User activated successfully"
            if request.is_active
            else "User deactivated successfully"
        ),

        "user": {

            "pkid": user.pkid,

            "email": user.email,

            "full_name": user.full_name,

            "role": user.role,

            "is_active": user.is_active,
        },
    }


# ==================================================
# SOFT DELETE USER
# ADMIN ONLY
# ==================================================

@router.delete(
    "/users/{user_id}",
)
def delete_user(

    user_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_admin
    ),
):

    user = get_user_by_id(
        db,
        user_id,
    )

    if not user:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )


    # ==============================================
    # PREVENT ADMIN FROM DELETING SELF
    # ==============================================

    if user.pkid == current_user["pkid"]:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot delete your own account",
        )


    # ==============================================
    # SOFT DELETE
    # ==============================================

    soft_delete_user(
        db,
        user,
    )


    return {

        "message": "User deleted successfully",
    }


# ==================================================
# GET ABILITIES
# ==================================================

@router.get(
    "/abilities",
)
def list_abilities(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    abilities = get_abilities(
        db
    )

    return {

        "total": len(abilities),

        "abilities": [

            ability_to_dict(ability)

            for ability in abilities
        ],
    }


# ==================================================
# GET ABILITY BY ID
# ==================================================

@router.get(
    "/abilities/{ability_id}",
)
def get_ability(

    ability_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    ability = get_ability_by_id(
        db,
        ability_id,
    )

    if not ability:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ability not found",
        )

    return {

        "ability": ability_to_dict(ability),
    }


# ==================================================
# CREATE ABILITY
# REQUIRES: ability / add
# ==================================================

@router.post(
    "/abilities",
    status_code=status.HTTP_201_CREATED,
)
def create_new_ability(

    request: AbilityCreateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("ability", "add")
    ),
):

    if ability_exists(
        db,
        request.abilities,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ability already exists",
        )

    ability = create_ability(
        db,
        request.abilities,
    )

    return {

        "message": "Ability created successfully",

        "ability": ability_to_dict(ability),
    }


# ==================================================
# UPDATE ABILITY
# REQUIRES: ability / edit
# ==================================================

@router.put(
    "/abilities/{ability_id}",
)
def update_existing_ability(

    ability_id: int,

    request: AbilityUpdateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("ability", "edit")
    ),
):

    existing = get_ability_by_id(
        db,
        ability_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ability not found",
        )

    if ability_exists_for_other(
        db,
        request.abilities,
        ability_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ability already exists",
        )

    ability = update_ability(
        db,
        ability_id,
        request.abilities,
    )

    return {

        "message": "Ability updated successfully",

        "ability": ability_to_dict(ability),
    }


# ==================================================
# DELETE ABILITY
# REQUIRES: ability / delete
# ==================================================

@router.delete(
    "/abilities/{ability_id}",
)
def delete_ability(

    ability_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("ability", "delete")
    ),
):

    existing = get_ability_by_id(
        db,
        ability_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ability not found",
        )

    deactivate_ability(
        db,
        ability_id,
    )

    return {

        "message": "Ability deleted successfully",
    }


# ==================================================
# GET LOCATIONS
# ==================================================

@router.get(
    "/locations",
)
def list_locations(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    locations = get_locations(
        db
    )

    return {

        "total": len(locations),

        "locations": [

            location_to_dict(location)

            for location in locations
        ],
    }


# ==================================================
# GET LOCATION BY ID
# ==================================================

@router.get(
    "/locations/{location_id}",
)
def get_location(

    location_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    location = get_location_by_id(
        db,
        location_id,
    )

    if not location:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found",
        )

    return {

        "location": location_to_dict(location),
    }


# ==================================================
# CREATE LOCATION
# REQUIRES: location / add
# ==================================================

@router.post(
    "/locations",
    status_code=status.HTTP_201_CREATED,
)
def create_new_location(

    request: LocationCreateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("location", "add")
    ),
):

    if location_exists(
        db,
        request.location,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Location already exists",
        )

    location = create_location(
        db,
        request.location,
    )

    return {

        "message": "Location created successfully",

        "location": location_to_dict(location),
    }


# ==================================================
# UPDATE LOCATION
# REQUIRES: location / edit
# ==================================================

@router.put(
    "/locations/{location_id}",
)
def update_existing_location(

    location_id: int,

    request: LocationUpdateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("location", "edit")
    ),
):

    existing = get_location_by_id(
        db,
        location_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found",
        )

    if location_exists_for_other(
        db,
        request.location,
        location_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Location already exists",
        )

    location = update_location(
        db,
        location_id,
        request.location,
    )

    return {

        "message": "Location updated successfully",

        "location": location_to_dict(location),
    }


# ==================================================
# DELETE LOCATION
# REQUIRES: location / delete
# ==================================================

@router.delete(
    "/locations/{location_id}",
)
def delete_location(

    location_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("location", "delete")
    ),
):

    existing = get_location_by_id(
        db,
        location_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found",
        )

    deactivate_location(
        db,
        location_id,
    )

    return {

        "message": "Location deleted successfully",
    }


# ==================================================
# GET HOBBIES
# ==================================================

@router.get(
    "/hobbies",
)
def list_hobbies(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    hobbies = get_hobbies(
        db
    )

    return {

        "total": len(hobbies),

        "hobbies": [

            hobby_to_dict(hobby)

            for hobby in hobbies
        ],
    }


# ==================================================
# GET HOBBY BY ID
# ==================================================

@router.get(
    "/hobbies/{hobby_id}",
)
def get_hobby(

    hobby_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    hobby = get_hobby_by_id(
        db,
        hobby_id,
    )

    if not hobby:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hobby not found",
        )

    return {

        "hobby": hobby_to_dict(hobby),
    }


# ==================================================
# CREATE HOBBY
# REQUIRES: hobby / add
# ==================================================

@router.post(
    "/hobbies",
    status_code=status.HTTP_201_CREATED,
)
def create_new_hobby(

    request: HobbyCreateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("hobby", "add")
    ),
):

    if hobby_exists(
        db,
        request.hobby,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hobby already exists",
        )

    hobby = create_hobby(
        db,
        request.hobby,
    )

    return {

        "message": "Hobby created successfully",

        "hobby": hobby_to_dict(hobby),
    }


# ==================================================
# UPDATE HOBBY
# REQUIRES: hobby / edit
# ==================================================

@router.put(
    "/hobbies/{hobby_id}",
)
def update_existing_hobby(

    hobby_id: int,

    request: HobbyUpdateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("hobby", "edit")
    ),
):

    existing = get_hobby_by_id(
        db,
        hobby_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hobby not found",
        )

    if hobby_exists_for_other(
        db,
        request.hobby,
        hobby_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hobby already exists",
        )

    hobby = update_hobby(
        db,
        hobby_id,
        request.hobby,
    )

    return {

        "message": "Hobby updated successfully",

        "hobby": hobby_to_dict(hobby),
    }


# ==================================================
# DELETE HOBBY
# REQUIRES: hobby / delete
# ==================================================

@router.delete(
    "/hobbies/{hobby_id}",
)
def delete_hobby(

    hobby_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("hobby", "delete")
    ),
):

    existing = get_hobby_by_id(
        db,
        hobby_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hobby not found",
        )

    deactivate_hobby(
        db,
        hobby_id,
    )

    return {

        "message": "Hobby deleted successfully",
    }


# ==================================================
# GET ANNOUNCEMENT TYPES
# ==================================================

@router.get(
    "/announcement-types",
)
def list_announcement_types(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    announcement_types = get_announcement_types(
        db
    )

    return {

        "total": len(announcement_types),

        "announcement_types": [

            announcement_type_to_dict(announcement_type)

            for announcement_type in announcement_types
        ],
    }


# ==================================================
# GET ANNOUNCEMENT TYPE BY ID
# ==================================================

@router.get(
    "/announcement-types/{announcement_type_id}",
)
def get_announcement_type(

    announcement_type_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    announcement_type = get_announcement_type_by_id(
        db,
        announcement_type_id,
    )

    if not announcement_type:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Announcement type not found",
        )

    return {

        "announcement_type": announcement_type_to_dict(
            announcement_type
        ),
    }


# ==================================================
# CREATE ANNOUNCEMENT TYPE
# REQUIRES: announcement_type / add
# ==================================================

@router.post(
    "/announcement-types",
    status_code=status.HTTP_201_CREATED,
)
def create_new_announcement_type(

    request: AnnouncementTypeCreateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("announcement_type", "add")
    ),
):

    if announcement_type_exists(
        db,
        request.announcement_type,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Announcement type already exists",
        )

    announcement_type = create_announcement_type(
        db,
        request.announcement_type,
    )

    return {

        "message": "Announcement type created successfully",

        "announcement_type": announcement_type_to_dict(
            announcement_type
        ),
    }


# ==================================================
# UPDATE ANNOUNCEMENT TYPE
# REQUIRES: announcement_type / edit
# ==================================================

@router.put(
    "/announcement-types/{announcement_type_id}",
)
def update_existing_announcement_type(

    announcement_type_id: int,

    request: AnnouncementTypeUpdateRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("announcement_type", "edit")
    ),
):

    existing = get_announcement_type_by_id(
        db,
        announcement_type_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Announcement type not found",
        )

    if announcement_type_exists_for_other(
        db,
        request.announcement_type,
        announcement_type_id,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Announcement type already exists",
        )

    announcement_type = update_announcement_type(
        db,
        announcement_type_id,
        request.announcement_type,
    )

    return {

        "message": "Announcement type updated successfully",

        "announcement_type": announcement_type_to_dict(
            announcement_type
        ),
    }


# ==================================================
# DELETE ANNOUNCEMENT TYPE
# REQUIRES: announcement_type / delete
# ==================================================

@router.delete(
    "/announcement-types/{announcement_type_id}",
)
def delete_announcement_type(

    announcement_type_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_permission("announcement_type", "delete")
    ),
):

    existing = get_announcement_type_by_id(
        db,
        announcement_type_id,
    )

    if not existing:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Announcement type not found",
        )

    deactivate_announcement_type(
        db,
        announcement_type_id,
    )

    return {

        "message": "Announcement type deleted successfully",
    }


# ==================================================
# GET MY OWN RIGHTS
# ANY LOGGED-IN USER
# Used by the frontend to decide what to show/hide
# for the person currently logged in.
# ==================================================

@router.get(
    "/user-rights/me",
)
def get_my_rights(

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        get_current_user
    ),
):

    rights_map = get_user_rights_map(
        db,
        current_user["pkid"],
    )

    return {

        "role": current_user["role"],

        "rights": rights_map,
    }


# ==================================================
# GET A USER'S RIGHTS
# ADMIN ONLY
# Used to populate the User Rights matrix when an
# admin selects a user.
# ==================================================

@router.get(
    "/user-rights/{user_id}",
)
def get_rights_for_user(

    user_id: int,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_admin
    ),
):

    target_user = get_user_by_id(
        db,
        user_id,
    )

    if not target_user:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    rights_map = get_user_rights_map(
        db,
        user_id,
    )

    return {

        "user_id": user_id,

        "rights": rights_map,
    }


# ==================================================
# SET A USER'S RIGHTS
# ADMIN ONLY
# Saves the whole matrix for one user in a single
# call, replacing whatever was there before for each
# module included in the request.
# ==================================================

@router.put(
    "/user-rights/{user_id}",
)
def set_rights_for_user(

    user_id: int,

    request: SetUserRightsRequest,

    db: Session = Depends(get_db),

    current_user: dict = Depends(
        require_admin
    ),
):

    target_user = get_user_by_id(
        db,
        user_id,
    )

    if not target_user:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    rights_list = [
        item.model_dump()
        for item in request.rights
    ]

    updated_rows = set_user_rights_bulk(
        db,
        user_id,
        rights_list,
    )

    return {

        "message": "User rights updated successfully",

        "rights": [
            user_right_to_dict(row)
            for row in updated_rows
        ],
    }