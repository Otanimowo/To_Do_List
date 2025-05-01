# To-Do List Application

A full-stack web application for managing tasks with a React frontend and FastAPI backend.

## Project Structure

```
To_Do_List/
├── api/                 # FastAPI backend
│   ├── app/             # API application code
│   │   ├── models/      # Database models and schemas
│   │   ├── routers/     # API route definitions
│   │   ├── services/    # Business logic
│   │   └── main.py      # FastAPI application entry point
│   └── run.py           # API server startup script
├── web/                 # Frontend
│   └── todo-app/        # React frontend application
├── To_Do_List/          # Python command-line application
│   └── To_Do_List.py    # Original CLI version of the app
└── README.md            # This file
```

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete tasks
- Mark tasks as completed/uncompleted
- Filter tasks by status and other criteria
- User profile management
- Responsive UI design

## Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for API development
- **SQLAlchemy**: SQL toolkit and ORM for database access
- **Pydantic**: Data validation and settings management
- **JWT**: JSON Web Tokens for authentication
- **Uvicorn**: ASGI server implementation for running the backend

### Frontend
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed JavaScript for better developer experience
- **Material-UI**: React component library for consistent design
- **React Router**: Navigation and routing for React applications
- **Axios**: HTTP client for API requests
- **Context API**: For state management across components

## Setup and Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup
1. Navigate to the API directory:
   ```
   cd To_Do_List/api
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Run the API server:
   ```
   python run.py
   ```
   
   The API will be available at http://localhost:8000

### Frontend Setup
1. Navigate to the web app directory:
   ```
   cd To_Do_List/web/todo-app
   ```

2. Install dependencies:
   ```
   npm install
   ```
   
   For PowerShell users with Execution Policy restrictions, use:
   ```
   powershell -ExecutionPolicy Bypass -Command "npm install"
   ```

3. Start the development server:
   ```
   npm start
   ```
   
   For PowerShell users with Execution Policy restrictions, use:
   ```
   powershell -ExecutionPolicy Bypass -Command "npm start"
   ```
   
   The web app will be available at http://localhost:3000

## Original CLI Application

The project also includes the original command-line interface version located in the `To_Do_List/To_Do_List.py` file. To run it:

```
cd To_Do_List
python To_Do_List.py
```

## API Documentation

Once the backend is running, API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## License

MIT 