import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user needs to change password
  if (user?.firstLogin && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }

  // Check role requirements
  if (requiredRole) {
    const isAgent = user?.username?.includes('agent');
    const userRole = isAgent ? 'AGENT' : 'CLIENT';
    
    if (userRole !== requiredRole) {
      return <Navigate to={isAgent ? '/agent/clients' : '/client/dashboard'} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
