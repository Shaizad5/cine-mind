import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { searchMovies, getGenres, discoverByGenre } from '../api';
import MovieGrid from '../components/MovieGrid';
import { MovieCardSkeleton } from '../components/Skeleton';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);

  useEffect(() => {
    getGenres().then(res => setGenres(res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setActiveGenre(null);
    try {
      const res = await searchMovies(q);
      setResults(res.data.results || []);
      setTotalResults(res.data.total_results || 0);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      performSearch(query.trim());
    }
  };

  const handleGenreFilter = async (genre) => {
    setActiveGenre(genre.id);
    setLoading(true);
    try {
      const res = await discoverByGenre(genre.id);
      setResults(res.data.results || []);
      setTotalResults(res.data.results?.length || 0);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="pt-16 min-h-screen" data-testid="search-page">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        {/* Search Header */}
        <div className="mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-6">
            {initialQuery ? `Results for "${initialQuery}"` : 'Search Movies'}
          </h1>

          <form onSubmit={handleSubmit} className="relative max-w-2xl" data-testid="search-form">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for any movie worldwide..."
              className="w-full bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary h-14 pl-12 pr-4 rounded-xl text-base outline-none transition-colors duration-200"
              data-testid="search-page-input"
            />
          </form>
        </div>

        {/* Genre Filters */}
        {genres.length > 0 && (
          <div className="mb-8" data-testid="genre-filters">
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Filter by Genre</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreFilter(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                    activeGenre === genre.id
                      ? 'bg-primary text-white border-primary glow-primary'
                      : 'bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10 hover:text-foreground'
                  }`}
                  data-testid={`search-genre-${genre.id}`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <MovieCardSkeleton count={12} />
        ) : results.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-6">{totalResults} result{totalResults !== 1 ? 's' : ''} found</p>
            <MovieGrid movies={results} />
          </>
        ) : initialQuery ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-serif font-bold mb-2">No results found</h2>
            <p className="text-muted-foreground">Try different keywords or browse by genre above</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-serif font-bold mb-2">Search for movies</h2>
            <p className="text-muted-foreground">Find any movie from worldwide cinema</p>
          </div>
        )}
      </div>
    </div>
  );
}
