import os
import pickle
import uuid
import json
import time
from typing import Optional, List, Dict, Any, Tuple
from datetime import datetime, timezone

import numpy as np
import pandas as pd
import httpx
from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId

load_dotenv()

# =========================
# ENV
# =========================
MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")
TMDB_API_KEY = os.getenv("TMDB_API_KEY", "")
EMERGENT_LLM_KEY = os.getenv("EMERGENT_LLM_KEY", "")

TMDB_BASE = "https://api.themoviedb.org/3"
TMDB_IMG_500 = "https://image.tmdb.org/t/p/w500"
TMDB_IMG_780 = "https://image.tmdb.org/t/p/w780"
TMDB_IMG_ORIGINAL = "https://image.tmdb.org/t/p/original"

# =========================
# MONGODB
# =========================
client = MongoClient(MONGO_URL)
db = client[DB_NAME]
ratings_col = db["ratings"]
reviews_col = db["reviews"]
collab_col = db["collaborative_data"]

# Create indexes
ratings_col.create_index([("tmdb_id", 1)])
ratings_col.create_index([("session_id", 1)])
reviews_col.create_index([("tmdb_id", 1)])
collab_col.create_index([("session_id", 1)])

# =========================
# FASTAPI APP
# =========================
app = FastAPI(title="CineMind API", version="3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# PICKLE GLOBALS
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DF_PATH = os.path.join(BASE_DIR, "df (1).pkl")
INDICES_PATH = os.path.join(BASE_DIR, "indices.pkl")
TFIDF_MATRIX_PATH = os.path.join(BASE_DIR, "tfidf_matrix.pkl")
TFIDF_PATH = os.path.join(BASE_DIR, "tfidf.pkl")

df: Optional[pd.DataFrame] = None
indices_obj: Any = None
tfidf_matrix: Any = None
tfidf_obj: Any = None
TITLE_TO_IDX: Optional[Dict[str, int]] = None

# =========================
# MODELS
# =========================
class TMDBMovieCard(BaseModel):
    tmdb_id: int
    title: str
    poster_url: Optional[str] = None
    backdrop_url: Optional[str] = None
    release_date: Optional[str] = None
    vote_average: Optional[float] = None
    overview: Optional[str] = None
    genre_ids: List[int] = []

class TMDBMovieDetails(BaseModel):
    tmdb_id: int
    title: str
    overview: Optional[str] = None
    release_date: Optional[str] = None
    poster_url: Optional[str] = None
    backdrop_url: Optional[str] = None
    genres: List[dict] = []
    runtime: Optional[int] = None
    vote_average: Optional[float] = None
    vote_count: Optional[int] = None
    tagline: Optional[str] = None
    budget: Optional[int] = None
    revenue: Optional[int] = None
    production_countries: List[dict] = []
    spoken_languages: List[dict] = []
    cast: List[dict] = []
    trailer_url: Optional[str] = None

class RatingRequest(BaseModel):
    tmdb_id: int
    session_id: str
    rating: float = Field(ge=0.5, le=5.0)
    movie_title: Optional[str] = None

class ReviewRequest(BaseModel):
    tmdb_id: int
    session_id: str
    author_name: str = "Anonymous"
    content: str
    rating: Optional[float] = None

class MoodMatchRequest(BaseModel):
    mood: str
    session_id: Optional[str] = None

# =========================
# UTILS
# =========================
def _norm_title(t: str) -> str:
    return str(t).strip().lower()

def make_img_url(path: Optional[str], size: str = "w500") -> Optional[str]:
    if not path:
        return None
    return f"https://image.tmdb.org/t/p/{size}{path}"

async def tmdb_get(path: str, params: Dict[str, Any]) -> Dict[str, Any]:
    if not TMDB_API_KEY or TMDB_API_KEY == "demo_key_placeholder":
        return {}
    q = dict(params)
    q["api_key"] = TMDB_API_KEY
    try:
        async with httpx.AsyncClient(timeout=20) as client_http:
            r = await client_http.get(f"{TMDB_BASE}{path}", params=q)
        if r.status_code != 200:
            return {}
        return r.json()
    except Exception:
        return {}

async def tmdb_cards_from_results(results: List[dict], limit: int = 20) -> List[TMDBMovieCard]:
    out = []
    for m in (results or [])[:limit]:
        out.append(TMDBMovieCard(
            tmdb_id=int(m.get("id", 0)),
            title=m.get("title") or m.get("name") or "",
            poster_url=make_img_url(m.get("poster_path")),
            backdrop_url=make_img_url(m.get("backdrop_path"), "w780"),
            release_date=m.get("release_date"),
            vote_average=m.get("vote_average"),
            overview=m.get("overview", ""),
            genre_ids=m.get("genre_ids", []),
        ))
    return out

async def tmdb_movie_details(movie_id: int) -> TMDBMovieDetails:
    data = await tmdb_get(f"/movie/{movie_id}", {
        "language": "en-US",
        "append_to_response": "credits,videos"
    })
    if not data:
        raise HTTPException(status_code=404, detail="Movie not found")

    # Extract cast
    cast_list = []
    credits = data.get("credits", {})
    for c in (credits.get("cast") or [])[:12]:
        cast_list.append({
            "name": c.get("name", ""),
            "character": c.get("character", ""),
            "profile_path": make_img_url(c.get("profile_path"), "w185"),
        })

    # Extract trailer
    trailer_url = None
    videos = data.get("videos", {})
    for v in (videos.get("results") or []):
        if v.get("type") == "Trailer" and v.get("site") == "YouTube":
            trailer_url = f"https://www.youtube.com/embed/{v['key']}"
            break

    return TMDBMovieDetails(
        tmdb_id=int(data.get("id", 0)),
        title=data.get("title") or "",
        overview=data.get("overview"),
        release_date=data.get("release_date"),
        poster_url=make_img_url(data.get("poster_path")),
        backdrop_url=make_img_url(data.get("backdrop_path"), "original"),
        genres=data.get("genres", []),
        runtime=data.get("runtime"),
        vote_average=data.get("vote_average"),
        vote_count=data.get("vote_count"),
        tagline=data.get("tagline"),
        budget=data.get("budget"),
        revenue=data.get("revenue"),
        production_countries=data.get("production_countries", []),
        spoken_languages=data.get("spoken_languages", []),
        cast=cast_list,
        trailer_url=trailer_url,
    )

# =========================
# TF-IDF Helpers
# =========================
def build_title_to_idx_map(indices: Any) -> Dict[str, int]:
    title_to_idx: Dict[str, int] = {}
    if isinstance(indices, dict):
        for k, v in indices.items():
            title_to_idx[_norm_title(k)] = int(v)
        return title_to_idx
    try:
        for k, v in indices.items():
            title_to_idx[_norm_title(k)] = int(v)
        return title_to_idx
    except Exception:
        return {}

def tfidf_recommend_titles(query_title: str, top_n: int = 10) -> List[Tuple[str, float]]:
    global df, tfidf_matrix, TITLE_TO_IDX
    if df is None or tfidf_matrix is None or TITLE_TO_IDX is None:
        return []
    key = _norm_title(query_title)
    if key not in TITLE_TO_IDX:
        return []
    idx = TITLE_TO_IDX[key]
    qv = tfidf_matrix[idx]
    scores = (tfidf_matrix @ qv.T).toarray().ravel()
    order = np.argsort(-scores)
    out = []
    for i in order:
        if int(i) == int(idx):
            continue
        try:
            title_i = str(df.iloc[int(i)]["title"])
        except Exception:
            continue
        out.append((title_i, float(scores[int(i)])))
        if len(out) >= top_n:
            break
    return out

async def attach_tmdb_card(title: str) -> Optional[TMDBMovieCard]:
    try:
        data = await tmdb_get("/search/movie", {"query": title, "include_adult": "false", "language": "en-US", "page": 1})
        results = data.get("results", [])
        if not results:
            return None
        m = results[0]
        return TMDBMovieCard(
            tmdb_id=int(m["id"]),
            title=m.get("title") or title,
            poster_url=make_img_url(m.get("poster_path")),
            backdrop_url=make_img_url(m.get("backdrop_path"), "w780"),
            release_date=m.get("release_date"),
            vote_average=m.get("vote_average"),
            overview=m.get("overview", ""),
            genre_ids=m.get("genre_ids", []),
        )
    except Exception:
        return None

# =========================
# COLLABORATIVE FILTERING
# =========================
def get_collaborative_recommendations(tmdb_id: int, session_id: str = None, limit: int = 12) -> List[Dict]:
    """
    Item-based collaborative filtering:
    Find users who rated this movie highly, then find other movies they also rated highly.
    """
    # Get all ratings for this movie
    movie_raters = list(ratings_col.find(
        {"tmdb_id": tmdb_id, "rating": {"$gte": 3.5}},
        {"_id": 0, "session_id": 1}
    ))
    
    if not movie_raters:
        return []
    
    rater_sessions = [r["session_id"] for r in movie_raters]
    
    # Find other highly-rated movies by these users
    pipeline = [
        {"$match": {
            "session_id": {"$in": rater_sessions},
            "tmdb_id": {"$ne": tmdb_id},
            "rating": {"$gte": 3.5}
        }},
        {"$group": {
            "_id": "$tmdb_id",
            "avg_rating": {"$avg": "$rating"},
            "count": {"$sum": 1},
            "movie_title": {"$first": "$movie_title"}
        }},
        {"$sort": {"count": -1, "avg_rating": -1}},
        {"$limit": limit}
    ]
    
    results = list(ratings_col.aggregate(pipeline))
    return [{"tmdb_id": r["_id"], "score": r["avg_rating"], "count": r["count"], "title": r.get("movie_title", "")} for r in results]

def get_personalized_recommendations(session_id: str, limit: int = 20) -> List[Dict]:
    """
    User-based collaborative filtering:
    Find users with similar rating patterns, recommend their highly rated movies.
    """
    # Get this user's ratings
    user_ratings = list(ratings_col.find(
        {"session_id": session_id},
        {"_id": 0, "tmdb_id": 1, "rating": 1}
    ))
    
    if not user_ratings:
        return []
    
    user_movie_ids = [r["tmdb_id"] for r in user_ratings]
    user_ratings_map = {r["tmdb_id"]: r["rating"] for r in user_ratings}
    
    # Find other users who rated the same movies
    similar_users_pipeline = [
        {"$match": {
            "tmdb_id": {"$in": user_movie_ids},
            "session_id": {"$ne": session_id}
        }},
        {"$group": {
            "_id": "$session_id",
            "common_movies": {"$sum": 1},
            "ratings": {"$push": {"tmdb_id": "$tmdb_id", "rating": "$rating"}}
        }},
        {"$match": {"common_movies": {"$gte": 2}}},
        {"$sort": {"common_movies": -1}},
        {"$limit": 50}
    ]
    
    similar_users = list(ratings_col.aggregate(similar_users_pipeline))
    
    if not similar_users:
        return []
    
    # Calculate similarity scores using rating overlap
    similar_session_ids = [u["_id"] for u in similar_users]
    
    # Get recommendations from similar users
    rec_pipeline = [
        {"$match": {
            "session_id": {"$in": similar_session_ids},
            "tmdb_id": {"$nin": user_movie_ids},
            "rating": {"$gte": 3.5}
        }},
        {"$group": {
            "_id": "$tmdb_id",
            "avg_rating": {"$avg": "$rating"},
            "recommender_count": {"$sum": 1},
            "movie_title": {"$first": "$movie_title"}
        }},
        {"$sort": {"recommender_count": -1, "avg_rating": -1}},
        {"$limit": limit}
    ]
    
    results = list(ratings_col.aggregate(rec_pipeline))
    return [{"tmdb_id": r["_id"], "score": r["avg_rating"], "count": r["recommender_count"], "title": r.get("movie_title", "")} for r in results]

# =========================
# STARTUP
# =========================
@app.on_event("startup")
def load_pickles():
    global df, indices_obj, tfidf_matrix, tfidf_obj, TITLE_TO_IDX
    try:
        with open(DF_PATH, "rb") as f:
            df = pickle.load(f)
        with open(INDICES_PATH, "rb") as f:
            indices_obj = pickle.load(f)
        with open(TFIDF_MATRIX_PATH, "rb") as f:
            tfidf_matrix = pickle.load(f)
        with open(TFIDF_PATH, "rb") as f:
            tfidf_obj = pickle.load(f)
        TITLE_TO_IDX = build_title_to_idx_map(indices_obj)
    except Exception as e:
        print(f"Warning: Could not load pickle files: {e}")

    # Seed some collaborative data for demo
    seed_collaborative_data()

def seed_collaborative_data():
    """Seed sample ratings for collaborative filtering demo"""
    if ratings_col.count_documents({}) > 0:
        return
    
    # Sample movie ratings from demo users with diverse taste
    sample_ratings = [
        # User 1: Action fan
        {"session_id": "demo_user_1", "tmdb_id": 299536, "rating": 4.5, "movie_title": "Avengers: Infinity War"},
        {"session_id": "demo_user_1", "tmdb_id": 299534, "rating": 4.0, "movie_title": "Avengers: Endgame"},
        {"session_id": "demo_user_1", "tmdb_id": 27205, "rating": 5.0, "movie_title": "Inception"},
        {"session_id": "demo_user_1", "tmdb_id": 155, "rating": 5.0, "movie_title": "The Dark Knight"},
        {"session_id": "demo_user_1", "tmdb_id": 24428, "rating": 4.0, "movie_title": "The Avengers"},
        {"session_id": "demo_user_1", "tmdb_id": 157336, "rating": 4.5, "movie_title": "Interstellar"},
        # User 2: Sci-fi fan
        {"session_id": "demo_user_2", "tmdb_id": 27205, "rating": 5.0, "movie_title": "Inception"},
        {"session_id": "demo_user_2", "tmdb_id": 157336, "rating": 5.0, "movie_title": "Interstellar"},
        {"session_id": "demo_user_2", "tmdb_id": 603, "rating": 4.5, "movie_title": "The Matrix"},
        {"session_id": "demo_user_2", "tmdb_id": 62, "rating": 4.0, "movie_title": "2001: A Space Odyssey"},
        {"session_id": "demo_user_2", "tmdb_id": 152601, "rating": 4.5, "movie_title": "Her"},
        {"session_id": "demo_user_2", "tmdb_id": 264660, "rating": 4.0, "movie_title": "Ex Machina"},
        # User 3: Drama lover
        {"session_id": "demo_user_3", "tmdb_id": 278, "rating": 5.0, "movie_title": "The Shawshank Redemption"},
        {"session_id": "demo_user_3", "tmdb_id": 238, "rating": 5.0, "movie_title": "The Godfather"},
        {"session_id": "demo_user_3", "tmdb_id": 550, "rating": 4.5, "movie_title": "Fight Club"},
        {"session_id": "demo_user_3", "tmdb_id": 680, "rating": 4.5, "movie_title": "Pulp Fiction"},
        {"session_id": "demo_user_3", "tmdb_id": 13, "rating": 4.0, "movie_title": "Forrest Gump"},
        {"session_id": "demo_user_3", "tmdb_id": 155, "rating": 4.5, "movie_title": "The Dark Knight"},
        # User 4: Diverse taste
        {"session_id": "demo_user_4", "tmdb_id": 155, "rating": 5.0, "movie_title": "The Dark Knight"},
        {"session_id": "demo_user_4", "tmdb_id": 27205, "rating": 4.5, "movie_title": "Inception"},
        {"session_id": "demo_user_4", "tmdb_id": 278, "rating": 5.0, "movie_title": "The Shawshank Redemption"},
        {"session_id": "demo_user_4", "tmdb_id": 120, "rating": 4.0, "movie_title": "The Lord of the Rings"},
        {"session_id": "demo_user_4", "tmdb_id": 244786, "rating": 4.5, "movie_title": "Whiplash"},
        {"session_id": "demo_user_4", "tmdb_id": 497, "rating": 4.0, "movie_title": "The Green Mile"},
        # User 5: International cinema
        {"session_id": "demo_user_5", "tmdb_id": 496243, "rating": 5.0, "movie_title": "Parasite"},
        {"session_id": "demo_user_5", "tmdb_id": 346, "rating": 4.5, "movie_title": "Seven Samurai"},
        {"session_id": "demo_user_5", "tmdb_id": 153, "rating": 4.5, "movie_title": "Lost in Translation"},
        {"session_id": "demo_user_5", "tmdb_id": 27205, "rating": 4.0, "movie_title": "Inception"},
        {"session_id": "demo_user_5", "tmdb_id": 155, "rating": 4.5, "movie_title": "The Dark Knight"},
        {"session_id": "demo_user_5", "tmdb_id": 372058, "rating": 5.0, "movie_title": "Your Name"},
    ]
    
    for r in sample_ratings:
        r["created_at"] = datetime.now(timezone.utc).isoformat()
    
    ratings_col.insert_many(sample_ratings)

    # Seed some reviews
    sample_reviews = [
        {"tmdb_id": 27205, "session_id": "demo_user_1", "author_name": "MovieBuff42", "content": "Nolan's masterpiece. The layered dream sequences are mind-bending yet emotionally grounded.", "rating": 5.0, "created_at": datetime.now(timezone.utc).isoformat(), "likes": 12},
        {"tmdb_id": 27205, "session_id": "demo_user_2", "author_name": "CinemaLover", "content": "A film that rewards multiple viewings. Each layer reveals something new.", "rating": 4.5, "created_at": datetime.now(timezone.utc).isoformat(), "likes": 8},
        {"tmdb_id": 155, "session_id": "demo_user_3", "author_name": "DarkKnightFan", "content": "Heath Ledger's Joker is the greatest villain performance in cinema history.", "rating": 5.0, "created_at": datetime.now(timezone.utc).isoformat(), "likes": 25},
        {"tmdb_id": 278, "session_id": "demo_user_4", "author_name": "ClassicFilmFan", "content": "Hope is a dangerous thing. This film captures it perfectly.", "rating": 5.0, "created_at": datetime.now(timezone.utc).isoformat(), "likes": 15},
        {"tmdb_id": 496243, "session_id": "demo_user_5", "author_name": "WorldCinema", "content": "Bong Joon-ho crafted a perfect genre-bending thriller about class warfare.", "rating": 5.0, "created_at": datetime.now(timezone.utc).isoformat(), "likes": 20},
    ]
    reviews_col.insert_many(sample_reviews)
    print("Seeded collaborative data successfully")

# =========================
# ROUTES
# =========================
@app.get("/api/health")
def health():
    return {"status": "ok", "tmdb_configured": bool(TMDB_API_KEY and TMDB_API_KEY != "demo_key_placeholder")}

# ---------- HOME FEED ----------
@app.get("/api/home")
async def home(
    category: str = Query("popular"),
    limit: int = Query(20, ge=1, le=50),
    page: int = Query(1, ge=1, le=10),
):
    if category == "trending":
        data = await tmdb_get("/trending/movie/day", {"language": "en-US", "page": page})
    elif category in {"popular", "top_rated", "upcoming", "now_playing"}:
        data = await tmdb_get(f"/movie/{category}", {"language": "en-US", "page": page})
    else:
        raise HTTPException(status_code=400, detail="Invalid category")
    
    results = data.get("results", [])
    cards = await tmdb_cards_from_results(results, limit=limit)
    return {"results": [c.dict() for c in cards], "total_pages": data.get("total_pages", 1)}

# ---------- SEARCH ----------
@app.get("/api/search")
async def search_movies(
    query: str = Query(..., min_length=1),
    page: int = Query(1, ge=1, le=10),
):
    data = await tmdb_get("/search/movie", {
        "query": query,
        "include_adult": "false",
        "language": "en-US",
        "page": page,
    })
    results = data.get("results", [])
    cards = await tmdb_cards_from_results(results, limit=20)
    return {"results": [c.dict() for c in cards], "total_results": data.get("total_results", 0)}

# ---------- MOVIE DETAILS ----------
@app.get("/api/movie/{tmdb_id}")
async def movie_details_route(tmdb_id: int):
    details = await tmdb_movie_details(tmdb_id)
    result = details.dict()
    
    # Add community rating
    avg_pipeline = [
        {"$match": {"tmdb_id": tmdb_id}},
        {"$group": {"_id": None, "avg": {"$avg": "$rating"}, "count": {"$sum": 1}}}
    ]
    agg = list(ratings_col.aggregate(avg_pipeline))
    if agg:
        result["community_rating"] = round(agg[0]["avg"], 1)
        result["community_rating_count"] = agg[0]["count"]
    else:
        result["community_rating"] = None
        result["community_rating_count"] = 0
    
    return result

# ---------- GENRES ----------
@app.get("/api/genres")
async def get_genres():
    data = await tmdb_get("/genre/movie/list", {"language": "en-US"})
    return data.get("genres", [])

# ---------- DISCOVER BY GENRE ----------
@app.get("/api/discover")
async def discover_by_genre(
    genre_id: int = Query(...),
    page: int = Query(1, ge=1, le=10),
    sort_by: str = Query("popularity.desc"),
):
    data = await tmdb_get("/discover/movie", {
        "with_genres": genre_id,
        "language": "en-US",
        "sort_by": sort_by,
        "page": page,
    })
    results = data.get("results", [])
    cards = await tmdb_cards_from_results(results, limit=20)
    return {"results": [c.dict() for c in cards], "total_pages": data.get("total_pages", 1)}

# ---------- TF-IDF RECOMMENDATIONS ----------
@app.get("/api/recommend/tfidf")
async def recommend_tfidf(
    title: str = Query(..., min_length=1),
    top_n: int = Query(12, ge=1, le=30),
):
    recs = tfidf_recommend_titles(title, top_n=top_n)
    items = []
    for t, score in recs:
        card = await attach_tmdb_card(t)
        items.append({
            "title": t,
            "score": round(score, 3),
            "tmdb": card.dict() if card else None,
        })
    return items

# ---------- GENRE RECOMMENDATIONS ----------
@app.get("/api/recommend/genre")
async def recommend_genre(
    tmdb_id: int = Query(...),
    limit: int = Query(12, ge=1, le=30),
):
    details = await tmdb_movie_details(tmdb_id)
    if not details.genres:
        return []
    genre_id = details.genres[0]["id"]
    data = await tmdb_get("/discover/movie", {
        "with_genres": genre_id,
        "language": "en-US",
        "sort_by": "popularity.desc",
        "page": 1,
    })
    cards = await tmdb_cards_from_results(data.get("results", []), limit=limit)
    return [c.dict() for c in cards if c.tmdb_id != tmdb_id]

# ---------- COLLABORATIVE RECOMMENDATIONS ----------
@app.get("/api/recommend/collaborative")
async def recommend_collaborative(
    tmdb_id: int = Query(...),
    session_id: str = Query(""),
    limit: int = Query(12, ge=1, le=30),
):
    recs = get_collaborative_recommendations(tmdb_id, session_id, limit)
    # Enrich with TMDB data
    enriched = []
    for rec in recs:
        card = await attach_tmdb_card(rec["title"]) if rec.get("title") else None
        if card:
            enriched.append({
                "tmdb_id": rec["tmdb_id"],
                "score": rec["score"],
                "count": rec["count"],
                "tmdb": card.dict(),
            })
    return enriched

# ---------- PERSONALIZED RECOMMENDATIONS ----------
@app.get("/api/recommend/personalized")
async def recommend_personalized(
    session_id: str = Query(...),
    limit: int = Query(20, ge=1, le=50),
):
    recs = get_personalized_recommendations(session_id, limit)
    enriched = []
    for rec in recs:
        card = await attach_tmdb_card(rec["title"]) if rec.get("title") else None
        if card:
            enriched.append({
                "tmdb_id": rec["tmdb_id"],
                "score": rec["score"],
                "count": rec["count"],
                "tmdb": card.dict(),
            })
    return enriched

# ---------- RATINGS ----------
@app.post("/api/ratings")
async def submit_rating(req: RatingRequest):
    # Upsert rating
    ratings_col.update_one(
        {"tmdb_id": req.tmdb_id, "session_id": req.session_id},
        {"$set": {
            "rating": req.rating,
            "movie_title": req.movie_title or "",
            "updated_at": datetime.now(timezone.utc).isoformat(),
        },
        "$setOnInsert": {"created_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True,
    )
    
    # Return updated average
    avg_pipeline = [
        {"$match": {"tmdb_id": req.tmdb_id}},
        {"$group": {"_id": None, "avg": {"$avg": "$rating"}, "count": {"$sum": 1}}}
    ]
    agg = list(ratings_col.aggregate(avg_pipeline))
    avg = round(agg[0]["avg"], 1) if agg else 0
    count = agg[0]["count"] if agg else 0
    
    return {"success": True, "average_rating": avg, "total_ratings": count}

@app.get("/api/ratings/{tmdb_id}")
async def get_rating(tmdb_id: int, session_id: str = Query("")):
    result = {"average_rating": None, "total_ratings": 0, "user_rating": None}
    
    avg_pipeline = [
        {"$match": {"tmdb_id": tmdb_id}},
        {"$group": {"_id": None, "avg": {"$avg": "$rating"}, "count": {"$sum": 1}}}
    ]
    agg = list(ratings_col.aggregate(avg_pipeline))
    if agg:
        result["average_rating"] = round(agg[0]["avg"], 1)
        result["total_ratings"] = agg[0]["count"]
    
    if session_id:
        user_rating = ratings_col.find_one(
            {"tmdb_id": tmdb_id, "session_id": session_id},
            {"_id": 0, "rating": 1}
        )
        if user_rating:
            result["user_rating"] = user_rating["rating"]
    
    return result

# ---------- REVIEWS ----------
@app.post("/api/reviews")
async def submit_review(req: ReviewRequest):
    doc = {
        "tmdb_id": req.tmdb_id,
        "session_id": req.session_id,
        "author_name": req.author_name,
        "content": req.content,
        "rating": req.rating,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "likes": 0,
    }
    reviews_col.insert_one(doc)
    return {"success": True}

@app.get("/api/reviews/{tmdb_id}")
async def get_reviews(tmdb_id: int, page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=50)):
    skip = (page - 1) * limit
    reviews = list(reviews_col.find(
        {"tmdb_id": tmdb_id},
        {"_id": 0, "session_id": 0}
    ).sort("created_at", -1).skip(skip).limit(limit))
    
    total = reviews_col.count_documents({"tmdb_id": tmdb_id})
    return {"reviews": reviews, "total": total, "page": page}

@app.post("/api/reviews/like")
async def like_review(tmdb_id: int = Body(...), author_name: str = Body(...)):
    reviews_col.update_one(
        {"tmdb_id": tmdb_id, "author_name": author_name},
        {"$inc": {"likes": 1}}
    )
    return {"success": True}

# ---------- AI MOOD MATCHER ----------
@app.post("/api/mood-match")
async def mood_match(req: MoodMatchRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="AI service not configured")
    
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"mood_{uuid.uuid4().hex[:8]}",
        system_message="""You are CineMind, an expert movie recommendation AI. Given a user's mood or vibe description, recommend exactly 6 movies that match their emotional state. 

For each movie, provide:
- title: exact movie title
- year: release year
- reason: one sentence explaining why it matches the mood (keep it evocative and personal)
- mood_tags: 2-3 mood/vibe tags

Return ONLY valid JSON in this format:
{"recommendations": [{"title": "...", "year": 2020, "reason": "...", "mood_tags": ["tag1", "tag2"]}]}

Focus on worldwide cinema - include Hollywood, Bollywood, Korean, Japanese, French, Spanish, and other international films when relevant. Mix classic and modern films."""
    )
    chat.with_model("openai", "gpt-4o")
    
    user_message = UserMessage(text=f"My mood right now: {req.mood}")
    
    try:
        response = await chat.send_message(user_message)
        # Parse JSON from response
        response_text = response.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        
        parsed = json.loads(response_text)
        recommendations = parsed.get("recommendations", [])
        
        # Enrich with TMDB data
        enriched = []
        for rec in recommendations:
            card = await attach_tmdb_card(f"{rec['title']} {rec.get('year', '')}")
            enriched.append({
                "title": rec["title"],
                "year": rec.get("year"),
                "reason": rec.get("reason", ""),
                "mood_tags": rec.get("mood_tags", []),
                "tmdb": card.dict() if card else None,
            })
        
        return {"mood": req.mood, "recommendations": enriched}
    except json.JSONDecodeError:
        return {"mood": req.mood, "recommendations": [], "raw_response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI recommendation failed: {str(e)}")

# ---------- STATS ----------
@app.get("/api/stats")
async def get_stats():
    total_ratings = ratings_col.count_documents({})
    total_reviews = reviews_col.count_documents({})
    unique_users = len(ratings_col.distinct("session_id"))
    unique_movies_rated = len(ratings_col.distinct("tmdb_id"))
    
    # Top rated movies
    top_pipeline = [
        {"$group": {
            "_id": "$tmdb_id",
            "avg_rating": {"$avg": "$rating"},
            "count": {"$sum": 1},
            "title": {"$first": "$movie_title"}
        }},
        {"$match": {"count": {"$gte": 2}}},
        {"$sort": {"avg_rating": -1}},
        {"$limit": 10}
    ]
    top_rated = list(ratings_col.aggregate(top_pipeline))
    
    return {
        "total_ratings": total_ratings,
        "total_reviews": total_reviews,
        "unique_users": unique_users,
        "unique_movies_rated": unique_movies_rated,
        "top_community_rated": [
            {"tmdb_id": t["_id"], "title": t.get("title", ""), "avg_rating": round(t["avg_rating"], 1), "count": t["count"]}
            for t in top_rated
        ]
    }
