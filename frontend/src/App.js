import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { getCurrentLang, getTranslation, setLanguage as setLangStorage } from './i18n';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import MoodMatcherPage from './pages/MoodMatcherPage';
import SearchPage from './pages/SearchPage';
import WatchlistPage from './pages/WatchlistPage';
import './App.css';

export const LangContext = createContext();

function App() {
  const [lang, setLang] = useState(getCurrentLang());
  const t = getTranslation(lang);

  useEffect(() => {
    const handler = () => setLang(getCurrentLang());
    window.addEventListener('languageChange', handler);
    return () => window.removeEventListener('languageChange', handler);
  }, []);

  const changeLang = (newLang) => {
    setLangStorage(newLang);
    setLang(newLang);
  };

  return (
    <LangContext.Provider value={{ lang, t, changeLang }}>
      <BrowserRouter>
        <div className="min-h-screen bg-background" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movie/:id" element={<MovieDetailPage />} />
              <Route path="/mood" element={<MoodMatcherPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
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
    </LangContext.Provider>
  );
}

export default App;
