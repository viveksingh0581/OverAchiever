import { Link } from 'react-router-dom';

export default function NoteCard({ note }) {
  const getRarityColor = (rating) => {
    if (rating >= 4.5) return { border: '#ffd700', label: 'LEGENDARY', bg: 'rgba(255, 215, 0, 0.1)' };
    if (rating >= 4) return { border: '#a855f7', label: 'EPIC', bg: 'rgba(168, 85, 247, 0.1)' };
    if (rating >= 3) return { border: '#3b82f6', label: 'RARE', bg: 'rgba(59, 130, 246, 0.1)' };
    return { border: '#6b7280', label: 'COMMON', bg: 'rgba(107, 114, 128, 0.1)' };
  };

  const rarity = getRarityColor(note.averageRating || 0);

  return (
    <div className="card" style={{ 
      borderColor: rarity.border,
      background: `linear-gradient(135deg, ${rarity.bg}, var(--bg-card))`
    }}>
      {/* Rarity Badge */}
      <div style={{ 
        position: 'absolute', 
        top: '12px', 
        right: '12px',
        background: rarity.border,
        color: '#000',
        padding: '4px 10px',
        borderRadius: '4px',
        fontSize: '10px',
        fontFamily: 'Orbitron, sans-serif',
        fontWeight: '700'
      }}>
        {rarity.label}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <span className="tag">{note.subject}</span>
        <span style={{ 
          fontSize: '11px', 
          color: '#06b6d4',
          fontFamily: 'Orbitron, sans-serif',
          padding: '4px 8px',
          background: 'rgba(6, 182, 212, 0.1)',
          borderRadius: '4px'
        }}>
          {note.fileType?.toUpperCase()}
        </span>
      </div>
      
      <Link to={`/notes/${note._id}`}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '700',
          marginBottom: '8px',
          color: '#fff',
          fontFamily: 'Rajdhani, sans-serif'
        }}>
          {note.title}
        </h3>
      </Link>
      
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', flex: 1, marginBottom: '16px' }}>
        {note.description?.substring(0, 80)}...
      </p>
      
      {/* Stats Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '12px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '8px',
        marginBottom: '12px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="stars" style={{ fontSize: '16px' }}>
            {'★'.repeat(Math.round(note.averageRating || 0))}
            {'☆'.repeat(5 - Math.round(note.averageRating || 0))}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'Orbitron' }}>
            {note.totalReviews || 0} REVIEWS
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>
            📥 {note.downloads || 0}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'Orbitron' }}>
            DOWNLOADS
          </div>
        </div>
      </div>
      
      {note.author && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(168, 85, 247, 0.2)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '700'
          }}>
            {note.author.name?.[0]?.toUpperCase()}
          </div>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {note.author.name}
          </span>
        </div>
      )}
    </div>
  );
}
