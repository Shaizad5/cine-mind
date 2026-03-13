import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Globe, Play, Heart, Send, MessageSquare, Users, Film, Clapperboard, Bookmark, BookmarkCheck, Tv, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { getMovieDetails, getTfidfRecs, getGenreRecs, getCollaborativeRecs, getRating, submitRating, getReviews, submitReview, getWatchProviders, addToWatchlist, removeFromWatchlist, checkWatchlist } from '../api';
import StarRating from '../components/StarRating';
import { MovieRow } from '../components/MovieGrid';
import { Skeleton } from '../components/Skeleton';
import { LangContext } from '../App';

const PROVIDER_REGIONS = ['US', 'IN', 'GB', 'DE', 'FR', 'ES', 'KR', 'JP', 'BR', 'IT'];

const getSessionId = () => {
  let id = localStorage.getItem('cinemind_session');
  if (!id) { id = 'user_' + Math.random().toString(36).substr(2, 9); localStorage.setItem('cinemind_session', id); }
  return id;
};

export default function MovieDetailPage() {
  const { t } = useContext(LangContext);
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tfidfRecs, setTfidfRecs] = useState([]);
  const [genreRecs, setGenreRecs] = useState([]);
  const [collabRecs, setCollabRecs] = useState([]);
  const [ratingData, setRatingData] = useState({ average_rating: null, total_ratings: 0, user_rating: null });
  const [reviews, setReviews] = useState([]);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const [watchProviders, setWatchProviders] = useState(null);
  const [providerRegion, setProviderRegion] = useState('US');
  const [inWatchlist, setInWatchlist] = useState(false);
  const sessionId = getSessionId();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [detailRes, ratingRes, reviewRes, watchlistRes] = await Promise.all([
          getMovieDetails(id), getRating(id, sessionId), getReviews(id), checkWatchlist(id, sessionId),
        ]);
        const movieData = detailRes.data;
        setMovie(movieData);
        setRatingData(ratingRes.data);
        setReviews(reviewRes.data.reviews || []);
        setReviewTotal(reviewRes.data.total || 0);
        setInWatchlist(watchlistRes.data.in_watchlist);

        // Load watch providers
        getWatchProviders(id).then(res => setWatchProviders(res.data.providers || {})).catch(() => {});

        // Load recommendations in parallel
        const title = movieData.title;
        Promise.all([
          getTfidfRecs(title, 12).catch(() => ({ data: [] })),
          getGenreRecs(id, 12).catch(() => ({ data: [] })),
          getCollaborativeRecs(id, sessionId, 12).catch(() => ({ data: [] })),
        ]).then(([tRes, gRes, cRes]) => {
          setTfidfRecs((tRes.data || []).filter(r => r.tmdb).map(r => r.tmdb));
          setGenreRecs(gRes.data || []);
          setCollabRecs((cRes.data || []).filter(r => r.tmdb).map(r => r.tmdb));
        });
      } catch (err) { console.error('Failed to load movie:', err); }
      setLoading(false);
    };
    fetchAll();
  }, [id, sessionId]);

  const handleRate = async (value) => {
    try {
      const res = await submitRating(parseInt(id), sessionId, value, movie?.title);
      setRatingData(prev => ({ ...prev, user_rating: value, average_rating: res.data.average_rating, total_ratings: res.data.total_ratings }));
      toast.success(`Rated ${value} stars`);
    } catch { toast.error('Failed to submit rating'); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    try {
      await submitReview(parseInt(id), sessionId, reviewName || 'Anonymous', reviewText, reviewRating || null);
      toast.success('Review submitted!');
      setReviewText(''); setReviewRating(0);
      const res = await getReviews(id);
      setReviews(res.data.reviews || []); setReviewTotal(res.data.total || 0);
    } catch { toast.error('Failed to submit review'); }
  };

  const handleWatchlist = async () => {
    try {
      if (inWatchlist) {
        await removeFromWatchlist(parseInt(id), sessionId);
        setInWatchlist(false);
        toast.success(t.movie.removeWatchlist);
      } else {
        await addToWatchlist(parseInt(id), sessionId, movie?.title, movie?.poster_url);
        setInWatchlist(true);
        toast.success(t.movie.addWatchlist);
      }
    } catch { toast.error('Failed'); }
  };

  const regionProviders = watchProviders?.[providerRegion];
  const typeLabels = { flatrate: t.movie.stream, rent: t.movie.rent, buy: t.movie.buy, free: t.movie.free };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="h-[60vh] skeleton" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
          <Skeleton className="h-10 w-96 mb-4" /><Skeleton className="h-6 w-64 mb-8" /><Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Film className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold mb-2">{t.movie.notFound}</h2>
          <Link to="/" className="text-primary hover:underline">{t.movie.backHome}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen" data-testid="movie-detail-page">
      {/* Backdrop Hero */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden" data-testid="movie-backdrop">
        <div className="absolute inset-0">
          {movie.backdrop_url ? <img src={movie.backdrop_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-card" />}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        </div>
        {movie.trailer_url && (
          <button onClick={() => setShowTrailer(true)} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-20 h-20 rounded-full bg-primary/80 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300 glow-primary" data-testid="play-trailer-btn">
            <Play className="w-8 h-8 text-white ml-1" />
          </button>
        )}
      </section>

      {/* Trailer Modal */}
      {showTrailer && movie.trailer_url && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setShowTrailer(false)} data-testid="trailer-modal">
          <div className="w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <iframe src={`${movie.trailer_url}?autoplay=1`} title="Trailer" className="w-full h-full rounded-lg" allow="autoplay; encrypted-media" allowFullScreen />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 -mt-32 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-48 md:w-64 flex-shrink-0">
            {movie.poster_url ? <img src={movie.poster_url} alt={movie.title} className="w-full rounded-xl shadow-2xl" data-testid="movie-poster" /> :
              <div className="w-full aspect-[2/3] bg-card rounded-xl flex items-center justify-center"><Film className="w-16 h-16 text-muted-foreground" /></div>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight" data-testid="movie-title">{movie.title}</h1>
              <button onClick={handleWatchlist}
                className={`flex-shrink-0 p-3 rounded-full transition-all duration-300 ${inWatchlist ? 'bg-accent/20 text-accent glow-primary' : 'bg-white/5 text-muted-foreground hover:bg-white/10'}`}
                data-testid="watchlist-toggle-btn">
                {inWatchlist ? <BookmarkCheck className="w-6 h-6" /> : <Bookmark className="w-6 h-6" />}
              </button>
            </div>

            {movie.tagline && <p className="text-muted-foreground italic text-lg mb-4" data-testid="movie-tagline">"{movie.tagline}"</p>}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              {movie.release_date && <span data-testid="movie-year">{movie.release_date.slice(0, 4)}</span>}
              {movie.runtime > 0 && <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>}
              {movie.vote_average > 0 && <span className="flex items-center gap-1"><Star className="w-4 h-4 text-accent fill-accent" /><span className="text-accent font-semibold">{movie.vote_average.toFixed(1)}</span><span className="text-muted-foreground/50">TMDB</span></span>}
              {movie.production_countries?.length > 0 && <span className="flex items-center gap-1"><Globe className="w-4 h-4" />{movie.production_countries.map(c => c.iso_3166_1).join(', ')}</span>}
            </div>

            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6" data-testid="movie-genres">
                {movie.genres.map(g => (
                  <span key={g.id} className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-secondary/20 text-secondary border border-secondary/10">{g.name}</span>
                ))}
              </div>
            )}

            {movie.overview && (
              <div className="mb-8">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{t.movie.synopsis}</h3>
                <p className="text-white/80 leading-relaxed text-base" data-testid="movie-overview">{movie.overview}</p>
              </div>
            )}

            {/* Rating Section */}
            <div className="glass rounded-xl p-6 mb-6" data-testid="rating-section">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{t.movie.communityRating}</h3>
                  <div className="flex items-center gap-3">
                    {ratingData.average_rating ? (
                      <>
                        <span className="text-3xl font-bold text-accent">{ratingData.average_rating}</span>
                        <div>
                          <StarRating rating={Math.round(ratingData.average_rating)} readonly size="sm" />
                          <p className="text-xs text-muted-foreground mt-0.5">{ratingData.total_ratings} {t.movie.rating}{ratingData.total_ratings !== 1 ? 's' : ''}</p>
                        </div>
                      </>
                    ) : <p className="text-muted-foreground text-sm">{t.movie.noRatings}</p>}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{t.movie.yourRating}</h3>
                  <StarRating rating={ratingData.user_rating || 0} onRate={handleRate} size="lg" />
                </div>
              </div>
            </div>

            {/* Where to Watch */}
            <div className="glass rounded-xl p-6 mb-6" data-testid="where-to-watch">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Tv className="w-4 h-4 text-primary" /> {t.movie.whereToWatch}
              </h3>
              <div className="flex gap-2 mb-4 flex-wrap">
                {PROVIDER_REGIONS.map(r => (
                  <button key={r} onClick={() => setProviderRegion(r)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${providerRegion === r ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground hover:bg-white/10'}`}
                    data-testid={`provider-region-${r}`}>{r}</button>
                ))}
              </div>
              {regionProviders?.providers?.length > 0 ? (
                <div>
                  <div className="flex flex-wrap gap-3">
                    {regionProviders.providers.map((p, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5" data-testid={`provider-${i}`}>
                        {p.logo && <img src={p.logo} alt={p.name} className="w-7 h-7 rounded" />}
                        <div>
                          <p className="text-xs font-semibold">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{typeLabels[p.type] || p.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {regionProviders.link && (
                    <a href={regionProviders.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-3" data-testid="justwatch-link">
                      <ExternalLink className="w-3 h-3" /> JustWatch
                    </a>
                  )}
                </div>
              ) : <p className="text-sm text-muted-foreground">{t.movie.noProviders}</p>}
            </div>
          </motion.div>
        </div>

        {/* Cast */}
        {movie.cast?.length > 0 && (
          <section className="mt-12 mb-12" data-testid="cast-section">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">{t.movie.cast}</h3>
            <div className="horizontal-scroll flex gap-4 pb-4">
              {movie.cast.map((member, i) => (
                <div key={i} className="flex-shrink-0 w-24 text-center">
                  {member.profile_path ? <img src={member.profile_path} alt={member.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-2 border-2 border-white/10" /> :
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-2"><Users className="w-8 h-8 text-muted-foreground" /></div>}
                  <p className="text-xs font-medium truncate">{member.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{member.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <section className="mb-12" data-testid="reviews-section">
          <h3 className="font-serif text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" /> {t.movie.reviews}
            {reviewTotal > 0 && <span className="text-sm font-normal text-muted-foreground">({reviewTotal})</span>}
          </h3>
          <form onSubmit={handleReviewSubmit} className="glass rounded-xl p-6 mb-8" data-testid="review-form">
            <h4 className="text-sm font-semibold mb-4">{t.movie.writeReview}</h4>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <input type="text" value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder={t.movie.namePlaceholder}
                className="bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary h-10 px-4 rounded-lg text-sm outline-none flex-1" data-testid="review-name-input" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t.movie.rating}:</span>
                <StarRating rating={reviewRating} onRate={setReviewRating} size="sm" />
              </div>
            </div>
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder={t.movie.reviewPlaceholder} rows={3}
              className="w-full bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary p-4 rounded-lg text-sm outline-none resize-none mb-4" data-testid="review-content-input" />
            <button type="submit" disabled={!reviewText.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed glow-primary transition-all duration-300" data-testid="submit-review-btn">
              <Send className="w-4 h-4" /> {t.movie.postReview}
            </button>
          </form>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-5" data-testid={`review-item-${i}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">{(review.author_name || 'A')[0].toUpperCase()}</div>
                      <span className="text-sm font-semibold">{review.author_name || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {review.rating && <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-accent fill-accent" /><span className="text-xs font-semibold text-accent">{review.rating}</span></div>}
                      <span className="text-xs text-muted-foreground">{review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">{review.content}</p>
                  {review.likes > 0 && <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground"><Heart className="w-3 h-3" />{review.likes}</div>}
                </motion.div>
              ))}
            </div>
          ) : <p className="text-muted-foreground text-sm">{t.movie.noReviews}</p>}
        </section>

        {/* Recommendations */}
        <section className="pb-16" data-testid="recommendations-section">
          <h2 className="font-serif text-2xl font-bold tracking-tight mb-8 flex items-center gap-2"><Clapperboard className="w-6 h-6 text-primary" /> {t.movie.recommendations}</h2>
          {tfidfRecs.length > 0 && <MovieRow movies={tfidfRecs} title={t.movie.similarMovies} subtitle={t.movie.similarDesc} />}
          {collabRecs.length > 0 && <MovieRow movies={collabRecs} title={t.movie.peopleAlsoLiked} subtitle={t.movie.collabDesc} />}
          {genreRecs.length > 0 && <MovieRow movies={genreRecs} title={t.movie.moreGenre} subtitle={t.movie.genreDesc} />}
          {tfidfRecs.length === 0 && collabRecs.length === 0 && genreRecs.length === 0 && <p className="text-muted-foreground text-sm">{t.movie.noRecs}</p>}
        </section>
      </div>
    </div>
  );
}
