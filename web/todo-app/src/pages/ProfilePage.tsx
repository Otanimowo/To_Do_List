import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { Person as PersonIcon, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout/Layout';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Form validation
    if (!username.trim() || !email.trim()) {
      setError('Username and email are required');
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      await updateProfile({ username, email });
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      console.error('Profile update failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <Container maxWidth="md">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
          My Profile
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ width: { xs: '100%', md: '33.333%' } }}>
            <Card elevation={3}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    backgroundColor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 2,
                  }}
                >
                  <PersonIcon sx={{ fontSize: 80, color: 'white' }} />
                </Box>
                <Typography variant="h5" gutterBottom>
                  {user.username}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Member since: {new Date(user.created_at).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ width: { xs: '100%', md: '66.666%' } }}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" component="h2">
                  Profile Information
                </Typography>
                {!isEditing && (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {success}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!isEditing || isSubmitting}
                  sx={{ mb: 3 }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing || isSubmitting}
                  sx={{ mb: 3 }}
                />

                {isEditing && (
                  <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsEditing(false);
                        setError(null);
                        // Reset form
                        if (user) {
                          setUsername(user.username || '');
                          setEmail(user.email || '');
                        }
                      }}
                      sx={{ mr: 2 }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ width: '40%' }}>
                    <Typography variant="body2" color="text.secondary">
                      Account Status:
                    </Typography>
                  </Box>
                  <Box sx={{ width: '60%' }}>
                    <Typography variant="body2">
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ width: '40%' }}>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated:
                    </Typography>
                  </Box>
                  <Box sx={{ width: '60%' }}>
                    <Typography variant="body2">
                      {new Date(user.modified_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default ProfilePage; 