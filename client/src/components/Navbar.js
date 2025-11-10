import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

// 1. Receive 'user' and 'onLogout' from App.js
function Navbar({ user, onLogout }) {

  const handleFindNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          alert(`Location found! We'll search near ${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`);
        },
        () => {
          alert('Could not get your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <nav className="navbar-transparent">
      <div className="navbar-left">
        <Link to="/" className="nav-item-main">Home</Link>
        <button onClick={handleFindNearMe} className="nav-item-location">
          <span>📍</span>
          <span>Use Location</span>
        </button>
      </div>
      <div className="navbar-center">
        <span className="navbar-brand-title">HOME SERVICE FINDER</span>
      </div>
      <div className="navbar-right">
        {/* 2. Check if 'user' exists */}
        {user ? (
          <>
            {/* If logged in, show this */}
            <span className="nav-item-hello">Hello, {user.name}</span>
            <button onClick={onLogout} className="nav-item-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            {/* If logged out, show this */}
            <Link to="/login" className="nav-item-auth">Login</Link>
            <Link to="/provider-register" className="nav-item-auth-join">
              Join as Provider
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

