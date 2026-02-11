import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Collections } from './pages/Collections';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { ScrollToTop } from './components/ui/ScrollToTop';

// Placeholder components for routes not fully implemented yet
const Placeholder = ({ title }: { title: string }) => (
  <div className="container mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
    <h1 className="text-4xl font-serif text-jade-900 mb-4">{title}</h1>
    <p className="text-gray-600">This page is currently being curated for you.</p>
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
          <Route path="collections" element={<Collections />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="product/:id" element={<ProductDetails />} />
          
          {/* Placeholders */}
          <Route path="cart" element={<Placeholder title="Shopping Cart" />} />
          <Route path="wishlist" element={<Placeholder title="Your Wishlist" />} />
          <Route path="login" element={<Placeholder title="Login / Register" />} />
          <Route path="*" element={<Placeholder title="Page Not Found" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
