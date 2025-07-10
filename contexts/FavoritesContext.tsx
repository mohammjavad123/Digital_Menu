import React, { createContext, useContext, useState, ReactNode } from 'react';

export type FavoriteItem = {
  id: number;
  name: string;
  image: any;
  price: string;
};

type FavoritesContextType = {
  favorites: FavoriteItem[];
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (itemId: number) => boolean;
  clearFavorites: () => void; // ✅ Added
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const isFavorite = (itemId: number) => {
    return favorites.some(i => i.id === itemId);
  };

  const clearFavorites = () => {
    console.log('🧹 Clearing all favorites'); // ← Debug log
    setFavorites([]); // ✅ Actually clears favorites
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, clearFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
  return context;
};
