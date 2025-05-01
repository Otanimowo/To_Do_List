"""
User routes.
"""
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..models.database import get_db
from ..models.user import User as UserModel
from ..models.schemas import User as UserSchema, UserUpdate
from ..auth.security import get_current_active_user, get_password_hash

router = APIRouter()


@router.get("/me", response_model=UserSchema)
async def get_current_user_profile(
    current_user: str = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> UserModel:
    """
    Get the current user's profile.
    
    Args:
        current_user: Current user
        db: Database session
        
    Returns:
        User profile
        
    Raises:
        HTTPException: If the user is not found
    """
    user = db.query(UserModel).filter(UserModel.username == current_user).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.put("/me", response_model=UserSchema)
async def update_current_user_profile(
    user_data: UserUpdate,
    current_user: str = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> UserModel:
    """
    Update the current user's profile.
    
    Args:
        user_data: User data to update
        current_user: Current user
        db: Database session
        
    Returns:
        Updated user profile
        
    Raises:
        HTTPException: If the user is not found or username/email is already taken
    """
    # Get the user
    user = db.query(UserModel).filter(UserModel.username == current_user).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if username already exists (if changing username)
    if user_data.username and user_data.username != user.username:
        existing_user = db.query(UserModel).filter(
            UserModel.username == user_data.username
        ).first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
    
    # Check if email already exists (if changing email)
    if user_data.email and user_data.email != user.email:
        existing_user = db.query(UserModel).filter(
            UserModel.email == user_data.email
        ).first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Update user attributes
    update_data = user_data.dict(exclude_unset=True)
    
    # Handle password separately (hash it)
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    for key, value in update_data.items():
        setattr(user, key, value)
    
    # Save to database
    db.commit()
    db.refresh(user)
    
    return user 