"""
Pydantic schemas for data validation.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr, validator
import re


# Task schemas
class TaskBase(BaseModel):
    """Base Task schema with common attributes."""
    description: str
    completed: bool = False
    priority: int = Field(1, ge=1, le=3)
    due_date: Optional[str] = None
    category: Optional[str] = None
    notes: Optional[str] = None

    @validator('due_date')
    def validate_due_date(cls, v):
        """Validate due date format."""
        if v is not None:
            # Check format with regex
            if not re.match(r'^\d{4}-\d{2}-\d{2}$', v):
                raise ValueError('Due date must be in YYYY-MM-DD format')
            
            # Check if it's a valid date
            try:
                datetime.strptime(v, '%Y-%m-%d')
            except ValueError:
                raise ValueError('Invalid date')
        return v


class TaskCreate(TaskBase):
    """Schema for creating a task."""
    pass


class TaskUpdate(BaseModel):
    """Schema for updating a task."""
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[int] = Field(None, ge=1, le=3)
    due_date: Optional[str] = None
    category: Optional[str] = None
    notes: Optional[str] = None

    @validator('due_date')
    def validate_due_date(cls, v):
        """Validate due date format."""
        if v is not None:
            # Check format with regex
            if not re.match(r'^\d{4}-\d{2}-\d{2}$', v):
                raise ValueError('Due date must be in YYYY-MM-DD format')
            
            # Check if it's a valid date
            try:
                datetime.strptime(v, '%Y-%m-%d')
            except ValueError:
                raise ValueError('Invalid date')
        return v


class Task(TaskBase):
    """Schema for a complete task."""
    id: str
    created_at: datetime
    modified_at: datetime
    user_id: Optional[str] = None

    class Config:
        """Pydantic config."""
        from_attributes = True


# User schemas
class UserBase(BaseModel):
    """Base User schema with common attributes."""
    username: str
    email: EmailStr


class UserCreate(UserBase):
    """Schema for creating a user."""
    password: str

    @validator('password')
    def validate_password(cls, v):
        """Validate password strength."""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one number')
        if not any(char.isalpha() for char in v):
            raise ValueError('Password must contain at least one letter')
        return v


class UserUpdate(BaseModel):
    """Schema for updating a user."""
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

    @validator('password')
    def validate_password(cls, v):
        """Validate password strength."""
        if v is not None:
            if len(v) < 8:
                raise ValueError('Password must be at least 8 characters')
            if not any(char.isdigit() for char in v):
                raise ValueError('Password must contain at least one number')
            if not any(char.isalpha() for char in v):
                raise ValueError('Password must contain at least one letter')
        return v


class User(UserBase):
    """Schema for a complete user."""
    id: str
    is_active: bool
    created_at: datetime
    modified_at: datetime

    class Config:
        """Pydantic config."""
        from_attributes = True


# Token schemas
class Token(BaseModel):
    """Schema for authentication token."""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Schema for token data."""
    username: Optional[str] = None 