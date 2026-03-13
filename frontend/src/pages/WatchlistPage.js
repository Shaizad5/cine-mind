import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, Trash2, Film, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { getWatchlist, removeFromWatchlist } from '../api';
import { LangContext } from '../App';

const getSessionId = () => {
  let id = localStorage.getItem('cinemind_session');
  if (!id) { id = 'user_' + Math.random().toString(36).substr(2, 9); localStorage.setItem('cinemind_session', id); }
  return id;
};

export default function WatchlistPage() {
  const { t } = useContext(LangContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const sessionId = getSessionId();

  useEffect(() => {
    const fetchWatchlist = async () => {
      setLoading(true);
      try {
        const res = await getWatchlist(sessionId);
        setItems(res.data.items || []);
      } catch {}
      setLoading(false);
    };
    fetchWatchlist();
  }, [sessionId]);

  const handleRemove = async (tmdbId) => {
    try {
      await removeFromWatchlist(tmdbId, sessionId);
      setItems(prev => prev.filter(item => item.tmdb_id !== tmdbId));
      toast.success(t.watchlist.remove);
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="pt-16 min-h-screen" data-testid="watchlist-page">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-accent" /> {t.watchlist.title}
          </h1>
          <p className="text-muted-foreground mb-10">{items.length} movie{items.length !== 1 ? 's' : ''}</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}><div className="skeleton aspect-[2/3] rounded-lg" /><div className="skeleton h-4 mt-2 w-3/4 rounded" /></div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {items.map((item, i) => (
              <motion.div key={item.tmdb_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="group relative" data-testid={`watchlist-item-${item.tmdb_id}`}>
                <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-card cursor-pointer" onClick={() => navigate(`/movie/${item.tmdb_id}`)}>
                  {item.poster_url ? <img src={item.poster_url} alt={item.movie_title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" /> :
                    <div className="w-full h-full flex items-center justify-center bg-muted"><Film className="w-10 h-10 text-muted-foreground" /></div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex items-start justify-between mt-2 gap-1">
                  <p className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/movie/${item.tmdb_id}`)}>
                    {item.movie_title || 'Untitled'}
                  </p>
                  <button onClick={(e) => { e.stopPropagation(); handleRemove(item.tmdb_id); }}
                    className="flex-shrink-0 p-1.5 rounded-full hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-all" data-testid={`remove-watchlist-${item.tmdb_id}`}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Bookmark className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-serif font-bold mb-2">{t.watchlist.empty}</h2>
            <p className="text-muted-foreground mb-6">{t.watchlist.emptyDesc}</p>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 glow-primary transition-all duration-300" data-testid="browse-movies-btn">
              {t.watchlist.browseMovies} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
