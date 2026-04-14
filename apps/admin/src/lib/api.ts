import axios, { type AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure axios-retry
axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
    return !error.response || (error.response.status >= 500 && error.response.status <= 599);
  },
  onRetry: (retryCount, error) => {
    console.warn(`Retrying request (${retryCount}/3)...`, error.message);
  }
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
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest = error.config;

    // 1. Handle Token Refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      const state = useAuthStore.getState();
      if (state.isTokenExpired()) {
        try {
          originalRequest._retry = true;
          await state.refreshToken();
          const token = state.getAccessToken();
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error("Failed to refresh token", refreshError);
          state.logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    // 2. Global Error Redirection (When retries are exhausted or non-retryable)
    // We check if axios-retry has finished all attempts
    const isLastRetry = !originalRequest['axios-retry'] || originalRequest['axios-retry'].retryCount >= 3;
    
    if (isLastRetry) {
      const skipRedirect = [401, 403, 404, 422].includes(error.response?.status) || originalRequest.url?.includes('/auth/');
      
      if (!skipRedirect) {
        console.error("API Error: Max retries reached or critical failure. Redirecting to error page.", error);
        if (window.location.pathname !== '/error') {
          window.location.href = '/error';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;