import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Upload() {
  const [form, setForm] = useState({ title: '', description: '', subject: '', topic: '', tags: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();
  const { updateUser, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a file');
    
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    formData.append('file', file);

    try {
      const res = await api.post('/notes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Update user XP in context
      updateUser({ points: (user.points || 0) + 10 });
      navigate(`/notes/${res.data.note._id}`);
    } catch (err) {
      console.error('Upload error:', err.response?.data);
      setError(err.response?.data?.message || JSON.stringify(err.response?.data) || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  return (
    <div className="container" style={{ maxWidth: '700px', paddingTop: '40px', paddingBottom: '60px' }}>
      <div className="card" style={{ padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📤</div>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700',
            fontFamily: 'Orbitron, sans-serif',
            marginBottom: '8px'
          }}>
            DROP YOUR LOOT
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Share knowledge, earn XP</p>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* File Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
            style={{
              border: `2px dashed ${dragOver ? '#a855f7' : 'rgba(168, 85, 247, 0.3)'}`,
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
              marginBottom: '24px',
              cursor: 'pointer',
              background: dragOver ? 'rgba(168, 85, 247, 0.1)' : 'rgba(0,0,0,0.2)',
              transition: 'all 0.3s'
            }}
          >
            <input
              id="file-input"
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={e => setFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
            {file ? (
              <div>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>✅</div>
                <div style={{ color: '#10b981', fontWeight: '600' }}>{file.name}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>📁</div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  Drag & drop or click to select
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '8px' }}>
                  PDF, DOC, DOCX, PNG, JPG (max 10MB)
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>TITLE</label>
            <input 
              type="text" 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})} 
              placeholder="Give your loot a name"
              required 
            />
          </div>
          
          <div className="form-group">
            <label>DESCRIPTION</label>
            <textarea 
              rows={4} 
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              placeholder="What's inside? Help others find it..."
              required 
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>SUBJECT</label>
              <input 
                type="text" 
                value={form.subject} 
                onChange={e => setForm({...form, subject: e.target.value})} 
                placeholder="e.g. Mathematics"
                required 
              />
            </div>
            <div className="form-group">
              <label>TOPIC</label>
              <input 
                type="text" 
                value={form.topic} 
                onChange={e => setForm({...form, topic: e.target.value})} 
                placeholder="e.g. Calculus"
                required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>TAGS (comma separated)</label>
            <input 
              type="text" 
              value={form.tags} 
              onChange={e => setForm({...form, tags: e.target.value})} 
              placeholder="e.g. integration, derivatives, exam prep"
            />
          </div>

          {/* XP Reward Banner */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(249, 115, 22, 0.2))',
            border: '1px solid rgba(251, 191, 36, 0.4)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <span style={{ fontSize: '32px' }}>⚡</span>
            <div>
              <div style={{ fontWeight: '700', color: '#fbbf24', fontFamily: 'Orbitron, sans-serif' }}>
                +10 XP REWARD
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                You'll earn XP when you upload this note!
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '18px' }} 
            disabled={loading}
          >
            {loading ? '⏳ UPLOADING...' : '🚀 DEPLOY LOOT'}
          </button>
        </form>
      </div>
    </div>
  );
}
