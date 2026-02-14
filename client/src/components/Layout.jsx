import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-app text-primary transition-colors duration-300">
      {/* 1. Animated Background Layer */}
      <div className="cosmos-background">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      {/* 2. Top Navigation */}
      <Navbar onLogout={onLogout} />

      {/* 3. Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        {/* <Outlet /> is where Dashboard, Profile, etc. will appear.
            Now they sit beautifully under the Navbar.
        */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;