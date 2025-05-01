"""
User database model.
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Table
from sqlalchemy.sql import func

from .database import Base, metadata

# SQLAlchemy ORM model
class User(Base):
    """
    User database model using SQLAlchemy ORM.
    """
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    modified_at = Column(DateTime, default=func.now(), onupdate=func.now())


# SQLAlchemy Core table for async operations
users = Table(
    "users",
    metadata,
    Column("id", String, primary_key=True, index=True),
    Column("username", String, unique=True, index=True, nullable=False),
    Column("email", String, unique=True, index=True, nullable=False),
    Column("hashed_password", String, nullable=False),
    Column("is_active", Boolean, default=True),
    Column("created_at", DateTime, default=func.now()),
    Column("modified_at", DateTime, default=func.now(), onupdate=func.now()),
) 