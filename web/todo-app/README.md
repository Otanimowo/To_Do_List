# To-Do List React Frontend

A modern, responsive React frontend for the To-Do List application.

## Technologies Used

- **React 19**: Latest version of the React library
- **TypeScript**: For type-safe code
- **React Router**: For navigation between pages
- **Material UI**: For responsive and beautiful UI components
- **Formik & Yup**: For form handling and validation
- **Context API**: For state management
- **Mock API**: For development and testing without a backend

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/            # Authentication components
│   ├── Layout/          # Layout components
│   └── Tasks/           # Task-related components
├── contexts/            # React contexts for state management
│   ├── AuthContext.tsx  # Authentication state
│   ├── TaskContext.tsx  # Task management state
│   └── ThemeContext.tsx # Theme management
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API services
│   └── api.ts           # API client and endpoints
├── theme/               # Theme configuration
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
│   ├── dateUtils.ts     # Date formatting and manipulation
│   └── logger.ts        # Centralized logging system
└── App.tsx              # Main application component
```

## Features

- **User Authentication**
  - Register new accounts
  - Login with validation
  - Protected routes
  - Session persistence

- **Task Management**
  - Create, view, edit, and delete tasks
  - Mark tasks as complete/incomplete
  - Set priority levels (Low, Medium, High, Urgent)
  - Categorize tasks
  - Add detailed notes
  - Set due dates

- **Task Organization**
  - Filter by completion status
  - Filter by category
  - Filter by priority
  - Visual indicators for overdue tasks
  - Task details expansion

- **User Experience**
  - Responsive design for all devices
  - Light/dark theme switching
  - Form validation
  - Smooth animations and transitions
  - Loading state indicators

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
   
   If you encounter module resolution issues, run the fix script:
   ```
   .\fixModules.ps1
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

## Testing

See [TESTING.md](./src/TESTING.md) for comprehensive testing guidelines.

## Development Utilities

### Logger

The application includes a centralized logging system in `utils/logger.ts`. Use this for consistent, controllable logging:

```typescript
import { createLogger } from '../utils/logger';

const log = createLogger('MyComponent');
log.info('Component mounted');
log.error('Something went wrong', error);
```

In production, debugging logs are automatically disabled.

### Date Utilities

Common date operations are available in `utils/dateUtils.ts`:

```typescript
import { formatDate, isDateOverdue } from '../utils/dateUtils';

const displayDate = formatDate(task.due_date);
const isOverdue = isDateOverdue(task.due_date);
```

## Notes for Development

- Material UI components require proper theme setup in `ThemeContext.tsx`
- Authentication uses JWT token stored in localStorage
- Protected routes are managed through the `useProtectedRoute` hook
- The mock API in `services/api.ts` simulates backend functionality
- Form validation schemas are centralized in `hooks/useFormValidation.ts`

## Learn More

- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Material UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Formik Documentation](https://formik.org/docs/overview)
- [Yup Documentation](https://github.com/jquense/yup)
