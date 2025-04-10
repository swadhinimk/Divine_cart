import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <h1 className="site-title">🛕 Divine Store</h1>
      </div>

      <div className="nav-right">
        <Link to="/blog" className="nav-link">Blog</Link>
        <Link to="/cart" className="nav-link">Cart</Link>

        <div className="profile-container">
          <img
            src="/icons/profile.svg" // ✅ You can put your icon in public/icons
            alt="Profile"
            className="profile-icon"
          />
          <div className="profile-dropdown">
            <Link to="/login">Login</Link>
            <Link to="/profile">Profile</Link>
            <button className="dark-toggle">🌙 Dark Mode</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
