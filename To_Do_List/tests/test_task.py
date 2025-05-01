"""
Tests for the Task model.
"""
import unittest
from datetime import datetime, timedelta

from todo_app.models.task import Task

class TestTask(unittest.TestCase):
    """Test cases for the Task class."""
    
    def test_task_creation(self):
        """Test creating a task with default values."""
        task = Task("Test task")
        
        self.assertEqual(task.description, "Test task")
        self.assertFalse(task.completed)
        self.assertIsNotNone(task.task_id)
        self.assertEqual(task.priority, 1)
        self.assertIsNone(task.category)
        self.assertIsNone(task.notes)
        self.assertIsNone(task.due_date)
        self.assertIsNotNone(task.created_at)
        self.assertIsNotNone(task.modified_at)
    
    def test_task_creation_with_values(self):
        """Test creating a task with specified values."""
        task = Task(
            description="Test task",
            completed=True,
            task_id="test-id",
            due_date="2023-12-31",
            priority=2,
            category="Test",
            notes="Test notes"
        )
        
        self.assertEqual(task.description, "Test task")
        self.assertTrue(task.completed)
        self.assertEqual(task.task_id, "test-id")
        self.assertEqual(task.priority, 2)
        self.assertEqual(task.category, "Test")
        self.assertEqual(task.notes, "Test notes")
        self.assertEqual(task.due_date, "2023-12-31")
    
    def test_priority_bounds(self):
        """Test that priority is bounded between 1 and 3."""
        task1 = Task("Test task", priority=0)
        task2 = Task("Test task", priority=4)
        
        self.assertEqual(task1.priority, 1)  # Min value is 1
        self.assertEqual(task2.priority, 3)  # Max value is 3
    
    def test_to_dict(self):
        """Test converting a task to a dictionary."""
        task = Task(
            description="Test task",
            completed=True,
            task_id="test-id",
            due_date="2023-12-31",
            priority=2,
            category="Test",
            notes="Test notes"
        )
        
        task_dict = task.to_dict()
        
        self.assertEqual(task_dict["description"], "Test task")
        self.assertTrue(task_dict["completed"])
        self.assertEqual(task_dict["task_id"], "test-id")
        self.assertEqual(task_dict["priority"], 2)
        self.assertEqual(task_dict["category"], "Test")
        self.assertEqual(task_dict["notes"], "Test notes")
        self.assertEqual(task_dict["due_date"], "2023-12-31")
    
    def test_from_dict(self):
        """Test creating a task from a dictionary."""
        task_dict = {
            "description": "Test task",
            "completed": True,
            "task_id": "test-id",
            "due_date": "2023-12-31",
            "priority": 2,
            "category": "Test",
            "notes": "Test notes",
            "created_at": "2023-01-01T12:00:00",
            "modified_at": "2023-01-02T12:00:00"
        }
        
        task = Task.from_dict(task_dict)
        
        self.assertEqual(task.description, "Test task")
        self.assertTrue(task.completed)
        self.assertEqual(task.task_id, "test-id")
        self.assertEqual(task.priority, 2)
        self.assertEqual(task.category, "Test")
        self.assertEqual(task.notes, "Test notes")
        self.assertEqual(task.due_date, "2023-12-31")
        self.assertEqual(task.created_at, "2023-01-01T12:00:00")
        self.assertEqual(task.modified_at, "2023-01-02T12:00:00")
    
    def test_due_date_formats(self):
        """Test handling different due date formats."""
        today = datetime.now().date()
        
        # Test with datetime object
        task1 = Task("Test task", due_date=today)
        self.assertEqual(task1.due_date, today.isoformat())
        
        # Test with date object
        task2 = Task("Test task", due_date=today)
        self.assertEqual(task2.due_date, today.isoformat())
        
        # Test with string
        task3 = Task("Test task", due_date="2023-12-31")
        self.assertEqual(task3.due_date, "2023-12-31")
    
    def test_string_representation(self):
        """Test the string representation of a task."""
        task = Task(
            description="Test task",
            completed=True,
            priority=2,
            category="Test",
            due_date="2023-12-31"
        )
        
        expected = "[✓] !! Test task (Due: 2023-12-31) #Test"
        self.assertEqual(str(task), expected)
        
        # Test without optional fields
        task = Task("Simple task")
        expected = "[ ] Simple task"
        self.assertEqual(str(task), expected)

if __name__ == "__main__":
    unittest.main() 