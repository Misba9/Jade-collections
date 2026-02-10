import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { ScrollToTop } from './components/ui/ScrollToTop';

// Placeholder components for routes not fully implemented yet
const Placeholder = ({ title }: { title: string }) => (
  <div className="container mx-auto px-4 py-20 text-center">
    <h1 className="text-3xl font-serif text-jade-900 mb-4">{title}</h1>
    <p className="text-gray-600">This page is under construction.</p>
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="collections" element={<Placeholder title="Collections" />} />
          <Route path="about" element={<Placeholder title="About Us" />} />
          <Route path="contact" element={<Placeholder title="Contact Us" />} />
          <Route path="cart" element={<Placeholder title="Shopping Cart" />} />
          <Route path="login" element={<Placeholder title="Login / Register" />} />
          <Route path="*" element={<Placeholder title="Page Not Found" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
