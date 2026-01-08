import { useState } from 'react';

export default function StarRating({ rating, onRate, readonly = false, size = 28 }) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => !readonly && onRate?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{
            cursor: readonly ? 'default' : 'pointer',
            fontSize: `${size}px`,
            color: star <= (hover || rating) ? '#fbbf24' : '#374151',
            textShadow: star <= (hover || rating) ? '0 0 15px rgba(251, 191, 36, 0.8)' : 'none',
            transition: 'all 0.2s ease',
            transform: star <= hover ? 'scale(1.2)' : 'scale(1)'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
