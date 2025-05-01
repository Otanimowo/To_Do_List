"""
Tests for validator utilities.
"""
import unittest

from todo_app.utils.validators import (
    validate_date_format,
    validate_priority,
    validate_non_empty,
    create_length_validator,
    validate_menu_choice
)

class TestValidators(unittest.TestCase):
    """Test cases for validator utilities."""
    
    def test_validate_date_format(self):
        """Test date format validation."""
        # Valid dates
        self.assertTrue(validate_date_format("2023-01-01"))
        self.assertTrue(validate_date_format("2023-12-31"))
        self.assertTrue(validate_date_format(""))  # Empty is valid
        
        # Invalid dates
        self.assertFalse(validate_date_format("01-01-2023"))  # Wrong format
        self.assertFalse(validate_date_format("2023/01/01"))  # Wrong format
        self.assertFalse(validate_date_format("2023-13-01"))  # Invalid month
        self.assertFalse(validate_date_format("2023-01-32"))  # Invalid day
        self.assertFalse(validate_date_format("abcd-ef-gh"))  # Not a date
    
    def test_validate_priority(self):
        """Test priority validation."""
        # Valid priorities
        self.assertTrue(validate_priority(1))
        self.assertTrue(validate_priority(2))
        self.assertTrue(validate_priority(3))
        self.assertTrue(validate_priority("1"))
        self.assertTrue(validate_priority("2"))
        self.assertTrue(validate_priority("3"))
        self.assertTrue(validate_priority(""))  # Empty is valid (default)
        
        # Invalid priorities
        self.assertFalse(validate_priority(0))
        self.assertFalse(validate_priority(4))
        self.assertFalse(validate_priority("0"))
        self.assertFalse(validate_priority("4"))
        self.assertFalse(validate_priority("abc"))
    
    def test_validate_non_empty(self):
        """Test non-empty validation."""
        # Valid (non-empty)
        self.assertTrue(validate_non_empty("text"))
        self.assertTrue(validate_non_empty(" text "))
        
        # Invalid (empty)
        self.assertFalse(validate_non_empty(""))
        self.assertFalse(validate_non_empty(" "))
        self.assertFalse(validate_non_empty("  \t\n  "))
    
    def test_create_length_validator(self):
        """Test length validator creation."""
        # Create validators
        validate_short = create_length_validator(5)
        validate_range = create_length_validator(10, 5)
        
        # Test short validator
        self.assertTrue(validate_short("a"))
        self.assertTrue(validate_short("abcde"))
        self.assertFalse(validate_short("abcdef"))
        
        # Test range validator
        self.assertFalse(validate_range("abcd"))
        self.assertTrue(validate_range("abcde"))
        self.assertTrue(validate_range("abcdefghij"))
        self.assertFalse(validate_range("abcdefghijk"))
    
    def test_validate_menu_choice(self):
        """Test menu choice validation."""
        # Valid choices
        self.assertTrue(validate_menu_choice("1", 5))
        self.assertTrue(validate_menu_choice("3", 5))
        self.assertTrue(validate_menu_choice("5", 5))
        
        # Invalid choices
        self.assertFalse(validate_menu_choice("0", 5))
        self.assertFalse(validate_menu_choice("6", 5))
        self.assertFalse(validate_menu_choice("a", 5))
        self.assertFalse(validate_menu_choice("", 5))

if __name__ == "__main__":
    unittest.main() 