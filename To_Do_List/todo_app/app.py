#!/usr/bin/env python3
"""
To-Do List Application
Author: Olushola Tanimowo
Description: A modular task management application.
"""
import sys
from typing import Dict, Callable

from .views.cli_view import CLIView
from .controllers.task_controller import TaskController
from .utils.validators import validate_menu_choice

class TodoApplication:
    """
    Main application class.
    Handles the application lifecycle and event loop.
    """
    
    def __init__(self):
        """Initialize the application."""
        self.view = CLIView()
        self.controller = TaskController(self.view)
        self.running = False
        
        # Map menu choices to handler methods
        self.menu_actions: Dict[str, Callable[[], None]] = {
            "1": self.controller.show_all_tasks,
            "2": self.controller.add_task,
            "3": self.controller.update_task,
            "4": self.controller.remove_task,
            "5": self.controller.toggle_task_completed,
            "6": self.controller.show_task_details,
            "7": self.controller.manage_settings,
            "8": self.exit
        }
    
    def start(self) -> None:
        """Start the application."""
        self.running = True
        self.view.display_message("Welcome to the To-Do List Application!")
        
        while self.running:
            try:
                self.view.clear_screen()
                self.view.display_header()
                self.view.display_menu()
                
                choice = self.view.get_input(
                    "\nEnter your choice (1-8): ",
                    lambda c: validate_menu_choice(c, 8),
                    "Invalid choice. Please enter a number between 1 and 8."
                )
                
                if choice in self.menu_actions:
                    self.menu_actions[choice]()
                    # Pause after action to allow user to see results
                    if choice != "8":  # Don't pause on exit
                        self.view.pause()
            
            except KeyboardInterrupt:
                print("\nExiting the application.")
                self.exit()
            except Exception as e:
                self.view.display_error(f"An error occurred: {e}")
                self.view.pause()
    
    def exit(self) -> None:
        """Exit the application."""
        self.controller.exit_application()
        self.running = False
        sys.exit(0)

def main() -> None:
    """Application entry point."""
    app = TodoApplication()
    app.start()

if __name__ == "__main__":
    main() 