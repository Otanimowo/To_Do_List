"""
Task controller module.
Handles application logic and coordinates models and views.
"""
from typing import Optional, List, Dict, Any

from ..models.task import Task
from ..models.task_repository import task_repository
from ..views.cli_view import CLIView
from ..config.settings import config

class TaskController:
    """
    Controller for task-related operations.
    Coordinates the model and view components.
    """
    
    def __init__(self, view: CLIView):
        """
        Initialize the task controller.
        
        Args:
            view: The view to use for displaying information
        """
        self.view = view
        self.repository = task_repository
    
    def show_all_tasks(self, show_details: bool = False) -> None:
        """
        Display all tasks.
        
        Args:
            show_details: Whether to show detailed task information
        """
        tasks = self.repository.get_all_tasks()
        self.view.display_tasks(tasks, show_details)
    
    def add_task(self) -> None:
        """Add a new task."""
        task_data = self.view.get_task_input()
        
        if task_data is None:
            return
        
        task = Task(**task_data)
        self.repository.add_task(task)
        self.view.display_message(f"Task '{task.description}' added successfully.")
    
    def update_task(self) -> None:
        """Update an existing task."""
        tasks = self.repository.get_all_tasks()
        
        if not tasks:
            self.view.display_message("No tasks to update.")
            return
        
        self.view.display_tasks(tasks)
        
        task_num = self.view.get_int_input("Enter the task number to update (or 'c' to cancel)", 1, len(tasks))
        if task_num is None:
            return
        
        task = tasks[task_num - 1]
        
        # Show current task details
        self.view.display_task_details(task)
        
        # Get updated information
        print("\n=== Update Task ===")
        print("(Leave blank to keep current value)")
        
        try:
            # Description
            new_description = input(f"Description [{task.description}]: ").strip()
            if new_description:
                task.description = new_description
            
            # Due date
            current_due = task.due_date or "None"
            new_due_date = input(f"Due date [{current_due}]: ").strip()
            if new_due_date:
                if new_due_date.lower() in ('none', 'n'):
                    task.due_date = None
                else:
                    task.due_date = new_due_date
            
            # Priority
            new_priority = self.view.get_int_input(f"Priority [{task.priority}]", 1, 3)
            if new_priority is not None:
                task.priority = new_priority
            
            # Category
            current_category = task.category or "None"
            new_category = input(f"Category [{current_category}]: ").strip()
            if new_category:
                if new_category.lower() in ('none', 'n'):
                    task.category = None
                else:
                    task.category = new_category
            
            # Notes
            current_notes = task.notes or "None"
            new_notes = input(f"Notes [{current_notes}]: ").strip()
            if new_notes:
                if new_notes.lower() in ('none', 'n'):
                    task.notes = None
                else:
                    task.notes = new_notes
            
            # Update task
            self.repository.update_task(task)
            self.view.display_message(f"Task '{task.description}' updated successfully.")
        except KeyboardInterrupt:
            self.view.display_message("Task update cancelled.")
    
    def remove_task(self) -> None:
        """Remove a task."""
        tasks = self.repository.get_all_tasks()
        
        if not tasks:
            self.view.display_message("No tasks to remove.")
            return
        
        self.view.display_tasks(tasks)
        
        task_num = self.view.get_int_input("Enter the task number to remove (or 'c' to cancel)", 1, len(tasks))
        if task_num is None:
            return
        
        # Get the task before it's removed for the confirmation message
        task = tasks[task_num - 1]
        
        if self.view.confirm_action(f"Are you sure you want to remove task '{task.description}'?"):
            self.repository.delete_task_by_index(task_num - 1)
            self.view.display_message(f"Task '{task.description}' removed successfully.")
        else:
            self.view.display_message("Task removal cancelled.")
    
    def toggle_task_completed(self) -> None:
        """Toggle the completed status of a task."""
        tasks = self.repository.get_all_tasks()
        
        if not tasks:
            self.view.display_message("No tasks to mark as completed.")
            return
        
        self.view.display_tasks(tasks)
        
        task_num = self.view.get_int_input("Enter the task number to toggle completion status (or 'c' to cancel)", 1, len(tasks))
        if task_num is None:
            return
        
        task = self.repository.toggle_task_completed_by_index(task_num - 1)
        status = "completed" if task.completed else "uncompleted"
        self.view.display_message(f"Task '{task.description}' marked as {status}.")
    
    def show_task_details(self) -> None:
        """Show detailed information for a task."""
        tasks = self.repository.get_all_tasks()
        
        if not tasks:
            self.view.display_message("No tasks to view.")
            return
        
        self.view.display_tasks(tasks)
        
        task_num = self.view.get_int_input("Enter the task number to view details (or 'c' to cancel)", 1, len(tasks))
        if task_num is None:
            return
        
        task = tasks[task_num - 1]
        self.view.display_task_details(task)
    
    def manage_settings(self) -> None:
        """Manage application settings."""
        while True:
            self.view.display_settings()
            
            choice = self.view.get_int_input("Enter your choice", 1, 6)
            if choice is None or choice == 6:
                break
            
            if choice == 1:
                # Tasks file
                new_value = input(f"Enter new tasks file name [{config.get('tasks_file')}]: ").strip()
                if new_value:
                    config.set("tasks_file", new_value)
                    self.view.display_message(f"Tasks file set to '{new_value}'.")
            
            elif choice == 2:
                # Data directory
                new_value = input(f"Enter new data directory [{config.get('data_dir')}]: ").strip()
                if new_value:
                    config.set("data_dir", new_value)
                    self.view.display_message(f"Data directory set to '{new_value}'.")
            
            elif choice == 3:
                # Backup enabled
                current = config.get("backup_enabled", True)
                new_value = self.view.confirm_action(f"Enable backups? (Currently {'enabled' if current else 'disabled'})")
                config.set("backup_enabled", new_value)
                self.view.display_message(f"Backups {'enabled' if new_value else 'disabled'}.")
            
            elif choice == 4:
                # Backup count
                current = config.get("backup_count", 3)
                new_value = self.view.get_int_input(f"Enter number of backups to keep (currently {current})", 1, 10)
                if new_value is not None:
                    config.set("backup_count", new_value)
                    self.view.display_message(f"Backup count set to {new_value}.")
            
            elif choice == 5:
                # Auto save
                current = config.get("auto_save", True)
                new_value = self.view.confirm_action(f"Enable auto save? (Currently {'enabled' if current else 'disabled'})")
                config.set("auto_save", new_value)
                self.view.display_message(f"Auto save {'enabled' if new_value else 'disabled'}.")
    
    def exit_application(self) -> None:
        """Exit the application."""
        if not config.get("auto_save", True):
            if self.view.confirm_action("Save changes before exiting?"):
                self.repository.save()
                self.view.display_message("Changes saved.")
        
        self.view.display_message("Thank you for using the To-Do List Application. Goodbye!") 