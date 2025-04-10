import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [material, setMaterial] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const navigate = useNavigate(); // ✅ Hook at top level

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('material', material);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('image', image); // should match backend's multer key

    try {
      const res = await axios.post('http://localhost:5000/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('✅ Product added successfully!');
      console.log('Product added:', res.data);

      navigate('/'); // ✅ Redirect to homepage to view new product
    } catch (err) {
      console.error('❌ Upload failed:', err);
      alert('Failed to add product');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" required onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Category" required onChange={(e) => setCategory(e.target.value)} />
      <input type="text" placeholder="Material" required onChange={(e) => setMaterial(e.target.value)} />
      <input type="number" placeholder="Price" required onChange={(e) => setPrice(e.target.value)} />
      <textarea placeholder="Description" required onChange={(e) => setDescription(e.target.value)} />
      <input type="file" required onChange={(e) => setImage(e.target.files[0])} />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProduct;
