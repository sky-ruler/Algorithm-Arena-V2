import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import LoadingScreen from './components/LoadingScreen';
import ThemeToggle from './components/ThemeToggle';
import NotificationListener from './components/NotificationListener';
import { useAuth } from './context/useAuth';

const Login = lazy(() => import('./pages/Login'));
const ChallengeDetails = lazy(() => import('./pages/ChallengeDetails'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLoginSuccess = () => {};

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-container">
      <div className="fixed bottom-20 sm:bottom-6 right-6 z-[60]">
        <ThemeToggle />
      </div>
      <NotificationListener />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout onLogout={handleLogout} />
              </ProtectedRoute>
            }
          >
            <Route
              path="/"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
            <Route path="/challenge/:id" element={<ChallengeDetails />} />
          </Route>

          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;

