# Todo App Testing Guidelines

This document provides guidelines for testing the Todo application to ensure it works correctly and meets all requirements.

## Manual Testing Checklist

### Authentication
- [ ] User can register with valid credentials
- [ ] System prevents duplicate username registration
- [ ] User can log in with valid credentials
- [ ] System provides appropriate error messages for invalid login
- [ ] User can log out
- [ ] Protected routes redirect to login when not authenticated

### Task Management
- [ ] User can view their tasks
- [ ] User can add a new task
- [ ] User can edit an existing task
- [ ] User can delete a task
- [ ] User can mark a task as complete/incomplete
- [ ] Task completion toggle works correctly
- [ ] Overdue tasks show visual indicators

### Task Filtering
- [ ] User can filter tasks by status (All/Active/Completed)
- [ ] User can filter tasks by category
- [ ] User can filter tasks by priority
- [ ] Filtered results are displayed correctly

### UI/UX
- [ ] Light/dark theme toggle works correctly
- [ ] Responsive design works on mobile, tablet, and desktop
- [ ] Task form validation displays appropriate error messages
- [ ] Transition animations work smoothly
- [ ] Loading indicators appear during async operations

## Automated Testing

### Unit Tests
For unit testing, we focus on isolated component and utility function testing using Jest and React Testing Library.

Key areas for unit testing:
- Utility functions (dateUtils, logger)
- Form validation logic
- Component rendering
- State management hooks

Example unit test for the date utility:

```typescript
// dateUtils.test.ts
import { formatDate, isDateOverdue } from '../utils/dateUtils';

describe('Date Utilities', () => {
  test('formatDate returns correct format', () => {
    const date = '2023-05-20T00:00:00Z';
    expect(formatDate(date)).toMatch(/May 20, 2023/);
  });
  
  test('isDateOverdue returns true for past dates', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    expect(isDateOverdue(pastDate.toISOString())).toBe(true);
  });
  
  test('isDateOverdue returns false for future dates', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    expect(isDateOverdue(futureDate.toISOString())).toBe(false);
  });
});
```

### Integration Tests
Integration tests verify that components work together correctly.

Key integration test scenarios:
- Task creation flow
- Authentication flow
- Task filtering mechanisms
- Context providers integration

### End-to-End Tests
End-to-end tests verify the application works as a whole using Cypress or similar tools.

Key E2E test scenarios:
- User registration and login
- Complete task lifecycle (create, view, edit, complete, delete)
- Task filtering and sorting
- Theme switching

## Test Data

For testing, use a mix of the following:

- Default test account: username `testuser`, password `password`
- Tasks with different priorities, due dates, and completion statuses
- Tasks with and without categories
- Overdue and upcoming tasks

## Mock API Testing

Since the application uses a mock API service for development, ensure that:

- Mock API responses match expected formats
- Error cases are properly simulated
- State persistence works correctly

## Debugging Tips

1. Use the centralized logger with DEBUG=true to view detailed logs
2. Check browser console for errors
3. Verify localStorage token for authentication issues
4. Test form validation with various input combinations

## Performance Testing

- Verify the application handles a large number of tasks efficiently
- Test loading and rendering times
- Check memory usage with React Developer Tools

Remember to run tests in both light and dark themes and on different browsers! 