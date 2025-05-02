import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { SentimentDissatisfied as SadIcon } from '@mui/icons-material';
import Layout from '../components/Layout/Layout';

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 5, my: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 4 }}>
            <SadIcon sx={{ fontSize: 80, color: 'text.secondary' }} />
          </Box>
          
          <Typography variant="h3" component="h1" gutterBottom>
            404 - Page Not Found
          </Typography>
          
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Oops! The page you are looking for doesn't exist.
          </Typography>
          
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            color="primary"
            size="large"
          >
            Go to Home Page
          </Button>
        </Paper>
      </Container>
    </Layout>
  );
};

export default NotFoundPage; 