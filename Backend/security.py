import os
import re

import bcrypt
import jwt

from datetime import (
    datetime,
    timedelta,
    timezone,
)

from fastapi import (
    Depends,
    Header,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from database import get_db


# ==================================================
# JWT CONFIGURATION
# ==================================================

JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "development-secret-key-change-this-in-production",
)

JWT_ALGORITHM = os.getenv(
    "JWT_ALGORITHM",
    "HS256",
)

JWT_EXPIRATION_MINUTES = int(
    os.getenv(
        "JWT_EXPIRATION_MINUTES",
        "60",
    )
)


# ==================================================
# PASSWORD VALIDATION
# ==================================================

def validate_password(
    password: str,
) -> bool:

    if not password:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password is required",
        )

    if len(password) < 8:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Password must be at least "
                "8 characters long"
            ),
        )

    if not re.search(
        r"[A-Za-z]",
        password,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Password must contain "
                "at least one letter"
            ),
        )

    if not re.search(
        r"[0-9]",
        password,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Password must contain "
                "at least one number"
            ),
        )

    if not re.search(
        r"[^A-Za-z0-9]",
        password,
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Password must contain "
                "at least one special character"
            ),
        )

    return True


# ==================================================
# PASSWORD HASHING
# ==================================================

def hash_password(
    password: str,
) -> str:

    if not password:

        raise ValueError(
            "Password cannot be empty"
        )

    password_hash = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt(),
    )

    return password_hash.decode(
        "utf-8"
    )


def get_password_hash(
    password: str,
) -> str:

    return hash_password(
        password
    )


# ==================================================
# PASSWORD VERIFICATION
# ==================================================

def verify_password(
    password: str,
    password_hash: str,
) -> bool:

    if not password:
        return False

    if not password_hash:
        return False

    try:

        return bcrypt.checkpw(
            password.encode("utf-8"),
            password_hash.encode("utf-8"),
        )

    except (
        ValueError,
        AttributeError,
        TypeError,
    ):

        return False


# ==================================================
# CREATE ACCESS TOKEN
# ==================================================

def create_access_token(
    user_id: int,
) -> str:

    expiration = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=JWT_EXPIRATION_MINUTES
        )
    )

    payload = {

        "user_id": user_id,

        "exp": expiration,
    }

    token = jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )

    return token


# ==================================================
# DECODE ACCESS TOKEN
# ==================================================

def decode_access_token(
    token: str,
) -> dict:

    try:

        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[
                JWT_ALGORITHM
            ],
        )

        return payload

    except jwt.ExpiredSignatureError:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token has expired",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    except jwt.InvalidTokenError:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )


# ==================================================
# GET CURRENT USER
# ==================================================

def get_current_user(

    db: Session = Depends(get_db),

    authorization: str | None = Header(
        default=None
    ),
):

    if not authorization:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    scheme, _, token = authorization.partition(
        " "
    )

    if scheme.lower() != "bearer":

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=(
                "Invalid authentication format. "
                "Use Bearer token."
            ),
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    if not token:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token missing",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    payload = decode_access_token(
        token
    )

    user_id = payload.get(
        "user_id"
    )

    if user_id is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    try:

        user_id = int(
            user_id
        )

    except (
        ValueError,
        TypeError,
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=(
                "Invalid user ID in authentication token"
            ),
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    # ==============================================
    # IMPORT USER MODEL
    # ==============================================

    from model import get_user_by_id


    # ==============================================
    # GET USER
    # ==============================================

    user = get_user_by_id(
        db,
        user_id,
    )

    if not user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )


    # ==============================================
    # DELETED USER CHECK
    # ==============================================

    if user.deleted_at is not None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account has been deleted",
            headers={
                "WWW-Authenticate": "Bearer",
            },
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
    # RETURN USER
    # ==============================================

    return {

        "pkid": user.pkid,

        "email": user.email,

        "full_name": user.full_name,

        "role": user.role,

        "is_active": user.is_active,
    }


# ==================================================
# ADMIN AUTHORIZATION
# ==================================================

def require_admin(

    current_user: dict = Depends(
        get_current_user
    ),
):

    user_role = current_user.get(
        "role",
        "",
    )

    if user_role.lower() != "admin":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return current_user


# ==================================================
# ROLE AUTHORIZATION
# ==================================================

def require_roles(
    *allowed_roles: str,
):

    def role_checker(

        current_user: dict = Depends(
            get_current_user
        ),
    ):

        user_role = current_user.get(
            "role",
            "",
        ).lower()

        normalized_roles = [

            role.lower()

            for role in allowed_roles
        ]

        if user_role not in normalized_roles:

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "You do not have permission "
                    "to access this resource"
                ),
            )

        return current_user

    return role_checker


# ==================================================
# MODULE / ACTION AUTHORIZATION (USER RIGHTS)
# Replaces require_admin on master routes so a user granted
# specific rights via UserRights.jsx can actually use them,
# instead of always being blocked by the admin-only check.
#
# Admins bypass the rights table entirely (matches the
# frontend's admin-bypass rule in Permissions.jsx). Everyone
# else is checked against their UserRight row for `module`,
# via the existing get_user_rights_map() helper in model.py —
# reusing it (rather than querying UserRight directly) keeps
# the can_* <-> bare-key translation in exactly one place.
#
# `action` must be one of: add, edit, delete, view, print,
# export — the same bare keys used throughout schema.py/
# model.py/UserRights.jsx.
#
# GET (read) routes are NOT yet using this — see the TODO
# below; that's a pending decision, not an oversight.
# ==================================================

VALID_PERMISSION_ACTIONS = {
    "add",
    "edit",
    "delete",
    "view",
    "print",
    "export",
}


def require_permission(
    module: str,
    action: str,
):

    if action not in VALID_PERMISSION_ACTIONS:

        raise ValueError(
            f"Unknown permission action: {action!r}. "
            f"Must be one of {sorted(VALID_PERMISSION_ACTIONS)}."
        )

    def dependency(

        db: Session = Depends(get_db),

        current_user: dict = Depends(
            get_current_user
        ),
    ):

        # ==========================================
        # ADMIN BYPASS
        # ==========================================

        if current_user.get("role", "").lower() == "admin":

            return current_user


        # ==========================================
        # IMPORT HERE — same pattern as get_current_user
        # above, to avoid a circular import between
        # security.py and model.py.
        # ==========================================

        from model import get_user_rights_map


        rights_map = get_user_rights_map(
            db,

            current_user["pkid"],
        )

        module_rights = rights_map.get(
            module,
            {},
        )

        allowed = bool(
            module_rights.get(
                action,
                False,
            )
        )

        if not allowed:

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"You don't have {action} access "
                    f"to {module}."
                ),
            )

        return current_user

    return dependency


# ==================================================


#
# Should GET routes (list_abilities, get_ability, etc.)
# require can_view specifically via require_permission(module,
# "view"), or should any granted right on that module be
# enough to read records? Right now every GET route below
# still uses plain get_current_user (any authenticated user,
# no rights check at all) — deliberately left unchanged until
# this is decided. Once confirmed, apply
# require_permission("<module>", "view") the same way the
# write routes below use require_permission("<module>", "<verb>").
# ==================================================