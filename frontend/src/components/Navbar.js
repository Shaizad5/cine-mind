import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, Film, X, Bookmark, Globe } from 'lucide-react';
import { searchMovies } from '../api';
import { LangContext } from '../App';
import { SUPPORTED_LANGUAGES, getTranslation } from '../i18n';

export const Navbar = () => {
  const { t, changeLang, lang } = useContext(LangContext);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const langRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
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
    setQuery(''); setSuggestions([]); setShowSuggestions(false); setSearchOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong" data-testid="navbar">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group" data-testid="nav-logo">
            <Film className="w-7 h-7 text-primary transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-serif text-xl font-bold tracking-tight">
              Cine<span className="text-primary">Mind</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200" data-testid="nav-home">
              {t.nav.discover}
            </Link>
            <Link to="/mood" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200" data-testid="nav-mood">
              <Sparkles className="w-4 h-4" />
              {t.nav.moodMatch}
            </Link>
            <Link to="/watchlist" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-accent transition-colors duration-200" data-testid="nav-watchlist">
              <Bookmark className="w-4 h-4" />
              {t.nav.watchlist}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <div className={`${searchOpen ? 'w-64' : 'w-0 md:w-60'} transition-all duration-300 overflow-hidden`}>
                <form onSubmit={handleSubmit}>
                  <input type="text" value={query} onChange={(e) => handleSearch(e.target.value)} placeholder={t.nav.searchPlaceholder}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary h-9 px-4 pr-9 rounded-full text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground"
                    data-testid="search-input" />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2" data-testid="search-submit-btn">
                    <Search className="w-4 h-4 text-muted-foreground" />
                  </button>
                </form>
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full mt-2 w-full glass-strong rounded-lg overflow-hidden shadow-xl z-50" data-testid="search-suggestions">
                    {suggestions.map((m) => (
                      <button key={m.tmdb_id} onClick={() => selectMovie(m.tmdb_id)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors duration-150 text-left"
                        data-testid={`suggestion-${m.tmdb_id}`}>
                        {m.poster_url ? <img src={m.poster_url} alt="" className="w-8 h-12 object-cover rounded" /> :
                          <div className="w-8 h-12 bg-muted rounded flex items-center justify-center"><Film className="w-4 h-4 text-muted-foreground" /></div>}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{m.title}</p>
                          <p className="text-xs text-muted-foreground">{m.release_date?.slice(0, 4)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button onClick={() => setSearchOpen(!searchOpen)} className="md:hidden p-2 rounded-full hover:bg-white/5" data-testid="mobile-search-toggle">
              {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                data-testid="lang-switcher-btn">
                <Globe className="w-3.5 h-3.5" />
                {getTranslation(lang).flag}
              </button>
              {langMenuOpen && (
                <div className="absolute top-full right-0 mt-2 glass-strong rounded-lg overflow-hidden shadow-xl min-w-[140px] z-50" data-testid="lang-menu">
                  {SUPPORTED_LANGUAGES.map((code) => {
                    const tr = getTranslation(code);
                    return (
                      <button key={code} onClick={() => { changeLang(code); setLangMenuOpen(false); }}
                        className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-left ${lang === code ? 'text-primary font-semibold' : 'text-foreground'}`}
                        data-testid={`lang-option-${code}`}>
                        <span className="text-xs font-bold w-6">{tr.flag}</span>
                        {tr.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile nav icons */}
            <Link to="/watchlist" className="md:hidden p-2 rounded-full hover:bg-white/5" data-testid="mobile-watchlist-link">
              <Bookmark className="w-5 h-5 text-accent" />
            </Link>
            <Link to="/mood" className="md:hidden p-2 rounded-full hover:bg-white/5" data-testid="mobile-mood-link">
              <Sparkles className="w-5 h-5 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
