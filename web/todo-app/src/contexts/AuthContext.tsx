import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, LoginCredentials, UserCreate, AuthContextType } from '../types';
import { authApi } from '../services/api';

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

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider Component
 * 
 * Manages authentication state and provides authentication operations
 * (login, register, logout, profile update) to the entire application.
 * 
 * @param {ReactNode} children - Child components that will have access to auth context 
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Check for token and load user on mount
  useEffect(() => {
    const loadUser = async () => {
      log.info('AuthContext: Loading user...');
      const token = localStorage.getItem('token');
      
      if (!token) {
        log.info('AuthContext: No token found, user not authenticated');
        setState({ ...initialState, isLoading: false });
        return;
      }

      try {
        log.info('AuthContext: Token found, getting current user');
        const user = await authApi.getCurrentUser();
        log.info('AuthContext: User loaded successfully', user);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        log.error('AuthContext: Error loading user', error);
        localStorage.removeItem('token');
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Session expired. Please login again.',
        });
      }
    };

    loadUser();
  }, []);

  /**
   * Logs in a user with the provided credentials
   * 
   * @param {LoginCredentials} credentials - User login credentials
   * @returns {Promise<void>}
   * @throws Will throw an error if login fails
   */
  const login = async (credentials: LoginCredentials) => {
    setState({ ...state, isLoading: true, error: null });
    log.info('AuthContext: Attempting login for user:', credentials.username);
    
    try {
      const authResponse = await authApi.login(credentials);
      localStorage.setItem('token', authResponse.access_token);
      log.info('AuthContext: Login successful, token received');
      
      const user = await authApi.getCurrentUser();
      log.info('AuthContext: User data retrieved after login', user);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      log.error('AuthContext: Login failed', error);
      setState({
        ...state,
        isLoading: false,
        error: 'Invalid credentials. Please try again.',
      });
      throw error;
    }
  };

  /**
   * Registers a new user
   * 
   * @param {UserCreate} userData - New user data for registration
   * @returns {Promise<void>}
   * @throws Will throw an error if registration fails
   */
  const register = async (userData: UserCreate) => {
    setState({ ...state, isLoading: true, error: null });
    log.info('AuthContext: Attempting registration for user:', userData.username);
    
    try {
      await authApi.register(userData);
      log.info('AuthContext: Registration successful, proceeding to login');
      await login({ username: userData.username, password: userData.password });
    } catch (error) {
      log.error('AuthContext: Registration failed', error);
      setState({
        ...state,
        isLoading: false,
        error: 'Registration failed. Please try again.',
      });
      throw error;
    }
  };

  /**
   * Logs out the current user by removing the token and resetting state
   */
  const logout = () => {
    log.info('AuthContext: Logging out user');
    localStorage.removeItem('token');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  /**
   * Updates the current user's profile
   * 
   * @param {Partial<UserCreate>} userData - User data to update
   * @returns {Promise<void>}
   * @throws Will throw an error if profile update fails
   */
  const updateProfile = async (userData: Partial<UserCreate>) => {
    setState({ ...state, isLoading: true, error: null });
    log.info('AuthContext: Updating user profile');
    
    try {
      const updatedUser = await authApi.updateUserProfile(userData);
      log.info('AuthContext: Profile updated successfully', updatedUser);
      setState({
        ...state,
        user: updatedUser,
        isLoading: false,
      });
    } catch (error) {
      log.error('AuthContext: Profile update failed', error);
      setState({
        ...state,
        isLoading: false,
        error: 'Profile update failed. Please try again.',
      });
      throw error;
    }
  };

  // Context value
  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook for using the authentication context
 * 
 * @returns {AuthContextType} Authentication context value
 * @throws {Error} If used outside of an AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext; 