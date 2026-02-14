import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCpu, FiGrid, FiAward, FiUser, FiLogOut } from 'react-icons/fi';
import { clsx } from 'clsx';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ onLogout }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Mission Control', path: '/dashboard', icon: FiGrid },
    { name: 'Leaderboard', path: '/leaderboard', icon: FiAward },
    { name: 'Profile', path: '/profile', icon: FiUser },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-glass-surface backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 1. Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-accent/50 transition-all duration-300">
              <FiCpu className="text-white text-lg" />
            </div>
            <span className="font-bold text-xl tracking-tight text-primary group-hover:text-accent transition-colors">
              AlgoArena
            </span>
          </Link>

          {/* 2. Navigation Links (Center) */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive 
                      ? 'bg-accent/10 text-accent' 
                      : 'text-secondary hover:text-primary hover:bg-white/5'
                  )}
                >
                  <Icon className={clsx('text-lg', isActive ? 'text-accent' : 'text-secondary')} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* 3. Right Actions (Theme + Logout) */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <div className="h-6 w-px bg-white/20 hidden md:block"></div>
            
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
            >
              <FiLogOut className="text-lg" />
              <span className="hidden md:inline">Disconnect</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;