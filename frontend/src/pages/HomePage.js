import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, Award, Clock, Calendar, Sparkles, ChevronRight } from 'lucide-react';
import { getHome, getGenres, discoverByGenre } from '../api';
import { MovieRow } from '../components/MovieGrid';
import MovieGrid from '../components/MovieGrid';
import { MovieCardSkeleton } from '../components/Skeleton';

const CATEGORIES = [
  { key: 'trending', label: 'Trending', icon: TrendingUp },
  { key: 'popular', label: 'Popular', icon: Flame },
  { key: 'top_rated', label: 'Top Rated', icon: Award },
  { key: 'now_playing', label: 'Now Playing', icon: Clock },
  { key: 'upcoming', label: 'Upcoming', icon: Calendar },
];

const getSessionId = () => {
  let id = localStorage.getItem('cinemind_session');
  if (!id) {
    id = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('cinemind_session', id);
  }
  return id;
};

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('trending');
  const [movies, setMovies] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [genreMovies, setGenreMovies] = useState({});
  const [loading, setLoading] = useState(true);
  const [trendingMovies, setTrendingMovies] = useState([]);

  // Init session
  useEffect(() => { getSessionId(); }, []);

  const fetchMovies = useCallback(async (category) => {
    setLoading(true);
    try {
      const res = await getHome(category);
      const results = res.data.results || [];
      setMovies(results);
      if (category === 'trending' && results.length > 0) {
        setHeroMovie(results[0]);
        setTrendingMovies(results.slice(0, 10));
      }
    } catch (err) {
      console.error('Failed to fetch movies:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMovies(activeCategory);
  }, [activeCategory, fetchMovies]);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const res = await getGenres();
        const genreList = res.data || [];
        setGenres(genreList.slice(0, 6));
        // Load movies for first 3 genres
        for (const genre of genreList.slice(0, 3)) {
          try {
            const gRes = await discoverByGenre(genre.id);
            setGenreMovies(prev => ({ ...prev, [genre.id]: gRes.data.results || [] }));
          } catch {}
        }
      } catch {}
    };
    loadGenres();
  }, []);

  return (
    <div className="pt-16" data-testid="home-page">
      {/* Hero Section */}
      {heroMovie && (
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden" data-testid="hero-section">
          <div className="absolute inset-0">
            {heroMovie.backdrop_url ? (
              <img
                src={heroMovie.backdrop_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-card to-background" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
          </div>

          <div className="relative h-full max-w-[1440px] mx-auto px-6 lg:px-12 flex items-end pb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-primary/20 text-primary mb-4">
                Trending Now
              </span>
              <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-4">
                {heroMovie.title}
              </h1>
              {heroMovie.overview && (
                <p className="text-base text-white/70 leading-relaxed mb-6 line-clamp-3">
                  {heroMovie.overview}
                </p>
              )}
              <div className="flex items-center gap-4">
                <Link
                  to={`/movie/${heroMovie.tmdb_id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 glow-primary transition-all duration-300"
                  data-testid="hero-details-btn"
                >
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/mood"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white font-semibold text-sm hover:bg-white/5 transition-all duration-300"
                  data-testid="hero-mood-btn"
                >
                  <Sparkles className="w-4 h-4 text-secondary" />
                  Mood Match
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        {/* Mood Matcher Teaser */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Link to="/mood" className="block" data-testid="mood-teaser">
            <div className="relative overflow-hidden rounded-2xl p-8 md:p-12 glass group hover:border-secondary/30 transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-secondary/20 text-secondary mb-3">
                    AI-Powered
                  </span>
                  <h2 className="font-serif text-2xl md:text-4xl font-bold tracking-tight mb-2">
                    Mood Matcher
                  </h2>
                  <p className="text-muted-foreground max-w-md">
                    Tell us how you feel, and our AI will curate the perfect movie list for your mood.
                  </p>
                </div>
                <Sparkles className="w-16 h-16 text-secondary/30 group-hover:text-secondary/60 transition-colors duration-500 hidden md:block" />
              </div>
            </div>
          </Link>
        </motion.section>

        {/* Trending Row */}
        {trendingMovies.length > 0 && (
          <MovieRow movies={trendingMovies} title="Trending Today" subtitle="What the world is watching right now" />
        )}

        {/* Category Tabs */}
        <section className="mb-8" data-testid="category-tabs">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 horizontal-scroll">
            {CATEGORIES.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeCategory === key
                    ? 'bg-primary text-white glow-primary'
                    : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
                }`}
                data-testid={`category-${key}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Main Grid */}
        {loading ? (
          <MovieCardSkeleton count={12} />
        ) : (
          <MovieGrid movies={movies} title={CATEGORIES.find(c => c.key === activeCategory)?.label || 'Movies'} />
        )}

        {/* Genre Sections */}
        {genres.slice(0, 3).map((genre) => (
          genreMovies[genre.id] && genreMovies[genre.id].length > 0 && (
            <MovieRow
              key={genre.id}
              movies={genreMovies[genre.id]}
              title={genre.name}
              subtitle={`Discover ${genre.name.toLowerCase()} movies from around the world`}
            />
          )
        ))}

        {/* Genre Tags */}
        {genres.length > 0 && (
          <section className="mb-12" data-testid="genre-tags">
            <h2 className="font-serif text-xl font-bold tracking-tight mb-4">Browse by Genre</h2>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={async () => {
                    try {
                      const res = await discoverByGenre(genre.id);
                      setMovies(res.data.results || []);
                      setActiveCategory('');
                    } catch {}
                  }}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-white/5 text-muted-foreground hover:bg-secondary/20 hover:text-secondary transition-all duration-300 border border-white/5 hover:border-secondary/30"
                  data-testid={`genre-tag-${genre.id}`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
