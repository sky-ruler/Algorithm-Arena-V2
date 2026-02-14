import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Card from '../components/Card';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try { setCurrentUser(jwtDecode(token).username); } catch (e) {}
    }
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/submissions/leaderboard');
        setLeaders(res.data);
      } catch (err) {}
    };
    fetchLeaderboard();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px' }}>Leaderboard</h1>
      
      <Card style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ 
              borderBottom: '1px solid var(--glass-border)', 
              color: 'var(--fg-secondary)', 
              fontSize: '12px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em' 
            }}>
              <th style={{ padding: '20px' }}>Rank</th>
              <th style={{ padding: '20px' }}>User</th>
              <th style={{ padding: '20px', textAlign: 'center' }}>Solved</th>
              <th style={{ padding: '20px', textAlign: 'right' }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader, index) => {
              const isMe = leader.username === currentUser;
              
              // Rank Badges
              let rankDisplay = `#${index + 1}`;
              let rowStyle = {};

              if (index === 0) { rankDisplay = '🥇'; }
              else if (index === 1) { rankDisplay = '🥈'; }
              else if (index === 2) { rankDisplay = '🥉'; }

              if (isMe) {
                rowStyle = { background: 'rgba(0, 122, 255, 0.1)' };
              }

              return (
                <tr key={leader._id} style={{ 
                  borderBottom: '1px solid var(--glass-border)',
                  transition: 'background 0.2s',
                  ...rowStyle
                }}>
                  <td style={{ padding: '20px', fontWeight: '600', fontSize: '16px' }}>
                    {rankDisplay}
                  </td>
                  <td style={{ padding: '20px', fontWeight: '600', color: isMe ? 'var(--accent-primary)' : 'var(--fg-primary)' }}>
                    {leader.username}
                    {isMe && <span style={{ marginLeft: '8px', fontSize: '10px', background: 'var(--accent-primary)', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>YOU</span>}
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
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--fg-secondary)' }}>
            No rankings available yet.
          </div>
        )}
      </Card>
    </div>
  );
};

export default Leaderboard;