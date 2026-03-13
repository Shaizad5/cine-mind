import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, Tag, Film } from 'lucide-react';
import { moodMatch } from '../api';
import { LangContext } from '../App';

export default function MoodMatcherPage() {
  const { t } = useContext(LangContext);
  const [mood, setMood] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (moodText) => {
    const text = moodText || mood;
    if (!text.trim()) return;
    setLoading(true); setError(''); setResults(null);
    try {
      const res = await moodMatch(text);
      setResults(res.data);
    } catch { setError(t.mood.error); }
    setLoading(false);
  };

  return (
    <div className="pt-16 min-h-screen" data-testid="mood-matcher-page">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
        <div className="relative max-w-3xl mx-auto px-6 lg:px-12 py-20 md:py-28 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-secondary/20 text-secondary mb-6">
              <Sparkles className="w-3 h-3" /> {t.home.moodTeaser}
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight mb-4">
              {t.mood.title} <span className="text-gradient">{t.mood.titleHighlight}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">{t.mood.subtitle}</p>
          </motion.div>
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="relative max-w-2xl mx-auto" data-testid="mood-form">
            <textarea value={mood} onChange={(e) => setMood(e.target.value)} placeholder={t.mood.placeholder} rows={3}
              className="w-full bg-white/5 border border-white/10 focus:border-secondary focus:ring-1 focus:ring-secondary p-5 pr-14 rounded-2xl text-base outline-none resize-none placeholder:text-muted-foreground/50" data-testid="mood-input" />
            <button type="submit" disabled={loading || !mood.trim()}
              className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center hover:bg-secondary/80 disabled:opacity-40 transition-all duration-300 glow-secondary" data-testid="mood-submit-btn">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </motion.form>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-2 mt-6" data-testid="mood-presets">
            {t.mood.presets.map((preset, i) => (
              <button key={i} onClick={() => { setMood(preset); handleSubmit(preset); }} disabled={loading}
                className="px-4 py-2 rounded-full text-sm bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-white/5 hover:border-white/10 transition-all duration-200 disabled:opacity-40"
                data-testid={`mood-preset-${i}`}>{preset}</button>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pb-16">
        {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-400 mb-8" data-testid="mood-error">{error}</motion.div>}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16" data-testid="mood-loading">
            <Loader2 className="w-10 h-10 text-secondary animate-spin mx-auto mb-4" /><p className="text-muted-foreground">{t.mood.loading}</p>
          </motion.div>
        )}
        <AnimatePresence>
          {results && results.recommendations?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} data-testid="mood-results">
              <div className="text-center mb-10">
                <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight mb-2">{t.mood.results}</h2>
                <p className="text-muted-foreground">{t.mood.basedOn} <span className="italic text-secondary">"{results.mood}"</span></p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.recommendations.map((rec, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="glass rounded-xl overflow-hidden group hover:border-secondary/20 transition-all duration-300" data-testid={`mood-result-${i}`}>
                    <div className="flex gap-4 p-5">
                      {rec.tmdb?.poster_url ? (
                        <div className="w-28 flex-shrink-0 cursor-pointer" onClick={() => rec.tmdb?.tmdb_id && window.location.assign(`/movie/${rec.tmdb.tmdb_id}`)}>
                          <img src={rec.tmdb.poster_url} alt={rec.title} className="w-full rounded-lg shadow-lg group-hover:scale-[1.02] transition-transform duration-300" />
                        </div>
                      ) : <div className="w-28 flex-shrink-0 aspect-[2/3] bg-muted rounded-lg flex items-center justify-center"><Film className="w-8 h-8 text-muted-foreground" /></div>}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 leading-tight">{rec.title}</h3>
                        {rec.year && <p className="text-xs text-muted-foreground mb-2">{rec.year}</p>}
                        <p className="text-sm text-white/70 leading-relaxed mb-3">{rec.reason}</p>
                        {rec.mood_tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {rec.mood_tags.map((tag, j) => (
                              <span key={j} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-secondary/15 text-secondary/80">
                                <Tag className="w-2.5 h-2.5" />{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
