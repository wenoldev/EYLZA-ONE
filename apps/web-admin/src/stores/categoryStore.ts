import api from '@/lib/api';
import { create } from 'zustand';

export interface Category {
  id: string;
  store_id: string;
  name: string;
  slug: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CategoryFilters {
  store_id?: string;
  status?: string;
  search?: string;
}

interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  filters: CategoryFilters;
  fetchCategories: (filters?: CategoryFilters) => Promise<void>;
  fetchCategoryById: (id: string) => Promise<void>;
  createCategory: (categoryData: Partial<Category>) => Promise<Category>;
  updateCategory: (id: string, categoryData: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  bulkDeleteCategories: (ids: string[]) => Promise<void>;
  setFilters: (filters: CategoryFilters) => void;
  clearError: () => void;
  clearCurrentCategory: () => void;
  reset: () => void;
  getCategoriesByStore: (storeId: string) => Category[];
  getActiveCategories: () => Category[];
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
      categories: [],
      currentCategory: null,
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      error: null,
      filters: {},

fetchCategories: async (filters?: CategoryFilters) => {
  set({ isLoading: true, error: null });

  try {
    const currentFilters = {
      ...get().filters,
      ...filters,
    };

    // Remove empty, null, undefined or invalid search filters
    const cleanedFilters = Object.fromEntries(
      Object.entries(currentFilters).filter(([key, value]) => {
        if (value === undefined || value === null || value === '') return false;
        if (key === 'search' && !filters?.search) return false;
        return true;
      })
    );

    // ✅ Axios handles serialization automatically
    const response = await api.get(`/api/v1/categories`, { params: cleanedFilters });
    const result = response.data;

    if (result.error) {
      throw new Error(result.error?.message || 'Failed to fetch categories');
    }

    set({
      categories: result.data?.categories || [],
      filters: currentFilters,
      isLoading: false,
      error: null,
    });
  } catch (error) {
    set({
      error: error instanceof Error ? error.message : 'Failed to fetch categories',
      isLoading: false,
    });
    throw error;
  }
},

      fetchCategoryById: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await api.get(`/api/v1/categories/${id}`);
          const result = response.data;

          if (result.error) {
            throw new Error(result.error?.message || 'Failed to fetch category');
          }

          set({
            currentCategory: result.data.category,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch category',
            isLoading: false,
          });
          throw error;
        }
      },

      createCategory: async (categoryData: Partial<Category>) => {
        set({ isCreating: true, error: null });
        
        try {
          const response = await api.post(`/api/v1/categories`, categoryData);
          const result = response.data;

          if (result.error) {
            throw new Error(result.error?.message || 'Failed to create category');
          }

          const newCategory = result.data.category;
          
          set(state => ({
            categories: [newCategory, ...state.categories],
            isCreating: false,
            error: null,
          }));

          return newCategory;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to create category',
            isCreating: false,
          });
          throw error;
        }
      },

      updateCategory: async (id: string, categoryData: Partial<Category>) => {
        set({ isUpdating: true, error: null });
        
        try {
          const response = await api.patch(`/api/v1/categories/${id}`, categoryData);
          const result = response.data;

          if (result.error) {
            throw new Error(result.error?.message || 'Failed to update category');
          }

          const updatedCategory = result.data.category;
          
          set(state => ({
            categories: state.categories.map(category => 
              category.id === id ? updatedCategory : category
            ),
            currentCategory: state.currentCategory?.id === id ? updatedCategory : state.currentCategory,
            isUpdating: false,
            error: null,
          }));

          return updatedCategory;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update category',
            isUpdating: false,
          });
          throw error;
        }
      },

      deleteCategory: async (id: string) => {
        set({ isDeleting: true, error: null });
        
        try {
          const response = await api.delete(`/api/v1/categories/${id}`);
          const result = response.data;

          if (result.error) {
            throw new Error(result.error?.message || 'Failed to delete category');
          }

          set(state => ({
            categories: state.categories.filter(category => category.id !== id),
            currentCategory: state.currentCategory?.id === id ? null : state.currentCategory,
            isDeleting: false,
            error: null,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete category',
            isDeleting: false,
          });
          throw error;
        }
      },

      bulkDeleteCategories: async (ids: string[]) => {
        set({ isDeleting: true, error: null });
        
        try {
          const deletePromises = ids.map(id => api.delete(`/api/v1/categories/${id}`));
          const responses = await Promise.all(deletePromises);
          
          const failedDeletions = responses.filter(response => response.data.error);
          if (failedDeletions.length > 0) {
            throw new Error(`Failed to delete ${failedDeletions.length} categories`);
          }

          set(state => ({
            categories: state.categories.filter(category => !ids.includes(category.id)),
            isDeleting: false,
            error: null,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete categories',
            isDeleting: false,
          });
          throw error;
        }
      },

      setFilters: (filters: CategoryFilters) => {
        set(state => ({
          filters: { ...state.filters, ...filters }
        }));
      },

      clearError: () => {
        set({ error: null });
      },

      clearCurrentCategory: () => {
        set({ currentCategory: null });
      },

      reset: () => {
        set({
          categories: [],
          currentCategory: null,
          isLoading: false,
          isCreating: false,
          isUpdating: false,
          isDeleting: false,
          error: null,
          filters: {},
        });
      },

      getCategoriesByStore: (storeId: string) => {
        return get().categories.filter(category => category.store_id === storeId);
      },

      getActiveCategories: () => {
        return get().categories.filter(category => category.status === 'active');
      },
    }
  )
);

export const useCategories = () => {
  const { 
    categories, 
    isLoading, 
    error, 
    filters, 
    getCategoriesByStore, 
    getActiveCategories 
  } = useCategoryStore();
  
  return { 
    categories, 
    isLoading, 
    error, 
    filters, 
    getCategoriesByStore, 
    getActiveCategories 
  };
};

export const useCategoryActions = () => {
  const {
    fetchCategories,
    fetchCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    bulkDeleteCategories,
    setFilters,
    clearError,
    clearCurrentCategory,
    reset,
  } = useCategoryStore();
  
  return {
    fetchCategories,
    fetchCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    bulkDeleteCategories,
    setFilters,
    clearError,
    clearCurrentCategory,
    reset,
  };
};

export const useCurrentCategory = () => {
  const { currentCategory, isLoading, error } = useCategoryStore();
  return { currentCategory, isLoading, error };
};