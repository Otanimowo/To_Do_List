"""
Task routes.
"""
from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..models.database import get_db
from ..models.task import Task as TaskModel
from ..models.schemas import Task as TaskSchema, TaskCreate, TaskUpdate
from ..auth.security import get_current_active_user

router = APIRouter()


@router.get("/", response_model=List[TaskSchema])
async def list_tasks(
    skip: int = 0,
    limit: int = 100,
    completed: Optional[bool] = None,
    category: Optional[str] = None,
    priority: Optional[int] = None,
    current_user: str = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> List[TaskModel]:
    """
    List tasks for the current user.
    
    Args:
        skip: Number of tasks to skip
        limit: Maximum number of tasks to return
        completed: Filter by completion status
        category: Filter by category
        priority: Filter by priority
        current_user: Current user
        db: Database session
        
    Returns:
        List of tasks
    """
    # Start with a query for the current user's tasks
    query = db.query(TaskModel).filter(TaskModel.user_id == current_user)
    
    # Apply filters if provided
    if completed is not None:
        query = query.filter(TaskModel.completed == completed)
    
    if category:
        query = query.filter(TaskModel.category == category)
    
    if priority:
        query = query.filter(TaskModel.priority == priority)
    
    # Pagination
    tasks = query.offset(skip).limit(limit).all()
    
    return tasks


@router.post("/", response_model=TaskSchema, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    current_user: str = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> TaskModel:
    """
    Create a new task.
    
    Args:
        task_data: Task data
        current_user: Current user
        db: Database session
        
    Returns:
        Created task
    """
    # Create new task
    db_task = TaskModel(
        **task_data.dict(),
        user_id=current_user
    )
    
    # Save to database
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    return db_task


@router.get("/{task_id}", response_model=TaskSchema)
async def get_task(
    task_id: str,
    current_user: str = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> TaskModel:
    """
    Get a task by ID.
    
    Args:
        task_id: Task ID
        current_user: Current user
        db: Database session
        
    Returns:
        Task if found
        
    Raises:
        HTTPException: If the task is not found or doesn't belong to the user
    """
    # Get task
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    
    # Check if task exists
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check if task belongs to the user
    if task.user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )
    
    return task


@router.put("/{task_id}", response_model=TaskSchema)
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    current_user: str = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> TaskModel:
    """
    Update a task.
    
    Args:
        task_id: Task ID
        task_data: Task data
        current_user: Current user
        db: Database session
        
    Returns:
        Updated task
        
    Raises:
        HTTPException: If the task is not found or doesn't belong to the user
    """
    # Get task
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    
    # Check if task exists
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check if task belongs to the user
    if task.user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )
    
    # Update task attributes
    for key, value in task_data.dict(exclude_unset=True).items():
        setattr(task, key, value)
    
    # Save to database
    db.commit()
    db.refresh(task)
    
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: str,
    current_user: str = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> None:
    """
    Delete a task.
    
    Args:
        task_id: Task ID
        current_user: Current user
        db: Database session
        
    Raises:
        HTTPException: If the task is not found or doesn't belong to the user
    """
    # Get task
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    
    # Check if task exists
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check if task belongs to the user
    if task.user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )
    
    # Delete task
    db.delete(task)
    db.commit()


@router.post("/{task_id}/complete", response_model=TaskSchema)
async def complete_task(
    task_id: str,
    current_user: str = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> TaskModel:
    """
    Mark a task as completed.
    
    Args:
        task_id: Task ID
        current_user: Current user
        db: Database session
        
    Returns:
        Updated task
        
    Raises:
        HTTPException: If the task is not found or doesn't belong to the user
    """
    # Get task
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    
    # Check if task exists
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check if task belongs to the user
    if task.user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )
    
    # Mark as completed
    task.completed = True
    
    # Save to database
    db.commit()
    db.refresh(task)
    
    return task


@router.post("/{task_id}/uncomplete", response_model=TaskSchema)
async def uncomplete_task(
    task_id: str,
    current_user: str = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> TaskModel:
    """
    Mark a task as not completed.
    
    Args:
        task_id: Task ID
        current_user: Current user
        db: Database session
        
    Returns:
        Updated task
        
    Raises:
        HTTPException: If the task is not found or doesn't belong to the user
    """
    # Get task
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    
    # Check if task exists
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check if task belongs to the user
    if task.user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )
    
    # Mark as not completed
    task.completed = False
    
    # Save to database
    db.commit()
    db.refresh(task)
    
    return task 