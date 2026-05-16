import axios from 'axios';
import Constants from 'expo-constants';

// Resolve backend host at runtime.
// On a physical device running in Expo Go the Metro server host = the backend host,
// so we pull the IP from Constants.  Emulator fallbacks remain as a safety net.
function getBaseURL(): string {
  // expo-constants hostUri looks like "192.168.1.x:8081"
  const hostUri =
    Constants?.expoConfig?.hostUri ??
    (Constants as any)?.manifest?.debuggerHost ??
    (Constants as any)?.manifest2?.extra?.expoGo?.debuggerHost;

  if (hostUri) {
    const host = hostUri.split(':')[0]; // strip port, keep IP
    return `http://${host}:4000/api`;
  }

  // Fallback for emulators / bare workflow
  const { Platform } = require('react-native');
  return Platform.OS === 'android'
    ? 'http://10.0.2.2:4000/api'
    : 'http://localhost:4000/api';
}

export const api = axios.create({
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Set baseURL lazily on first use
api.interceptors.request.use((config) => {
  if (!api.defaults.baseURL) {
    api.defaults.baseURL = getBaseURL();
  }
  config.baseURL = config.baseURL ?? getBaseURL();
  return config;
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Auth
export const authAPI = {
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'customer' | 'rider';
    vehicleType?: string;
    vehiclePlate?: string;
  }) => api.post('/auth/register', data),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  me: () => api.get('/auth/me'),
};

// Orders
export const orderAPI = {
  create: (data: {
    pickup: object;
    dropoff: object;
    vehicleType: string;
    note?: string;
    packageDescription?: string;
    paymentMethod: string;
  }) => api.post('/orders', data),

  getById: (id: string) => api.get(`/orders/${id}`),
  getMyOrders: () => api.get('/orders/my'),
  cancel: (id: string, reason?: string) =>
    api.patch(`/orders/${id}/cancel`, { reason }),
  rate: (id: string, rating: number, review?: string) =>
    api.patch(`/orders/${id}/rate`, { rating, review }),
};

// Rider-specific
export const riderAPI = {
  toggleOnline: (isOnline: boolean) =>
    api.patch('/riders/status', { isOnline }),
  updateLocation: (lat: number, lng: number) =>
    api.patch('/riders/location', { latitude: lat, longitude: lng }),
  acceptOrder: (orderId: string) =>
    api.patch(`/riders/orders/${orderId}/accept`),
  rejectOrder: (orderId: string) =>
    api.patch(`/riders/orders/${orderId}/reject`),
  updateOrderStatus: (orderId: string, status: string) =>
    api.patch(`/riders/orders/${orderId}/status`, { status }),
  getEarnings: () => api.get('/riders/earnings'),
};
