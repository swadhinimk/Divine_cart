import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductDetails.css";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice"; // Make sure this path matches your project structure

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart(product)); // ✅ Add product to cart
    navigate("/cart"); // ✅ Navigate to cart page
  };

  if (loading) return <div className="product-detail-container">Loading...</div>;
  if (!product) return <div className="product-detail-container">Product not found.</div>;

  return (
    <div className="product-detail-container">
      <div className="product-image-section">
        <img
          src={`http://localhost:5000${product.imageUrl}`}
          alt={product.name}
          className="product-detail-image"
        />
      </div>

      <div className="product-info-section">
        <h2>{product.name}</h2>
        <p className="product-price">₹{product.price}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Material:</strong> {product.material}</p>
        <p className="product-description">{product.description}</p>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
