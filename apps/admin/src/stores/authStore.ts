/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LoginResponse, Session, User, UserRole } from '@/types/auth';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  isAdmin: () => boolean;
  isVendor: () => boolean;
  getAccessToken: () => string | null;
  isTokenExpired: () => boolean;
  initializeAuth: () => Promise<void>;
  navigator: ((path: string) => void) | null;
  setNavigator: (navFn: (path: string) => void) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      navigator: null as null | ((path: string) => void),
      setNavigator: (navFn: (path: string) => void) => set({ navigator: navFn }),
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.post(`/api/v1/auth`, {
            action: 'login',
            email,
            password,
            options: {
              redirectTo: `${window.location.origin}/auth/callback`
            },
          });

          const result: LoginResponse = response.data;

          if (result.error) {
            const errorMessage = result.error?.message || 'Login failed';
            set({
              error: errorMessage,
              isLoading: false
            });
            return result;
          }

          const userRole = (result.data.user.user_metadata?.role || result.data.role) as UserRole;

          if (userRole !== 'admin' && userRole !== 'vendor') {
            set({
              error: 'Unauthorized: Only admin and vendor access allowed',
              isLoading: false
            });
            return result;
          }

          set({
            user: { ...(result.data.user), role: userRole },
            session: result.data.session,
            role: userRole,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return result;
        } catch (error: any) {
          const backendMessage =
            error?.response?.data?.error?.message ||
            error?.response?.data?.message ||
            error.message ||
            'An unexpected error occurred';
          set({
            error: backendMessage,
            isLoading: false
          });
          throw error;
        }
      },

      logout: async () => {
        const { navigator } = get();
        set({
          user: null,
          session: null,
          role: null,
          isAuthenticated: false,
          error: null
        });
        if (navigator) navigator("/login")
        try {
          const response = await api.post(`/api/v1/auth`, {
            action: "logout",
          });
          console.log(response.data);
        } catch (err) {
          console.error(err);
        }
      },

      refreshToken: async () => {
        const { session, logout, isLoading } = get();

        if (isLoading) return;
        if (!session?.refresh_token) {
          logout();
          return;
        }

        try {
          // axios will throw if status not 2xx
          const response = await api.post('/api/v1/auth/refresh', {
            refresh_token: session.refresh_token,
          });

          const result: { data?: any; error?: any } = response.data;
          // Additional guard: require real session
          if (response.status < 200 || response.status >= 300 || result.error || !result.data?.session) {
            console.warn('Refresh failed or returned no session:', result.error);
            logout();
            return;
          }

          // success -> set session
          set({
            user: result.data.user,
            session: result.data.session,
            role: result.data.user?.user_metadata?.role,
            isAuthenticated: true,
          });
        } catch (err: any) {

          console.error('Token refresh failed (axios):', err);

          // inspect HTTP status (axios attaches response)
          const status = err?.response?.status;
          if (status === 429) {
            console.warn('Rate limited by Supabase (429). Logging out to avoid retry loop.');
          } else if (status === 401) {
            console.warn('Refresh unauthorized (401).');
          }

          logout();
        }
      },

      clearError: () => {
        set({ error: null });
      },

      isAdmin: () => get().role === 'admin',
      isVendor: () => get().role === 'vendor',

      getAccessToken: () => {
        return get().session?.access_token || null;
      },

      isTokenExpired: () => {
        const { session } = get();
        if (!session?.expires_at) return true;

        const currentTime = Math.floor(Date.now() / 1000);
        return session.expires_at - currentTime < 300;
      },

      initializeAuth: async () => {
        const { session, isTokenExpired, refreshToken, isLoading } = get();

        if (isLoading || !session) return;

        if (isTokenExpired()) {
          console.log("Auth token expired, refreshing...");
          await refreshToken();
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        role: state.role,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

export const useAuthGuard = () => {
  const { isAuthenticated, isLoading, user, role, isAdmin, isVendor } = useAuthStore();

  return {
    isAuthenticated,
    isLoading,
    user,
    role,
    isAdmin: isAdmin(),
    isVendor: isVendor()
  };
};

export const useAuthIntegration = () => {
  const { login, logout, error, isLoading, clearError } = useAuthStore();
  const { isAdmin, isVendor } = useAuthGuard();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);

    if (!result.error) {
      const role = result.data.role;
      if (role === 'vendor' || role === 'admin') {
        navigate('/');
      }
      else {
        navigate('/login')
      }
    }

    return result;
  };

  return {
    handleLogin,
    logout,
    error,
    isLoading,
    clearError,
    isAdmin,
    isVendor
  };
};