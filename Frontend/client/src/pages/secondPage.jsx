import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import MicButton from "../components/micButton";
import HamburgerNav from "../components/hamburgerNav";
import { buildRawgUrl } from "../config/api";
import "./secondPage.css";
import duelystImage from "../assets/duelyst-video-games-multiple-display-wallpaper-thumb.jpg";
import leagueImg from '../assets/league-of-legends.webp';
import minecraftImg from '../assets/images.jpeg';
import overwatchImg from '../assets/images (3).jpeg';
import apexImg from '../assets/images (2).jpeg';
import fortniteImg from '../assets/images (1).jpeg';
import valorantImg from '../assets/red-bull-campus-clutch-new-zealand.avif';
import dontStarveImg from '../assets/dont-starve-873zcco14pemp30d.jpg';
import rustImg from '../assets/Rust.jpeg';
import longDarkImg from '../assets/The long dark.jpeg';
import arkImg from '../assets/ark survival evolved.webp';
import greenHellImg from '../assets/green hell.jpg';
import sonsForestImg from '../assets/sons-of-the-forest-february-22.avif';
// Latest Games imports
import cyberpunkImg from '../assets/cyberpunk 2077.webp';
import eldenRingImg from '../assets/Elder ring.avif';
import godOfWarImg from '../assets/god of war ragnarok.jpeg';
import spidermanImg from '../assets/Spiderman 2.avif';
import hogwartsImg from '../assets/hogwarts legacy.webp';
import starfieldImg from '../assets/starfield.jpg';

export default function SecondPage() {
  const [searchText, setSearchText] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProfileNav, setShowProfileNav] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const navigate = useNavigate();

  // Debounced search effect
  useEffect(() => {
    if (searchText.trim()) {
      setShowDropdown(true);
      const timeoutId = setTimeout(() => {
        searchGames(searchText);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else {
      setSearchSuggestions([]);
      setShowDropdown(false);
    }
  }, [searchText]);

  const handleTranscript = (transcript) => {
    setSearchText(transcript);
    if (transcript.trim()) {
      searchGames(transcript);
    }
  };

  const searchGames = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const url = buildRawgUrl('/games', {
        search: query,
        page_size: 5
      });
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }

      const data = await response.json();
      const suggestions = data.results.map(game => ({
        id: game.id.toString(),
        name: game.name,
        img: game.background_image || 'https://via.placeholder.com/300x200?text=No+Image',
        rating: game.rating,
        released: game.released,
        stars: Math.round(game.rating) || 3
      }));

      setSearchSuggestions(suggestions);
    } catch (error) {
      console.error('Error searching games:', error);
      setSearchSuggestions([]);
      // Optionally show a user-friendly error message
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
  };

  const handleSuggestionClick = (game) => {
    setSearchText(game.name);
    setShowDropdown(false);
    // Navigate to search results page
    navigate(`/search?q=${encodeURIComponent(game.name)}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      setShowDropdown(false);
      navigate(`/search?q=${encodeURIComponent(searchText)}`);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    setShowProfileNav(false); // Close profile nav when opening sidebar
  };

  const toggleProfileNav = () => {
    setShowProfileNav(!showProfileNav);
    setShowSidebar(false); // Close sidebar when opening profile nav
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

  const handleKnowMore = (gameId) => {
    // For local games with string IDs, we'll search for them
    // For API games with numeric IDs, we'll navigate directly
    if (typeof gameId === 'string') {
      // Search for the game name and navigate to search results
      const game = [...latestGames, ...topGames, ...survivalGames].find(g => g.id === gameId);
      if (game) {
        navigate(`/search?q=${encodeURIComponent(game.name)}`);
      }
    } else {
      // Navigate to game details page
      navigate(`/game/${gameId}`);
    }
  };

  // Latest Games data with unique IDs and local images
  const latestGames = [
    { id: 'cyberpunk-2077', name: 'Cyberpunk 2077', stars: 4, img: cyberpunkImg },
    { id: 'elden-ring', name: 'Elden Ring', stars: 5, img: eldenRingImg },
    { id: 'god-of-war-ragnarok', name: 'God of War Ragnarök', stars: 5, img: godOfWarImg },
    { id: 'spider-man-2', name: 'Spider-Man 2', stars: 4, img: spidermanImg },
    { id: 'hogwarts-legacy', name: 'Hogwarts Legacy', stars: 4, img: hogwartsImg },
    { id: 'starfield', name: 'Starfield', stars: 3, img: starfieldImg },
  ];

  // Game data with unique IDs
  const topGames = [
    { id: 'valorant', name: 'Valorant', stars: 5, img: valorantImg },
    { id: 'league-of-legends', name: 'League of Legends', stars: 4, img: leagueImg },
    { id: 'minecraft', name: 'Minecraft', stars: 5, img: minecraftImg },
    { id: 'fortnite', name: 'Fortnite', stars: 4, img: fortniteImg },
    { id: 'apex-legends', name: 'Apex Legends', stars: 3, img: apexImg },
    { id: 'overwatch', name: 'Overwatch', stars: 4, img: overwatchImg },
  ];

  const survivalGames = [
    { id: 'dont-starve', name: "Don't Starve", stars: 4, img: dontStarveImg },
    { id: 'rust', name: 'Rust', stars: 5, img: rustImg },
    { id: 'the-long-dark', name: 'The Long Dark', stars: 4, img: longDarkImg },
    { id: 'ark-survival-evolved', name: 'ARK: Survival Evolved', stars: 5, img: arkImg },
    { id: 'green-hell', name: 'Green Hell', stars: 4, img: greenHellImg },
    { id: 'sons-of-the-forest', name: 'Sons of the Forest', stars: 5, img: sonsForestImg },
  ];

  return (
    <div className={`app-container ${theme}`}>
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

      {/* Game image */}
      <div>
        <img className="image-1" src={duelystImage} alt="Game banner" />
      </div>

      {/* Search bar with dropdown */}
      <div className={`search-bar-container ${theme}`}>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className={`search-icon ${theme}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </div>

          <input
            type="text"
            className={`search-input ${theme}`}
            placeholder="Search games..."
            value={searchText}
            onChange={handleSearchChange}
            onFocus={() => {
              if (searchText.trim() && searchSuggestions.length > 0) {
                setShowDropdown(true);
              }
            }}
            aria-label="Search for games"
            aria-autocomplete="list"
            aria-controls="search-dropdown"
            aria-expanded={showDropdown}
          />

          <MicButton onTranscript={handleTranscript} />
        </form>

        {/* Search Dropdown */}
        {showDropdown && (
          <div className={`search-dropdown ${theme}`} id="search-dropdown" role="listbox">
            {isSearching ? (
              <div className="dropdown-loading" role="status" aria-live="polite">
                <span className="loading-spinner">⏳</span>
                Searching...
              </div>
            ) : searchSuggestions.length > 0 ? (
              searchSuggestions.map((game) => (
                <div
                  key={game.id}
                  className={`dropdown-item ${theme}`}
                  onClick={() => handleSuggestionClick(game)}
                  role="option"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSuggestionClick(game);
                    }
                  }}
                >
                  <img 
                    className="dropdown-item-img" 
                    src={game.img} 
                    alt={game.name}
                  />
                  <div className="dropdown-item-content">
                    <div className="dropdown-item-name">{game.name}</div>
                    {game.released && (
                      <div className="dropdown-item-release">{game.released}</div>
                    )}
                  </div>
                  <div className="dropdown-item-rating">
                    {game.rating ? `★ ${game.rating.toFixed(1)}` : 'N/A'}
                  </div>
                </div>
              ))
            ) : searchText.trim() && (
              <div className="dropdown-no-results" role="status">No games found</div>
            )}
          </div>
        )}
      </div>

      {/* Latest Games Section */}
      <div className="section-title"><span className="section-icon" role="img" aria-label="fire">🔥</span>Latest Games</div>
      <div className="game-grid">
        {latestGames.map((game) => (
          <div className="game-card-new" key={game.id}>
            <img 
              className="game-card-img" 
              src={game.img} 
              alt={game.name}
            />
            <div className="game-card-header">
              <span className="game-card-title">{game.name}</span>
            </div>
            <div className="game-card-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < game.stars ? '#FFD700' : '#ccc', fontSize: '1.2rem' }}>★</span>
              ))}
            </div>
            <div className="game-card-actions">
              <button className="know-more-link" onClick={() => handleKnowMore(game.id)}>Know more ?</button>
              <button 
                className={`wishlist-btn ${isInWishlist(game.id) ? 'in-wishlist' : ''}`}
                onClick={() => handleWishlistToggle(game)}
                title={isInWishlist(game.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isInWishlist(game.id) ? '❤️' : '♡'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Top Games Section */}
      <div className="section-title"><span className="section-icon" role="img" aria-label="trophy">🏆</span>Top Games</div>
      <div className="game-grid">
        {topGames.map((game) => (
          <div className="game-card-new" key={game.id}>
            <img 
              className="game-card-img" 
              src={game.img} 
              alt={game.name}
            />
            <div className="game-card-header">
              <span className="game-card-title">{game.name}</span>
            </div>
            <div className="game-card-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < game.stars ? '#FFD700' : '#ccc', fontSize: '1.2rem' }}>★</span>
              ))}
            </div>
            <div className="game-card-actions">
              <button className="know-more-link" onClick={() => handleKnowMore(game.id)}>Know more ?</button>
              <button 
                className={`wishlist-btn ${isInWishlist(game.id) ? 'in-wishlist' : ''}`}
                onClick={() => handleWishlistToggle(game)}
                title={isInWishlist(game.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isInWishlist(game.id) ? '❤️' : '♡'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Survival Section */}
      <div className="section-title"><span className="section-icon" role="img" aria-label="survival">🛡️</span>Survival</div>
      <div className="game-grid">
        {survivalGames.map((game) => (
          <div className="game-card-new" key={game.id}>
            <img 
              className="game-card-img" 
              src={game.img} 
              alt={game.name}
            />
            <div className="game-card-header">
              <span className="game-card-title">{game.name}</span>
            </div>
            <div className="game-card-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < game.stars ? '#FFD700' : '#ccc', fontSize: '1.2rem' }}>★</span>
              ))}
            </div>
            <div className="game-card-actions">
              <button className="know-more-link" onClick={() => handleKnowMore(game.id)}>Know more ?</button>
              <button 
                className={`wishlist-btn ${isInWishlist(game.id) ? 'in-wishlist' : ''}`}
                onClick={() => handleWishlistToggle(game)}
                title={isInWishlist(game.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isInWishlist(game.id) ? '❤️' : '♡'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

