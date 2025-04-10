import React, { useState, useEffect } from 'react';
import './Profile.css';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    alert('You have been logged out!');
    navigate('/');
  };

  return (
    <div className={`profile-page ${darkMode ? 'dark' : ''}`}>
      <div className="profile-card">
        <div className="profile-avatar">
          <FaUserCircle size={64} />
        </div>
        <h2>👤 User Profile</h2>
        {user ? (
          <div className="profile-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        ) : (
          <p className="no-user">No user data found.</p>
        )}
        <div className="theme-toggle">
          <span>{darkMode ? '🌙 Dark Theme' : '☀️ Light Theme'}</span>
          <label className="switch">
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            <span className="slider round"></span>
          </label>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
