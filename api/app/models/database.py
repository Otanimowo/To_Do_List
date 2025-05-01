"""
Database connection module.
"""
import os
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from databases import Database

# Get the database URL from environment variable or use a default SQLite database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")
TEST_DATABASE_URL = "sqlite:///./test_todos.db"

# Use different DB URL for testing
if os.getenv("TESTING"):
    DATABASE_URL = TEST_DATABASE_URL

# SQLAlchemy engine and session
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
metadata = MetaData()

# Database instance for async queries
database = Database(DATABASE_URL)


def get_db():
    """
    Get a database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 