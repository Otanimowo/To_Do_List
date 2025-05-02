import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './hooks/useProtectedRoute';

/**
 * Main App component that handles routing for the Todo application.
 * 
 * The component defines the following routes:
 * - Public routes: Home, Login, Register
 * - Protected routes (requires authentication): Tasks, Profile
 * - Fallback route: 404 page for non-existent routes
 * 
 * Protected routes are wrapped with the ProtectedRoute component which
 * checks for authentication and redirects to the login page if needed.
 */
const App: React.FC = () => {
  return (
    <Routes>
      {/* Public routes accessible to all users */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes requiring authentication */}
      <Route 
        path="/tasks" 
        element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      
      {/* 404 route for handling non-existent routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
