import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '440px', paddingTop: '60px' }}>
      <div className="card" style={{ 
        padding: '40px',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), var(--bg-card))'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎮</div>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700',
            fontFamily: 'Orbitron, sans-serif',
            marginBottom: '8px'
          }}>
            WELCOME BACK
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Continue your quest</p>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
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
              placeholder="••••••••"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '16px', marginTop: '8px' }} 
            disabled={loading}
          >
            {loading ? '⏳ AUTHENTICATING...' : '🚀 ENTER THE ARENA'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)' }}>
          New player? <Link to="/register" style={{ fontWeight: '600' }}>Create Account</Link>
        </p>
      </div>
    </div>
  );
}
