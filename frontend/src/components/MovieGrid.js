import React from 'react';
import MovieCard from './MovieCard';

export const MovieGrid = ({ movies = [], title, subtitle, size = 'default' }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="mb-12" data-testid={`movie-grid-${title?.toLowerCase().replace(/\s+/g, '-') || 'default'}`}>
      {title && (
        <div className="mb-6">
          <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {movies.map((movie, i) => (
          <MovieCard key={movie?.tmdb_id || movie?.tmdb?.tmdb_id || i} movie={movie} index={i} size={size} />
        ))}
      </div>
    </section>
  );
};

export const MovieRow = ({ movies = [], title, subtitle, size = 'default' }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="mb-12" data-testid={`movie-row-${title?.toLowerCase().replace(/\s+/g, '-') || 'default'}`}>
      {title && (
        <div className="mb-5">
          <h2 className="font-serif text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="horizontal-scroll flex gap-4 md:gap-5 pb-4">
        {movies.map((movie, i) => (
          <MovieCard key={movie?.tmdb_id || movie?.tmdb?.tmdb_id || i} movie={movie} index={i} size={size} />
        ))}
      </div>
    </section>
  );
};

export default MovieGrid;
