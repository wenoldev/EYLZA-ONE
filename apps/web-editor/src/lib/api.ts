import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { getCookie, setCookie, removeCookie } from '@/utils/cookies';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authorization token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getCookie('access');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getCookie('refresh');

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken
          });

          const { session } = response.data.data;
          const { access_token, refresh_token: newRefreshToken } = session;

          setCookie('access', access_token);
          if (newRefreshToken) setCookie('refresh', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest); // retry
        } catch (refreshError) {
          console.error("Failed to refresh token", refreshError);
          removeCookie('access');
          removeCookie('refresh');
          window.location.href = import.meta.env.VITE_ADMIN_URL || '/';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
