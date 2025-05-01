"""
Task database model.
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, DateTime, Table
from sqlalchemy.sql import func

from .database import Base, metadata

# SQLAlchemy ORM model
class Task(Base):
    """
    Task database model using SQLAlchemy ORM.
    """
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    description = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    priority = Column(Integer, default=1)
    due_date = Column(String, nullable=True)
    category = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
    modified_at = Column(DateTime, default=func.now(), onupdate=func.now())
    user_id = Column(String, index=True, nullable=True)  # For user-specific tasks


# SQLAlchemy Core table for async operations
tasks = Table(
    "tasks",
    metadata,
    Column("id", String, primary_key=True, index=True),
    Column("description", String, nullable=False),
    Column("completed", Boolean, default=False),
    Column("priority", Integer, default=1),
    Column("due_date", String, nullable=True),
    Column("category", String, nullable=True),
    Column("notes", String, nullable=True),
    Column("created_at", DateTime, default=func.now()),
    Column("modified_at", DateTime, default=func.now(), onupdate=func.now()),
    Column("user_id", String, index=True, nullable=True),
) 