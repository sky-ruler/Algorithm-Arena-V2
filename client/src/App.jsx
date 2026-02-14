import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ChallengeDetails from './pages/ChallengeDetails';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

function App() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/challenge/:id" element={<ChallengeDetails />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
