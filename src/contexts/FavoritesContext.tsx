
import React, { createContext, useState, useEffect, useContext } from 'react';
import { FavoritesContextType } from '@/types/matching';
import { getFavorites, addFavorite as addFav, removeFavorite as removeFav, isFavorite as isFav } from '@/services/matchingService';

// Create the context with a default value
const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false
});

// Provider component that wraps the app
export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadedFavorites = getFavorites();
    setFavorites(loadedFavorites);
  }, []);

  // Add a favorite
  const addFavorite = (id: string) => {
    addFav(id);
    setFavorites(prev => [...prev, id]);
  };

  // Remove a favorite
  const removeFavorite = (id: string) => {
    removeFav(id);
    setFavorites(prev => prev.filter(fav => fav !== id));
  };

  // Check if an item is a favorite
  const isFavorite = (id: string) => {
    return isFav(id);
  };

  // Value provided to consuming components
  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use the favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
