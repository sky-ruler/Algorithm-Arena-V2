import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, onLogout }) => {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* 1. THE COSMOS BACKGROUND LAYER */}
      <div className="cosmos-background">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      {/* 2. SIDEBAR */}
      <Sidebar onLogout={onLogout} />

      {/* 3. CONTENT AREA */}
      <main style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '32px 48px',
        position: 'relative', 
        zIndex: 1 
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;