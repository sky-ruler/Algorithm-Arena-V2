import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/'); // 👈 Changed: Redirects to Home Page instead of Login
  };

  const NavItem = ({ to, icon, label }) => (
    <NavLink 
      to={to} 
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        marginBottom: '4px',
        borderRadius: '12px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: isActive ? '600' : '400',
        color: isActive ? '#fff' : 'var(--fg-primary)',
        background: isActive ? 'var(--accent-primary)' : 'transparent',
        transition: 'all 0.2s ease',
        boxShadow: isActive ? '0 4px 12px var(--accent-glow)' : 'none'
      })}
    >
      <span style={{ fontSize: '18px' }}>{icon}</span>
      {label}
    </NavLink>
  );

  return (
    <aside style={{
      width: '280px',
      height: '100%',
      background: 'var(--bg-sidebar)',
      backdropFilter: 'blur(40px)',
      borderRight: '1px solid var(--glass-border)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 10
    }}>
      {/* Logo -> Links to Home Page now */}
      <Link to="/" style={{ textDecoration: 'none', display: 'block', padding: '0 12px 32px 12px' }}>
        <h1 style={{ 
          fontSize: '20px', 
          fontWeight: '800', 
          background: 'linear-gradient(135deg, var(--accent-primary), #a259ff)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px',
          cursor: 'pointer'
        }}>
          Algorithm Arena
        </h1>
        <p style={{ fontSize: '11px', color: 'var(--fg-secondary)', fontWeight: '500', marginTop: '4px' }}>
          GDG On Campus • SOA ITER
        </p>
      </Link>
      
      <nav style={{ flex: 1 }}>
        <NavItem to="/dashboard" icon="💻" label="Problem Set" />
        <NavItem to="/leaderboard" icon="📊" label="Leaderboard" />
        <NavItem to="/profile" icon="👤" label="My Profile" />
        <NavItem to="/admin" icon="🛠️" label="Admin Panel" />
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ThemeToggle />
        
        <button 
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 14px',
            background: 'transparent',
            border: '1px solid rgba(255, 59, 48, 0.2)',
            borderRadius: '12px',
            color: '#FF3B30',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <span>↪</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;