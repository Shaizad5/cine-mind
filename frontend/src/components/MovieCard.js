import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Film } from 'lucide-react';
import { motion } from 'framer-motion';

export const MovieCard = ({ movie, index = 0, size = 'default' }) => {
  const navigate = useNavigate();
  const tmdbId = movie?.tmdb_id || movie?.tmdb?.tmdb_id;
  const title = movie?.title || movie?.tmdb?.title || 'Untitled';
  const poster = movie?.poster_url || movie?.tmdb?.poster_url;
  const rating = movie?.vote_average || movie?.tmdb?.vote_average;
  const year = (movie?.release_date || movie?.tmdb?.release_date || '')?.slice(0, 4);

  if (!tmdbId) return null;

  const sizeClasses = {
    small: 'w-32 md:w-36',
    default: 'w-40 md:w-48',
    large: 'w-48 md:w-56',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.5), duration: 0.4 }}
      className={`${sizeClasses[size]} flex-shrink-0 group cursor-pointer`}
      onClick={() => navigate(`/movie/${tmdbId}`)}
      data-testid={`movie-card-${tmdbId}`}
    >
      <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-card">
        {poster ? (
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Film className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          {rating > 0 && (
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-3 h-3 text-accent fill-accent" />
              <span className="text-xs font-semibold text-accent">{rating.toFixed(1)}</span>
            </div>
          )}
          <p className="text-xs text-white/70">{year}</p>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
        {title}
      </p>
    </motion.div>
  );
};

export default MovieCard;
