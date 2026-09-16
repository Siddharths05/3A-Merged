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

DATABASE_USER = os.getenv("DATABASE_USER")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
DATABASE_HOST = os.getenv("DATABASE_HOST")
DATABASE_PORT = os.getenv(
    "DATABASE_PORT",
    "5432",
)
DATABASE_NAME = os.getenv("DATABASE_NAME")


# ==================================================
# VALIDATE DATABASE CONFIGURATION
# ==================================================

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

DATABASE_URL = URL.create(

    drivername="postgresql+psycopg2",

    username=DATABASE_USER,

    password=DATABASE_PASSWORD,

    host=DATABASE_HOST,

    port=int(DATABASE_PORT),

    database=DATABASE_NAME,

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

        #end of file