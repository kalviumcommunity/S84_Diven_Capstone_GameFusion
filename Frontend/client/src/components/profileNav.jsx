// src/components/ProfileNav.jsx
import React from "react";
import "./profileNav.css";

export default function ProfileNav({ toggleDrawer, showNavDrawer }) {
  return (
    <div className="nav-bar">
      <div className="nav-icons">
        <span className="hamburger" onClick={toggleDrawer}>
          ☰
        </span>
        <h1 className="logo">
          <span>GameFusion</span>
        </h1>
        <div className="profile-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="profile-icon"
            viewBox="0 0 16 16"
            onClick={toggleDrawer} // Toggles the profile menu on click
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path
              fillRule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
            />
          </svg>
        </div>
      </div>

      {/* Conditionally Render the Nav Drawer */}
      {showNavDrawer && (
        <div className="nav-drawer">
          <ul>
            <li>Profile</li>
            <li>Settings</li>
            <li>Log Out</li>
          </ul>
        </div>
      )}
    </div>
  );
}
