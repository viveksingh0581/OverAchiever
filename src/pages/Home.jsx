import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import NoteCard from '../components/NoteCard';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notes/trending')
      .then(res => setTrending(res.data.notes))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section style={{ 
        textAlign: 'center', 
        marginBottom: '80px',
        padding: '60px 20px',
        background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
        borderRadius: '24px'
      }}>
        <div style={{ 
          fontSize: '14px', 
          color: '#06b6d4', 
          fontFamily: 'Orbitron, sans-serif',
          letterSpacing: '4px',
          marginBottom: '16px'
        }}>
          🎮 WELCOME TO THE ARENA
        </div>
        
        <h1 style={{ 
          fontSize: '64px', 
          fontWeight: '900', 
          marginBottom: '20px',
          fontFamily: 'Orbitron, sans-serif',
          background: 'linear-gradient(135deg, #a855f7, #ec4899, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1.1'
        }}>
          STUDYQUEST
        </h1>
        
        <p style={{ 
          fontSize: '22px', 
          color: 'var(--text-secondary)', 
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px'
        }}>
          Level up your knowledge. Share notes. Earn XP. Become a <span style={{ color: '#fbbf24' }}>LEGEND</span>.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/search" className="btn btn-primary" style={{ padding: '18px 36px', fontSize: '16px' }}>
            🔍 START EXPLORING
          </Link>
          <Link to="/register" className="btn btn-secondary" style={{ padding: '18px 36px', fontSize: '16px' }}>
            ⚔️ JOIN THE QUEST
          </Link>
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '60px', 
          marginTop: '60px',
          flexWrap: 'wrap'
        }}>
          {[
            { icon: '📚', value: '1000+', label: 'NOTES' },
            { icon: '👥', value: '500+', label: 'PLAYERS' },
            { icon: '⭐', value: '4.8', label: 'AVG RATING' }
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '900', 
                fontFamily: 'Orbitron, sans-serif',
                color: '#a855f7'
              }}>
                {stat.value}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--text-secondary)',
                fontFamily: 'Orbitron, sans-serif',
                letterSpacing: '2px'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ marginBottom: '80px' }}>
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          marginBottom: '40px',
          fontFamily: 'Orbitron, sans-serif',
          textAlign: 'center',
          color: '#06b6d4'
        }}>
          ⚡ HOW TO PLAY
        </h2>
        
        <div className="grid grid-3">
          {[
            { icon: '📤', title: 'UPLOAD', desc: 'Share your notes and earn +10 XP per upload', color: '#a855f7' },
            { icon: '⭐', title: 'GET RATED', desc: 'Quality notes get rated and boost your rank', color: '#ec4899' },
            { icon: '🏆', title: 'LEVEL UP', desc: 'Climb the leaderboard and become a Legend', color: '#fbbf24' }
          ].map((item, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
              <div style={{ 
                fontSize: '48px', 
                marginBottom: '16px',
                filter: `drop-shadow(0 0 20px ${item.color})`
              }}>
                {item.icon}
              </div>
              <h3 style={{ 
                fontFamily: 'Orbitron, sans-serif', 
                fontSize: '18px',
                marginBottom: '12px',
                color: item.color
              }}>
                {item.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Notes */}
      <section>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '700',
            fontFamily: 'Orbitron, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ color: '#ef4444' }}>🔥</span> TRENDING LOOT
          </h2>
          <Link to="/search" className="btn btn-secondary" style={{ padding: '10px 20px' }}>
            VIEW ALL →
          </Link>
        </div>
        
        {loading ? (
          <div className="loading">LOADING LOOT...</div>
        ) : trending.length > 0 ? (
          <div className="grid grid-3">
            {trending.slice(0, 6).map(note => (
              <NoteCard key={note._id} note={note} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              No loot discovered yet. Be the first explorer!
            </p>
            <Link to="/upload" className="btn btn-primary">DROP YOUR FIRST NOTE</Link>
          </div>
        )}
      </section>
    </div>
  );
}
