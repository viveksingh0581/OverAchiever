import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '440px', paddingTop: '60px' }}>
      <div className="card" style={{ 
        padding: '40px',
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), var(--bg-card))'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚔️</div>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700',
            fontFamily: 'Orbitron, sans-serif',
            marginBottom: '8px'
          }}>
            JOIN THE QUEST
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Create your player profile</p>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>PLAYER NAME</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Choose your name"
              required 
            />
          </div>
          <div className="form-group">
            <label>EMAIL</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="player@email.com"
              required 
            />
          </div>
          <div className="form-group">
            <label>PASSWORD</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Min 6 characters"
              required 
              minLength={6} 
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '16px', marginTop: '8px' }} 
            disabled={loading}
          >
            {loading ? '⏳ CREATING PROFILE...' : '🎮 START YOUR JOURNEY'}
          </button>
        </form>

        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          background: 'rgba(251, 191, 36, 0.1)', 
          borderRadius: '8px',
          border: '1px solid rgba(251, 191, 36, 0.3)'
        }}>
          <div style={{ fontSize: '14px', color: '#fbbf24', fontWeight: '600' }}>
            🎁 STARTER BONUS
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Upload your first note and earn +10 XP instantly!
          </div>
        </div>
        
        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)' }}>
          Already a player? <Link to="/login" style={{ fontWeight: '600' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
