import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser, FaShoppingCart, FaCheckCircle, FaClock, FaRupeeSign, FaEdit, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', password: '', location: '' });
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pinSuggestions, setPinSuggestions] = useState([]);
  const [loadingPin, setLoadingPin] = useState(false);
  const [address, setAddress] = useState('');

  console.log("Profile component loaded");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view your profile.');
          setLoading(false);
          return;
        }
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
        if (response.data && response.data.user && response.data.user.location) {
          setAddress(response.data.user.location);
        }
      } catch (err) {
        setError('Failed to load profile. Please make sure you are logged in and the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (pincode.length !== 6 || isNaN(pincode)) {
      setPinSuggestions([]);
      return;
    }
    setLoadingPin(true);
    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      .then(res => res.json())
      .then(data => {
        if (data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
          setPinSuggestions(data[0].PostOffice.map(po => ({
            label: `${po.Name}, ${po.District}, ${po.State} (${po.Pincode})`,
            value: `${po.Name}, ${po.District}, ${po.State} (${po.Pincode})`
          })));
        } else {
          setPinSuggestions([]);
        }
        setLoadingPin(false);
      })
      .catch(() => {
        setPinSuggestions([]);
        setLoadingPin(false);
      });
  }, [pincode]);

  const handleSelectPinSuggestion = (suggestion) => {
    setPincode(suggestion.value);
    setAddress(suggestion.value);
    setPinSuggestions([]);
  };

  const openEditModal = () => {
    setEditData({ name: profile.user.name, email: profile.user.email, password: '', location: profile.user.location || '' });
    setEditError('');
    setEditSuccess('');
    setShowEdit(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/users/profile',
        { name: editData.name, email: editData.email, password: editData.password, location: address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditSuccess('Profile updated successfully!');
      setProfile((prev) => ({
        ...prev,
        user: { ...prev.user, name: editData.name, email: editData.email, location: address }
      }));
      localStorage.setItem(
        'user',
        JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), name: editData.name, email: editData.email, location: address })
      );
      setShowEdit(false);
    } catch (err) {
      setEditError('Failed to update profile.');
    }
  };

  const handleAddressSave = async () => {
    setEditError('');
    setEditSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/users/profile',
        { location: address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditSuccess('Address updated successfully!');
      setProfile((prev) => ({
        ...prev,
        user: { ...prev.user, location: address }
      }));
      localStorage.setItem(
        'user',
        JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), location: address })
      );
      setShowAddressModal(false);
    } catch (err) {
      setEditError('Failed to update address.');
    }
  };

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (error) return <div className="profile-error">{error}</div>;
  if (!profile) return null;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUser size={50} />
        </div>
        <div className="profile-info">
          <h1>{profile.user.name}</h1>
          <p>{profile.user.email}</p>
          <p>Member since {new Date(profile.user.joinedDate).toLocaleDateString()}</p>
          <p><FaMapMarkerAlt style={{marginRight: 6}} />{profile.user.location || 'No address set'}</p>
        </div>
        <button className="edit-btn" onClick={openEditModal} title="Edit Profile">
          <FaEdit /> Edit Profile
        </button>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <FaShoppingCart size={24} />
          <h3>Total Orders</h3>
          <p>{profile.stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <FaRupeeSign size={24} />
          <h3>Total Spent</h3>
          <p>₹{profile.stats.totalSpent.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <FaCheckCircle size={24} />
          <h3>Completed Orders</h3>
          <p>{profile.stats.completedOrders}</p>
        </div>
        <div className="stat-card">
          <FaClock size={24} />
          <h3>Pending Orders</h3>
          <p>{profile.stats.pendingOrders}</p>
        </div>
      </div>

      <div className="recent-orders">
        <h2>Recent Orders</h2>
        {profile.recentOrders.length > 0 ? (
          <div className="orders-list">
            {profile.recentOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <span>Order #{order._id.slice(-6)}</span>
                  <span className={`status ${order.status}`}>{order.status}</span>
                </div>
                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item._id} className="order-item">
                      <img src={item.product?.image || '/placeholder.png'} alt={item.product?.name || 'Product'} />
                      <div className="item-details">
                        <h4>{item.product?.name || 'Product'}</h4>
                        <p>₹{item.product?.price?.toLocaleString() || 'N/A'}</p>
                        <p>Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <span>Total: ₹{order.totalAmount.toLocaleString()}</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-orders">No recent orders</p>
        )}
      </div>

      {showEdit && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Profile</h2>
            <form onSubmit={handleEditSubmit}>
              <label>
                Name:
                <input type="text" name="name" value={editData.name} onChange={handleEditChange} required />
              </label>
              <label>
                Email:
                <input type="email" name="email" value={editData.email} onChange={handleEditChange} required />
              </label>
              <label>
                New Password:
                <input type="password" name="password" value={editData.password} onChange={handleEditChange} placeholder="Leave blank to keep current" />
              </label>
              <label>
                Address:
                <input type="text" name="location" value={address} readOnly style={{background:'#f9f9f9', cursor:'pointer'}} onClick={()=>setShowAddressModal(true)} placeholder="Click to set address" />
                <button type="button" className="edit-btn" style={{marginTop:8}} onClick={()=>setShowAddressModal(true)}>Edit Address</button>
              </label>
              {editError && <div className="edit-error">{editError}</div>}
              {editSuccess && <div className="edit-success">{editSuccess}</div>}
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowEdit(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showAddressModal && (
        <div className="location-modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="location-modal" onClick={e => e.stopPropagation()}>
            <h3>Update Your Address</h3>
            <div className="location-search-input-container">
              <FaSearch className="location-search-icon" />
              <input
                type="text"
                placeholder="Enter 6-digit pincode..."
                className="location-search-input"
                value={pincode}
                onChange={e => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={6}
                autoFocus
              />
            </div>
            <div>
              {loadingPin && <div>Loading...</div>}
              {pinSuggestions.map(suggestion => (
                <div
                  key={suggestion.value}
                  className="suggestion-item"
                  onClick={() => handleSelectPinSuggestion(suggestion)}
                >
                  {suggestion.label}
                </div>
              ))}
              {!loadingPin && pincode.length === 6 && pinSuggestions.length === 0 && (
                <div className="suggestion-item">No results found</div>
              )}
            </div>
            <div className="location-modal-buttons">
              <button onClick={handleAddressSave} className="save-btn">Save Address</button>
              <button onClick={() => setShowAddressModal(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
