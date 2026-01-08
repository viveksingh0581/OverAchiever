import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import NoteCard from '../components/NoteCard';

export default function CollectionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', isPublic: false });

  useEffect(() => {
    api.get(`/collections/${id}`)
      .then(res => {
        setCollection(res.data.collection);
        setForm({
          name: res.data.collection.name,
          description: res.data.collection.description || '',
          isPublic: res.data.collection.isPublic
        });
      })
      .catch(() => setCollection(null))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = user && collection?.owner?._id === user._id;

  const handleUpdate = async () => {
    try {
      const res = await api.put(`/collections/${id}`, form);
      setCollection(res.data.collection);
      setEditing(false);
    } catch (err) {
      alert('Failed to update');
    }
  };

  const handleRemoveNote = async (noteId) => {
    try {
      await api.delete(`/collections/${id}/notes/${noteId}`);
      setCollection({
        ...collection,
        notes: collection.notes.filter(n => n._id !== noteId)
      });
    } catch (err) {
      alert('Failed to remove note');
    }
  };

  if (loading) return <div className="loading">LOADING QUEST...</div>;
  if (!collection) return (
    <div className="container" style={{ paddingTop: '40px', textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔒</div>
      <h2 style={{ fontFamily: 'Orbitron, sans-serif' }}>QUEST NOT FOUND</h2>
      <p style={{ color: 'var(--text-secondary)' }}>This quest doesn't exist or you don't have access.</p>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      {/* Quest Header */}
      <div className="card" style={{ 
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), var(--bg-card))',
        padding: '32px'
      }}>
        {editing ? (
          <>
            <div className="form-group">
              <label>QUEST NAME</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>DESCRIPTION</label>
              <textarea rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                <input 
                  type="checkbox" 
                  checked={form.isPublic} 
                  onChange={e => setForm({...form, isPublic: e.target.checked})}
                  style={{ width: '18px', height: '18px', accentColor: '#a855f7' }}
                />
                🌐 Public quest
              </label>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleUpdate} className="btn btn-primary">SAVE</button>
              <button onClick={() => setEditing(false)} className="btn btn-secondary">CANCEL</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#06b6d4',
                  fontFamily: 'Orbitron, sans-serif',
                  letterSpacing: '2px',
                  marginBottom: '8px'
                }}>
                  ⚔️ QUEST
                </div>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700',
                  fontFamily: 'Orbitron, sans-serif'
                }}>
                  {collection.name}
                </h1>
              </div>
              <span style={{ 
                fontSize: '12px', 
                color: collection.isPublic ? '#10b981' : 'var(--text-secondary)',
                fontFamily: 'Orbitron, sans-serif',
                padding: '6px 14px',
                background: collection.isPublic ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                borderRadius: '6px'
              }}>
                {collection.isPublic ? '🌐 PUBLIC' : '🔒 PRIVATE'}
              </span>
            </div>
            
            {collection.description && (
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '16px' }}>
                {collection.description}
              </p>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                Created by <Link to={`/profile/${collection.owner?._id}`} style={{ fontWeight: '600' }}>
                  {collection.owner?.name}
                </Link> • <span style={{ color: '#a855f7' }}>{collection.notes?.length || 0} items</span>
              </span>
              {isOwner && (
                <button onClick={() => setEditing(true)} className="btn btn-secondary">
                  ✏️ EDIT QUEST
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Quest Items */}
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: '700',
        fontFamily: 'Orbitron, sans-serif',
        marginBottom: '24px'
      }}>
        📦 QUEST ITEMS
      </h2>
      
      {collection.notes?.length > 0 ? (
        <div className="grid grid-3">
          {collection.notes.map(note => (
            <div key={note._id} style={{ position: 'relative' }}>
              <NoteCard note={note} />
              {isOwner && (
                <button
                  onClick={() => handleRemoveNote(note._id)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '700',
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
                    zIndex: 10
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <p style={{ color: 'var(--text-secondary)' }}>No items in this quest yet.</p>
          {isOwner && (
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Browse notes and click "Add to Collection" to add them here.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
