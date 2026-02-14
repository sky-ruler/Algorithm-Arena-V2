import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiCpu, FiArrowRight } from 'react-icons/fi';
import Card from '../components/Card';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ 
          username: data.username, 
          role: data.role 
        }));
        
        onLoginSuccess(); // Update App state
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Server connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="cosmos-background absolute inset-0 z-0">
        <div className="orb orb-1 opacity-50"></div>
        <div className="orb orb-2 opacity-50"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center shadow-lg shadow-accent/20">
              <FiCpu className="text-white text-xl" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-primary">
              AlgoArena
            </span>
          </Link>
          <h2 className="text-xl font-medium text-secondary">Welcome back, Pilot.</h2>
        </div>

        <Card className="shadow-2xl shadow-black/5 backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Alert */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-3.5 text-secondary group-focus-within:text-accent transition-colors" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/50 dark:bg-black/20 border border-glass-border rounded-xl py-3 pl-11 pr-4 text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-400"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider">
                Password
              </label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-3.5 text-secondary group-focus-within:text-accent transition-colors" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white/50 dark:bg-black/20 border border-glass-border rounded-xl py-3 pl-11 pr-4 text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-glow text-white font-bold transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Enter Arena <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center pt-6 border-t border-glass-border">
            <p className="text-sm text-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-accent hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;