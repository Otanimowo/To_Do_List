#!/usr/bin/env python3
"""
To-Do List Application
Author: Olushola Tanimowo
Description: A simple command-line to-do list application that allows users to view, add, and remove tasks.
The application also saves tasks to a file for persistence between sessions.
"""
import os
import json

# Constants
TASKS_FILE = "tasks.json"

def display_menu():
    """Display the main menu options to the user."""
    print("\n===== To-Do List Application =====")
    print("1. View To-Do List")
    print("2. Add a Task")
    print("3. Remove a Task")
    print("4. Mark Task as Completed")
    print("5. Exit")
    print("=================================")

def load_tasks():
    """
    Load tasks from the JSON file.
    
    Returns:
        list: List of tasks, or an empty list if the file doesn't exist
    """
    if os.path.exists(TASKS_FILE):
        try:
            with open(TASKS_FILE, 'r') as file:
                return json.load(file)
        except json.JSONDecodeError:
            print("Error reading tasks file. Starting with an empty list.")
            return []
    return []

def save_tasks(tasks):
    """
    Save tasks to the JSON file.
    
    Args:
        tasks (list): List of tasks to save
    """
    with open(TASKS_FILE, 'w') as file:
        json.dump(tasks, file, indent=4)

def view_tasks(tasks):
    """
    Display all tasks with their status.
    
    Args:
        tasks (list): List of task dictionaries
    """
    print("\n===== Your To-Do List =====")
    if not tasks:
        print("No tasks in your to-do list.")
    else:
        for index, task in enumerate(tasks, start=1):
            status = "[✓]" if task.get("completed", False) else "[ ]"
            print(f"{index}. {status} {task['description']}")
    print("===========================")

def add_task(tasks):
    """
    Add a new task to the list.
    
    Args:
        tasks (list): List of task dictionaries
    """
    try:
        task_description = input("\nEnter the task: ").strip()
        if not task_description:
            print("Task cannot be empty.")
            return
        
        new_task = {
            "description": task_description,
            "completed": False
        }
        tasks.append(new_task)
        save_tasks(tasks)
        print(f"Task '{task_description}' added successfully.")
    except KeyboardInterrupt:
        print("\nTask addition cancelled.")

def remove_task(tasks):
    """
    Remove a task from the list.
    
    Args:
        tasks (list): List of task dictionaries
    """
    if not tasks:
        print("No tasks to remove.")
        return
    
    view_tasks(tasks)
    try:
        task_num = input("\nEnter the task number to remove (or 'c' to cancel): ")
        
        if task_num.lower() == 'c':
            print("Task removal cancelled.")
            return
            
        task_num = int(task_num)
        if 0 < task_num <= len(tasks):
            removed_task = tasks.pop(task_num - 1)
            save_tasks(tasks)
            print(f"Task '{removed_task['description']}' removed successfully.")
        else:
            print("Invalid task number.")
    except ValueError:
        print("Please enter a valid number.")
    except KeyboardInterrupt:
        print("\nTask removal cancelled.")

def mark_completed(tasks):
    """
    Mark a task as completed or uncompleted.
    
    Args:
        tasks (list): List of task dictionaries
    """
    if not tasks:
        print("No tasks to mark as completed.")
        return
    
    view_tasks(tasks)
    try:
        task_num = input("\nEnter the task number to toggle completion status (or 'c' to cancel): ")
        
        if task_num.lower() == 'c':
            print("Operation cancelled.")
            return
            
        task_num = int(task_num)
        if 0 < task_num <= len(tasks):
            tasks[task_num - 1]["completed"] = not tasks[task_num - 1].get("completed", False)
            status = "completed" if tasks[task_num - 1]["completed"] else "uncompleted"
            save_tasks(tasks)
            print(f"Task '{tasks[task_num - 1]['description']}' marked as {status}.")
        else:
            print("Invalid task number.")
    except ValueError:
        print("Please enter a valid number.")
    except KeyboardInterrupt:
        print("\nOperation cancelled.")

def main():
    """Main function to run the to-do list application."""
    print("Welcome to the To-Do List Application!")
    tasks = load_tasks()
    
    while True:
        display_menu()
        try:
            choice = input("\nEnter your choice (1-5): ")
            
            if choice == "1":
                view_tasks(tasks)
            elif choice == "2":
                add_task(tasks)
            elif choice == "3":
                remove_task(tasks)
            elif choice == "4":
                mark_completed(tasks)
            elif choice == "5":
                print("Thank you for using the To-Do List Application. Goodbye!")
                break
            else:
                print("Invalid choice. Please enter a number between 1 and 5.")
        except KeyboardInterrupt:
            print("\nExiting the application.")
            break
        except Exception as e:
            print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
