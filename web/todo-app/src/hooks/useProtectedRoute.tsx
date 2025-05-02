import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Props for the ProtectedRoute component
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component that guards routes requiring authentication.
 * 
 * This component checks if the user is authenticated:
 * - If authenticated: renders the protected content (children)
 * - If not authenticated: redirects to the login page, saving the current location
 *   so the user can be redirected back after successful login
 * - While checking authentication status: shows a loading indicator
 * 
 * @param {React.ReactNode} children - The components to render if authenticated
 * @returns React element based on authentication state
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading indicator while checking auth status
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Redirect to login page, but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
export {}; 