import React, { useState, useEffect, useRef } from 'react';
import './HomePage.css';
import axios from 'axios';
import LoginPopup from '../components/LoginPopup';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [showLogin, setShowLogin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowLogin(true), 20000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts =
    filter === 'All'
      ? products
      : products.filter((product) => product.category === filter);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    navigate('/cart');
  };

  return (
    <div className="homepage-container">
      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}

      <nav className="navbar">
        <h1 className="logo">🛕 Divine Kart</h1>
        <input type="text" placeholder="Search..." className="search-bar" />

        <div className="nav-links">
          <Link to="/blog" className="nav-link">Blog</Link>
          <Link to="/cart" className="nav-link">Cart</Link>

          <div
            className="profile-container"
            ref={profileRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaUserCircle size={28} className="profile-icon" />
            {dropdownOpen && (
              <div className="profile-dropdown">
                <span
                  className="profile-option"
                  onClick={() => {
                    setShowLogin(true);
                    setDropdownOpen(false);
                  }}
                >
                  Login
                </span>
                <Link
                  to="/profile"
                  className="profile-option"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="filters">
        <button onClick={() => setFilter('All')}>All</button>
        <button onClick={() => setFilter('Deity Statues')}>Deity Statues</button>
        <button onClick={() => setFilter('Puja Accessories')}>Puja Accessories</button>
        <button onClick={() => setFilter('Water Pots')}>Sacred Water Pots</button>
        <button onClick={() => setFilter('Decorative Arches')}>Decorative Arches</button>
      </div>

      <h2 className="section-title">Featured Products</h2>
      <div className="catalogue">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="product-card" key={product._id}>
              {product.imageUrl ? (
                <img
                  src={`http://localhost:5000${product.imageUrl}`}
                  alt={product.name}
                  className="product-image"
                />
              ) : (
                <div className="no-image">No Image</div>
              )}
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Material:</strong> {product.material}</p>
              <p><strong>Price:</strong> ₹{product.price}</p>
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p style={{ padding: '20px' }}>No products found for selected category.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
