import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MicButton from "../components/micButton";
import HamburgerNav from "../components/hamburgerNav";
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

export default function SecondPage() {
  const [searchText, setSearchText] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProfileNav, setShowProfileNav] = useState(false);
  const [theme, setTheme] = useState("dark");

  const handleTranscript = (transcript) => {
    setSearchText(transcript);
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

  const navigate = useNavigate();

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

      {/* Search bar */}
      <div className={`search-bar-container ${theme}`}>
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
          onChange={(e) => setSearchText(e.target.value)}
        />

        <MicButton onTranscript={handleTranscript} />
      </div>

      {/* Top Games Section */}
      <div className="section-title"><span className="section-icon" role="img" aria-label="trophy">🏆</span>Top Games</div>
      <div className="game-grid">
        {[
          { name: 'Valorant', stars: 5, img: valorantImg },
          { name: 'League of Legends', stars: 4, img: leagueImg },
          { name: 'Minecraft', stars: 5, img: minecraftImg },
          { name: 'Fortnite', stars: 4, img: fortniteImg },
          { name: 'Apex Legends', stars: 3, img: apexImg },
          { name: 'Overwatch', stars: 4, img: overwatchImg },
        ].map((game, idx) => (
          <div className="game-card-new" key={idx}>
            <img className="game-card-img" src={game.img || "https://via.placeholder.com/300x120?text=Game+Image"} alt="Game" />
            <div className="game-card-header">
              <span className="game-card-title">{game.name}</span>
            </div>
            <div className="game-card-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < game.stars ? '#FFD700' : '#ccc', fontSize: '1.2rem' }}>★</span>
              ))}
            </div>
            <div className="game-card-actions">
              <a href="#" className="know-more-link">Know more-</a>
              <button className="wishlist-btn" title="Add to wishlist">♡</button>
            </div>
          </div>
        ))}
      </div>

      {/* Survival Section */}
      <div className="section-title"><span className="section-icon" role="img" aria-label="survival">🛡️</span>Survival</div>
      <div className="game-grid">
        {[
          { name: "Don't Starve", stars: 4, img: dontStarveImg },
          { name: 'Rust', stars: 5, img: rustImg },
          { name: 'The Long Dark', stars: 4, img: longDarkImg },
          { name: 'ARK: Survival Evolved', stars: 5, img: arkImg },
          { name: 'Green Hell', stars: 4, img: greenHellImg },
          { name: 'Sons of the Forest', stars: 5, img: sonsForestImg },
        ].map((game, idx) => (
          <div className="game-card-new" key={idx}>
            <img className="game-card-img" src={game.img || "https://via.placeholder.com/300x120?text=Game+Image"} alt="Game" />
            <div className="game-card-header">
              <span className="game-card-title">{game.name}</span>
            </div>
            <div className="game-card-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < game.stars ? '#FFD700' : '#ccc', fontSize: '1.2rem' }}>★</span>
              ))}
            </div>
            <div className="game-card-actions">
              <a href="#" className="know-more-link">Know more-</a>
              <button className="wishlist-btn" title="Add to wishlist">♡</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
