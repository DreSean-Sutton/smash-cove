import React, { useState, useEffect } from 'react';
import Home from './pages/home';
import FighterDetails from './pages/fighter-details';
import FavoritesList from './pages/favorites';
import Navbar from './components/navbar';
import BackgroundCarousel from './components/background-carousel';

export default function App(props) {

  const [currentView, setCurrentView] = useState('characterList');
  // eslint-disable-next-line no-unused-vars
  const [orderByRosterId, setOrderByRosterId] = useState(false);
  const [focusedFighter, setFocusedFighter] = useState({});
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites'));
    if (favorites) {
      setFavorites(favorites);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  function handleViewChange(newView) {
    setCurrentView(newView);
  }

  function handleCurrentFighter(obj) {
    if (obj === null) {
      setFocusedFighter({});
      return;
    }
    setFocusedFighter(obj);
  }

  function handleAddFavorites(fav) {
    setFavorites([...favorites, fav].sort((a, b) => (a.fighterId > b.fighterId) ? 1 : -1));
  }

  function handleDeleteFavorites(id) {
    if (favorites.length === 1) {
      setFavorites([]);
      return;
    }
    setFavorites(favorites.filter(fav => fav.fighterId !== id));
  }

  let view = null;
  if (currentView === 'characterList') {
    view =
      <>
        <BackgroundCarousel />
         <Home
          view={currentView}
          viewChange={handleViewChange}
          focusedFighter={handleCurrentFighter}
          order={orderByRosterId}
          favorites={favorites}
          addFavorites={handleAddFavorites}
          deleteFavorites={handleDeleteFavorites}
        />;
      </>;
  } else if (currentView === 'favoritesList') {
    view =
        <>
          <BackgroundCarousel />
          <FavoritesList
            view={currentView}
            viewChange={handleViewChange}
            focusedFighter={handleCurrentFighter}
            order={orderByRosterId}
            favorites={favorites}
            addFavorites={handleAddFavorites}
            deleteFavorites={handleDeleteFavorites}
          />;
        </>;
  } else if (currentView === 'characterDetails') {
    view =
        <>
          <BackgroundCarousel />
          <FighterDetails focusedFighter={focusedFighter} />
        </>;
  }
  return (
    <>
      <header>
        <Navbar viewChange={handleViewChange} view={currentView} />
      </header>
      <main>
        { view }
      </main>
    </>
  );
}