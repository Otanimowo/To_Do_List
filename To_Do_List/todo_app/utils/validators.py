"""
Validator utilities for the To-Do List application.
"""
import re
from datetime import datetime
from typing import Optional, Any, Callable

def validate_date_format(date_string: str) -> bool:
    """
    Validate that a string is in YYYY-MM-DD format.
    
    Args:
        date_string: String to validate
        
    Returns:
        True if the string is a valid date in YYYY-MM-DD format, False otherwise
    """
    if not date_string:
        return True  # Empty string is valid (no date)
    
    # Check format with regex
    if not re.match(r'^\d{4}-\d{2}-\d{2}$', date_string):
        return False
    
    # Check if it's a valid date
    try:
        datetime.strptime(date_string, '%Y-%m-%d')
        return True
    except ValueError:
        return False

def validate_priority(priority: Any) -> bool:
    """
    Validate that a value is a valid priority (1-3).
    
    Args:
        priority: Value to validate
        
    Returns:
        True if the value is a valid priority, False otherwise
    """
    if not priority and priority != 0:  # Check if empty but not zero
        return True  # Empty value is valid (default priority)
    
    try:
        priority_int = int(priority)
        return 1 <= priority_int <= 3
    except (ValueError, TypeError):
        return False

def validate_non_empty(value: str) -> bool:
    """
    Validate that a string is not empty.
    
    Args:
        value: String to validate
        
    Returns:
        True if the string is not empty, False otherwise
    """
    return bool(value.strip())

def create_length_validator(max_length: int, min_length: int = 0) -> Callable[[str], bool]:
    """
    Create a validator function for string length.
    
    Args:
        max_length: Maximum allowed length
        min_length: Minimum allowed length
        
    Returns:
        A validator function
    """
    def validator(value: str) -> bool:
        length = len(value.strip())
        return min_length <= length <= max_length
    
    return validator

def validate_menu_choice(choice: str, max_choice: int) -> bool:
    """
    Validate that a string is a valid menu choice.
    
    Args:
        choice: String to validate
        max_choice: Maximum valid choice number
        
    Returns:
        True if the string is a valid menu choice, False otherwise
    """
    try:
        choice_int = int(choice)
        return 1 <= choice_int <= max_choice
    except ValueError:
        return False 