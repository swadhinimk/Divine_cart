import React, { useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    material: '',
    price: '',
    description: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      setProduct({ ...product, image: file });

      // Generate image preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in product) {
      formData.append(key, product[key]);
    }

    try {
      await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Product added successfully!');

      // Reset form
      setProduct({
        name: '',
        category: '',
        material: '',
        price: '',
        description: '',
        image: null
      });
      setImagePreview(null);

    } catch (err) {
      console.error("Error adding product:", err.response?.data || err.message);
      alert('Error adding product.');
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-dashboard-container">
        <h2 className="admin-heading">Admin Dashboard - Add Product</h2>

        <div className="admin-card">
          <form className="admin-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={product.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={product.category}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="material"
              placeholder="Material"
              value={product.material}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={product.price}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={product.description}
              onChange={handleChange}
              required
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="admin-img-preview"
              />
            )}

            <button type="submit">Add Product</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
