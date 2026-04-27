import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import LoadingScreen from "./LoadingScreen";

const ProtectedRoute = ({ children }) => {
  return children;
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen label="Restoring session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
