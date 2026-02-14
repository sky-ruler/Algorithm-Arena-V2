import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { api, getAuthConfig } from '../lib/api';

const getStoredUsername = () => {
  const raw = localStorage.getItem('user');
  if (!raw) {
    return '';
  }

  try {
    return JSON.parse(raw).username || '';
  } catch {
    return '';
  }
};

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [currentUser] = useState(() => getStoredUsername());

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/api/submissions/leaderboard', getAuthConfig());
        setLeaders(res.data.data || []);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px' }}>Leaderboard</h1>

      <Card style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr
              style={{
                borderBottom: '1px solid var(--glass-border-color)',
                color: 'var(--fg-secondary)',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <th style={{ padding: '20px' }}>Rank</th>
              <th style={{ padding: '20px' }}>User</th>
              <th style={{ padding: '20px', textAlign: 'center' }}>Solved</th>
              <th style={{ padding: '20px', textAlign: 'right' }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader, index) => {
              const isMe = leader.username === currentUser;
              let rankDisplay = `#${index + 1}`;

              if (index === 0) {
                rankDisplay = '#1';
              } else if (index === 1) {
                rankDisplay = '#2';
              } else if (index === 2) {
                rankDisplay = '#3';
              }

              return (
                <tr
                  key={leader._id}
                  style={{
                    borderBottom: '1px solid var(--glass-border-color)',
                    transition: 'background 0.2s',
                    background: isMe ? 'rgba(0, 122, 255, 0.1)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '20px', fontWeight: '600', fontSize: '16px' }}>{rankDisplay}</td>
                  <td style={{ padding: '20px', fontWeight: '600', color: isMe ? 'var(--accent-primary)' : 'var(--fg-primary)' }}>
                    {leader.username}
                    {isMe && (
                      <span
                        style={{
                          marginLeft: '8px',
                          fontSize: '10px',
                          background: 'var(--accent-primary)',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        YOU
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '20px', textAlign: 'center', fontFamily: 'monospace', color: 'var(--fg-secondary)' }}>
                    {leader.solvedCount}
                  </td>
                  <td style={{ padding: '20px', textAlign: 'right', fontWeight: '700', color: '#30D158' }}>
                    {leader.totalPoints}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {leaders.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--fg-secondary)' }}>No rankings available yet.</div>
        )}
      </Card>
    </div>
  );
};

export default Leaderboard;

