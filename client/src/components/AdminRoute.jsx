import React from 'react';
import { Navigate } from 'react-router-dom';

const getStoredUser = () => {
  const raw = localStorage.getItem('user');
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = getStoredUser();

  if (!token || !user) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminRoute;
