import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, my: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to the To-Do List App
          </Typography>
          
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Stay organized, boost productivity, and never miss a deadline
          </Typography>

          {isAuthenticated ? (
            <Button
              component={RouterLink}
              to="/tasks"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
            >
              Go to My Tasks
            </Button>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="primary"
                size="large"
              >
                Login
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="outlined"
                color="primary"
                size="large"
              >
                Register
              </Button>
            </Box>
          )}
        </Paper>

        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Key Features
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', mt: 4 }}>
            <Paper elevation={2} sx={{ p: 3, flex: '1 1 250px', maxWidth: '350px' }}>
              <Typography variant="h6" gutterBottom>
                Task Management
              </Typography>
              <Typography variant="body1">
                Create, organize, and track your tasks with priority levels, due dates, and categories.
              </Typography>
            </Paper>
            
            <Paper elevation={2} sx={{ p: 3, flex: '1 1 250px', maxWidth: '350px' }}>
              <Typography variant="h6" gutterBottom>
                User Accounts
              </Typography>
              <Typography variant="body1">
                Register for an account to save your tasks securely in the cloud and access them anywhere.
              </Typography>
            </Paper>
            
            <Paper elevation={2} sx={{ p: 3, flex: '1 1 250px', maxWidth: '350px' }}>
              <Typography variant="h6" gutterBottom>
                Filtering & Sorting
              </Typography>
              <Typography variant="body1">
                Easily find the tasks you need with powerful filtering by status, priority, and category.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default HomePage; 