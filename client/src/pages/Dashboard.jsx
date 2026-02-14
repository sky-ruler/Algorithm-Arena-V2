import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

const Dashboard = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/challenges');
        setChallenges(res.data);
      } catch (err) {
        console.error("Failed to fetch challenges");
      }
    };
    fetchChallenges();
  }, []);

  return (
    <div>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Challenges
        </h1>
        <p style={{ color: 'var(--fg-secondary)', fontSize: '15px' }}>
          Select a protocol to begin your assessment.
        </p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '24px' 
      }}>
        {challenges.length > 0 ? (
          challenges.map((challenge) => (
            <Link 
              to={`/challenge/${challenge._id}`} 
              key={challenge._id} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Card className="hover-scale">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: '700', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: challenge.difficulty === 'Easy' ? 'var(--accent-green)' : 
                           challenge.difficulty === 'Medium' ? 'var(--accent-orange)' : 'var(--accent-red)'
                  }}>
                    {challenge.difficulty}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--fg-tertiary)' }}>
                    {challenge.points} PTS
                  </span>
                </div>

                <h3 style={{ fontSize: '19px', fontWeight: '600', marginBottom: '8px', lineHeight: '1.3' }}>
                  {challenge.title}
                </h3>
                
                <p style={{ 
                  color: 'var(--fg-secondary)', 
                  fontSize: '14px', 
                  lineHeight: '1.5', 
                  marginBottom: '24px',
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {challenge.description}
                </p>
                
                <div style={{ 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: 'var(--accent-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  Start Challenge <span>→</span>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--fg-tertiary)' }}>
            No challenges available.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;