/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/lib/api';
import { create } from 'zustand';

export interface Product {
  id: string;
  store_id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  original_price?: number;
  currency?: string;
  stock?: number;
  images?: string[];
  meta_data?: any;
  status: 'active' | 'inactive' | 'draft';
  created_at: string;
  updated_at: string;
  product_categories?: string[];
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  store_id?: string;
  category_id?: string;
  status?: string;
  search?: string;
  min_price?: string;
  max_price?: string;
}

export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
}

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  pagination: ProductPagination | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  filters: ProductFilters;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  createProduct: (productData: Partial<Product>) => Promise<Product>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  bulkDeleteProducts: (ids: string[]) => Promise<void>;
  reorderProducts: (products: Product[]) => Promise<void>;
  setFilters: (filters: ProductFilters) => void;
  clearError: () => void;
  clearCurrentProduct: () => void;
  reset: () => void;
}
export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  currentProduct: null,
  pagination: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  filters: {},

  fetchProducts: async (filters?: ProductFilters) => {
    set({ isLoading: true, error: null });

    try {
    const currentFilters = {
      ...get().filters,
      ...filters,
    };

    // Build query params — skip empty/null/undefined AND exclude `search` if not provided
    const queryParams = new URLSearchParams(
      Object.entries(currentFilters)
        .filter(([key, value]) => {
          if (value === undefined || value === null || value === '') return false;
          if (key === 'search' && !filters?.search) return false;
          return true;
        })
        // Ensure all values are strings
        .map(([key, value]) => [key, String(value)])
    );

      const response = await api.get(`/api/v1/public/products`, { params: queryParams });
      const result = response.data;

      if (result.error) {
        throw new Error(result.error?.message || 'Failed to fetch products');
      }

      set({
        products: result.data.products || [],
        pagination: result.data.pagination || null,
        filters: currentFilters,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchProductById: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get(`/api/v1/public/products/${id}`);
      const result = response.data;

      if (result.error) {
        throw new Error(result.error?.message || 'Failed to fetch product');
      }

      set({
        currentProduct: result.data.product,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch product',
        isLoading: false,
      });
      throw error;
    }
  },

  createProduct: async (productData: Partial<Product>) => {
    set({ isCreating: true, error: null });
    
    try {
      const response = await api.post(`/api/v1/products`, productData);
      const result = response.data;
      
      if (result.error) {
        throw new Error(result.error?.message || 'Failed to create product');
      }

      const newProduct = result.data.product;
      
      set(state => ({
        products: [newProduct, ...state.products],
        isCreating: false,
        error: null,
      }));

      return newProduct;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create product',
        isCreating: false,
      });
      throw error;
    }
  },

  updateProduct: async (id: string, productData: Partial<Product>) => {
    set({ isUpdating: true, error: null });
    
    try {
      const response = await api.patch(`/api/v1/products/${id}`, productData);
      const result = response.data;

      if (result.error) {
        throw new Error(result.error?.message || 'Failed to update product');
      }

      const updatedProduct = result.data.product;
      
      set(state => ({
        products: state.products.map(product => 
          product.id === id ? updatedProduct : product
        ),
        currentProduct: state.currentProduct?.id === id ? updatedProduct : state.currentProduct,
        isUpdating: false,
        error: null,
      }));

      return updatedProduct;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update product',
        isUpdating: false,
      });
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    set({ isDeleting: true, error: null });
    
    try {
      const response = await api.delete(`/api/v1/products/${id}`);
      const result = response.data;

      if (result.error) {
        throw new Error(result.error?.message || 'Failed to delete product');
      }

      set(state => ({
        products: state.products.filter(product => product.id !== id),
        currentProduct: state.currentProduct?.id === id ? null : state.currentProduct,
        isDeleting: false,
        error: null,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete product',
        isDeleting: false,
      });
      throw error;
    }
  },

  bulkDeleteProducts: async (ids: string[]) => {
    set({ isDeleting: true, error: null });
    
    try {
      const deletePromises = ids.map(id => api.delete(`/api/v1/products/${id}`));
      const responses = await Promise.all(deletePromises);
      
      const failedDeletions = responses.filter(response => response.data.error);
      if (failedDeletions.length > 0) {
        throw new Error(`Failed to delete ${failedDeletions.length} products`);
      }

      set(state => ({
        products: state.products.filter(product => !ids.includes(product.id)),
        isDeleting: false,
        error: null,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete products',
        isDeleting: false,
      });
      throw error;
    }
  },

  reorderProducts: async (products: Product[]) => {
    try {
      set({ products, error: null });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reorder products',
      });
      throw error;
    }
  },

  setFilters: (filters: ProductFilters) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  clearCurrentProduct: () => {
    set({ currentProduct: null });
  },

  reset: () => {
    set({
      products: [],
      currentProduct: null,
      pagination: null,
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      error: null,
      filters: {},
    });
  },
}));

export const useProducts = () => {
  const { products, isLoading, error, pagination, filters } = useProductStore();
  return { products, isLoading, error, pagination, filters };
};

export const useProductActions = () => {
  const {
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
    reorderProducts,
    setFilters,
    clearError,
    clearCurrentProduct,
    reset,
  } = useProductStore();
  
  return {
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
    reorderProducts,
    setFilters,
    clearError,
    clearCurrentProduct,
    reset,
  };
};

export const useCurrentProduct = () => {
  const { currentProduct, isLoading, error } = useProductStore();
  return { currentProduct, isLoading, error };
};