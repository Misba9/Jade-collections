import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../lib/api';
import { useAuth } from './AuthContext';

interface CartItem {
  product: { _id: string; title: string; images?: string[]; price: number; discountPrice?: number };
  quantity: number;
  size?: string;
  color?: string;
  unitPrice?: number;
  unitDiscountPrice?: number;
}

interface Cart {
  items: CartItem[];
  totalPrice?: number;
  subtotal?: number;
  discountSaved?: number;
}

interface CartContextType {
  cart: Cart | null;
  cartCount: number;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await cartApi.get();
      setCart(data.data ?? null);
    } catch {
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const cartCount = cart?.items?.reduce((sum, i) => sum + (i.quantity ?? 0), 0) ?? 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, isLoading, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
