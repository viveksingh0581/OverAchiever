import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import NoteCard from '../components/NoteCard';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [subject, setSubject] = useState(searchParams.get('subject') || '');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const search = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (subject) params.set('subject', subject);
      
      const res = await api.get(`/notes/search?${params}`);
      setNotes(res.data.notes);
      setTotal(res.data.total);
      setSearchParams(params);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    search();
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: '700',
          fontFamily: 'Orbitron, sans-serif',
          marginBottom: '8px'
        }}>
          🔍 EXPLORE THE VAULT
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Discover legendary notes from fellow players</p>
      </div>
      
      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '40px', padding: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔎 Search by keyword..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ 
              flex: 2, 
              minWidth: '200px', 
              padding: '16px 20px', 
              background: 'rgba(0,0,0,0.3)',
              border: '2px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px'
            }}
          />
          <input
            type="text"
            placeholder="📚 Filter by subject..."
            value={subject}
            onChange={e => setSubject(e.target.value)}
            style={{ 
              flex: 1, 
              minWidth: '150px', 
              padding: '16px 20px', 
              background: 'rgba(0,0,0,0.3)',
              border: '2px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px'
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '16px 32px' }}>
            SEARCH
          </button>
        </div>
      </form>

      {loading ? (
        <div className="loading">SCANNING VAULT...</div>
      ) : (
        <>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <p style={{ 
              color: 'var(--text-secondary)',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '14px'
            }}>
              <span style={{ color: '#10b981', fontWeight: '700' }}>{total}</span> ITEMS FOUND
            </p>
          </div>
          
          {notes.length > 0 ? (
            <div className="grid grid-3">
              {notes.map(note => <NoteCard key={note._id} note={note} />)}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔮</div>
              <p style={{ color: 'var(--text-secondary)' }}>
                No loot found. Try different keywords or be the first to drop some!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
