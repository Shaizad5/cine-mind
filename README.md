# 🎬 Movie Recommendation System

A machine learning based movie recommendation web app built with **Python** and **Streamlit** using **content-based filtering** and similarity models.

## 🚀 Live Demo
https://movie-recommender-ywuztjentqtaf5njj93psv.streamlit.app/

## 📌 Features
- Recommend similar movies based on selected title
- Content-based filtering using movie metadata
- TF-IDF vectorization and cosine similarity
- Fast interactive UI with Streamlit
- Precomputed similarity model for quick results

## 🧠 Tech Stack
- Python
- Streamlit
- Scikit-learn
- Pandas
- NumPy

## 📂 Project Structure
app.py — Streamlit web app
main.py — model building script
tfidf.pkl — vectorizer model
tfidf_matrix.pkl — transformed feature matrix
indices.pkl — movie index mapping
## ▶️ Run Locally

```bash
pip install -r requirements.txt
streamlit run app.py
👩‍💻 Author

Built as a machine learning project for movie recommendations.
