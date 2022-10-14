/* eslint-disable no-restricted-globals */
import { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  Navigate
} from "react-router-dom";
import { useAppSelector, useAppDispatch } from './app/hook';
import { selectUser } from './features/account/userSlice';
import { setFighterArray, selectFighterArray } from './features/fighters/fightersArraySlice';
import { setFavorites, selectFavorites } from './features/favorites/favoritingSlice';
import BackgroundCarousel from './components/BackgroundCarousel';
import SiteNavbar from './components/navbar/SiteNavbar';
import Home from './pages/Home';
import FighterDetails from './pages/FighterDetails';
import Favorites from './pages/Favorites';
import Registration from './pages/Registration';
import Loading from './components/Loading';
import axios from 'axios';

export default function App() {

  const user = useAppSelector(selectUser);
  const fighterArray = useAppSelector(selectFighterArray);
  const favorites = useAppSelector(selectFavorites);
  const [loading, setIsLoading]: any[] = useState(false);
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchData(getFavoritesQuery: {email: string}) {
      const result = await handleGetFavorites(getFavoritesQuery);
      dispatch(setFavorites(result.favorites));
    }
    if(user) {
      const getFavoritesQuery = { email: user.user.email };
      fetchData(getFavoritesQuery)
    } else {
      const favoriteItem: string | null = localStorage.getItem('favorites');
      if (favoriteItem) {
        dispatch(setFavorites(JSON.parse(favoriteItem)));
      }
    }
  }, [user, dispatch]);

  useEffect(() => {
    if(user) {
      const uploadFavoritesQuery = {
        email: user.user.email,
        favorites: favorites
      }
      handleUploadFavorites(uploadFavoritesQuery);
    } else {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, user]);

  useEffect(() => {
    if (window.location.pathname.includes('registration')) {
      return;
    }
    if(fighterArray.length === 0) {
      fetchFighters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  async function fetchFighters() {
    setIsLoading(true);
    try {
      const res = await axios.get('https://the-ultimate-api.herokuapp.com/api/fighters')
      if (res.status === 200) {
        dispatch(setFighterArray(res.data));
      } else {
        throw Error(res.statusText);
      }
    } catch (e) {
      console.error('Fetch failed!', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUploadFavorites(query: any) {
    const url = 'http://localhost:5000/favoriting/characters/upsert';
    const controller = new AbortController()
    const headers = {
      signal: controller.signal,
      validateStatus: () => true
    }
    try {
      const { status, data }: any = await axios.post(url, query, headers);
      if (status !== 201) throw new Error('favoriting failed!');
      return data;
    } catch (e: any) {
      return { error: e.message }
    }
  }

  async function handleGetFavorites(queryEmail: {email: string}) {
    const url = 'http://localhost:5000/favoriting/characters/get';
    const controller = new AbortController()
    const header = {
      signal: controller.signal,
      validateStatus: () => true
    }
    try {
      const { status, data } = await axios.post(url, queryEmail, header);
      if (status !== 200) throw new Error('Fetch failed!');
      return data
    } catch (e: any) {
      return { error: e.message }
    }
  }

  function handleDeleteFavorites(id: number): void {
    interface Fav {
      fighterId: number
    }
    if (favorites.length === 1) {
      dispatch(setFavorites([]));
    }

    function filterFav(fav: Fav): number | undefined {
      if (fav.fighterId !== id) {
        return fav.fighterId
      }
    }
    dispatch(setFavorites(favorites.filter(filterFav)));
  }
  if(loading) {
    return (
      <>
        <header className='mb-0'>
          <SiteNavbar />
        </header>
        <main className='bg-dark min-vh-100' style={{ paddingTop: '6rem' }}>
          <Loading />
        </main>
      </>
    );
  }
  return (
    <>
      <header>
        <SiteNavbar />
      </header>
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <BackgroundCarousel />
              <Home
                deleteFavorites = {handleDeleteFavorites}
              />
            </>
          } />
          <Route path="/favorites" element={
            <>
              <BackgroundCarousel />
              <Favorites
                deleteFavorites = {handleDeleteFavorites}
              />
            </>
          } />
          <Route path='/character-details'>
            <Route path={':fighter'} element={
              <>
                <BackgroundCarousel />
                <FighterDetails />
              </>
            } />
          </Route>
          <Route path='/registration'>
            <Route path="create-account" element={
              <Registration />
            } />
            <Route path="sign-in" element={
              <Registration />
            } />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}
