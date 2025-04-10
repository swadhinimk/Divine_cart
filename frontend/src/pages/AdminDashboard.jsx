import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [tab, setTab] = useState(null);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    category: '',
    material: '',
    price: '',
    description: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    material: '',
    price: '',
    description: '',
    image: null,
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };

  useEffect(() => {
    if (tab === 'view') {
      fetchProducts();
    }
  }, [tab]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setProduct({ ...product, image: file });
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
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Product added successfully!');
      setProduct({ name: '', category: '', material: '', price: '', description: '', image: null });
      setImagePreview(null);
    } catch (err) {
      console.error("Error adding product:", err.response?.data || err.message);
      alert('Error adding product.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        alert('Product deleted!');
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err.message);
        alert('Failed to delete product.');
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setEditForm({
      name: product.name,
      category: product.category,
      material: product.material,
      price: product.price,
      description: product.description,
      image: null,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      await axios.put(`http://localhost:5000/api/products/${editingProductId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Product updated!');
      setEditingProductId(null);
      fetchProducts();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update product.');
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-dashboard-container">
        <h2 className="admin-heading">Admin Dashboard</h2>

        {tab === null && (
          <div className="tab-buttons">
            <button onClick={() => setTab('add')}>➕ Add Product</button>
            <button onClick={() => setTab('view')}>👁️ View Products</button>
          </div>
        )}

        {tab === 'add' && (
          <>
            <div className="tab-buttons">
              <button className="back-btn" onClick={() => setTab(null)}>← Back</button>
            </div>
            <div className="admin-card">
              <form className="admin-form" onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" value={product.name} onChange={handleChange} required />
                <input type="text" name="category" placeholder="Category" value={product.category} onChange={handleChange} required />
                <input type="text" name="material" placeholder="Material" value={product.material} onChange={handleChange} required />
                <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={product.description} onChange={handleChange} required />
                <input type="file" name="image" accept="image/*" onChange={handleChange} required />
                {imagePreview && <img src={imagePreview} alt="Preview" className="admin-img-preview" />}
                <button type="submit">Add Product</button>
              </form>
            </div>
          </>
        )}

        {tab === 'view' && (
          <>
            <div className="tab-buttons">
              <button className="back-btn" onClick={() => setTab(null)}>← Back</button>
            </div>
            <div className="product-list">
              {products.length === 0 ? (
                <p>No products available.</p>
              ) : (
                products.map((item) => (
                  <div className="product-item" key={item._id}>
                    <img src={`http://localhost:5000${item.imageUrl}`} alt={item.name} />
                    <div>
                      <h4>{item.name}</h4>
                      <p>Category: {item.category}</p>
                      <p>Price: ₹{item.price}</p>
                    </div>
                    <button onClick={() => handleEditClick(item)}>Edit</button>
                    <button onClick={() => handleDelete(item._id)} className="delete-btn">Delete</button>

                    {editingProductId === item._id && (
                      <form onSubmit={handleUpdate} className="edit-form">
                        <input type="text" name="name" value={editForm.name} onChange={handleEditChange} required />
                        <input type="text" name="category" value={editForm.category} onChange={handleEditChange} required />
                        <input type="text" name="material" value={editForm.material} onChange={handleEditChange} required />
                        <input type="number" name="price" value={editForm.price} onChange={handleEditChange} required />
                        <textarea name="description" value={editForm.description} onChange={handleEditChange} required />
                        <input type="file" name="image" onChange={handleEditChange} accept="image/*" />
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setEditingProductId(null)}>Cancel</button>
                      </form>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;