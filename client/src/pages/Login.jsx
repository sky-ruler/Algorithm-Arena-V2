import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/Card';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      onLoginSuccess(); 
      navigate('/dashboard'); 
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px', borderRadius: '12px',
    border: '1px solid var(--glass-border)', background: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--fg-primary)', outline: 'none', marginBottom: '16px', fontSize: '14px'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <Card style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        
        <div style={{ marginBottom: '32px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ 
              fontSize: '28px', fontWeight: '800', 
              background: 'linear-gradient(135deg, var(--accent-primary), #a259ff)', 
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px', cursor: 'pointer', display: 'inline-block'
            }}>
              Algorithm Arena
            </h1>
          </Link>
          <p style={{ color: 'var(--fg-secondary)', fontSize: '14px', marginTop: '8px' }}>
            Welcome back. Please sign in.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <input type="email" required style={inputStyle} placeholder="Email address" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input type="password" required style={inputStyle} placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} />

          <button type="submit" style={{ 
              width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
              background: 'var(--accent-primary)', color: 'white', fontWeight: '600', cursor: 'pointer',
              marginTop: '8px', boxShadow: '0 4px 12px var(--accent-glow)'
            }}>
            Sign In
          </button>
        </form>

        <p style={{ marginTop: '24px', fontSize: '13px', color: 'var(--fg-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: '600', textDecoration: 'none' }}>Register here</Link>
        </p>

      </Card>
    </div>
  );
};

export default Login;