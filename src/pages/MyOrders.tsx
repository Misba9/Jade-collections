import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ordersApi } from '../lib/api';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Package } from 'lucide-react';

interface OrderItem {
  product?: { title: string; images?: string[] };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  orderItems: OrderItem[];
  createdAt: string;
}

export const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    ordersApi
      .myOrders()
      .then((res) => setOrders(res.data.data ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="pt-24 pb-16 min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="font-serif text-2xl text-jade-950 mb-4">My Orders</h1>
        <p className="text-stone-600 mb-6">Please sign in to view your orders.</p>
        <Link to="/login?redirect=/profile/orders">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-stone-500">Loading orders...</div>
      </div>
    );
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-serif text-3xl font-bold text-jade-950 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
            <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-600 mb-6">You haven&apos;t placed any orders yet.</p>
            <Link to="/shop">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl border border-stone-200 p-6"
              >
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <p className="text-sm text-stone-500">
                      Order #{order._id.slice(-8).toUpperCase()} •{' '}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="font-semibold text-jade-950 mt-1">
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full capitalize ${statusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <div className="border-t border-stone-100 pt-4 space-y-2">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-stone-600">
                        {item.product?.title ?? 'Product'} × {item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
