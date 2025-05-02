import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Formik, Form, Field, FormikHelpers, FormikProps } from 'formik';
import { TextField, Button, Typography, Box, Paper, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { registerValidationSchema } from '../../hooks/useFormValidation';
import { UserCreate } from '../../types';

// Debug flag to enable/disable console logging
// Set to false for production builds
const DEBUG = true;

// Logger function that only logs when DEBUG is true
const log = {
  info: (message: string, ...args: any[]) => {
    if (DEBUG) console.log(message, ...args);
  },
  error: (message: string, ...args: any[]) => {
    if (DEBUG) console.error(message, ...args);
  }
};

/**
 * Registration form values interface
 * Extends UserCreate with confirmPassword field for validation
 */
interface RegisterFormValues extends UserCreate {
  confirmPassword: string;
}

/**
 * Registration form component for creating new user accounts
 * 
 * Features:
 * - Form validation using Formik and Yup
 * - Password confirmation
 * - Error handling and display
 * - Redirect to home page after successful registration
 */
const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Initial form values
  const initialValues: RegisterFormValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  /**
   * Handle form submission
   * Attempts to register the user and redirects on success
   * 
   * @param {RegisterFormValues} values - Form values
   * @param {FormikHelpers<RegisterFormValues>} helpers - Formik helpers
   */
  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting, setFieldError }: FormikHelpers<RegisterFormValues>
  ) => {
    try {
      setError(null);
      log.info('RegisterForm: Submitting registration form', { 
        username: values.username, 
        email: values.email 
      });
      
      const userData: UserCreate = {
        username: values.username,
        email: values.email,
        password: values.password,
      };
      
      await register(userData);
      log.info('RegisterForm: Registration successful, redirecting to home');
      navigate('/'); // Redirect to home page after successful registration
    } catch (err: any) {
      log.error('RegisterForm: Registration error', err);
      
      // Handle specific error cases
      if (err.message?.includes('Username already exists')) {
        setFieldError('username', 'This username is already taken. Please choose another one.');
      } else if (err.message?.includes('email')) {
        setFieldError('email', 'This email is already in use. Please use another email or login to your existing account.');
      } else {
        // Generic error message for other cases
        let errorMessage = 'Registration failed. Please try again.';
        
        if (err.message) {
          errorMessage = err.message;
        } else if (err.response && err.response.data) {
          errorMessage = err.response.data.detail || errorMessage;
        }
        
        setError(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Register
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={registerValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors }: FormikProps<RegisterFormValues>) => (
          <Form>
            <Field
              as={TextField}
              name="username"
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              error={touched.username && Boolean(errors.username)}
              helperText={touched.username && errors.username}
            />

            <Field
              as={TextField}
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />

            <Field
              as={TextField}
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />

            <Field
              as={TextField}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={isSubmitting}
              sx={{ mt: 2 }}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>

            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Already have an account?{' '}
                <RouterLink to="/login" style={{ textDecoration: 'none' }}>
                  Login here
                </RouterLink>
              </Typography>
            </Box>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default RegisterForm; 