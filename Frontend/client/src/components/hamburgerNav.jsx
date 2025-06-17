import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './hamburgerNav.css';

const HamburgerNav = ({ showSidebar, toggleSidebar, theme, toggleTheme }) => {
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const navigate = useNavigate();

  const handleThemeClick = () => {
    setShowThemeOptions(!showThemeOptions);
  };

  const handleWishlistClick = () => {
    navigate('/wishlist');
    toggleSidebar(); // Close sidebar after navigation
  };

  return (
    <>
      <span className={`hamburger ${theme}`} onClick={toggleSidebar}>☰</span>
      
      {showSidebar && (
        <div className={`sidebar ${theme}`}>
          <div className="sidebar-header">
            <span className="back-arrow" onClick={toggleSidebar}>←</span>
            <h3>Menu</h3>
          </div>
          
          <div className="sidebar-content">
            <div className="sidebar-item" onClick={handleWishlistClick}>
              <span className="icon">❤️</span>
              <span>Wishlist</span>
            </div>
            
            <div className="sidebar-item">
              <span className="icon">⭐</span>
              <span>Favorites</span>
            </div>
            
            <div className="sidebar-item theme-selector" onClick={handleThemeClick}>
              <span className="icon">🎨</span>
              <span>Theme: {theme}</span>
              {showThemeOptions && (
                <div className="theme-options">
                  <button 
                    className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTheme('light');
                    }}
                  >
                    Light
                  </button>
                  <button 
                    className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTheme('dark');
                    }}
                  >
                    Dark
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HamburgerNav; 