import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getRole } from '../services/auth';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const role = getRole();
  // allow if no allowedRoles specified
  if (allowedRoles.length === 0) return children;

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
