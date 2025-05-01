# To-Do List API

A RESTful API for the To-Do List application built with FastAPI.

## Features

- Task management (create, read, update, delete)
- Task filtering by status, category, and priority
- User authentication with JWT tokens
- User registration and profile management
- Comprehensive API documentation
- Robust error handling
- Database integration with SQLAlchemy

## Installation

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Set environment variables (optional):

```bash
# Windows
set SECRET_KEY=your_secret_key
set DATABASE_URL=sqlite:///./todos.db

# Linux/Mac
export SECRET_KEY=your_secret_key
export DATABASE_URL=sqlite:///./todos.db
```

## Usage

Run the API:

```bash
python run.py
```

The API will be available at http://localhost:8000.

API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication

- `POST /token` - Get access token
- `POST /register` - Register a new user

### Tasks

- `GET /tasks` - List tasks
- `POST /tasks` - Create a task
- `GET /tasks/{task_id}` - Get a task
- `PUT /tasks/{task_id}` - Update a task
- `DELETE /tasks/{task_id}` - Delete a task
- `POST /tasks/{task_id}/complete` - Mark a task as completed
- `POST /tasks/{task_id}/uncomplete` - Mark a task as not completed

### Users

- `GET /users/me` - Get the current user's profile
- `PUT /users/me` - Update the current user's profile

## Testing

Run tests:

```bash
# Set testing environment
set TESTING=1  # Windows
export TESTING=1  # Linux/Mac

# Run tests
pytest
```

## Development

The API is built using:

- FastAPI - Web framework
- SQLAlchemy - ORM
- Pydantic - Data validation
- JWT - Authentication
- Uvicorn - ASGI server

## License

MIT License 