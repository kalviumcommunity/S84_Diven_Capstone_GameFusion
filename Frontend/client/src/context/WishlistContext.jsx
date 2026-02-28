import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist);
        setWishlist(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
      setWishlist([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      } catch (error) {
        console.error('Error saving wishlist to localStorage:', error);
      }
    }
  }, [wishlist, isLoading]);

  const addToWishlist = (game) => {
    if (!game || !game.id) {
      console.error('Invalid game object:', game);
      return;
    }
    
    setWishlist(prev => {
      const exists = prev.find(item => item.id === game.id);
      if (!exists) {
        return [...prev, game];
      }
      return prev;
    });
  };

  const removeFromWishlist = (gameId) => {
    setWishlist(prev => prev.filter(game => game.id !== gameId));
  };

  const isInWishlist = (gameId) => {
    return wishlist.some(game => game.id === gameId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    isLoading
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}; 