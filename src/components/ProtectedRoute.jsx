import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Support both children prop (legacy) and Outlet (nested routes)
  return children || <Outlet />;
};

export default ProtectedRoute;
