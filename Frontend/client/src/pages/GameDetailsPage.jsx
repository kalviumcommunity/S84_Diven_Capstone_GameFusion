import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import HamburgerNav from '../components/hamburgerNav';
import { buildRawgUrl } from '../config/api';
import './GameDetailsPage.css';

const GameDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProfileNav, setShowProfileNav] = useState(false);
  const [theme, setTheme] = useState("dark");
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchGameDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchGameDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const url = buildRawgUrl(`/games/${id}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch game details');
      }

      const data = await response.json();
      setGame({
        id: data.id,
        name: data.name,
        description: data.description_raw || data.description || 'No description available',
        img: data.background_image,
        rating: data.rating,
        released: data.released,
        stars: Math.round(data.rating) || 3,
        genres: data.genres?.map(g => g.name) || [],
        platforms: data.platforms?.map(p => p.platform.name) || [],
        developers: data.developers?.map(d => d.name) || [],
        publishers: data.publishers?.map(p => p.name) || [],
        esrbRating: data.esrb_rating?.name || 'Not Rated',
        metacritic: data.metacritic,
        playtime: data.playtime,
        screenshots: data.short_screenshots?.slice(0, 4) || [],
        website: data.website,
        tags: data.tags?.slice(0, 10).map(t => t.name) || []
      });
    } catch (err) {
      console.error('Error fetching game details:', err);
      setError('Failed to load game details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleWishlistToggle = () => {
    if (isInWishlist(game.id)) {
      removeFromWishlist(game.id);
    } else {
      addToWishlist(game);
    }
  };

  if (loading) {
    return (
      <div className={`game-details-container ${theme}`}>
        <div className="loading-container">
          <div className="loading-spinner">⏳</div>
          <p className="loading-text">Loading game details...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className={`game-details-container ${theme}`}>
        <div className="error-container">
          <div className="error-icon">😕</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button className="back-btn" onClick={() => navigate('/second')}>
            ← Back to Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`game-details-container ${theme}`}>
      {/* Navigation Bar */}
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

      {/* Game Details Content */}
      <div className="game-details-content">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* Hero Section */}
        <div className="game-hero" style={{ backgroundImage: `url(${game.img})` }}>
          <div className="hero-overlay">
            <h1 className="game-title">{game.name}</h1>
            <div className="game-meta">
              <div className="rating-badge">
                <span className="rating-number">{game.rating}</span>
                <div className="stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: i < game.stars ? '#FFD700' : '#ccc' }}>★</span>
                  ))}
                </div>
              </div>
              {game.metacritic && (
                <div className="metacritic-badge">
                  Metacritic: {game.metacritic}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Info Section */}
        <div className="game-info-grid">
          <div className="info-main">
            <div className="info-section">
              <h2>About</h2>
              <p className="game-description">{game.description}</p>
            </div>

            {game.screenshots.length > 0 && (
              <div className="info-section">
                <h2>Screenshots</h2>
                <div className="screenshots-grid">
                  {game.screenshots.map((screenshot, index) => (
                    <img 
                      key={index} 
                      src={screenshot.image} 
                      alt={`${game.name} screenshot ${index + 1}`}
                      className="screenshot-img"
                    />
                  ))}
                </div>
              </div>
            )}

            {game.tags.length > 0 && (
              <div className="info-section">
                <h2>Tags</h2>
                <div className="tags-container">
                  {game.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="info-sidebar">
            <div className="sidebar-section">
              <button 
                className={`wishlist-btn-large ${isInWishlist(game.id) ? 'in-wishlist' : ''}`}
                onClick={handleWishlistToggle}
              >
                {isInWishlist(game.id) ? '❤️ In Wishlist' : '♡ Add to Wishlist'}
              </button>
            </div>

            <div className="sidebar-section">
              <h3>Release Date</h3>
              <p>{game.released || 'TBA'}</p>
            </div>

            <div className="sidebar-section">
              <h3>Genres</h3>
              <p>{game.genres.join(', ') || 'N/A'}</p>
            </div>

            <div className="sidebar-section">
              <h3>Platforms</h3>
              <p>{game.platforms.slice(0, 5).join(', ') || 'N/A'}</p>
            </div>

            {game.developers.length > 0 && (
              <div className="sidebar-section">
                <h3>Developers</h3>
                <p>{game.developers.join(', ')}</p>
              </div>
            )}

            {game.publishers.length > 0 && (
              <div className="sidebar-section">
                <h3>Publishers</h3>
                <p>{game.publishers.join(', ')}</p>
              </div>
            )}

            <div className="sidebar-section">
              <h3>ESRB Rating</h3>
              <p>{game.esrbRating}</p>
            </div>

            {game.playtime > 0 && (
              <div className="sidebar-section">
                <h3>Average Playtime</h3>
                <p>{game.playtime} hours</p>
              </div>
            )}

            {game.website && (
              <div className="sidebar-section">
                <a 
                  href={game.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="website-link"
                >
                  Visit Official Website →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailsPage;
