import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  let isAdmin = false;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAdmin = decoded.role === 'admin';
    } catch (e) {
      console.error("Invalid token");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  // Helper for active link styles
  const getLinkStyle = (path) => ({
    color: location.pathname === path ? 'var(--accent-color)' : 'var(--text-secondary)',
    fontWeight: location.pathname === path ? '700' : '500',
    textDecoration: 'none',
    transition: 'color 0.2s ease'
  });

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--glass-bg)', // Uses your global glass variable
      backdropFilter: 'blur(20px)',  // Strong blur for the Apple header look
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--glass-border)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/dashboard" style={{ 
          fontSize: '1.5rem', 
          fontWeight: '800', 
          background: 'linear-gradient(to right, #007AFF, #00C7BE)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          textDecoration: 'none'
        }}>
          Algorithm Arena
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', gap: '1.5rem' }} className="hidden md:flex">
          <Link to="/dashboard" style={getLinkStyle('/dashboard')}>Challenges</Link>
          <Link to="/leaderboard" style={getLinkStyle('/leaderboard')}>Leaderboard</Link>
          <Link to="/profile" style={getLinkStyle('/profile')}>My Profile</Link>
          {isAdmin && (
            <Link to="/admin" style={{ color: '#34C759', fontWeight: '600', textDecoration: 'none' }}>
              Creator Studio
            </Link>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        {token ? (
          <button 
            onClick={handleLogout}
            style={{
              background: 'rgba(255, 59, 48, 0.1)', // Soft red background
              color: '#FF3B30', // Apple Red
              border: '1px solid rgba(255, 59, 48, 0.2)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600', padding: '8px 0' }}>Login</Link>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 20px' }}>Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;