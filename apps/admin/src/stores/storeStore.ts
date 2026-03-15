/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/lib/api';
import { create } from 'zustand';

interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  contact_email?: string | null;
  phone?: string | null;
  currency?: string | null;
  country?: string | null;
  city?: string | null;
  timezone?: string | null;
  status: 'active' | 'inactive' | 'suspended' | null;
  color?: string | null;
  user_id?: string | null;
  trial_ends_at?: string | null;
  plan_id?: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface StoreResponse {
  data: {
    stores: Store[];
    page: number;
    limit: number;
  };
  error: { message: string; code: string } | null;
}

interface CreateStorePayload {
  name: string;
  slug?: string;
  description?: string;
  logo_url?: string;
  contact_email?: string;
  phone?: string;
  currency?: string;
  country?: string;
  city?: string;
  timezone?: string;
}

interface UpdateStorePayload {
  name?: string;
  slug?: string;
  description?: string;
  logo_url?: string;
  contact_email?: string;
  phone?: string;
  currency?: string;
  country?: string;
  city?: string;
  timezone?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

interface CreateStoreResponse {
  data: { store: Store };
  error: { message: string; code: string } | null;
}

interface StoreState {
  stores: Store[] | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  activeStoreId: string | null;
  setActiveStoreId: (storeId: string) => void;
  fetchStores: (params?: { page?: number; limit?: number; status?: string; search?: string }) => Promise<void>;
  createStore: (payload: CreateStorePayload) => Promise<Store | null>;
  updateStore: (storeId: string, payload: UpdateStorePayload) => Promise<Store | null>;
  deleteStore: (storeId: string) => Promise<boolean>;
}


interface StoreOperationResponse {
  data: { store?: Store; message?: string };
  error: { message: string; code: string } | null;
}


export const useStoreStore = create<StoreState>((set, get) => ({
  stores: null,
  loading: false,
  error: null,
  page: 1,
  limit: 20,
  total: 0,
  activeStoreId: null,
  setActiveStoreId: (storeId: string) => set({ activeStoreId: storeId }),

  fetchStores: async ({ page = 1, limit = 20, status, search } = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<StoreResponse>('/api/v1/stores', {
        params: { page, limit, status, search },
      });

      if (response.data.error) {
        set({ loading: false, error: response.data.error.message });
        return;
      }
      set({
        stores: response.data.data.stores,
        page: response.data.data.page,
        limit: response.data.data.limit,
        total: response.data.data.stores.length, // Adjust if backend provides total count
        activeStoreId: response.data.data.stores.length > 0 && !get().activeStoreId ? response.data.data.stores[0].id : get().activeStoreId,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.log("here", error);

      set({ loading: false, error: error.response?.data?.error?.message || 'Failed to fetch stores' });
    }
  },

  createStore: async (payload: CreateStorePayload) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post<CreateStoreResponse>('/api/v1/stores', payload);
      if (response.data.error) {
        set({ loading: false, error: response.data.error.message });
        return null;
      }
      const newStore = response.data.data.store;
      set((state) => ({
        stores: state.stores ? [...state.stores, newStore] : [newStore],
        loading: false,
        error: null,
      }));
      return newStore;
    } catch (error: any) {
      set({ loading: false, error: error.response?.data?.error?.message || 'Failed to create store' });
      return null;
    }
  },
  updateStore: async (storeId: string, payload: UpdateStorePayload) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch<StoreOperationResponse>(`/api/v1/stores/${storeId}`, payload);
      if (response.data.error) {
        set({ loading: false, error: response.data.error.message });
        return null;
      }
      const updatedStore = response.data.data.store ?? null;
      set((state) => ({
        stores: state.stores?.map((store) =>
          store.id === storeId && updatedStore ? { ...store, ...updatedStore } : store
        ),
        loading: false,
        error: null,
      }));
      return updatedStore;
    } catch (error: any) {
      set({ loading: false, error: error.response?.data?.error?.message || 'Failed to update store' });
      return null;
    }
  },

  deleteStore: async (storeId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete<StoreOperationResponse>(`/api/v1/stores/${storeId}`);
      if (response.data.error) {
        set({ loading: false, error: response.data.error.message });
        return false;
      }
      set((state) => ({
        stores: state.stores?.filter((store) => store.id !== storeId) || null,
        loading: false,
        error: null,
      }));
      return true;
    } catch (error: any) {
      set({ loading: false, error: error.response?.data?.error?.message || 'Failed to delete store' });
      return false;
    }
  },
}));