import React, { useState, useEffect } from 'react';
import './LoginPopup.css';
import { useNavigate } from 'react-router-dom';

const LoginPopup = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'admin'
  const [isSignup, setIsSignup] = useState(false); // true for signup form
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleAdminLogin = () => {
    if (username === 'admin' && pass === 'admin') {
      alert('Admin logged in!');
      onClose();
      navigate('/admin');
    } else {
      alert('Invalid Admin credentials');
    }
  };

  const handleUserLogin = () => {
    // Simulate login (you'll later connect to MongoDB)
    if (email && pass) {
      alert('User logged in (simulation)');
      onClose();
    } else {
      alert('Enter valid user credentials');
    }
  };

  const handleUserSignup = () => {
    // Simulate signup
    if (email && pass) {
      alert('User registered (simulation)');
      setIsSignup(false); // Switch to login mode
    } else {
      alert('Fill in all fields');
    }
  };

  return (
    <div className="login-popup-overlay">
      <div className="login-popup">
        <button className="close-btn" onClick={onClose}>×</button>

        {/* Tabs */}
        <div className="login-tabs">
          <button
            className={activeTab === 'user' ? 'active' : ''}
            onClick={() => setActiveTab('user')}
          >User</button>
          <button
            className={activeTab === 'admin' ? 'active' : ''}
            onClick={() => setActiveTab('admin')}
          >Admin</button>
        </div>

        {/* Admin Form */}
        {activeTab === 'admin' && (
          <div>
            <h2>🔐 Admin Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="login-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="login-input"
            />
            <button className="login-submit" onClick={handleAdminLogin}>Login</button>
          </div>
        )}

        {/* User Form */}
        {activeTab === 'user' && (
          <div>
            <h2>{isSignup ? '👤 User Signup' : '👤 User Login'}</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="login-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="login-input"
            />
            <button
              className="login-submit"
              onClick={isSignup ? handleUserSignup : handleUserLogin}
            >
              {isSignup ? 'Sign Up' : 'Login'}
            </button>

            <p className="toggle-auth" onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? 'Already have an account? Login' : 'New user? Sign up'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;
