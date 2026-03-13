import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import MoodMatcherPage from './pages/MoodMatcherPage';
import SearchPage from './pages/SearchPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route path="/mood" element={<MoodMatcherPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </main>
        <Toaster 
          theme="dark" 
          position="bottom-right"
          toastOptions={{
            style: { background: '#121212', border: '1px solid #27272a', color: '#fafafa' }
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
