import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Card from '../components/Card';

const Profile = () => {
  const [submissions, setSubmissions] = useState([]);
  const [username, setUsername] = useState('User');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setUsername(jwtDecode(token).username || 'User');

    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/submissions/my-submissions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubmissions(res.data);
      } catch (err) {}
    };
    fetchHistory();
  }, []);

  const acceptedCount = submissions.filter(s => s.status === 'Accepted').length;

  return (
    <div>
      {/* Top Section: User Info & Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* User Identity Card */}
        <Card style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--accent-primary), #5AC8FA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', fontWeight: 'bold', color: 'white',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
          }}>
            {username[0].toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>{username}</h1>
            <p style={{ color: 'var(--fg-secondary)', fontSize: '14px' }}>Student Developer</p>
          </div>
        </Card>
        
        {/* Statistics Card */}
        <Card style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>{submissions.length}</div>
            <div style={{ fontSize: '13px', color: 'var(--fg-secondary)', fontWeight: '500' }}>Total Submissions</div>
          </div>
          <div style={{ width: '1px', height: '40px', background: 'var(--glass-border)' }}></div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#30D158', marginBottom: '4px' }}>
              {acceptedCount}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--fg-secondary)', fontWeight: '500' }}>Solutions Accepted</div>
          </div>
        </Card>
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Recent Activity</h2>
      
      {/* Submission History List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {submissions.length > 0 ? (
          submissions.map((sub) => (
            <Card key={sub._id} className="hover-scale" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
              
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>
                  {sub.challengeId?.title || 'Unknown Challenge'}
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--fg-secondary)', display: 'flex', gap: '12px' }}>
                  <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span style={{ 
                    color: sub.challengeId?.difficulty === 'Easy' ? 'var(--accent-green)' : 
                           sub.challengeId?.difficulty === 'Medium' ? 'var(--accent-orange)' : 'var(--accent-red)'
                  }}>
                    {sub.challengeId?.difficulty}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ 
                  padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700',
                  background: sub.status === 'Accepted' ? 'rgba(48, 209, 88, 0.1)' : 
                              sub.status === 'Rejected' ? 'rgba(255, 69, 58, 0.1)' : 'rgba(255, 159, 10, 0.1)',
                  color: sub.status === 'Accepted' ? '#30D158' : 
                         sub.status === 'Rejected' ? '#FF453A' : '#FF9F0A'
                }}>
                  {sub.status}
                </span>
                
                {sub.repositoryUrl && (
                  <div style={{ marginTop: '8px' }}>
                    <a href={sub.repositoryUrl} target="_blank" rel="noreferrer" style={{ 
                      fontSize: '12px', color: 'var(--fg-secondary)', textDecoration: 'none', fontWeight: '500' 
                    }}>
                      View Code ↗
                    </a>
                  </div>
                )}
              </div>

            </Card>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--fg-secondary)' }}>
            No activity recorded. Start solving problems!
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;