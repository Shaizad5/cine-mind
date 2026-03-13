import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 0, onRate, size = 'md', readonly = false }) => {
  const [hovered, setHovered] = useState(0);
  const stars = [1, 2, 3, 4, 5];
  
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const handleClick = (value) => {
    if (!readonly && onRate) {
      onRate(value === rating ? 0 : value);
    }
  };

  return (
    <div className="flex items-center gap-0.5" data-testid="star-rating">
      {stars.map((value) => {
        const filled = value <= (hovered || rating);
        const half = !filled && value - 0.5 <= (hovered || rating);
        return (
          <button
            key={value}
            onClick={() => handleClick(value)}
            onMouseEnter={() => !readonly && setHovered(value)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-transform duration-150 ${!readonly && 'hover:scale-110 active:scale-95'}`}
            disabled={readonly}
            data-testid={`star-${value}`}
          >
            <Star
              className={`${sizeMap[size]} transition-colors duration-200 ${
                filled ? 'text-accent fill-accent' : half ? 'text-accent fill-accent/50' : 'text-muted-foreground/30'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
