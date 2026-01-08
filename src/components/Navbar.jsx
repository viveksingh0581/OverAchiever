import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getLevel = (points) => {
    if (points >= 1000) return { level: 'LEGEND', color: '#ffd700' };
    if (points >= 500) return { level: 'MASTER', color: '#a855f7' };
    if (points >= 200) return { level: 'PRO', color: '#3b82f6' };
    if (points >= 50) return { level: 'ROOKIE', color: '#10b981' };
    return { level: 'NOOB', color: '#6b7280' };
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'rgba(10, 10, 15, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
      boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)',
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '70px'
      }}>
        <Link to="/" style={{ 
          fontSize: '24px', 
          fontWeight: '900', 
          fontFamily: 'Orbitron, sans-serif',
          background: 'linear-gradient(135deg, #a855f7, #ec4899, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '28px' }}>🎮</span>
          STUDYQUEST
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/search" style={{ fontWeight: '600', letterSpacing: '1px' }}>🔍 EXPLORE</Link>
          {user ? (
            <>
              <Link to="/upload" style={{ fontWeight: '600', letterSpacing: '1px' }}>📤 UPLOAD</Link>
              <Link to="/collections" style={{ fontWeight: '600', letterSpacing: '1px' }}>📚 QUESTS</Link>
              <Link to="/dashboard" style={{ fontWeight: '600', letterSpacing: '1px' }}>🏠 HQ</Link>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="xp-badge">⚡ {user.points} XP</span>
                <span className="level-badge" style={{ background: getLevel(user.points).color }}>
                  {getLevel(user.points).level}
                </span>
              </div>
              
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px' }}>
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontWeight: '600' }}>LOGIN</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '10px 20px' }}>
                JOIN NOW
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
