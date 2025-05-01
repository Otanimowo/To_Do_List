# To-Do List Application

A modular command-line to-do list application built with Python.

## Features

- View, add, update, and remove tasks
- Mark tasks as completed or uncompleted
- Task priorities (1-3)
- Due dates for tasks
- Task categories/tags
- Task notes
- Task history (creation and modification timestamps)
- Configurable settings
- Data persistence with automatic backups
- Clean, user-friendly interface

## Installation

### Development Installation

1. Clone the repository
2. Navigate to the project directory
3. Install the package in development mode:

```bash
pip install -e .
```

### User Installation

Install from the project directory:

```bash
pip install .
```

## Usage

To start the application:

```bash
todo
```

Or run the main script directly:

```bash
python main.py
```

## Configuration

The application stores configuration in `~/.todo_app/config.json`. You can modify settings through the application's Settings menu.

Available settings:

- **tasks_file**: The name of the file to store tasks in
- **data_dir**: Directory to store data files
- **backup_enabled**: Whether to create backups when saving tasks
- **backup_count**: Number of backups to keep
- **auto_save**: Whether to automatically save changes

## Project Structure

```
todo_app/
├── __init__.py
├── app.py              # Main application
├── models/             # Data models
│   ├── __init__.py
│   ├── task.py         # Task model
│   └── task_repository.py # Repository for tasks
├── views/              # UI components
│   ├── __init__.py
│   └── cli_view.py     # Command-line interface view
├── controllers/        # Application logic
│   ├── __init__.py
│   └── task_controller.py # Task controller
├── utils/              # Utilities
│   ├── __init__.py
│   └── validators.py   # Input validation utilities
└── config/             # Configuration
    ├── __init__.py
    └── settings.py     # Settings management
```

## Testing

Run the tests:

```bash
python -m unittest discover tests
```

## Author

Olushola Tanimowo

## License

MIT License 