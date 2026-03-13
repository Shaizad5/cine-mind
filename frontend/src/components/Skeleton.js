import React from 'react';

export const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${className}`} />
      ))}
    </>
  );
};

export const MovieCardSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
          <div className="skeleton aspect-[2/3] rounded-lg" />
          <div className="skeleton h-4 mt-2 w-3/4 rounded" />
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
