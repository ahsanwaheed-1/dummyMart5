import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import Header from './components/Header';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProductDetail from './pages/ProductDetail';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <ProductProvider>
      <Router>
        <div className="bg-yellow-200 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:name" element={<ProductDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </div>
      </Router>
    </ProductProvider>
  );
}

export default App;