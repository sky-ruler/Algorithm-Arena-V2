import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// --- Components ---
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// --- Pages ---
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
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();

  // Sync state with LocalStorage on mount/change
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, [location]);

  const handleLoginSuccess = () => {
    setToken(localStorage.getItem('token'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <div className="app-container">
      <Routes>
        {/* --- PUBLIC ROUTES (No Sidebar) --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register />} />

        {/* --- PROTECTED ROUTES (With Sidebar) --- */}
        {/* We wrap these in a Layout Route to apply the Sidebar globally */}
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
          
          {/* Admin Only */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } 
          />
        </Route>

        {/* --- 404 PAGE --- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;