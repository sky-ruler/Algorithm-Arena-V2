import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

const Home = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  const LandingNav = () => (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '24px 40px', maxWidth: '1200px', margin: '0 auto', width: '100%'
    }}>
      <div style={{ fontSize: '20px', fontWeight: '800', background: 'linear-gradient(135deg, var(--accent-primary), #a259ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
        Algorithm Arena
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        {isLoggedIn ? (
          <Link to="/dashboard" style={{ padding: '10px 24px', borderRadius: '20px', background: 'var(--accent-primary)', color: 'white', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" style={{ padding: '10px 24px', color: 'var(--fg-primary)', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>Log in</Link>
            <Link to="/register" style={{ padding: '10px 24px', borderRadius: '20px', background: 'var(--fg-primary)', color: 'var(--bg-app)', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <LandingNav />

      {/* Hero Section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', marginBottom: '40px' }}>
          <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '30px', background: 'rgba(0, 122, 255, 0.1)', color: 'var(--accent-primary)', fontSize: '12px', fontWeight: '700', marginBottom: '24px', letterSpacing: '0.05em' }}>
            OFFICIAL GDG PLATFORM
          </span>
          <h1 style={{ 
            fontSize: 'clamp(40px, 6vw, 72px)', 
            fontWeight: '800', 
            lineHeight: '1.1',
            letterSpacing: '-2px',
            marginBottom: '24px',
            color: 'var(--fg-primary)'
          }}>
            Master Data Structures<br/>
            <span style={{ color: 'var(--fg-secondary)' }}>& Algorithms.</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--fg-secondary)', maxWidth: '500px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
            The premier competitive programming arena for SOA ITER. Solve problems, climb the ranks, and prepare for your future.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to={isLoggedIn ? "/dashboard" : "/register"} style={{ 
              padding: '16px 40px', 
              borderRadius: '30px', 
              background: 'var(--accent-primary)', 
              color: 'white', 
              fontWeight: '600', 
              textDecoration: 'none',
              boxShadow: '0 8px 20px var(--accent-glow)',
              transition: 'transform 0.2s'
            }}>
              {isLoggedIn ? 'Resume Coding' : 'Start Coding Now'}
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div style={{ borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--fg-primary)' }}>50+</div>
            <div style={{ fontSize: '14px', color: 'var(--fg-secondary)', fontWeight: '500' }}>Challenges</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--fg-primary)' }}>200+</div>
            <div style={{ fontSize: '14px', color: 'var(--fg-secondary)', fontWeight: '500' }}>Active Developers</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--fg-primary)' }}>1.5k</div>
            <div style={{ fontSize: '14px', color: 'var(--fg-secondary)', fontWeight: '500' }}>Submissions</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '40px', textAlign: 'left' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Platform Features</h2>
          <p style={{ color: 'var(--fg-secondary)' }}>Everything you need to excel.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <Card className="hover-scale">
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(0,122,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px', color: '#007AFF' }}>🧩</div>
            <h3 style={{ marginBottom: '12px', fontSize: '20px' }}>Curated Problems</h3>
            <p style={{ fontSize: '15px', color: 'var(--fg-secondary)', lineHeight: '1.6' }}>
              Hand-picked challenges ranging from Arrays to Dynamic Programming, designed to mimic real interview questions.
            </p>
          </Card>
          
          <Card className="hover-scale">
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(52,199,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px', color: '#34C759' }}>📈</div>
            <h3 style={{ marginBottom: '12px', fontSize: '20px' }}>Global Leaderboard</h3>
            <p style={{ fontSize: '15px', color: 'var(--fg-secondary)', lineHeight: '1.6' }}>
              Compete with your peers in real-time. Every submission updates your rank instantly on the global stage.
            </p>
          </Card>
          
          <Card className="hover-scale">
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,149,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px', color: '#FF9500' }}>⚡</div>
            <h3 style={{ marginBottom: '12px', fontSize: '20px' }}>Instant Feedback</h3>
            <p style={{ fontSize: '15px', color: 'var(--fg-secondary)', lineHeight: '1.6' }}>
              Get immediate results on your code. Our admins review submissions for quality and optimization.
            </p>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--glass-border)', padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: 'var(--fg-secondary)' }}>
          © 2026 Algorithm Arena. Built for GDG On Campus • SOA ITER.
        </p>
      </footer>

    </div>
  );
};

export default Home;