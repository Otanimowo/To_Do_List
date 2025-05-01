"""
Task repository module.
Handles data storage and retrieval for tasks.
"""
import os
import json
import shutil
from typing import List, Optional, Dict, Any
from datetime import datetime

from ..config.settings import config
from .task import Task

class TaskRepository:
    """
    Repository for managing task storage and retrieval.
    """
    _instance = None
    
    def __new__(cls):
        """Implement as a singleton."""
        if cls._instance is None:
            cls._instance = super(TaskRepository, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance
    
    def __init__(self):
        """Initialize repository attributes."""
        # Already initialized in __new__, no need to do anything here
        pass
    
    def _initialize(self):
        """Initialize the task repository."""
        self._tasks = []
        self._load_tasks()
    
    def _load_tasks(self) -> None:
        """
        Load tasks from the JSON file.
        """
        tasks_file = config.get_tasks_file_path()
        
        if os.path.exists(tasks_file):
            try:
                with open(tasks_file, 'r') as file:
                    data = json.load(file)
                    self._tasks = [Task.from_dict(task_data) for task_data in data]
            except (json.JSONDecodeError, IOError) as e:
                print(f"Error reading tasks file: {e}")
                print("Starting with an empty task list.")
                self._tasks = []
        else:
            self._tasks = []
    
    def _save_tasks(self) -> None:
        """
        Save tasks to the JSON file.
        """
        tasks_file = config.get_tasks_file_path()
        
        # Create backup if enabled
        if config.get("backup_enabled", True) and os.path.exists(tasks_file):
            self._create_backup(tasks_file)
        
        try:
            # Convert tasks to dictionaries
            tasks_data = [task.to_dict() for task in self._tasks]
            
            # Save to file
            with open(tasks_file, 'w') as file:
                json.dump(tasks_data, file, indent=4)
        except IOError as e:
            print(f"Error saving tasks: {e}")
    
    def _create_backup(self, file_path: str) -> None:
        """
        Create a backup of the tasks file.
        
        Args:
            file_path: Path to the file to back up
        """
        backup_count = config.get("backup_count", 3)
        
        # Get the directory and filename
        directory = os.path.dirname(file_path)
        filename = os.path.basename(file_path)
        name, ext = os.path.splitext(filename)
        
        # Create timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = os.path.join(directory, f"{name}_{timestamp}{ext}")
        
        try:
            # Copy the file
            shutil.copy2(file_path, backup_path)
            
            # Remove old backups if we have too many
            backups = sorted([
                os.path.join(directory, f) 
                for f in os.listdir(directory) 
                if f.startswith(name + "_") and f.endswith(ext)
            ])
            
            if len(backups) > backup_count:
                for old_backup in backups[:-backup_count]:
                    os.remove(old_backup)
        except IOError as e:
            print(f"Error creating backup: {e}")
    
    def get_all_tasks(self) -> List[Task]:
        """
        Get all tasks.
        
        Returns:
            List of all tasks
        """
        return self._tasks.copy()
    
    def get_task_by_id(self, task_id: str) -> Optional[Task]:
        """
        Get a task by its ID.
        
        Args:
            task_id: ID of the task to retrieve
            
        Returns:
            The task if found, None otherwise
        """
        for task in self._tasks:
            if task.task_id == task_id:
                return task
        return None
    
    def add_task(self, task: Task) -> Task:
        """
        Add a task to the repository.
        
        Args:
            task: Task to add
            
        Returns:
            The added task
        """
        self._tasks.append(task)
        
        if config.get("auto_save", True):
            self._save_tasks()
            
        return task
    
    def update_task(self, task: Task) -> Optional[Task]:
        """
        Update a task.
        
        Args:
            task: Task with updated values
            
        Returns:
            The updated task if found, None otherwise
        """
        for i, existing_task in enumerate(self._tasks):
            if existing_task.task_id == task.task_id:
                self._tasks[i] = task
                
                if config.get("auto_save", True):
                    self._save_tasks()
                    
                return task
        return None
    
    def delete_task(self, task_id: str) -> bool:
        """
        Delete a task.
        
        Args:
            task_id: ID of the task to delete
            
        Returns:
            True if the task was deleted, False otherwise
        """
        for i, task in enumerate(self._tasks):
            if task.task_id == task_id:
                del self._tasks[i]
                
                if config.get("auto_save", True):
                    self._save_tasks()
                    
                return True
        return False
    
    def delete_task_by_index(self, index: int) -> Optional[Task]:
        """
        Delete a task by its index.
        
        Args:
            index: Index of the task to delete
            
        Returns:
            The deleted task if the index is valid, None otherwise
        """
        if 0 <= index < len(self._tasks):
            task = self._tasks.pop(index)
            
            if config.get("auto_save", True):
                self._save_tasks()
                
            return task
        return None
    
    def toggle_task_completed(self, task_id: str) -> Optional[Task]:
        """
        Toggle the completed status of a task.
        
        Args:
            task_id: ID of the task to toggle
            
        Returns:
            The updated task if found, None otherwise
        """
        task = self.get_task_by_id(task_id)
        if task:
            task.completed = not task.completed
            self.update_task(task)
            return task
        return None
    
    def toggle_task_completed_by_index(self, index: int) -> Optional[Task]:
        """
        Toggle the completed status of a task by its index.
        
        Args:
            index: Index of the task to toggle
            
        Returns:
            The updated task if the index is valid, None otherwise
        """
        if 0 <= index < len(self._tasks):
            task = self._tasks[index]
            task.completed = not task.completed
            
            if config.get("auto_save", True):
                self._save_tasks()
                
            return task
        return None
    
    def save(self) -> None:
        """
        Save all tasks to the file.
        """
        self._save_tasks()
    
    def reload(self) -> None:
        """
        Reload tasks from the file.
        """
        self._load_tasks()

# Create a global instance for importing
task_repository = TaskRepository() 