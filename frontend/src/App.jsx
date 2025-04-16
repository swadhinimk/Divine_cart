import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetails from './pages/ProductDetails';

// Inside your <Routes>


function App() {
  return (
    
      <Routes>
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    
  );
}

export default App;
