import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // This is the tool you just installed!

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // No token? Send them back to login
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);
    
    // Check if the role inside the token is "admin"
    if (decoded.role !== 'admin') {
      // Not an admin? Send them to the player dashboard
      return <Navigate to="/dashboard" />;
    }

    // If everything is fine, show the AdminPanel
    return children;
  } catch (error) {
    // If the token is invalid or expired
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;