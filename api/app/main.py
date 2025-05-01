"""
Main FastAPI application.
"""
import os
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

from .models.database import engine, Base, database
from .models import tasks, users
from .routes import auth, tasks as tasks_router, users as users_router
from .utils.error_handlers import (
    validation_exception_handler,
    sqlalchemy_exception_handler,
    general_exception_handler
)

# Create the database tables
Base.metadata.create_all(bind=engine)

# Create the FastAPI application
app = FastAPI(
    title="Todo API",
    description="API for the To-Do List application",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, change this to your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Database connection events
@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# Include routers
app.include_router(auth.router, tags=["auth"])
app.include_router(
    tasks_router.router,
    prefix="/tasks",
    tags=["tasks"]
)
app.include_router(
    users_router.router,
    prefix="/users",
    tags=["users"]
)

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to the To-Do List API",
        "version": "0.1.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


# Health check endpoint
@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok"} 