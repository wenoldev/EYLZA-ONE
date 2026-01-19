import axios, { type AxiosInstance } from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authorization token
api.interceptors.request.use(
  (config) => {
    const state = useAuthStore.getState();
    const token = state.getAccessToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (originalRequest.url.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      const state = useAuthStore.getState();

      if (state.isTokenExpired()) {
        try {
          await state.refreshToken();

          const token = state.getAccessToken();

          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest); // retry
          }
        } catch (refreshError) {
          console.error("Failed to refresh token", refreshError);
          state.logout();
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;