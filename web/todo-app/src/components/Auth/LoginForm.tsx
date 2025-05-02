import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { Formik, Form, Field, FormikHelpers, FormikProps } from 'formik';
import { TextField, Button, Typography, Box, Paper, Alert } from '@mui/material';
import { LoginCredentials } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { loginValidationSchema } from '../../hooks/useFormValidation';

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
 * Login form component that handles user authentication
 * 
 * Features:
 * - Form validation using Formik and Yup
 * - Redirect to the page user was trying to access after successful login
 * - Error handling and display
 * - Informational guidance for test credentials
 */
const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Get the redirect path from location state or default to home page
  const from = location.state?.from?.pathname || '/';

  // Initial form values
  const initialValues: LoginCredentials = {
    username: '',
    password: '',
  };

  /**
   * Handle form submission
   * Attempts to log in the user and redirects on success
   * 
   * @param {LoginCredentials} values - Form values
   * @param {FormikHelpers<LoginCredentials>} helpers - Formik helpers
   */
  const handleSubmit = async (
    values: LoginCredentials,
    { setSubmitting, setFieldError }: FormikHelpers<LoginCredentials>
  ) => {
    try {
      setError(null);
      log.info('LoginForm: Attempting login for user:', values.username);
      await login(values);
      log.info('LoginForm: Login successful, redirecting to:', from);
      navigate(from, { replace: true }); // Redirect to the page user was trying to access
    } catch (err: any) {
      log.error('LoginForm: Login error', err);
      
      // Handle specific error cases
      if (err.message?.toLowerCase().includes('invalid username or password')) {
        // Set a generic message for security (don't reveal if username exists)
        setError('Invalid username or password. Please check your credentials and try again.');
      } else if (err.message?.toLowerCase().includes('not authenticated')) {
        setError('Your session has expired. Please log in again.');
      } else {
        // Generic error fallback
        let errorMessage = 'Login failed. Please try again.';
        
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

  // Helper text for default login
  const defaultLoginInfo = (
    <Alert severity="info" sx={{ mt: 2, mb: 0 }}>
      <Typography variant="body2">
        For testing, you can log in with username: <strong>testuser</strong> and password: <strong>password</strong>
      </Typography>
    </Alert>
  );

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Login
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={loginValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors }: FormikProps<LoginCredentials>) => (
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
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
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
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>

            {defaultLoginInfo}

            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Don't have an account?{' '}
                <RouterLink to="/register" style={{ textDecoration: 'none' }}>
                  Register here
                </RouterLink>
              </Typography>
            </Box>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default LoginForm; 