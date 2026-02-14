import React from 'react';
import { Link } from 'react-router-dom';
import { FiCpu, FiCode, FiTrendingUp, FiZap, FiArrowRight } from 'react-icons/fi';
import Card from '../components/Card';

const Home = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-app text-primary font-sans selection:bg-accent selection:text-white">
      
      {/* Background Ambience (Manual override for landing page) */}
      <div className="cosmos-background absolute inset-0 z-0 pointer-events-none">
         <div className="orb orb-1 opacity-50"></div>
         <div className="orb orb-2 opacity-50"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center shadow-lg shadow-accent/20">
              <FiCpu className="text-white text-xl" />
            </div>
            <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              AlgoArena
            </span>
        </div>
        <div className="flex gap-4 items-center">
          {isLoggedIn ? (
            <Link to="/dashboard" className="px-6 py-2.5 rounded-full bg-accent hover:bg-accent-glow text-white font-semibold text-sm transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block px-4 py-2 text-secondary hover:text-primary font-medium text-sm transition-colors">
                Log in
              </Link>
              <Link to="/register" className="px-6 py-2.5 rounded-full bg-primary text-bg-app hover:bg-primary/90 font-semibold text-sm transition-all shadow-lg hover:-translate-y-0.5">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-wider uppercase backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            Official GDG Platform
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Master Data Structures <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-purple-500 to-pink-500">
              & Algorithms.
            </span>
          </h1>
          
          <p className="text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
            The premier competitive programming arena for SOA ITER. 
            Solve problems, climb the global ranks, and prepare for your future in tech.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link 
              to={isLoggedIn ? "/dashboard" : "/register"} 
              className="group px-8 py-4 rounded-full bg-accent text-white font-bold text-lg transition-all shadow-xl shadow-accent/30 hover:shadow-accent/50 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              {isLoggedIn ? 'Resume Coding' : 'Start Coding Now'}
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {!isLoggedIn && (
               <Link 
               to="/login"
               className="px-8 py-4 rounded-full bg-glass-surface border border-glass-border text-primary font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md"
             >
               View Leaderboard
             </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="relative z-10 border-y border-white/5 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-1">
                <div className="text-4xl font-black text-primary">50+</div>
                <div className="text-sm font-medium text-secondary uppercase tracking-widest">Challenges</div>
            </div>
            <div className="space-y-1">
                <div className="text-4xl font-black text-primary">200+</div>
                <div className="text-sm font-medium text-secondary uppercase tracking-widest">Active Developers</div>
            </div>
             <div className="space-y-1">
                <div className="text-4xl font-black text-primary">1.5k</div>
                <div className="text-sm font-medium text-secondary uppercase tracking-widest">Submissions</div>
            </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
            <div className="mb-16 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform Features</h2>
                <p className="text-secondary text-lg">Everything you need to excel in your next interview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="hover:border-accent/50 group">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <FiCode className="text-2xl text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Curated Problems</h3>
                    <p className="text-secondary leading-relaxed">
                        Hand-picked challenges ranging from Arrays to Dynamic Programming, designed to mimic real OA rounds.
                    </p>
                </Card>

                <Card className="hover:border-green-500/50 group">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <FiTrendingUp className="text-2xl text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Live Leaderboard</h3>
                    <p className="text-secondary leading-relaxed">
                        Compete with your peers in real-time. Every submission updates your rank instantly on the global stage.
                    </p>
                </Card>

                <Card className="hover:border-orange-500/50 group">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <FiZap className="text-2xl text-orange-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Instant Feedback</h3>
                    <p className="text-secondary leading-relaxed">
                        Get immediate results on your code. Our judge engine reviews submissions for correctness and speed.
                    </p>
                </Card>
            </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-10 text-center">
        <p className="text-sm text-secondary">
          © 2026 Algorithm Arena. Built for <span className="text-primary font-semibold">GDG On Campus • SOA ITER</span>.
        </p>
      </footer>

    </div>
  );
};

export default Home;