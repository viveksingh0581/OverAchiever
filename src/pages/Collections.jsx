import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', isPublic: false });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = () => {
    api.get('/collections/my')
      .then(res => setCollections(res.data.collections))
      .finally(() => setLoading(false));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/collections', form);
      setForm({ name: '', description: '', isPublic: false });
      setShowForm(false);
      fetchCollections();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create quest');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this quest?')) return;
    try {
      await api.delete(`/collections/${id}`);
      setCollections(collections.filter(c => c._id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (loading) return <div className="loading">LOADING QUESTS...</div>;

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '700',
            fontFamily: 'Orbitron, sans-serif',
            marginBottom: '8px'
          }}>
            📚 MY QUESTS
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Organize your loot into collections</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? '✕ CANCEL' : '+ NEW QUEST'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card" style={{ marginBottom: '32px', padding: '32px' }}>
          <h3 style={{ 
            fontFamily: 'Orbitron, sans-serif', 
            fontSize: '18px', 
            marginBottom: '24px',
            color: '#06b6d4'
          }}>
            ⚔️ CREATE NEW QUEST
          </h3>
          <div className="form-group">
            <label>QUEST NAME</label>
            <input 
              type="text" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              placeholder="e.g. Math Exam Prep"
              required 
            />
          </div>
          <div className="form-group">
            <label>DESCRIPTION (optional)</label>
            <textarea 
              rows={2} 
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              placeholder="What's this quest about?"
            />
          </div>
          <div className="form-group">
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}>
              <input 
                type="checkbox" 
                checked={form.isPublic} 
                onChange={e => setForm({...form, isPublic: e.target.checked})}
                style={{ width: '18px', height: '18px', accentColor: '#a855f7' }}
              />
              🌐 Make this quest public
            </label>
          </div>
          <button type="submit" className="btn btn-primary">🚀 CREATE QUEST</button>
        </form>
      )}

      {collections.length > 0 ? (
        <div className="grid grid-2">
          {collections.map(collection => (
            <div key={collection._id} className="card" style={{ 
              background: collection.isPublic 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), var(--bg-card))'
                : 'var(--bg-card)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <Link to={`/collections/${collection._id}`}>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: '700',
                    fontFamily: 'Rajdhani, sans-serif'
                  }}>
                    {collection.name}
                  </h3>
                </Link>
                <span style={{ 
                  fontSize: '11px', 
                  color: collection.isPublic ? '#10b981' : 'var(--text-secondary)',
                  fontFamily: 'Orbitron, sans-serif',
                  padding: '4px 10px',
                  background: collection.isPublic ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                  borderRadius: '4px'
                }}>
                  {collection.isPublic ? '🌐 PUBLIC' : '🔒 PRIVATE'}
                </span>
              </div>
              
              {collection.description && (
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>
                  {collection.description}
                </p>
              )}
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: '1px solid rgba(168, 85, 247, 0.2)'
              }}>
                <span style={{ 
                  color: '#a855f7', 
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '14px'
                }}>
                  📄 {collection.notes?.length || 0} ITEMS
                </span>
                <button 
                  onClick={() => handleDelete(collection._id)} 
                  className="btn btn-danger" 
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  🗑️ DELETE
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '80px 40px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚔️</div>
          <h3 style={{ 
            fontFamily: 'Orbitron, sans-serif', 
            fontSize: '20px', 
            marginBottom: '12px' 
          }}>
            NO QUESTS YET
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Create a quest to organize your notes into collections!
          </p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            CREATE YOUR FIRST QUEST
          </button>
        </div>
      )}
    </div>
  );
}
