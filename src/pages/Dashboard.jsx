import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import NoteCard from '../components/NoteCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [myNotes, setMyNotes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState('notes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/users/${user._id}`),
      api.get('/users/favorites/list'),
      api.get('/users/leaderboard/top')
    ]).then(([notesRes, favRes, leaderRes]) => {
      setMyNotes(notesRes.data.notes);
      setFavorites(favRes.data.favorites);
      setLeaderboard(leaderRes.data.users);
    }).finally(() => setLoading(false));
  }, [user._id]);

  const getLevel = (points) => {
    if (points >= 1000) return { level: 'LEGEND', color: '#ffd700', next: null };
    if (points >= 500) return { level: 'MASTER', color: '#a855f7', next: 1000 };
    if (points >= 200) return { level: 'PRO', color: '#3b82f6', next: 500 };
    if (points >= 50) return { level: 'ROOKIE', color: '#10b981', next: 200 };
    return { level: 'NOOB', color: '#6b7280', next: 50 };
  };

  const levelInfo = getLevel(user.points);
  const progress = levelInfo.next ? ((user.points % (levelInfo.next - (levelInfo.next === 50 ? 0 : getLevel(user.points - 1).next || 0))) / (levelInfo.next - (user.points >= 50 ? getLevel(user.points - 1).next || 0 : 0))) * 100 : 100;

  if (loading) return <div className="loading">LOADING HQ...</div>;

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      {/* Player Stats Header */}
      <div className="card" style={{ 
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.1), var(--bg-card))',
        padding: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${levelInfo.color}, #ec4899)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: '900',
              boxShadow: `0 0 30px ${levelInfo.color}50`
            }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: '700',
                fontFamily: 'Orbitron, sans-serif',
                marginBottom: '4px'
              }}>
                {user.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  background: levelInfo.color,
                  color: '#000',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>
                  {levelInfo.level}
                </span>
                <span className="xp-badge">⚡ {user.points} XP</span>
              </div>
            </div>
          </div>
          
          <Link to="/upload" className="btn btn-primary" style={{ padding: '14px 28px' }}>
            📤 DROP NEW LOOT
          </Link>
        </div>

        {/* XP Progress Bar */}
        {levelInfo.next && (
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Progress to next level</span>
              <span style={{ color: levelInfo.color, fontFamily: 'Orbitron, sans-serif' }}>
                {user.points} / {levelInfo.next} XP
              </span>
            </div>
            <div style={{ 
              height: '8px', 
              background: 'rgba(0,0,0,0.4)', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${Math.min((user.points / levelInfo.next) * 100, 100)}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${levelInfo.color}, #ec4899)`,
                borderRadius: '4px',
                boxShadow: `0 0 10px ${levelInfo.color}`,
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
        {/* Main Content */}
        <div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            {[
              { id: 'notes', icon: '📚', label: 'MY LOOT', count: myNotes.length },
              { id: 'favorites', icon: '💾', label: 'SAVED', count: favorites.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '14px 24px',
                  border: activeTab === tab.id ? 'none' : '2px solid rgba(168, 85, 247, 0.3)',
                  background: activeTab === tab.id 
                    ? 'linear-gradient(135deg, #a855f7, #ec4899)' 
                    : 'transparent',
                  color: 'white',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s',
                  boxShadow: activeTab === tab.id ? '0 0 20px rgba(168, 85, 247, 0.5)' : 'none'
                }}
              >
                {tab.icon} {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'notes' ? (
            myNotes.length > 0 ? (
              <div className="grid grid-2">
                {myNotes.map(note => <NoteCard key={note._id} note={note} />)}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎒</div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Your inventory is empty. Time to drop some loot!
                </p>
                <Link to="/upload" className="btn btn-primary">UPLOAD FIRST NOTE</Link>
              </div>
            )
          ) : (
            favorites.length > 0 ? (
              <div className="grid grid-2">
                {favorites.map(note => <NoteCard key={note._id} note={note} />)}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💾</div>
                <p style={{ color: 'var(--text-secondary)' }}>
                  No saved items yet. Explore and save your favorites!
                </p>
              </div>
            )
          )}
        </div>

        {/* Leaderboard Sidebar */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '700',
            fontFamily: 'Orbitron, sans-serif',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🏆 LEADERBOARD
          </h3>
          
          {leaderboard.slice(0, 10).map((u, i) => (
            <div 
              key={u._id} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '12px',
                background: u._id === user._id ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                borderRadius: '8px',
                marginBottom: '4px'
              }}
            >
              <span style={{ 
                width: '28px', 
                fontWeight: '700',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '14px',
                color: i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : 'var(--text-secondary)'
              }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
              </span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${getLevel(u.points).color}, #ec4899)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                {u.name?.[0]?.toUpperCase()}
              </div>
              <span style={{ flex: 1, fontWeight: '500' }}>{u.name}</span>
              <span style={{ 
                color: '#fbbf24', 
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                {u.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
