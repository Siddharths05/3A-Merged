import os

from pathlib import Path

from dotenv import load_dotenv

from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base, sessionmaker


# ==================================================
# BASE DIRECTORY
# ==================================================

BASE_DIR = Path(__file__).resolve().parent


# ==================================================
# LOAD ENVIRONMENT VARIABLES
# ==================================================

load_dotenv(
    BASE_DIR / ".env"
)


# ==================================================
# DATABASE ENVIRONMENT VARIABLES
# ==================================================

DATABASE_URL = os.getenv("DATABASE_URL")
DATABASE_USER = os.getenv("DATABASE_USER")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
DATABASE_HOST = os.getenv("DATABASE_HOST", "localhost")
DATABASE_PORT = os.getenv(
    "DATABASE_PORT",
    "1433",
)
DATABASE_NAME = os.getenv("DATABASE_NAME")

# Named instance, e.g. "SQLEXPRESS" — leave blank in .env if
# you're connecting to the default (unnamed) instance.
DATABASE_INSTANCE = os.getenv("DATABASE_INSTANCE", "")

# Must match an ODBC driver actually installed on this machine.
# Check installed drivers with: odbcinst -j  (or in Windows
# "ODBC Data Sources" app). "ODBC Driver 18 for SQL Server" is
# the current one; older installs may only have 17.
ODBC_DRIVER = os.getenv(
    "ODBC_DRIVER",
    "ODBC Driver 18 for SQL Server",
)


# ==================================================
# VALIDATE DATABASE CONFIGURATION
# ==================================================

if not DATABASE_URL:

    required_variables = {
        "DATABASE_USER": DATABASE_USER,
        "DATABASE_PASSWORD": DATABASE_PASSWORD,
        "DATABASE_HOST": DATABASE_HOST,
        "DATABASE_NAME": DATABASE_NAME,
    }


    missing_variables = [

        key

        for key, value in required_variables.items()

        if not value

    ]


    if missing_variables:

        raise RuntimeError(

            "Missing database environment variables: "

            + ", ".join(missing_variables)

        )


# ==================================================
# DATABASE URL
# ==================================================

if not DATABASE_URL:

    # Named instance goes in the host segment ("localhost\SQLEXPRESS"),
    # NOT combined with an explicit port — SQL Server resolves the
    # instance's port itself via the SQL Browser service.
    host = (
        f"{DATABASE_HOST}\\{DATABASE_INSTANCE}"
        if DATABASE_INSTANCE
        else DATABASE_HOST
    )

    DATABASE_URL = URL.create(

        drivername="mssql+pyodbc",

        username=DATABASE_USER,

        password=DATABASE_PASSWORD,

        host=host,

        port=None if DATABASE_INSTANCE else int(DATABASE_PORT),

        database=DATABASE_NAME,

        query={
            "driver": ODBC_DRIVER,
            # Self-signed/local dev cert — drop this once you're
            # on a properly trusted cert or driver 17.
            "TrustServerCertificate": "yes",
        },

    )


# ==================================================
# SQLALCHEMY ENGINE
# ==================================================

engine = create_engine(

    DATABASE_URL,

    pool_pre_ping=True,

    pool_size=10,

    max_overflow=20,

    pool_recycle=1800,

)


# ==================================================
# SESSION FACTORY
# ==================================================

SessionLocal = sessionmaker(

    autocommit=False,

    autoflush=False,

    bind=engine,

)


# ==================================================
# BASE MODEL
# ==================================================

Base = declarative_base()


# ==================================================
# DATABASE SESSION DEPENDENCY
# ==================================================

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()