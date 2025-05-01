# To-Do List React Frontend

A modern, responsive React frontend for the To-Do List application.

## Technologies Used

- **React 19**: Latest version of the React library
- **TypeScript**: For type-safe code
- **React Router**: For navigation between pages
- **Material UI**: For responsive and beautiful UI components
- **Axios**: For API communication
- **Context API**: For state management

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/            # Authentication components
│   ├── Layout/          # Layout components
│   └── Tasks/           # Task-related components
├── contexts/            # React contexts for state management
│   ├── AuthContext.tsx  # Authentication state
│   └── TaskContext.tsx  # Task management state
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API services
│   └── api.ts           # API client and endpoints
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── App.tsx              # Main application component
```

## Features

- User authentication (login/register)
- Task management (create, read, update, delete)
- Task filtering and sorting
- Responsive design for mobile and desktop
- Protected routes for authenticated users

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Install dependencies:
   ```
   npm install
   ```
   
   For PowerShell users with Execution Policy restrictions:
   ```
   powershell -ExecutionPolicy Bypass -Command "npm install"
   ```

2. Start the development server:
   ```
   npm start
   ```
   
   For PowerShell users with Execution Policy restrictions:
   ```
   powershell -ExecutionPolicy Bypass -Command "npm start"
   ```
   
   Or use the included start.ps1 script:
   ```
   .\start.ps1
   ```

3. Build for production:
   ```
   npm run build
   ```

## API Connection

The frontend connects to the FastAPI backend by default at `http://localhost:8000`. This can be configured in the `.env` file or through the proxy setting in `package.json`.

## Available Scripts

- `npm start`: Start the development server
- `npm test`: Run tests
- `npm run build`: Build for production
- `npm run eject`: Eject from Create React App

## Notes for Development

- Material UI components require proper theme setup in `App.tsx`
- Authentication uses JWT stored in localStorage
- Protected routes are managed through the `useProtectedRoute` hook
- API calls should use the centralized API client in `services/api.ts`

## Learn More

- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Material UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)
