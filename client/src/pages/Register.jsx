import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCpu, FiLock, FiMail, FiUser } from 'react-icons/fi';
import Card from '../components/Card';
import { api } from '../lib/api';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="cosmos-background absolute inset-0 z-0">
        <div className="orb orb-1 opacity-50"></div>
        <div className="orb orb-2 opacity-50"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center shadow-lg shadow-accent/20">
              <FiCpu className="text-white text-xl" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-primary">AlgoArena</span>
          </Link>
          <h2 className="text-xl font-medium text-secondary">Join the ranks.</h2>
        </div>

        <Card className="shadow-2xl shadow-black/5 backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider">Codename (Username)</label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-3.5 text-secondary group-focus-within:text-accent transition-colors" />
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-white/50 dark:bg-black/20 border border-glass-border rounded-xl py-3 pl-11 pr-4 text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-400"
                  placeholder="e.g. Neo"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider">Email Address</label>
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

            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider">Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-3.5 text-secondary group-focus-within:text-accent transition-colors" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white/50 dark:bg-black/20 border border-glass-border rounded-xl py-3 pl-11 pr-4 text-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-400"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-glow text-white font-bold transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Profile...
                </>
              ) : (
                <>
                  Initialize Account <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center pt-6 border-t border-glass-border">
            <p className="text-sm text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-accent hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
