import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card'; // Importing the NEW Card component

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('create');
  
  // State for Review Tab
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState('pending'); // 'pending' or 'history'
  const [editingId, setEditingId] = useState(null);

  // State for Create Tab
  const [formData, setFormData] = useState({
    title: '', description: '', difficulty: 'Easy', points: 100
  });

  useEffect(() => {
    if (activeTab === 'review') {
      fetchSubmissions();
    }
  }, [activeTab]);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/submissions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(res.data);
    } catch (err) {
      console.error("Failed to load submissions");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/challenges', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Challenge Published! ⚔️");
      setFormData({ title: '', description: '', difficulty: 'Easy', points: 100 });
    } catch (err) {
      alert("Failed to upload challenge.");
    }
  };

  const handleGrade = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/submissions/${id}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmissions(submissions.map(sub => sub._id === id ? { ...sub, status } : sub));
      setEditingId(null);
    } catch (err) {
      alert("Failed to grade submission.");
    }
  };

  const confirmReEvaluation = (id) => {
    if (window.confirm("⚠️ Re-evaluate this submission?")) {
      setEditingId(id);
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filter === 'pending') return sub.status === 'Pending';
    return sub.status !== 'Pending';
  });

  // --- STYLES ---
  const inputStyle = {
    width: '100%', padding: '14px', borderRadius: '12px',
    border: '1px solid var(--glass-border)', background: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--fg-primary)', outline: 'none', marginBottom: '16px', fontSize: '14px'
  };

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px' }}>Creator Studio</h1>

      {/* Segmented Control (Tabs) */}
      <div style={{ 
        background: 'rgba(120, 120, 128, 0.1)', 
        padding: '4px', 
        borderRadius: '12px', 
        display: 'inline-flex', 
        marginBottom: '32px',
        border: '1px solid var(--glass-border)'
      }}>
        <button 
          onClick={() => setActiveTab('create')}
          style={{ 
            padding: '8px 24px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer',
            background: activeTab === 'create' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'create' ? '#fff' : 'var(--fg-secondary)',
            transition: 'all 0.2s'
          }}
        >
          + New Challenge
        </button>
        <button 
          onClick={() => setActiveTab('review')}
          style={{ 
            padding: '8px 24px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer',
            background: activeTab === 'review' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'review' ? '#fff' : 'var(--fg-secondary)',
            transition: 'all 0.2s'
          }}
        >
          ⚖️ Review Work
        </button>
      </div>

      <Card>
        
        {/* --- TAB 1: CREATE --- */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreate} style={{ maxWidth: '600px' }}>
            <h2 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '700' }}>Draft Protocol</h2>
            
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--fg-secondary)', fontSize: '13px' }}>Title</label>
            <input type="text" required style={inputStyle} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />

            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--fg-secondary)', fontSize: '13px' }}>Description</label>
            <textarea rows="4" required style={inputStyle} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--fg-secondary)', fontSize: '13px' }}>Difficulty</label>
                <select style={inputStyle} value={formData.difficulty} onChange={(e) => setFormData({...formData, difficulty: e.target.value})}>
                  <option>Easy</option><option>Medium</option><option>Hard</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--fg-secondary)', fontSize: '13px' }}>Points</label>
                <input type="number" required style={inputStyle} value={formData.points} onChange={(e) => setFormData({...formData, points: e.target.value})} />
              </div>
            </div>

            <button type="submit" style={{ 
              width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
              background: 'var(--accent-primary)', color: 'white', fontWeight: '600', cursor: 'pointer', marginTop: '16px'
            }}>
              Publish to Arena 🚀
            </button>
          </form>
        )}

        {/* --- TAB 2: REVIEW --- */}
        {activeTab === 'review' && (
          <div>
            <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', borderBottom: '1px solid var(--glass-border)' }}>
              <button onClick={() => setFilter('pending')} style={{ paddingBottom: '8px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', color: filter === 'pending' ? 'var(--accent-primary)' : 'var(--fg-secondary)', borderBottom: filter === 'pending' ? '2px solid var(--accent-primary)' : '2px solid transparent' }}>Pending</button>
              <button onClick={() => setFilter('history')} style={{ paddingBottom: '8px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', color: filter === 'history' ? 'var(--accent-primary)' : 'var(--fg-secondary)', borderBottom: filter === 'history' ? '2px solid var(--accent-primary)' : '2px solid transparent' }}>History</button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: 'var(--fg-secondary)', borderBottom: '1px solid var(--glass-border)', fontSize: '13px' }}>
                  <th style={{ padding: '12px' }}>Student</th>
                  <th style={{ padding: '12px' }}>Challenge</th>
                  <th style={{ padding: '12px' }}>Solution</th>
                  <th style={{ padding: '12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub) => (
                  <tr key={sub._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '12px', fontWeight: '600' }}>{sub.userId?.username || 'Unknown'}</td>
                    <td style={{ padding: '12px' }}>{sub.challengeId?.title}</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>
                      {sub.repositoryUrl ? (
                        <a href={sub.repositoryUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>Link ↗</a>
                      ) : 'Snippet'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {(sub.status === 'Pending' || editingId === sub._id) ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleGrade(sub._id, 'Accepted')} style={{ background: 'rgba(48, 209, 88, 0.1)', color: '#30D158', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>✓ Accept</button>
                          <button onClick={() => handleGrade(sub._id, 'Rejected')} style={{ background: 'rgba(255, 69, 58, 0.1)', color: '#FF453A', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>✕ Reject</button>
                        </div>
                      ) : (
                        <span onClick={() => confirmReEvaluation(sub._id)} style={{ fontSize: '12px', color: sub.status === 'Accepted' ? '#30D158' : '#FF453A', cursor: 'pointer' }}>
                          {sub.status} <span style={{ color: 'var(--fg-secondary)', fontSize: '10px' }}>(edit)</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredSubmissions.length === 0 && <p style={{ textAlign: 'center', padding: '32px', color: 'var(--fg-secondary)' }}>All quiet on the front.</p>}
          </div>
        )}

      </Card>
    </div>
  );
};

export default AdminPanel;