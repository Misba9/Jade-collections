import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { cartApi } from '../lib/api';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export const Cart = () => {
  const { user } = useAuth();
  const { cart, isLoading, refreshCart } = useCart();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleUpdateQty = async (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity < 1) return;
    setUpdating(productId);
    try {
      await cartApi.updateQuantity(productId, quantity, size, color);
      await refreshCart();
    } catch {
      alert('Failed to update cart');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (productId: string, size?: string, color?: string) => {
    setUpdating(productId);
    try {
      await cartApi.removeItem(productId, size, color);
      await refreshCart();
    } catch {
      alert('Failed to remove item');
    } finally {
      setUpdating(null);
    }
  };

  if (!user) {
    return (
      <div className="pt-24 pb-16 min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="font-serif text-2xl text-jade-950 mb-4">Your Cart</h1>
        <p className="text-stone-600 mb-6">Please sign in to view your cart.</p>
        <Link to="/login?redirect=/cart">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-stone-500">Loading cart...</div>
      </div>
    );
  }

  const items = cart?.items ?? [];
  const isEmpty = items.length === 0;

  if (isEmpty) {
    return (
      <div className="pt-24 pb-16 min-h-[60vh] flex flex-col items-center justify-center">
        <ShoppingBag className="w-16 h-16 text-stone-300 mb-4" />
        <h1 className="font-serif text-2xl text-jade-950 mb-2">Your cart is empty</h1>
        <p className="text-stone-600 mb-6">Add some beautiful pieces to get started.</p>
        <Link to="/shop">
          <Button>Shop Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-stone-50">
      <div className="container mx-auto px-4">
        <h1 className="font-serif text-3xl font-bold text-jade-950 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const product = item.product;
              const img = product?.images?.[0] ?? '';
              const price = item.unitDiscountPrice ?? item.unitPrice ?? product?.price ?? 0;
              const isUpdating = updating === product?._id;

              return (
                <div
                  key={`${product?._id}-${item.size ?? ''}-${item.color ?? ''}`}
                  className="bg-white rounded-xl border border-stone-200 p-4 flex gap-4"
                >
                  <Link to={`/product/${product?._id}`} className="shrink-0 w-24 h-32 bg-stone-100 rounded overflow-hidden">
                    <img src={img} alt={product?.title} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${product?._id}`} className="font-medium text-jade-900 hover:text-gold-600">
                      {product?.title}
                    </Link>
                    {(item.size || item.color) && (
                      <p className="text-sm text-stone-500 mt-1">
                        {[item.size, item.color].filter(Boolean).join(' • ')}
                      </p>
                    )}
                    <p className="mt-2 font-semibold text-jade-900">{formatPrice(price)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center border border-stone-200 rounded">
                      <button
                        onClick={() => handleUpdateQty(product!._id, item.quantity - 1, item.size, item.color)}
                        disabled={item.quantity <= 1 || isUpdating}
                        className="p-2 hover:bg-stone-50 disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 min-w-[2.5rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQty(product!._id, item.quantity + 1, item.size, item.color)}
                        disabled={isUpdating}
                        className="p-2 hover:bg-stone-50 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(product!._id, item.size, item.color)}
                      disabled={isUpdating}
                      className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-stone-200 p-6 sticky top-28">
              <h2 className="font-serif text-xl font-semibold text-jade-950 mb-4">Order Summary</h2>
              <div className="space-y-2 text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart?.subtotal ?? 0)}</span>
                </div>
                {cart?.discountSaved && cart.discountSaved > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>You save</span>
                    <span>{formatPrice(cart.discountSaved)}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between font-semibold text-jade-950 mt-4 pt-4 border-t">
                <span>Total</span>
                <span>{formatPrice(cart?.totalPrice ?? 0)}</span>
              </div>
              <Link to="/checkout" className="block mt-6">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
