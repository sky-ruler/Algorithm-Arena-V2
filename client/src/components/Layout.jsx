import React from 'react';
import { Outlet } from 'react-router-dom'; // 👈 CRITICAL IMPORT
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

const Layout = ({ onLogout }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-app text-primary transition-colors duration-300">
      {/* 1. Animated Background Layer */}
      <div className="cosmos-background">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      {/* 2. Sidebar Navigation */}
      <Sidebar onLogout={onLogout} />

      {/* 3. Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10">
        {/* Top Bar with Theme Toggle */}
        <header className="flex justify-end p-6 sticky top-0 z-20 pointer-events-none">
          <div className="pointer-events-auto">
            <ThemeToggle />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="px-8 pb-12 max-w-7xl mx-auto">
          {/* 🚨 THE FIX IS HERE:
              <Outlet /> is a placeholder. 
              React Router will replace this with <Dashboard />, <Profile />, etc. 
              depending on the URL.
          */}
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default Layout;