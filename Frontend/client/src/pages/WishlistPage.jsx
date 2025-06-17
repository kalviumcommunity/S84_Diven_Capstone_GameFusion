import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import HamburgerNav from '../components/hamburgerNav';
import './WishlistPage.css';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProfileNav, setShowProfileNav] = useState(false);
  const [theme, setTheme] = useState("dark");
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    setShowProfileNav(false);
  };

  const toggleProfileNav = () => {
    setShowProfileNav(!showProfileNav);
    setShowSidebar(false);
  };

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    document.body.className = newTheme;
  };

  const handleRemoveFromWishlist = (gameId) => {
    removeFromWishlist(gameId);
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
    }
  };

  return (
    <div className={`wishlist-container ${theme}`}>
      <div className={`nav-bar ${theme}`}>
        <div className="nav-icons">
          <HamburgerNav 
            showSidebar={showSidebar}
            toggleSidebar={toggleSidebar}
            theme={theme}
            toggleTheme={toggleTheme}
          />
          <h1 className={`logo ${theme}`}>
            <span>GameFusion</span>
          </h1>
          <div className="profile-wrapper" onClick={toggleProfileNav}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className={`profile-icon ${theme}`}
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
              />
            </svg>
            {showProfileNav && (
              <div className={`profile-nav ${theme}`}>
                <div className="profile-nav-item" onClick={() => navigate('/auth', { state: { isLogin: true } })}>Login</div>
                <div className="profile-nav-item" onClick={() => navigate('/auth', { state: { isLogin: false } })}>Signup</div>
                <div className="profile-nav-item">Contact</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="wishlist-content">
        <div className="wishlist-header">
          <h2 className={`wishlist-title ${theme}`}>
            <span className="wishlist-icon">❤️</span>
            My Wishlist
          </h2>
          {wishlist.length > 0 && (
            <button 
              className={`clear-wishlist-btn ${theme}`}
              onClick={handleClearWishlist}
            >
              Clear All
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-wishlist-icon">💔</div>
            <h3 className={`empty-wishlist-title ${theme}`}>Your wishlist is empty</h3>
            <p className={`empty-wishlist-text ${theme}`}>
              Start adding games to your wishlist to see them here!
            </p>
            <button 
              className={`browse-games-btn ${theme}`}
              onClick={() => navigate('/second')}
            >
              Browse Games
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((game) => (
              <div key={game.id} className={`wishlist-card ${theme}`}>
                <img 
                  className="wishlist-game-img" 
                  src={game.img} 
                  alt={game.name}
                />
                <div className="wishlist-card-content">
                  <h3 className={`wishlist-card-title ${theme}`}>{game.name}</h3>
                  <div className="wishlist-card-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span 
                        key={i} 
                        style={{ 
                          color: i < (game.stars || 0) ? '#FFD700' : '#ccc', 
                          fontSize: '1.2rem' 
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="wishlist-card-actions">
                    <button 
                      className={`know-more-btn ${theme}`}
                      onClick={() => {
                        // Add navigation to game details page when available
                        alert(`Learn more about ${game.name}`);
                      }}
                    >
                      Know More
                    </button>
                    <button 
                      className={`remove-wishlist-btn ${theme}`}
                      onClick={() => handleRemoveFromWishlist(game.id)}
                      title="Remove from wishlist"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage; 