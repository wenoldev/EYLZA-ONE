/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import api from '@/lib/api';

export interface CMS {
  id: string;
  store_id: string;
  name: string;
  editor_json_url: string;
  content_json_url: string;
  created_at: string;
  updated_at: string;
}

interface CMSState {
  cmsList: CMS[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  error: string | null;
  fetchCMS: (storeId: string) => Promise<void>;
  createCMS: (data: { store_id: string; name: string }) => Promise<void>;
  deleteCMS: (id: string) => Promise<void>;
  updateCMSContent: (id: string, type: 'editor' | 'content', content: any) => Promise<any>;
  clearError: () => void;
}

export const useCMSStore = create<CMSState>((set) => ({
  cmsList: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  error: null,

  fetchCMS: async (storeId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/api/v1/cms?store_id=${storeId}`);
      set({ cmsList: response.data.data.cms, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error?.message || 'Failed to fetch CMS', isLoading: false });
    }
  },

  createCMS: async (data) => {
    set({ isCreating: true, error: null });
    try {
      const response = await api.post('/api/v1/cms', data);
      set((state) => ({
        cmsList: [response.data.data.cms, ...state.cmsList],
        isCreating: false
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error?.message || 'Failed to create CMS', isCreating: false });
      throw error;
    }
  },

  deleteCMS: async (id) => {
    set({ isUpdating: true, error: null });
    try {
      await api.delete(`/api/v1/cms/${id}`);
      set((state) => ({
        cmsList: state.cmsList.filter((c) => c.id !== id),
        isUpdating: false
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error?.message || 'Failed to delete CMS', isUpdating: false });
      throw error;
    }
  },

  updateCMSContent: async (id, type, content) => {
    set({ isUpdating: true, error: null });
    try {
      const response = await api.put(`/api/v1/cms/${id}`, { type, content });
      set((state) => ({
        cmsList: state.cmsList.map((c) => c.id === id ? response.data.data.cms : c),
        isUpdating: false
      }));
      return response.data;
    } catch (error: any) {
      set({ error: error.response?.data?.error?.message || `Failed to update ${type}`, isUpdating: false });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));
