import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, FiGrid, FiAward, FiUser, FiSettings, FiLogOut, FiCpu 
} from 'react-icons/fi';
import { clsx } from 'clsx'; // Helper for cleaner classes

const Navbar = ({ onLogout }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Mission Control', path: '/dashboard', icon: FiGrid },
    { name: 'Leaderboard', path: '/leaderboard', icon: FiAward },
    { name: 'Profile', path: '/profile', icon: FiUser },
    // { name: 'Admin Panel', path: '/admin', icon: FiCpu, adminOnly: true }, 
    // You can uncomment above if you want to show it conditionally
  ];

  return (
    <aside className="w-64 h-screen hidden md:flex flex-col border-r border-white/10 bg-sidebar backdrop-blur-xl relative z-20">
      {/* 1. Logo Section */}
      <div className="h-20 flex items-center px-8 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-accent/50 transition-all duration-300">
            <FiCpu className="text-white text-lg" />
          </div>
          <span className="font-bold text-xl tracking-tight text-primary group-hover:text-accent transition-colors">
            AlgoArena
          </span>
        </Link>
      </div>

      {/* 2. Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group',
                isActive 
                  ? 'bg-accent text-white shadow-lg shadow-accent/25' 
                  : 'text-secondary hover:bg-white/5 hover:text-primary'
              )}
            >
              <Icon className={clsx('text-xl', isActive ? 'text-white' : 'text-secondary group-hover:text-accent')} />
              <span className="font-medium">{item.name}</span>
              
              {/* Active Indicator Dot */}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* 3. User & Logout Section */}
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 group"
        >
          <FiLogOut className="text-xl group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Disconnect</span>
        </button>
      </div>
    </aside>
  );
};

export default Navbar;