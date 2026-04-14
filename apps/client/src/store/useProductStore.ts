import { create } from 'zustand';
import { api } from '@/lib/api';

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    original_price: number | null;
    currency: string;
    stock: number;
    status: string;
    category_ids: string[];
    images: {
        url: string;
        is_primary: boolean;
        type: string;
    }[];
}

interface ProductFilters {
    category_id?: string;
    search?: string;
    min_price?: number;
    max_price?: number;
    stock_status?: 'in_stock' | 'out_of_stock' | 'all';
    sort_by?: 'alphabetical_asc' | 'alphabetical_desc' | 'price_low_high' | 'price_high_low' | 'newest';
}

interface ProductState {
    products: Product[];
    currentProduct: Product | null;
    isLoading: boolean;
    error: string | null;
    filters: ProductFilters;
    
    // Actions
    fetchProducts: (storeId: string, filters?: ProductFilters) => Promise<void>;
    fetchProductById: (productId: string, storeId: string) => Promise<void>;
    setFilters: (filters: Partial<ProductFilters>) => void;
    clearFilters: () => void;
}

export const useProductStore = create<ProductState>()((set, get) => ({
    products: [],
    currentProduct: null,
    isLoading: false,
    error: null,
    filters: {},

    fetchProducts: async (storeId: string, filters?: ProductFilters) => {
        set({ isLoading: true, error: null });
        try {
            const currentFilters = { ...get().filters, ...filters };
            const params: Record<string, string> = {
                store_id: storeId,
                status: 'active',
            };

            if (currentFilters.category_id) params.category_id = currentFilters.category_id;
            if (currentFilters.search) params.search = currentFilters.search;
            if (currentFilters.min_price) params.min_price = String(currentFilters.min_price);
            if (currentFilters.max_price) params.max_price = String(currentFilters.max_price);
            if (currentFilters.stock_status && currentFilters.stock_status !== 'all') params.stock_status = currentFilters.stock_status;
            if (currentFilters.sort_by) params.sort_by = currentFilters.sort_by;

            const data = await api.get('/public/products', params);
            
            if (data?.products) {
                set({ products: data.products, isLoading: false });
            } else {
                set({ products: [], isLoading: false });
            }
        } catch (err) {
            console.error("Failed to fetch products:", err);
            set({ 
                error: err instanceof Error ? err.message : "Failed to load products", 
                isLoading: false,
                products: [] 
            });
        }
    },

    fetchProductById: async (productId: string, storeId: string) => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.get(`/public/products/${productId}`, { store_id: storeId });
            if (data?.product) {
                set({ currentProduct: data.product, isLoading: false });
            } else {
                set({ currentProduct: null, isLoading: false, error: "Product not found" });
            }
        } catch (err) {
            console.error("Failed to fetch product by ID:", err);
            set({ 
                error: err instanceof Error ? err.message : "Failed to load product details", 
                isLoading: false,
                currentProduct: null 
            });
        }
    },

    setFilters: (newFilters: Partial<ProductFilters>) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters }
        }));
    },

    clearFilters: () => {
        set({ filters: {} });
    }
}));
