import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Package, Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="font-serif text-3xl font-bold text-jade-950 mb-8">My Account</h1>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-jade-100 flex items-center justify-center">
              <User className="w-8 h-8 text-jade-700" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-jade-900">{user.name}</h2>
              <p className="text-stone-500">{user.email}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <Link
              to="/profile/orders"
              className="flex items-center gap-4 p-4 rounded-lg border border-stone-200 hover:border-jade-300 hover:bg-jade-50/50 transition-colors"
            >
              <Package className="w-6 h-6 text-jade-700" />
              <div className="flex-1">
                <h3 className="font-medium text-jade-900">My Orders</h3>
                <p className="text-sm text-stone-500">View and track your orders</p>
              </div>
              <span className="text-jade-600">→</span>
            </Link>

            <Link
              to="/wishlist"
              className="flex items-center gap-4 p-4 rounded-lg border border-stone-200 hover:border-jade-300 hover:bg-jade-50/50 transition-colors"
            >
              <Heart className="w-6 h-6 text-jade-700" />
              <div className="flex-1">
                <h3 className="font-medium text-jade-900">Wishlist</h3>
                <p className="text-sm text-stone-500">Your saved items</p>
              </div>
              <span className="text-jade-600">→</span>
            </Link>
          </div>

          <Link to="/shop">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
