import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ordersApi } from '../lib/api';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';

export const Checkout = () => {
  const { user } = useAuth();
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    phone: '',
  });

  const items = cart?.items ?? [];
  const isEmpty = items.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await ordersApi.create({
        shippingAddress: {
          street: address.street,
          city: address.city,
          state: address.state || undefined,
          zip: address.zip || undefined,
          country: address.country,
          phone: address.phone || undefined,
        },
        paymentMethod: 'cod',
      });
      await refreshCart();
      navigate(`/profile/orders`, { state: { orderId: data.data?._id } });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="pt-24 pb-16 min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-stone-600 mb-6">Please sign in to checkout.</p>
        <Link to="/login?redirect=/checkout">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="pt-24 pb-16 min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-stone-600 mb-6">Your cart is empty.</p>
        <Link to="/shop">
          <Button>Shop Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="font-serif text-3xl font-bold text-jade-950 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
          )}

          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
            <h2 className="font-serif text-xl font-semibold text-jade-950">Shipping Address</h2>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Street *</label>
              <input
                type="text"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-500"
                placeholder="House no., Building, Street"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">City *</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">State</label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">ZIP / PIN</label>
                <input
                  type="text"
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Country *</label>
                <input
                  type="text"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
              <input
                type="tel"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-500"
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <div className="flex justify-between font-semibold text-jade-950 text-lg">
              <span>Order Total</span>
              <span>{formatPrice(cart?.totalPrice ?? 0)}</span>
            </div>
            <p className="text-sm text-stone-500 mt-2">Cash on Delivery (COD) available</p>
          </div>

          <Button type="submit" className="w-full" size="lg" isLoading={submitting}>
            Place Order
          </Button>
        </form>
      </div>
    </div>
  );
};
