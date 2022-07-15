import React, { useState, useEffect } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from './pages/home';
import FighterDetails from './pages/fighter-details';
import FavoritesList from './pages/favorites';
import Navbar from './components/navbar';
import BackgroundCarousel from './components/background-carousel';
import axios from 'axios';

export default function App() {
  const [currentView, setCurrentView]: any[] = useState('characterList');
  const [focusedFighter, setFocusedFighter]: any[] = useState({});
  const [favorites, setFavorites]: any[] = useState([]);


  useEffect(() => {
    const favoriteItem: string | null = localStorage.getItem('favorites');
    if (favoriteItem) {
      const favorites: any = JSON.parse(favoriteItem);
      console.log({favorites});
      setFavorites(favorites);
    }
    const focusedFighterItem: any = localStorage.getItem('focusedFighter');
    if (focusedFighterItem) {
      const focusedFighter: any = JSON.parse(focusedFighterItem);
      setFocusedFighter(focusedFighter);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
    localStorage.setItem('focusedFighter', JSON.stringify(focusedFighter));
  }, [favorites, focusedFighter]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios('/api')
        if(res.status === 200) {
          console.log(res.data);
        } else {
          throw Error()
        }
      } catch (e) {
        console.error('fetch failed!', e);
      }

    }
    fetchData();
  }, [])

  function handleViewChange(newView: string): void {
    setCurrentView(newView);
  }

  function handleCurrentFighter(obj: any) {
    if (obj === null) {
      setFocusedFighter({});
      return;
    }
    setFocusedFighter(obj);
  }

  function handleAddFavorites(fav: object | undefined) {
    const newFavorites: any[] = [...favorites, fav]
    setFavorites(newFavorites.sort((a: any, b: any) => (a.fighterId > b.fighterId) ? 1 : -1));
  }
  function handleDeleteFavorites(id: number): void {
    interface Fav {
      fighterId: number
    }
    if (favorites.length === 1) {
      setFavorites([]);
    }
    function filterFav(fav: Fav): number | undefined {
      if (fav.fighterId !== id) {
        return fav.fighterId
      }
    }
    setFavorites(favorites.filter(filterFav));
  }
  return (
    <Router>
      <header>
        <Navbar viewChange={handleViewChange} view={currentView} />
      </header>
      <main>
        <BackgroundCarousel />
        <Routes>
          <Route path="/" element={
            <Home
              view={currentView}
              viewChange={handleViewChange}
              addFocusedFighter={handleCurrentFighter}
              focusedFighter = {focusedFighter}
              favorites={favorites}
              addFavorites={handleAddFavorites}
              deleteFavorites={handleDeleteFavorites}
            />} />
          <Route path="/favorites" element={
            <FavoritesList
              view={currentView}
              viewChange={handleViewChange}
              addFocusedFighter={handleCurrentFighter}
              focusedFighter = {focusedFighter}
              favorites={favorites}
              addFavorites={handleAddFavorites}
              deleteFavorites={handleDeleteFavorites}
            />} />
          <Route path={`/character-details/${focusedFighter.fighter}`} element={
            <FighterDetails focusedFighter={focusedFighter} />
          } />
        </Routes>
      </main>
    </Router>
  );
}
