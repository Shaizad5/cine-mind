import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, Film, X } from 'lucide-react';
import { searchMovies } from '../api';

export const Navbar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await searchMovies(value);
        setSuggestions(res.data.results?.slice(0, 6) || []);
        setShowSuggestions(true);
      } catch { setSuggestions([]); }
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      setSearchOpen(false);
    }
  };

  const selectMovie = (id) => {
    navigate(`/movie/${id}`);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSearchOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong" data-testid="navbar">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" data-testid="nav-logo">
            <Film className="w-7 h-7 text-primary transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-serif text-xl font-bold tracking-tight">
              Cine<span className="text-primary">Mind</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="nav-home">
              Discover
            </Link>
            <Link to="/mood" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200" data-testid="nav-mood">
              <Sparkles className="w-4 h-4" />
              Mood Match
            </Link>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3" ref={searchRef}>
            <div className={`${searchOpen ? 'w-72' : 'w-0 md:w-72'} transition-all duration-300 overflow-hidden relative`}>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search movies..."
                  className="w-full bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary h-9 px-4 pr-9 rounded-full text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground"
                  data-testid="search-input"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2" data-testid="search-submit-btn">
                  <Search className="w-4 h-4 text-muted-foreground" />
                </button>
              </form>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full glass-strong rounded-lg overflow-hidden shadow-xl" data-testid="search-suggestions">
                  {suggestions.map((m) => (
                    <button
                      key={m.tmdb_id}
                      onClick={() => selectMovie(m.tmdb_id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors duration-150 text-left"
                      data-testid={`suggestion-${m.tmdb_id}`}
                    >
                      {m.poster_url ? (
                        <img src={m.poster_url} alt="" className="w-8 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-8 h-12 bg-muted rounded flex items-center justify-center">
                          <Film className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{m.title}</p>
                        <p className="text-xs text-muted-foreground">{m.release_date?.slice(0, 4)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 rounded-full hover:bg-white/5 transition-colors duration-200"
              data-testid="mobile-search-toggle"
            >
              {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            {/* Mobile mood link */}
            <Link to="/mood" className="md:hidden p-2 rounded-full hover:bg-white/5 transition-colors duration-200" data-testid="mobile-mood-link">
              <Sparkles className="w-5 h-5 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
