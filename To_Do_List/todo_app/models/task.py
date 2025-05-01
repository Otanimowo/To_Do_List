"""
Task model module.
Defines the Task class and related functionality.
"""
import uuid
from datetime import datetime, date
from typing import Optional, List, Dict, Any, Union

class Task:
    """
    Represents a task in the to-do list.
    """
    def __init__(
        self,
        description: str,
        completed: bool = False,
        task_id: Optional[str] = None,
        due_date: Optional[Union[str, datetime, date]] = None,
        priority: int = 1,
        category: Optional[str] = None,
        notes: Optional[str] = None,
        created_at: Optional[Union[str, datetime]] = None,
        modified_at: Optional[Union[str, datetime]] = None
    ):
        """
        Initialize a Task.
        
        Args:
            description: The task description
            completed: Whether the task is completed
            task_id: Unique ID for the task (generated if not provided)
            due_date: Due date for the task
            priority: Priority level (1-3, where 1 is highest)
            category: Category/tag for the task
            notes: Additional notes about the task
            created_at: Creation timestamp
            modified_at: Last modification timestamp
        """
        self.description = description
        self.completed = completed
        self.task_id = task_id or str(uuid.uuid4())
        self.priority = max(1, min(3, priority))  # Ensure priority is 1-3
        self.category = category
        self.notes = notes
        
        # Handle due date conversion
        if due_date is None:
            self.due_date = None
        elif isinstance(due_date, (datetime, date)):
            self.due_date = due_date.isoformat().split('T')[0]  # Store as YYYY-MM-DD
        else:
            self.due_date = str(due_date)
        
        # Handle timestamps
        now = datetime.now().isoformat()
        if created_at is None:
            self.created_at = now
        elif isinstance(created_at, datetime):
            self.created_at = created_at.isoformat()
        else:
            self.created_at = str(created_at)
            
        if modified_at is None:
            self.modified_at = now
        elif isinstance(modified_at, datetime):
            self.modified_at = modified_at.isoformat()
        else:
            self.modified_at = str(modified_at)
    
    @staticmethod
    def from_dict(data: Dict[str, Any]) -> 'Task':
        """
        Create a Task object from a dictionary.
        
        Args:
            data: Dictionary containing task data
            
        Returns:
            A new Task instance
        """
        return Task(
            description=data.get('description', ''),
            completed=data.get('completed', False),
            task_id=data.get('task_id'),
            due_date=data.get('due_date'),
            priority=data.get('priority', 1),
            category=data.get('category'),
            notes=data.get('notes'),
            created_at=data.get('created_at'),
            modified_at=data.get('modified_at')
        )
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the Task to a dictionary.
        
        Returns:
            Dictionary representation of the task
        """
        # Update modified timestamp
        self.modified_at = datetime.now().isoformat()
        
        return {
            'description': self.description,
            'completed': self.completed,
            'task_id': self.task_id,
            'due_date': self.due_date,
            'priority': self.priority,
            'category': self.category,
            'notes': self.notes,
            'created_at': self.created_at,
            'modified_at': self.modified_at
        }
    
    def __str__(self) -> str:
        """String representation of the task."""
        status = "[✓]" if self.completed else "[ ]"
        priority_str = "!" * self.priority if self.priority > 1 else ""  # Only show priority if > 1
        due_str = f" (Due: {self.due_date})" if self.due_date else ""
        category_str = f" #{self.category}" if self.category else ""
        
        return f"{status} {priority_str}{' ' if priority_str else ''}{self.description}{due_str}{category_str}"
    
    def __repr__(self) -> str:
        """Developer representation of the task."""
        return f"Task('{self.description}', completed={self.completed}, task_id='{self.task_id}')" 