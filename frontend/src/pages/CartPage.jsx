import React from "react";
import "./CartPage.css";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../redux/cartSlice";
import { Link } from "react-router-dom";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleQuantityChange = (id, quantity) => {
    if (quantity >= 1) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛍️ Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/" className="back-to-shop">← Go back to shop</Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item, index) => (
              <div className="cart-item" key={`${item._id}-${index}`}>
                <img
                  src={`http://localhost:5000${item.imageUrl}`}
                  alt={item.name}
                  className="cart-img"
                />
                <div className="cart-details">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p><strong>Price:</strong> ₹{item.price}</p>
                  <div className="quantity-controls">
                    <button onClick={() =>
                      handleQuantityChange(item._id, item.quantity - 1)
                    }>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() =>
                      handleQuantityChange(item._id, item.quantity + 1)
                    }>+</button>
                  </div>
                  <p><strong>Subtotal:</strong> ₹{item.price * item.quantity}</p>
                  <button
                    className="remove-btn"
                    onClick={() => dispatch(removeFromCart(item._id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
