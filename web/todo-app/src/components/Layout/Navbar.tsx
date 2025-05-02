import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  IconButton,
  Tooltip,
  useMediaQuery,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import { 
  Brightness4 as DarkModeIcon, 
  Brightness7 as LightModeIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  List as TasksIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { mode, toggleColorMode } = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    handleMenuClose();
    navigate(path);
  };

  // Get first letter of username for avatar
  const getAvatarLetter = () => {
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <AppBar position="static" elevation={1}>
      <Container>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <RouterLink to="/" style={{ 
              color: 'inherit', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center' 
            }}>
              Todo App
            </RouterLink>
          </Typography>
          
          {/* Theme Toggle Button */}
          <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton
              edge="end"
              color="inherit"
              onClick={toggleColorMode}
              sx={{ mr: 1 }}
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <Box>
              {isAuthenticated ? (
                <>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/tasks"
                    startIcon={<TasksIcon />}
                    sx={{ mr: 1 }}
                  >
                    Tasks
                  </Button>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/profile"
                    startIcon={<PersonIcon />}
                    sx={{ mr: 1 }}
                  >
                    Profile
                  </Button>
                  <Button 
                    color="inherit"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/login"
                    sx={{ mr: 1 }}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="outlined"
                    color="inherit" 
                    component={RouterLink} 
                    to="/register"
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
          
          {/* Mobile Navigation */}
          {isMobile && (
            <>
              {isAuthenticated ? (
                <>
                  <Tooltip title={user?.username || 'User'}>
                    <IconButton
                      edge="end"
                      color="inherit"
                      onClick={handleMenuOpen}
                    >
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                        {getAvatarLetter()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      elevation: 2,
                      sx: { minWidth: 150 }
                    }}
                  >
                    <MenuItem onClick={() => handleNavigation('/tasks')}>
                      <TasksIcon fontSize="small" sx={{ mr: 1 }} /> Tasks
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigation('/profile')}>
                      <PersonIcon fontSize="small" sx={{ mr: 1 }} /> Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/login"
                    sx={{ mr: 1 }}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="outlined"
                    color="inherit" 
                    component={RouterLink} 
                    to="/register"
                  >
                    Register
                  </Button>
                </>
              )}
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 