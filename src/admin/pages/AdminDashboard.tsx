import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminEndpoints } from '../../lib/api';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatsOverview {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: { month: string; year: number; revenue: number; orderCount: number }[];
  recentOrders: Array<{
    _id: string;
    totalAmount: number;
    orderStatus: string;
    paymentStatus: string;
    user?: { name: string; email: string };
    createdAt: string;
  }>;
}

export const AdminDashboard = () => {
  const [data, setData] = useState<StatsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminEndpoints
      .statsOverview({ recentLimit: 5, months: 6 })
      .then((res) => setData(res.data.data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-10 w-10 border-2 border-jade-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
        {error || 'Failed to load dashboard'}
      </div>
    );
  }

  const stats = [
    { label: 'Revenue', value: `₹${data.totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Orders', value: data.totalOrders.toString(), icon: ShoppingCart, color: 'bg-jade-600' },
    { label: 'Products', value: data.totalProducts.toString(), icon: Package, color: 'bg-amber-500' },
    { label: 'Customers', value: data.totalUsers.toString(), icon: Users, color: 'bg-violet-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif font-semibold text-stone-900">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500">{label}</p>
                <p className="text-2xl font-semibold text-stone-900 mt-1">{value}</p>
              </div>
              <div className={`p-3 rounded-lg ${color} text-white`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900 mb-4">Revenue (Last 6 Months)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-900">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="text-sm text-jade-600 hover:text-jade-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {data.recentOrders.length === 0 ? (
              <p className="text-stone-500 text-sm">No recent orders</p>
            ) : (
              data.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-stone-900">
                      {order.user?.name || 'Guest'} • ₹{order.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-stone-500">
                      {order.orderStatus} • {order.paymentStatus}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.orderStatus === 'delivered'
                        ? 'bg-emerald-100 text-emerald-700'
                        : order.orderStatus === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
