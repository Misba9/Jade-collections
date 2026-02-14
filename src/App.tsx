import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Collections } from './pages/Collections';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import { Profile } from './pages/Profile';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { MyOrders } from './pages/MyOrders';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { UserProtectedRoute } from './components/UserProtectedRoute';
import { AdminProtectedRoute } from './admin/AdminProtectedRoute';
import { AdminLayout } from './admin/components/AdminLayout';
import { AdminLogin } from './admin/pages/AdminLogin';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { AdminProducts } from './admin/pages/AdminProducts';
import { AdminOrders } from './admin/pages/AdminOrders';
import { AdminCustomers } from './admin/pages/AdminCustomers';
import { AdminCoupons } from './admin/pages/AdminCoupons';
import { AdminCategories } from './admin/pages/AdminCategories';
import { AdminBanners } from './admin/pages/AdminBanners';
import { AdminSettings } from './admin/pages/AdminSettings';

const Placeholder = ({ title }: { title: string }) => (
  <div className="container mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
    <h1 className="text-4xl font-serif text-jade-900 mb-4">{title}</h1>
    <p className="text-gray-600">This page is currently being curated for you.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Store routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="collections" element={<Collections />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="wishlist" element={<Placeholder title="Your Wishlist" />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="profile" element={<UserProtectedRoute><Profile /></UserProtectedRoute>} />
              <Route path="profile/orders" element={<UserProtectedRoute><MyOrders /></UserProtectedRoute>} />
              <Route path="*" element={<Placeholder title="Page Not Found" />} />
            </Route>

          {/* Admin routes */}
          <Route
            path="/admin/*"
            element={
              <AdminAuthProvider>
                <Routes>
                  <Route path="login" element={<AdminLogin />} />
                  <Route
                    path="*"
                    element={
                      <AdminProtectedRoute>
                        <AdminLayout />
                      </AdminProtectedRoute>
                    }
                  >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Routes>
              </AdminAuthProvider>
            }
          />
        </Routes>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
