import * as Yup from 'yup';

// Validation schema for login form
export const loginValidationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

// Validation schema for registration form
export const registerValidationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

// Validation schema for task creation
export const taskValidationSchema = Yup.object({
  description: Yup.string()
    .required('Task description is required')
    .max(200, 'Description must be at most 200 characters'),
  priority: Yup.number()
    .min(1, 'Priority must be between 1 and 4')
    .max(4, 'Priority must be between 1 and 4')
    .required('Priority is required'),
  due_date: Yup.string()
    .nullable()
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      'Due date must be in YYYY-MM-DD format'
    ),
  category: Yup.string()
    .nullable()
    .max(50, 'Category must be at most 50 characters'),
  notes: Yup.string()
    .nullable()
    .max(500, 'Notes must be at most 500 characters'),
});

// Validation schema for user profile update
export const profileUpdateValidationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),
  email: Yup.string()
    .email('Invalid email address'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match'),
}); 