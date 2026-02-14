import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';

const ChallengeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [repoUrl, setRepoUrl] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/challenges/${id}`);
        setChallenge(res.data);
      } catch (err) {}
    };
    fetchChallenge();
  }, [id]);

  const handleSubmit = async () => {
    if (!repoUrl && !codeSnippet) {
      alert("Please provide code or a GitHub repository link.");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/submissions', 
        { challengeId: id, repositoryUrl: repoUrl, code: codeSnippet },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Solution Submitted Successfully!");
      navigate('/dashboard');
    } catch (err) {
      alert("Submission Failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!challenge) return <div>Loading Problem...</div>;

  const inputStyle = {
    width: '100%', padding: '16px', borderRadius: '12px',
    border: '1px solid var(--glass-border)', background: 'rgba(0, 0, 0, 0.2)',
    color: 'var(--fg-primary)', outline: 'none', fontFamily: 'monospace',
    marginBottom: '16px'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
      {/* Problem Description */}
      <div>
        <Card style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800' }}>{challenge.title}</h1>
            <span style={{ 
              padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
              border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)'
            }}>
              {challenge.difficulty}
            </span>
          </div>
          <div style={{ lineHeight: '1.7', color: 'var(--fg-primary)', fontSize: '16px', whiteSpace: 'pre-wrap' }}>
            {challenge.description}
          </div>
        </Card>
      </div>

      {/* Submission Form */}
      <div>
        <Card title="Submit Solution">
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--fg-secondary)' }}>GitHub Repository URL</label>
          <input type="text" placeholder="https://github.com/username/repo" style={inputStyle} value={repoUrl} onChange={e => setRepoUrl(e.target.value)} />
          
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--fg-secondary)' }}>Or Paste Code</label>
          <textarea rows="10" placeholder="// Write your solution here..." style={inputStyle} value={codeSnippet} onChange={e => setCodeSnippet(e.target.value)} />
          
          <button 
            onClick={handleSubmit} disabled={submitting}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'var(--accent-primary)', color: 'white', fontWeight: '600', cursor: 'pointer' }}
          >
            {submitting ? 'Submitting...' : 'Submit Solution'}
          </button>
        </Card>
      </div>
    </div>
  );
};

export default ChallengeDetails;