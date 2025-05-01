"""
Application settings and configuration.
"""
import os
import json
from pathlib import Path

# Default configuration
DEFAULT_CONFIG = {
    "tasks_file": "tasks.json",
    "app_name": "To-Do List Application",
    "data_dir": "",  # Will be set at runtime if empty
    "backup_enabled": True,
    "backup_count": 3,
    "auto_save": True
}

# User configuration file path
CONFIG_DIR = Path.home() / ".todo_app"
CONFIG_FILE = CONFIG_DIR / "config.json"

class Config:
    """
    Configuration manager for the application.
    Handles loading, saving, and accessing configuration settings.
    """
    _instance = None
    
    def __new__(cls):
        """Implement as a singleton."""
        if cls._instance is None:
            cls._instance = super(Config, cls).__new__(cls)
            cls._instance._load_config()
        return cls._instance
    
    def __init__(self):
        """Initialize configuration attributes."""
        # Already initialized in __new__, no need to do anything here
        pass
        
    def _load_config(self):
        """Load configuration from file or create default config."""
        self._config = DEFAULT_CONFIG.copy()
        
        # Create config directory if it doesn't exist
        if not CONFIG_DIR.exists():
            CONFIG_DIR.mkdir(parents=True, exist_ok=True)
        
        # Load user config if it exists
        if CONFIG_FILE.exists():
            try:
                with open(CONFIG_FILE, 'r') as file:
                    user_config = json.load(file)
                    self._config.update(user_config)
            except (json.JSONDecodeError, IOError) as e:
                print(f"Error loading configuration: {e}")
                print("Using default configuration.")
        
        # Set data directory if not specified
        if not self._config["data_dir"]:
            self._config["data_dir"] = str(CONFIG_DIR)
        
        # Ensure data directory exists
        data_dir = Path(self._config["data_dir"])
        if not data_dir.exists():
            data_dir.mkdir(parents=True, exist_ok=True)
    
    def save_config(self):
        """Save current configuration to file."""
        try:
            with open(CONFIG_FILE, 'w') as file:
                json.dump(self._config, file, indent=4)
        except IOError as e:
            print(f"Error saving configuration: {e}")
    
    def get(self, key, default=None):
        """Get a configuration value."""
        return self._config.get(key, default)
    
    def set(self, key, value):
        """Set a configuration value and save configuration."""
        self._config[key] = value
        self.save_config()
    
    def get_tasks_file_path(self):
        """Get the full path to the tasks file."""
        return os.path.join(self._config["data_dir"], self._config["tasks_file"])

# Create a global instance for importing
config = Config() 