import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  showCountText?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewCount,
  size = 'sm',
  showCountText = true,
}) => {
  const starSize = size === 'sm' ? 14 : 16;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4;

  return (
    <div className="flex items-center gap-1.5" aria-label={`Rating: ${rating} out of 5 stars`}>
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((index) => {
          const isFilled = index <= fullStars;
          const isHalf = !isFilled && index === fullStars + 1 && hasHalfStar;

          return (
            <span key={index} className="relative inline-block">
              <Star
                size={starSize}
                className={`${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : isHalf
                    ? 'text-amber-400 fill-amber-400/40'
                    : 'text-gray-300 fill-gray-100'
                }`}
              />
            </span>
          );
        })}
      </div>

      {showCountText && (
        <span className="text-xs font-medium text-brand-muted">
          <span className="text-brand-charcoal font-semibold">{rating.toFixed(1)}</span>
          {reviewCount !== undefined && <span> ({reviewCount})</span>}
        </span>
      )}
    </div>
  );
};
