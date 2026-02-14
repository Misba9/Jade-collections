import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { adminAuthApi } from '../lib/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Admin {
  _id: string;
  email: string;
  role: string;
  name?: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAdmin = useCallback(async () => {
    const token = localStorage.getItem('adminAccessToken');
    if (!token) {
      setAdmin(null);
      setIsLoading(false);
      return;
    }
    try {
      const { data } = await adminAuthApi.me();
      setAdmin(data.data);
    } catch {
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('adminRefreshToken');
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAdmin();
  }, [refreshAdmin]);

  const login = async (email: string, password: string) => {
    const { data } = await adminAuthApi.login(email, password);
    localStorage.setItem('adminAccessToken', data.data.accessToken);
    localStorage.setItem('adminRefreshToken', data.data.refreshToken);
    setAdmin(data.data.admin);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('adminRefreshToken');
    if (refreshToken) {
      try {
        await axios.post(`${API_BASE}/auth/logout`, { refreshToken });
      } catch {
        /* ignore */
      }
    }
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, isLoading, login, logout, refreshAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
