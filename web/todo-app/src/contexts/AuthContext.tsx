import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, UserCreate, AuthContextType } from '../types/auth';
import { authApi } from '../services/api';

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Check for token and load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setState({ ...initialState, isLoading: false });
        return;
      }

      try {
        const user = await authApi.getCurrentUser();
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
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

  // Login handler
  const login = async (credentials: LoginCredentials) => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      const authResponse = await authApi.login(credentials);
      localStorage.setItem('token', authResponse.access_token);
      
      const user = await authApi.getCurrentUser();
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Invalid credentials. Please try again.',
      });
      throw error;
    }
  };

  // Register handler
  const register = async (userData: UserCreate) => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      await authApi.register(userData);
      await login({ username: userData.username, password: userData.password });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Registration failed. Please try again.',
      });
      throw error;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  // Update profile handler
  const updateProfile = async (userData: Partial<UserCreate>) => {
    setState({ ...state, isLoading: true, error: null });
    
    try {
      const updatedUser = await authApi.updateUserProfile(userData);
      setState({
        ...state,
        user: updatedUser,
        isLoading: false,
      });
    } catch (error) {
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

// Hook for easy context use
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext; 