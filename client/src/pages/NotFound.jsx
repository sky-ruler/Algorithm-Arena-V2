import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col justify-center items-center">
      <h1 className="text-9xl font-bold text-slate-800">404</h1>
      <p className="text-xl text-slate-400 mt-4">You have wandered into the void.</p>
      <Link to="/" className="mt-8 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition-all font-bold">
        Return to Safety
      </Link>
    </div>
  );
};

export default NotFound;
