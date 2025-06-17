import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import HamburgerNav from '../components/hamburgerNav';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProfileNav, setShowProfileNav] = useState(false);
  const [theme, setTheme] = useState("dark");
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const API_KEY = 'dbb830f2fcc14d9bad3250b12c241e01';
  const API_BASE_URL = 'https://api.rawg.io/api';

  useEffect(() => {
    if (query.trim()) {
      searchGames(query);
    } else {
      setIsLoading(false);
    }
  }, [query]);

  const searchGames = async (searchQuery) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(searchQuery)}&page_size=20`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }

      const data = await response.json();
      const processedGames = data.results.map(game => ({
        id: game.id,
        name: game.name,
        img: game.background_image,
        rating: game.rating,
        released: game.released,
        platforms: game.platforms?.map(p => p.platform.name) || [],
        genres: game.genres?.map(g => g.name) || []
      }));

      setSearchResults(processedGames);
    } catch (error) {
      console.error('Error searching games:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
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

  const handleWishlistToggle = (game) => {
    if (isInWishlist(game.id)) {
      removeFromWishlist(game.id);
    } else {
      addToWishlist(game);
    }
  };

  const handleNewSearch = (newQuery) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  return (
    <div className={`search-results-container ${theme}`}>
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

      <div className="search-results-content">
        <div className="search-results-header">
          <h2 className={`search-results-title ${theme}`}>
            <span className="search-icon">🔍</span>
            Search Results for "{query}"
          </h2>
          <button 
            className={`back-btn ${theme}`}
            onClick={() => navigate('/second')}
          >
            ← Back to Games
          </button>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner">⏳</div>
            <p className="loading-text">Searching for games...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="search-results-grid">
            {searchResults.map((game) => (
              <div key={game.id} className={`search-result-card ${theme}`}>
                <img 
                  className="game-card-img" 
                  src={game.img} 
                  alt={game.name}
                />
                <div className="search-result-content">
                  <h3 className={`search-result-title ${theme}`}>{game.name}</h3>
                  <div className="search-result-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span 
                        key={i} 
                        style={{ 
                          color: i < game.stars ? '#FFD700' : '#ccc', 
                          fontSize: '1.2rem' 
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  {game.released && (
                    <div className="search-result-release">Released: {game.released}</div>
                  )}
                  {game.genres.length > 0 && (
                    <div className="search-result-genres">
                      Genres: {game.genres.slice(0, 3).join(', ')}
                    </div>
                  )}
                  {game.platforms.length > 0 && (
                    <div className="search-result-platforms">
                      Platforms: {game.platforms.slice(0, 3).join(', ')}
                    </div>
                  )}
                  <div className="search-result-actions">
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
                      className={`wishlist-btn ${isInWishlist(game.id) ? 'in-wishlist' : ''}`}
                      onClick={() => handleWishlistToggle(game)}
                      title={isInWishlist(game.id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {isInWishlist(game.id) ? '❤️' : '♡'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results-container">
            <div className="no-results-icon">😕</div>
            <h3 className={`no-results-title ${theme}`}>No games found</h3>
            <p className={`no-results-text ${theme}`}>
              We couldn't find any games matching "{query}". Try searching for something else.
            </p>
            <button 
              className={`try-again-btn ${theme}`}
              onClick={() => navigate('/second')}
            >
              Try Different Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage; 