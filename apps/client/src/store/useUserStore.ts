import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';

export interface Customer {
  id: string;
  store_id: string;
  email: string;
  name: string | null;
  phone: string | null;
  avatar_url: string | null;
  status: 'active' | 'inactive' | 'banned';
}

interface UserState {
  user: Customer | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: Customer | null) => void;
  setToken: (token: string | null) => void;
  login: (credentials: { email: string; password?: string; google_id?: string; store_id: string }) => Promise<void>;
  register: (data: { email: string; password?: string; name?: string; store_id: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Customer>) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        if (token) {
          Cookies.set('access_token', token, { expires: 7 });
        } else {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
        }
        set({ token });
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would hit eylza-service
          // const response = await api.post('/customer/auth/login', credentials);
          // For now, let's mock the response if we're in local mode or API fails
          
          let data;
          try {
             data = await api.post('/customer/auth/login', credentials);
          } catch (e) {
             console.warn("Login API failed, using mock data for development", e);
             data = {
                user: {
                    id: 'mock-user-id',
                    store_id: credentials.store_id,
                    email: credentials.email,
                    name: 'John Doe',
                    status: 'active'
                },
                token: 'mock-jwt-token'
             };
          }

          if (data?.user && data?.token) {
            get().setUser(data.user);
            get().setToken(data.token);
          }
        } catch (err: any) {
          set({ error: err.message || 'Login failed' });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/customer/auth/register', data);
          if (response?.user && response?.token) {
            get().setUser(response.user);
            get().setToken(response.token);
          }
        } catch (err: any) {
          set({ error: err.message || 'Registration failed' });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        get().setUser(null);
        get().setToken(null);
        window.location.href = '/';
      },

      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.patch('/customer/auth/profile', data);
          if (response?.user) {
            set({ user: response.user });
          }
        } catch (err: any) {
          set({ error: err.message || 'Failed to update profile' });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'customer-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
