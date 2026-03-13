import axios from 'axios';

const API_BASE = process.env.REACT_APP_BACKEND_URL || '';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 30000,
});

export const getHome = (category = 'popular', page = 1) =>
  api.get('/home', { params: { category, page, limit: 20 } });

export const searchMovies = (query, page = 1) =>
  api.get('/search', { params: { query, page } });

export const getMovieDetails = (tmdbId) =>
  api.get(`/movie/${tmdbId}`);

export const getGenres = () =>
  api.get('/genres');

export const discoverByGenre = (genreId, page = 1) =>
  api.get('/discover', { params: { genre_id: genreId, page } });

export const getTfidfRecs = (title, topN = 12) =>
  api.get('/recommend/tfidf', { params: { title, top_n: topN } });

export const getGenreRecs = (tmdbId, limit = 12) =>
  api.get('/recommend/genre', { params: { tmdb_id: tmdbId, limit } });

export const getCollaborativeRecs = (tmdbId, sessionId = '', limit = 12) =>
  api.get('/recommend/collaborative', { params: { tmdb_id: tmdbId, session_id: sessionId, limit } });

export const getPersonalizedRecs = (sessionId, limit = 20) =>
  api.get('/recommend/personalized', { params: { session_id: sessionId, limit } });

export const submitRating = (tmdbId, sessionId, rating, movieTitle = '') =>
  api.post('/ratings', { tmdb_id: tmdbId, session_id: sessionId, rating, movie_title: movieTitle });

export const getRating = (tmdbId, sessionId = '') =>
  api.get(`/ratings/${tmdbId}`, { params: { session_id: sessionId } });

export const submitReview = (tmdbId, sessionId, authorName, content, rating = null) =>
  api.post('/reviews', { tmdb_id: tmdbId, session_id: sessionId, author_name: authorName, content, rating });

export const getReviews = (tmdbId, page = 1) =>
  api.get(`/reviews/${tmdbId}`, { params: { page } });

export const likeReview = (tmdbId, authorName) =>
  api.post('/reviews/like', { tmdb_id: tmdbId, author_name: authorName });

export const moodMatch = (mood, sessionId = '') =>
  api.post('/mood-match', { mood, session_id: sessionId });

export const getStats = () =>
  api.get('/stats');

export const getHealth = () =>
  api.get('/health');

export default api;
