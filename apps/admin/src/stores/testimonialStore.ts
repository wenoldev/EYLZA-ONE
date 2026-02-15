/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/lib/api';
import { create } from 'zustand';

export interface Testimonial {
    id: string;
    store_id: string;
    name: string;
    review: string;
    profile_image?: string;
    meta_data?: any;
    created_at: string;
}

export interface TestimonialFilters {
    page?: number;
    limit?: number;
    store_id?: string;
}

export interface TestimonialPagination {
    page: number;
    limit: number;
    total: number;
}

interface TestimonialState {
    testimonials: Testimonial[];
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    error: string | null;
    pagination: TestimonialPagination | null;
    fetchTestimonials: (storeId: string, filters?: TestimonialFilters) => Promise<void>;
    createTestimonial: (data: Partial<Testimonial>) => Promise<Testimonial>;
    updateTestimonial: (id: string, data: Partial<Testimonial>) => Promise<Testimonial>;
    deleteTestimonial: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useTestimonialStore = create<TestimonialState>((set) => ({
    testimonials: [],
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
    pagination: null,

    fetchTestimonials: async (storeId: string, filters?: TestimonialFilters) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/api/v1/testimonials', {
                params: { ...filters, store_id: storeId },
            });
            const result = response.data;
            if (result.error) throw new Error(result.error.message);

            set({
                testimonials: result.data.testimonials || [],
                pagination: result.data.pagination || null,
                isLoading: false,
                error: null,
            });
        } catch (error: any) {
            set({ isLoading: false, error: error.message || 'Failed to fetch testimonials' });
        }
    },

    createTestimonial: async (data: Partial<Testimonial>) => {
        set({ isCreating: true, error: null });
        try {
            const response = await api.post('/api/v1/testimonials', data);
            const result = response.data;
            if (result.error) throw new Error(result.error.message);

            const newTestimonial = result.data.testimonial;
            set((state) => ({
                testimonials: [newTestimonial, ...state.testimonials],
                isCreating: false,
                error: null,
            }));
            return newTestimonial;
        } catch (error: any) {
            set({ isCreating: false, error: error.message || 'Failed to create testimonial' });
            throw error;
        }
    },

    updateTestimonial: async (id: string, data: Partial<Testimonial>) => {
        set({ isUpdating: true, error: null });
        try {
            const response = await api.patch(`/api/v1/testimonials/${id}`, data);
            const result = response.data;
            if (result.error) throw new Error(result.error.message);

            const updatedTestimonial = result.data.testimonial;
            set((state) => ({
                testimonials: state.testimonials.map((t) => (t.id === id ? updatedTestimonial : t)),
                isUpdating: false,
                error: null,
            }));
            return updatedTestimonial;
        } catch (error: any) {
            set({ isUpdating: false, error: error.message || 'Failed to update testimonial' });
            throw error;
        }
    },

    deleteTestimonial: async (id: string) => {
        set({ isDeleting: true, error: null });
        try {
            const response = await api.delete(`/api/v1/testimonials/${id}`);
            const result = response.data;
            if (result.error) throw new Error(result.error.message);

            set((state) => ({
                testimonials: state.testimonials.filter((t) => t.id !== id),
                isDeleting: false,
                error: null,
            }));
        } catch (error: any) {
            set({ isDeleting: false, error: error.message || 'Failed to delete testimonial' });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));
