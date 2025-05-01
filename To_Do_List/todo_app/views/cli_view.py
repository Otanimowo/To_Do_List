"""
CLI view module.
Handles user interface for the command-line version of the application.
"""
import os
from typing import List, Callable, Optional

from ..config.settings import config
from ..models.task import Task

class CLIView:
    """
    Command-line interface view.
    """
    
    @staticmethod
    def clear_screen() -> None:
        """Clear the terminal screen."""
        os.system('cls' if os.name == 'nt' else 'clear')
    
    @staticmethod
    def display_header() -> None:
        """Display the application header."""
        app_name = config.get("app_name", "To-Do List Application")
        print(f"\n{'=' * (len(app_name) + 10)}")
        print(f"===== {app_name} =====")
        print(f"{'=' * (len(app_name) + 10)}")
    
    @staticmethod
    def display_menu() -> None:
        """Display the main menu options."""
        print("\nMenu Options:")
        print("1. View To-Do List")
        print("2. Add a Task")
        print("3. Update a Task")
        print("4. Remove a Task")
        print("5. Mark Task as Completed")
        print("6. View Task Details")
        print("7. Settings")
        print("8. Exit")
        print(f"{'-' * 20}")
    
    @staticmethod
    def display_tasks(tasks: List[Task], show_details: bool = False) -> None:
        """
        Display tasks with their status.
        
        Args:
            tasks: List of Task objects
            show_details: Whether to show detailed information for each task
        """
        print("\n===== Your To-Do List =====")
        if not tasks:
            print("No tasks in your to-do list.")
        else:
            for index, task in enumerate(tasks, start=1):
                status = "[✓]" if task.completed else "[ ]"
                priority_str = "!" * task.priority
                print(f"{index}. {status} {priority_str} {task.description}")
                
                if show_details and (task.due_date or task.category or task.notes):
                    if task.due_date:
                        print(f"   Due: {task.due_date}")
                    if task.category:
                        print(f"   Category: {task.category}")
                    if task.notes:
                        print(f"   Notes: {task.notes}")
        print("===========================")
    
    @staticmethod
    def display_task_details(task: Task) -> None:
        """
        Display detailed information for a single task.
        
        Args:
            task: The task to display
        """
        print("\n===== Task Details =====")
        print(f"Description: {task.description}")
        print(f"Status: {'Completed' if task.completed else 'Not Completed'}")
        print(f"Priority: {task.priority}")
        
        if task.due_date:
            print(f"Due Date: {task.due_date}")
        if task.category:
            print(f"Category: {task.category}")
        if task.notes:
            print(f"Notes: {task.notes}")
            
        print(f"Created: {task.created_at.split('T')[0] if 'T' in task.created_at else task.created_at}")
        print(f"Last Modified: {task.modified_at.split('T')[0] if 'T' in task.modified_at else task.modified_at}")
        print("=======================")
    
    @staticmethod
    def display_settings() -> None:
        """Display application settings."""
        print("\n===== Application Settings =====")
        print(f"1. Tasks File: {config.get('tasks_file')}")
        print(f"2. Data Directory: {config.get('data_dir')}")
        print(f"3. Backup Enabled: {config.get('backup_enabled')}")
        print(f"4. Backup Count: {config.get('backup_count')}")
        print(f"5. Auto Save: {config.get('auto_save')}")
        print(f"6. Return to Main Menu")
        print("===============================")
    
    @staticmethod
    def get_input(prompt: str, validator: Optional[Callable[[str], bool]] = None, 
                 error_msg: str = "Invalid input. Please try again.") -> str:
        """
        Get validated input from the user.
        
        Args:
            prompt: Input prompt to display
            validator: Function to validate input
            error_msg: Message to display on validation failure
            
        Returns:
            Validated user input
        """
        while True:
            try:
                user_input = input(prompt).strip()
                if validator is None or validator(user_input):
                    return user_input
                print(error_msg)
            except KeyboardInterrupt:
                print("\nOperation cancelled.")
                return ""
    
    @staticmethod
    def get_int_input(prompt: str, min_value: Optional[int] = None, 
                     max_value: Optional[int] = None) -> Optional[int]:
        """
        Get integer input from the user within a specified range.
        
        Args:
            prompt: Input prompt to display
            min_value: Minimum acceptable value
            max_value: Maximum acceptable value
            
        Returns:
            Validated integer input or None if cancelled
        """
        range_str = ""
        if min_value is not None and max_value is not None:
            range_str = f" ({min_value}-{max_value})"
        elif min_value is not None:
            range_str = f" (min: {min_value})"
        elif max_value is not None:
            range_str = f" (max: {max_value})"
        
        while True:
            try:
                user_input = input(f"{prompt}{range_str}: ").strip()
                
                if user_input.lower() in ('c', 'cancel'):
                    return None
                
                value = int(user_input)
                
                if (min_value is not None and value < min_value) or \
                   (max_value is not None and value > max_value):
                    print(f"Please enter a value between {min_value or 'any'} and {max_value or 'any'}.")
                else:
                    return value
            except ValueError:
                print("Please enter a valid number.")
            except KeyboardInterrupt:
                print("\nOperation cancelled.")
                return None
    
    @staticmethod
    def get_task_input() -> Optional[dict]:
        """
        Get task information from user input.
        
        Returns:
            Dictionary with task information or None if cancelled
        """
        print("\n=== New Task ===")
        
        try:
            description = input("Enter task description: ").strip()
            if not description:
                print("Task description cannot be empty.")
                return None
            
            due_date = input("Enter due date (YYYY-MM-DD) or leave blank: ").strip()
            
            priority_input = input("Enter priority (1-3, where 1 is highest) or leave blank for default: ").strip()
            priority = 1  # Default
            if priority_input:
                try:
                    priority = int(priority_input)
                    if priority < 1 or priority > 3:
                        print("Priority must be between 1 and 3. Using default priority.")
                        priority = 1
                except ValueError:
                    print("Invalid priority. Using default priority.")
            
            category = input("Enter category/tag or leave blank: ").strip()
            
            notes = input("Enter additional notes or leave blank: ").strip()
            
            return {
                "description": description,
                "due_date": due_date if due_date else None,
                "priority": priority,
                "category": category if category else None,
                "notes": notes if notes else None
            }
        except KeyboardInterrupt:
            print("\nTask creation cancelled.")
            return None
    
    @staticmethod
    def confirm_action(prompt: str) -> bool:
        """
        Get confirmation from the user.
        
        Args:
            prompt: Confirmation prompt to display
            
        Returns:
            True if confirmed, False otherwise
        """
        try:
            response = input(f"{prompt} (y/n): ").strip().lower()
            return response in ('y', 'yes')
        except KeyboardInterrupt:
            print("\nOperation cancelled.")
            return False
    
    @staticmethod
    def display_message(message: str) -> None:
        """
        Display a message to the user.
        
        Args:
            message: Message to display
        """
        print(f"\n{message}")
    
    @staticmethod
    def display_error(error: str) -> None:
        """
        Display an error message to the user.
        
        Args:
            error: Error message to display
        """
        print(f"\nError: {error}")
    
    @staticmethod
    def pause() -> None:
        """Pause execution until the user presses Enter."""
        try:
            input("\nPress Enter to continue...")
        except KeyboardInterrupt:
            print()  # Print a newline 