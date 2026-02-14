import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("Registration Successful! Please Login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
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
        
        <Link to="/" style={{ textDecoration: 'none', marginBottom: '16px', display: 'block' }}>
           <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--fg-primary)' }}>
             Create Account
           </h2>
        </Link>
        
        <p style={{ color: 'var(--fg-secondary)', marginBottom: '32px', fontSize: '14px' }}>
          Join the community of developers.
        </p>
        
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" required style={inputStyle} onChange={(e) => setFormData({...formData, username: e.target.value})} />
          <input type="email" placeholder="Email Address" required style={inputStyle} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Password (Min 6 chars)" required style={inputStyle} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          
          <button type="submit" style={{ 
              width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
              background: 'var(--accent-primary)', color: 'white', fontWeight: '600', cursor: 'pointer',
              marginTop: '8px', boxShadow: '0 4px 12px var(--accent-glow)'
            }}>
            Sign Up
          </button>
        </form>
        
        <p style={{ marginTop: '24px', fontSize: '13px', color: 'var(--fg-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;