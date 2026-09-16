from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware,
)

from database import (
    Base,
    engine,
)

import model

from route import router


# ==================================================
# CREATE DATABASE TABLES
# ==================================================

Base.metadata.create_all(
    bind=engine
)


# ==================================================
# FASTAPI APPLICATION
# ==================================================

app = FastAPI(

    title="Synergy ERP API",

    version="1.0.0",

    description=(
        "Backend API for Synergy ERP"
    ),

)


# ==================================================
# CORS
# ==================================================

app.add_middleware(

    CORSMiddleware,


    allow_origins=[

        "http://localhost:5173",

        "http://127.0.0.1:5173",

    ],


    allow_credentials=True,


    allow_methods=[
        "*",
    ],


    allow_headers=[
        "*",
    ],

)


# ==================================================
# API ROUTES
# ==================================================

app.include_router(

    router,

    prefix="/api",

)


# ==================================================
# ROOT
# ==================================================

@app.get("/")
def root():

    return {

        "success": True,

        "message": (
            "Synergy ERP API is running"
        ),

        "version": "1.0.0",

    }


# ==================================================
# HEALTH CHECK
# ==================================================

@app.get("/health")
def health_check():

    return {

        "success": True,

        "status": "healthy",

    }

#end of file