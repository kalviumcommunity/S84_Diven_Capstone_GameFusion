import React from "react";
import { useNavigate } from "react-router-dom";
import "./firstPage.css";
import videoBg from "../assets/89894-616430996_small.mp4";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleVideoError = (e) => {
    console.error("Error loading video:", e);
  };

  return (
    <div className="landing-container">
      <video
        className="background-video"
        src={videoBg}
        autoPlay
        muted
        loop
        playsInline
        onError={handleVideoError}
      />

      <div className="overlay">
        <h1>
          <span className="game">Game Fusion</span> – Where Gaming Begins!
        </h1>
        <p>Explore, play, and conquer the best games all in one place. Ready to level up?</p>
        
        <button className="get-started" onClick={() => navigate("/second")}>
          Get started →
        </button>
      </div>
    </div>
  );
}
