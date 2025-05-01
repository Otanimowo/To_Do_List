# To-Do List Application

A full-stack to-do list application with web and mobile interfaces.

## Project Structure

```
To_Do_List/
├── python/                  # Original Python CLI application
│   ├── To_Do_List.py
│   └── tasks.json
├── To_Do_List/             # Refactored modular CLI application
│   ├── todo_app/           # Python package
│   │   ├── models/         # Data models
│   │   ├── views/          # User interface
│   │   ├── controllers/    # Application logic
│   │   ├── utils/          # Utilities
│   │   └── config/         # Configuration
│   ├── tests/              # Unit tests
│   ├── main.py             # Entry point
│   └── setup.py            # Package setup
├── api/                    # REST API with FastAPI
│   ├── app/                # API application
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   ├── auth/           # Authentication
│   │   └── utils/          # Utilities
│   ├── tests/              # API tests
│   ├── run.py              # Run script
│   └── requirements.txt    # Dependencies
├── backend/                # Node.js/TypeScript backend (planned)
├── web/                    # React/TypeScript web frontend (planned)
└── mobile/                 # React Native/TypeScript mobile app (planned)
```

## Features

### Original Python CLI Application
- View your to-do list with task completion status
- Add new tasks to your list
- Remove tasks from your list
- Mark tasks as completed or uncompleted
- Data persistence (tasks are saved between sessions)
- User-friendly interface with error handling

### Refactored CLI Application (Iteration 1)
- All features from the original CLI application
- Improved modularity with MVC architecture
- Enhanced task model with priorities, due dates, categories, and notes
- Automatic backups
- Configurable settings
- More robust error handling
- Comprehensive unit tests

### REST API (Iteration 2)
- RESTful endpoints for task management
- User authentication with JWT
- User registration and profile management
- Task filtering by status, category, and priority
- Comprehensive API documentation with Swagger UI
- Database integration with SQLAlchemy
- Containerization with Docker

### Planned Features (Coming Soon)
- Web frontend with React/TypeScript
- Mobile app with React Native/TypeScript
- Cross-platform data sync
- Offline support
- Real-time updates

## Setup Instructions

### Python CLI Application (Original)
1. Navigate to the python directory
2. Run the application:
   ```bash
   python To_Do_List.py
   ```

### Refactored CLI Application (Iteration 1)
1. Navigate to the To_Do_List directory
2. Install the package in development mode:
   ```bash
   pip install -e .
   ```
3. Run the application:
   ```bash
   todo
   ```
   Or directly:
   ```bash
   python main.py
   ```

### REST API (Iteration 2)
1. Navigate to the api directory
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the API:
   ```bash
   python run.py
   ```
4. The API will be available at http://localhost:8000
5. API documentation is available at:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

Or using Docker:
```bash
cd api
docker-compose up
```

## Development Status
- [x] Python CLI Application (Original)
- [x] Refactored CLI Application (Iteration 1)
- [x] REST API with FastAPI (Iteration 2)
- [ ] Web Frontend
- [ ] Mobile App
- [ ] Deployment

## Author
Olushola Tanimowo

## License
This project is open source and available under the MIT License. 