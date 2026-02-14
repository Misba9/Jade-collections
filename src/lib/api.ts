import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Public API - no auth, for GET /products, GET /categories (user site)
export const publicApi = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Admin API - uses admin tokens (adminAccessToken, adminRefreshToken)
export const adminApi = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminAccessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // When sending FormData, remove Content-Type so axios sets multipart boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      const adminRefreshToken = localStorage.getItem('adminRefreshToken');
      if (adminRefreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/refresh`, {
            refreshToken: adminRefreshToken,
          });
          localStorage.setItem('adminAccessToken', data.data.accessToken);
          localStorage.setItem('adminRefreshToken', data.data.refreshToken);
          err.config.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return adminApi(err.config);
        } catch {
          localStorage.removeItem('adminAccessToken');
          localStorage.removeItem('adminRefreshToken');
          window.location.href = '/admin/login';
        }
      } else {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

// User API - uses user tokens (accessToken, refreshToken)
export const userApi = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

userApi.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/refresh`, {
            refreshToken,
          });
          localStorage.setItem('accessToken', data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          err.config.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return userApi(err.config);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// Admin auth (admin login uses adminApi - no token needed before login)
export const adminAuthApi = {
  login: (email: string, password: string) =>
    adminApi.post('/admin/login', { email, password }),
  me: () => adminApi.get('/admin/me'),
};

// User auth
export const authApi = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    userApi.post('/auth/register', data),
  login: (email: string, password: string) =>
    userApi.post('/auth/login', { email, password }),
  logout: (refreshToken: string) => userApi.post('/auth/logout', { refreshToken }),
  me: () => userApi.get('/auth/me'),
};

// Admin endpoints (use adminApi)
export const adminEndpoints = {
  statsOverview: (params?: { recentLimit?: number; months?: number }) =>
    adminApi.get('/admin/stats/overview', { params }),
  monthlyRevenue: (params?: { year?: number; months?: number }) =>
    adminApi.get('/admin/stats/revenue/monthly', { params }),
  recentOrders: (limit?: number) =>
    adminApi.get('/admin/stats/orders/recent', { params: { limit } }),
  users: (params?: { page?: number; limit?: number; search?: string }) =>
    adminApi.get('/admin/users', { params }),
};

// Products - public GET (user site + admin list), admin CRUD
export const productsApi = {
  list: (params?: Record<string, string | number | boolean>) =>
    publicApi.get('/products', { params }),
  listAdmin: (params?: Record<string, string | number | boolean>) =>
    adminApi.get('/products', { params: { ...params, includeDeleted: 'true' } }),
  get: (id: string) => publicApi.get(`/products/${id}`),
  create: (data: FormData | Record<string, unknown>) =>
    adminApi.post('/products', data),
  update: (id: string, data: FormData | Record<string, unknown>) =>
    adminApi.put(`/products/${id}`, data),
  delete: (id: string) => adminApi.delete(`/products/${id}`),
};

// Categories - public GET for user site, admin CRUD
export const categoriesApi = {
  list: (params?: { isActive?: boolean | 'all' }) =>
    adminApi.get('/categories', {
      params: params?.isActive !== undefined && params.isActive !== 'all'
        ? { isActive: String(params.isActive) }
        : params?.isActive === 'all'
        ? { isActive: 'all' }
        : {},
    }),
  listPublic: (params?: { isActive?: boolean }) =>
    publicApi.get('/categories', {
      params: params?.isActive !== undefined ? { isActive: String(params.isActive) } : { isActive: 'true' },
    }),
  get: (id: string) => publicApi.get(`/categories/${id}`),
  create: (data: { name: string; isActive?: boolean; image?: string }) =>
    adminApi.post('/categories', data),
  update: (id: string, data: { name?: string; isActive?: boolean; image?: string }) =>
    adminApi.put(`/categories/${id}`, data),
  delete: (id: string) => adminApi.delete(`/categories/${id}`),
};

// Orders
export const ordersApi = {
  list: (params?: { page?: number; limit?: number; orderStatus?: string; paymentStatus?: string }) =>
    adminApi.get('/orders/all', { params }),
  updateStatus: (id: string, orderStatus: string) =>
    adminApi.put(`/orders/${id}/status`, { orderStatus }),
  myOrders: (params?: { page?: number; limit?: number }) =>
    userApi.get('/orders', { params }),
  create: (data: {
    shippingAddress: { street: string; city: string; country: string; state?: string; zip?: string; phone?: string };
    paymentMethod?: string;
    couponCode?: string;
  }) => userApi.post('/orders', data),
};

// Cart (user only - requires login)
export const cartApi = {
  get: () => userApi.get('/cart'),
  addItem: (productId: string, quantity?: number, size?: string, color?: string) =>
    userApi.post('/cart/items', { productId, quantity: quantity ?? 1, size, color }),
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) =>
    userApi.put(`/cart/items/${productId}`, { quantity, size, color }),
  removeItem: (productId: string, size?: string, color?: string) =>
    userApi.delete(`/cart/items/${productId}`, { data: { size, color } }),
  clear: () => userApi.delete('/cart'),
};

// Banners - public GET for user site, admin CRUD
export const bannersApi = {
  list: (params?: { isActive?: boolean | 'all' }) =>
    publicApi.get('/banners', {
      params:
        params?.isActive !== undefined && params.isActive !== 'all'
          ? { isActive: String(params.isActive) }
          : params?.isActive === 'all'
          ? { isActive: 'all' }
          : {},
    }),
  listPublic: () => publicApi.get('/banners', { params: { isActive: 'true' } }),
  get: (id: string) => publicApi.get(`/banners/${id}`),
  create: (data: FormData | Record<string, unknown>) =>
    adminApi.post('/banners', data, {
      headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    }),
  update: (id: string, data: FormData | Record<string, unknown>) =>
    adminApi.put(`/banners/${id}`, data, {
      headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    }),
  delete: (id: string) => adminApi.delete(`/banners/${id}`),
};

// Coupons (admin)
export const couponsApi = {
  list: () => adminApi.get('/coupons'),
  create: (data: Record<string, unknown>) => adminApi.post('/coupons', data),
  update: (id: string, data: Record<string, unknown>) => adminApi.put(`/coupons/${id}`, data),
  delete: (id: string) => adminApi.delete(`/coupons/${id}`),
};
