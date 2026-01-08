import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import NoteCard from '../components/NoteCard';

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '' });

  const isOwnProfile = !id || id === currentUser?._id;
  const userId = id || currentUser?._id;

  const getLevel = (points) => {
    if (points >= 1000) return { level: 'LEGEND', color: '#ffd700' };
    if (points >= 500) return { level: 'MASTER', color: '#a855f7' };
    if (points >= 200) return { level: 'PRO', color: '#3b82f6' };
    if (points >= 50) return { level: 'ROOKIE', color: '#10b981' };
    return { level: 'NOOB', color: '#6b7280' };
  };

  useEffect(() => {
    if (!userId) return;
    api.get(`/users/${userId}`)
      .then(res => {
        setProfile(res.data.user);
        setNotes(res.data.notes);
        setForm({ name: res.data.user.name, bio: res.data.user.bio || '' });
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSave = async () => {
    try {
      const res = await api.put('/users/profile', form);
      setProfile(res.data.user);
      updateUser(res.data.user);
      setEditing(false);
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  if (loading) return <div className="loading">LOADING PROFILE...</div>;
  if (!profile) return <div className="container" style={{ paddingTop: '40px' }}>Player not found</div>;

  const levelInfo = getLevel(profile.points);

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      {/* Profile Header */}
      <div className="card" style={{ 
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), var(--bg-card))',
        padding: '40px'
      }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'start', flexWrap: 'wrap' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            background: `linear-gradient(135deg, ${levelInfo.color}, #ec4899)`,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '48px', 
            fontWeight: '900',
            boxShadow: `0 0 40px ${levelInfo.color}50`
          }}>
            {profile.name?.[0]?.toUpperCase()}
          </div>
          
          <div style={{ flex: 1, minWidth: '280px' }}>
            {editing ? (
              <>
                <div className="form-group">
                  <label>PLAYER NAME</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>BIO</label>
                  <textarea rows={3} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Tell us about yourself..." />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={handleSave} className="btn btn-primary">SAVE</button>
                  <button onClick={() => setEditing(false)} className="btn btn-secondary">CANCEL</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                  <h1 style={{ 
                    fontSize: '32px', 
                    fontWeight: '700',
                    fontFamily: 'Orbitron, sans-serif'
                  }}>
                    {profile.name}
                  </h1>
                  <span style={{ 
                    background: levelInfo.color,
                    color: '#000',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    {levelInfo.level}
                  </span>
                </div>
                
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '16px' }}>
                  {profile.bio || 'No bio yet'}
                </p>
                
                {/* Stats */}
                <div style={{ display: 'flex', gap: '32px' }}>
                  <div>
                    <div style={{ 
                      fontSize: '28px', 
                      fontWeight: '900',
                      fontFamily: 'Orbitron, sans-serif',
                      color: '#fbbf24'
                    }}>
                      {profile.points}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'Orbitron' }}>XP</div>
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: '28px', 
                      fontWeight: '900',
                      fontFamily: 'Orbitron, sans-serif',
                      color: '#a855f7'
                    }}>
                      {notes.length}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'Orbitron' }}>NOTES</div>
                  </div>
                </div>
                
                {isOwnProfile && (
                  <button onClick={() => setEditing(true)} className="btn btn-secondary" style={{ marginTop: '20px' }}>
                    ✏️ EDIT PROFILE
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: '700',
        fontFamily: 'Orbitron, sans-serif',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        📚 {isOwnProfile ? 'MY LOOT' : `${profile.name}'S LOOT`}
      </h2>
      
      {notes.length > 0 ? (
        <div className="grid grid-3">
          {notes.map(note => <NoteCard key={note._id} note={note} />)}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎒</div>
          <p style={{ color: 'var(--text-secondary)' }}>No public loot yet.</p>
        </div>
      )}
    </div>
  );
}
