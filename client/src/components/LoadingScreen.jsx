import React from 'react';

const LoadingScreen = ({ label = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-app text-primary flex items-center justify-center">
      <div className="macos-glass px-6 py-4 flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        <span className="font-medium">{label}</span>
      </div>
    </div>
  );
};

export default LoadingScreen;

