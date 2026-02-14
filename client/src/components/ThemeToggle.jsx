import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button 
      onClick={toggleTheme}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(120, 120, 128, 0.1)',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        color: 'var(--fg-primary)',
        fontSize: '14px',
        fontWeight: '500',
        marginTop: 'auto', 
        transition: 'background 0.2s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(120, 120, 128, 0.2)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(120, 120, 128, 0.1)'}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </span>
      
      <div style={{
        width: '36px', height: '20px',
        background: theme === 'dark' ? '#30D158' : '#E5E5EA',
        borderRadius: '20px', position: 'relative', transition: 'background 0.3s'
      }}>
        <div style={{
          width: '16px', height: '16px', background: 'white', borderRadius: '50%',
          position: 'absolute', top: '2px',
          left: theme === 'dark' ? '18px' : '2px',
          transition: 'left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }} />
      </div>
    </button>
  );
};

export default ThemeToggle;