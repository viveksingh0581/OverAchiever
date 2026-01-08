import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';

export default function NoteDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [note, setNote] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [showCollections, setShowCollections] = useState(false);

  useEffect(() => {
    Promise.all([api.get(`/notes/${id}`), api.get(`/reviews/${id}`)])
      .then(([noteRes, reviewsRes]) => {
        setNote(noteRes.data.note);
        setReviews(reviewsRes.data.reviews);
      }).finally(() => setLoading(false));
    if (user) api.get('/collections/my').then(res => setCollections(res.data.collections));
  }, [id, user]);

  const handleDownload = async () => {
    await api.post(`/notes/${id}/download`);
    window.open(note.fileUrl, '_blank');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating) return;
    try {
      const res = await api.post(`/reviews/${id}`, reviewForm);
      setReviews([res.data.review, ...reviews]);
      setReviewForm({ rating: 0, comment: '' });
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleAddToCollection = async (collectionId) => {
    try {
      await api.post(`/collections/${collectionId}/notes/${id}`);
      alert('Added to quest!');
      setShowCollections(false);
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleFavorite = async () => {
    try { await api.post(`/users/favorites/${id}`); alert('Saved!'); }
    catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <div className="loading">LOADING LOOT...</div>;
  if (!note) return <div className="container" style={{ paddingTop: '40px' }}>Loot not found</div>;

  const getRarity = (rating) => {
    if (rating >= 4.5) return { label: 'LEGENDARY', color: '#ffd700' };
    if (rating >= 4) return { label: 'EPIC', color: '#a855f7' };
    if (rating >= 3) return { label: 'RARE', color: '#3b82f6' };
    return { label: 'COMMON', color: '#6b7280' };
  };
  const rarity = getRarity(note.averageRating || 0);

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div className="card" style={{ marginBottom: '24px', padding: '32px', borderColor: rarity.color }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span className="tag">{note.subject}</span>
            <span className="tag">{note.topic}</span>
          </div>
          <span style={{ background: rarity.color, color: '#000', padding: '6px 14px', borderRadius: '6px', fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: '700' }}>
            {rarity.label}
          </span>
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: '700', fontFamily: 'Orbitron, sans-serif', marginBottom: '16px' }}>{note.title}</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div className="stars" style={{ fontSize: '20px' }}>
            {'★'.repeat(Math.round(note.averageRating))}{'☆'.repeat(5 - Math.round(note.averageRating))}
            <span style={{ marginLeft: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              {note.averageRating?.toFixed(1)} ({note.totalReviews} reviews)
            </span>
          </div>
          <span style={{ color: '#10b981', fontFamily: 'Orbitron', fontSize: '14px' }}>📥 {note.downloads}</span>
          <span style={{ color: '#06b6d4', fontFamily: 'Orbitron', fontSize: '14px' }}>👁 {note.views}</span>
        </div>

        <p style={{ marginBottom: '24px', lineHeight: '1.8', color: 'var(--text-secondary)', fontSize: '16px' }}>{note.description}</p>
        {note.tags?.length > 0 && <div style={{ marginBottom: '24px' }}>{note.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div>}

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={handleDownload} className="btn btn-primary">📥 DOWNLOAD</button>
          {user && (
            <>
              <button onClick={handleFavorite} className="btn btn-secondary">💾 SAVE</button>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowCollections(!showCollections)} className="btn btn-secondary">📚 ADD TO QUEST</button>
                {showCollections && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, background: 'var(--bg-card)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '10px', padding: '8px', minWidth: '220px', zIndex: 10, marginTop: '8px' }}>
                    {collections.length > 0 ? collections.map(c => (
                      <div key={c._id} onClick={() => handleAddToCollection(c._id)} style={{ padding: '12px', cursor: 'pointer', borderRadius: '6px', transition: 'all 0.2s' }} onMouseOver={e => e.target.style.background = 'rgba(168, 85, 247, 0.2)'} onMouseOut={e => e.target.style.background = 'transparent'}>
                        {c.name}
                      </div>
                    )) : <p style={{ padding: '12px', color: 'var(--text-secondary)' }}>No quests yet</p>}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(168, 85, 247, 0.2)' }}>
          <Link to={`/profile/${note.author?._id}`} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700' }}>
              {note.author?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '16px' }}>{note.author?.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{note.author?.bio || 'Student'}</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'Orbitron, sans-serif', marginBottom: '24px' }}>⭐ REVIEWS</h2>
        
        {user && (
          <form onSubmit={handleReview} style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid rgba(168, 85, 247, 0.2)' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#06b6d4', fontFamily: 'Orbitron', fontSize: '12px', letterSpacing: '1px' }}>YOUR RATING</label>
              <StarRating rating={reviewForm.rating} onRate={r => setReviewForm({...reviewForm, rating: r})} />
            </div>
            <textarea
              placeholder="Share your thoughts..."
              value={reviewForm.comment}
              onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
              rows={3}
              style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.3)', border: '2px solid rgba(168, 85, 247, 0.3)', borderRadius: '10px', color: 'white', marginBottom: '16px', fontSize: '15px' }}
            />
            <button type="submit" className="btn btn-primary" disabled={!reviewForm.rating}>SUBMIT REVIEW</button>
          </form>
        )}

        {reviews.length > 0 ? reviews.map(review => (
          <div key={review._id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(168, 85, 247, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700' }}>
                  {review.user?.name?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontWeight: '600' }}>{review.user?.name}</span>
              </div>
              <span className="stars" style={{ fontSize: '16px' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
            </div>
            {review.comment && <p style={{ color: 'var(--text-secondary)', paddingLeft: '48px' }}>{review.comment}</p>}
          </div>
        )) : <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>No reviews yet. Be the first!</p>}
      </div>
    </div>
  );
}
