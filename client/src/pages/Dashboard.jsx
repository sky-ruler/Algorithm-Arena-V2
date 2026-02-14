import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card'; // Assuming you have this component

const Dashboard = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/challenges');
        
        if (!res.ok) throw new Error('Failed to fetch challenges');
        
        const data = await res.json();
        // Our API returns { success: true, data: [...] }
        setChallenges(data.data || []); 
      } catch (err) {
        console.error("Dashboard Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-accent animate-pulse">Loading Mission Data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        <h2 className="text-2xl font-bold">Connection Lost</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-purple-500">
            Mission Control
          </h1>
          <p className="text-secondary mt-2">
            Welcome back, Pilot. Choose your next challenge.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="macos-glass p-6">
          <h3 className="text-secondary text-sm font-semibold uppercase">Total Challenges</h3>
          <p className="text-3xl font-bold mt-1">{challenges.length}</p>
        </div>
        <div className="macos-glass p-6">
          <h3 className="text-secondary text-sm font-semibold uppercase">Solved</h3>
          <p className="text-3xl font-bold mt-1 text-green-500">0</p>
        </div>
        <div className="macos-glass p-6">
          <h3 className="text-secondary text-sm font-semibold uppercase">Global Rank</h3>
          <p className="text-3xl font-bold mt-1 text-accent">#42</p>
        </div>
      </div>

      {/* Challenges Grid */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">Available Missions</h2>
      
      {challenges.length === 0 ? (
        <div className="text-center py-10 text-secondary">
          No challenges available. Ask Admin to seed the database!
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {challenges.map((challenge) => (
            <Link key={challenge._id} to={`/challenge/${challenge._id}`} className="group">
              <div className="macos-glass p-6 hover:border-accent transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold 
                    ${challenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-500' : 
                      challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' : 
                      'bg-red-500/20 text-red-500'}`}>
                    {challenge.difficulty}
                  </span>
                  <span className="text-secondary text-sm">{challenge.points} XP</span>
                </div>
                <h3 className="text-xl font-bold group-hover:text-accent transition-colors">
                  {challenge.title}
                </h3>
                <p className="text-secondary text-sm mt-2 line-clamp-2">
                  {challenge.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;