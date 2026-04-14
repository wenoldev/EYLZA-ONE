import React, { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SideSheet } from '@/components/common/SideSheet';
import DynamicForm from '@/components/common/DynamicForm';
import type { FormField } from '@/types/form';
import DraggableContent from '@/components/common/DraggableContent';
import { useProductStore, useProductActions, type Product } from '@/stores/productStore';
import { useCategoryStore, useCategoryActions } from '@/stores/categoryStore';
import { CircleCheck, Plus, Trash2, Search, RotateCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import FilterList from '@/components/common/FilterList';
import Loader from '@/components/common/Loader';
import { useStoreStore } from '@/stores/storeStore';

const ProductsPage = () => {
  // Local state
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [showSelect, setShowSelect] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<{ label: string, value: string } | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [categoriesInitialized, setCategoriesInitialized] = useState(false);

  const { stores } = useStoreStore();
  const {
    products,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error: productError,
    pagination,
    filters: productFilters
  } = useProductStore();

  const {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
    reorderProducts,
    setFilters: setProductFilters,
    clearError: clearProductError
  } = useProductActions();

  const {
    categories,
    isLoading: categoriesLoading,
    error: categoryError
  } = useCategoryStore();

  const {
    fetchCategories,
    clearError: clearCategoryError
  } = useCategoryActions();

  // Get user's store ID
  const userStoreId = stores?.[0]?.id;

  // Memoized fetch functions
  const fetchProductsData = useCallback(async (filters: any) => {
    if (!userStoreId) return;

    try {
      await fetchProducts(filters);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products. Please refresh the page.");
    }
  }, [userStoreId, fetchProducts]);

  const fetchCategoriesData = useCallback(async () => {
    if (!userStoreId || categoriesInitialized) return;

    try {
      await fetchCategories({ store_id: userStoreId, status: 'active' });
      setCategoriesInitialized(true);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories.");
    }
  }, [userStoreId, categoriesInitialized, fetchCategories]);

  // Initialize categories first
  useEffect(() => {
    if (!userStoreId) return;
    fetchCategoriesData();
  }, [userStoreId, fetchCategoriesData]);

  // Initialize products after categories
  useEffect(() => {
    if (!userStoreId || !categoriesInitialized || hasInitialized) return;

    const initializeProducts = async () => {
      try {
        await fetchProductsData({
          store_id: userStoreId,
          status: 'active',
          ...productFilters
        });
        setHasInitialized(true);
      } catch (error) {
        console.error("Error initializing products:", error);
        toast.error("Failed to load products. Please refresh the page.");
      }
    };

    initializeProducts();
  }, [userStoreId, categoriesInitialized, hasInitialized, fetchProductsData, productFilters]);

  // Handle filter changes with debouncing
  useEffect(() => {
    if (!userStoreId || !hasInitialized) return;

    const filters = {
      store_id: userStoreId,
      status: 'active',
      ...(selectedCategoryFilter ? { category_id: selectedCategoryFilter.value } : {}),
      ...(searchInput.trim() ? { search: searchInput.trim() } : {})
    };

    const debounce = setTimeout(() => {
      fetchProductsData(filters);
    }, 300);

    return () => clearTimeout(debounce);
  }, [selectedCategoryFilter, searchInput, userStoreId, hasInitialized, fetchProductsData]);

  // Error handling
  useEffect(() => {
    if (productError) {
      toast.error(productError);
      clearProductError();
    }
    if (categoryError) {
      toast.error(categoryError);
      clearCategoryError();
    }
  }, [productError, categoryError, clearProductError, clearCategoryError]);

  // Form configuration
  const formFields: FormField[] = React.useMemo(() => [
    { name: "name", label: "Product Name", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "price", label: "Price", type: "number", required: true },
    { name: "original_price", label: "Original Price", type: "number" },
    { name: "stock", label: "Stock Quantity", type: "number" },
    {
      name: "category_ids",
      label: "Categories",
      type: "multi-select",
      options: categories.map(cat => ({ value: cat.id, label: cat.name })),
    },
    { name: "images", label: "Product Images", type: "image-group" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "draft", label: "Draft" }
      ],
      defaultValue: "active"
    }
  ], [categories]);

  // Category filter options
  const categoryFilterOptions = React.useMemo(() =>
    categories.map(cat => ({
      value: cat.id,
      label: cat.name
    })),
    [categories]
  );

  // Handle form submission
  const handleFormSubmit = async (formData: Partial<Product>) => {
    if (!userStoreId) {
      toast.error("Store ID not found. Please try again.");
      return;
    }

    try {
      if (editingItem) {
        await updateProduct(editingItem.id, formData);
        toast.success("Product updated successfully");
      } else {
        await createProduct({
          ...formData,
          store_id: userStoreId
        });
        toast.success("Product created successfully");
      }

      setIsSheetOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  // Handle single delete
  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    try {
      const selectedIds = Array.from(selectedRows)
        .map(index => products[index]?.id)
        .filter((id): id is string => id !== undefined);

      if (selectedIds.length > 0) {
        await bulkDeleteProducts(selectedIds);
        toast.success(`Successfully deleted ${selectedIds.length} products`);
      }

      setSelectedRows(new Set());
      setBulkDeleteDialogOpen(false);
    } catch (error) {
      console.error('Bulk delete error:', error);
    }
  };

  // Handle reorder
  const handleReorder = async (updatedItems: Product[]) => {
    try {
      await reorderProducts(updatedItems);
      toast.success("Products reordered successfully");
    } catch (error) {
      console.error('Reorder error:', error);
      toast.error("Failed to reorder products. Please try again.");
    }
  };

  // Manual search trigger
  const handleSearchClick = () => {
    if (!userStoreId) return;
    console.log({ searchInput });

    const filters = {
      store_id: userStoreId,
      status: 'active',
      ...(selectedCategoryFilter ? { category_id: selectedCategoryFilter.value } : {}),
      ...(searchInput.trim() ? { search: searchInput.trim() } : {})
    };

    fetchProductsData(filters);
  };

  // Handle search input key press
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  // Handle row selection
  const toggleRowSelection = (index: number) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(index)) {
      newSelectedRows.delete(index);
    } else {
      newSelectedRows.add(index);
    }
    setSelectedRows(newSelectedRows);
  };

  // Handle edit
  const handleEdit = (item: Product) => {
    setEditingItem(item);
    setIsSheetOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Handle add new product
  const handleAddNew = () => {
    setEditingItem(null);
    setIsSheetOpen(true);
  };

  // Clear selection when toggling select mode
  const handleToggleSelect = () => {
    setShowSelect(prev => !prev);
    if (showSelect) {
      setSelectedRows(new Set());
    }
  };

  // Handle category filter change
  const handleCategoryFilterChange = (filter: { label: string, value: string } | null) => {
    setSelectedCategoryFilter(filter);
  };

  // Handle pagination
  const handlePaginationChange = (newPage: number) => {
    const newFilters = { ...productFilters, page: newPage };
    setProductFilters(newFilters);
    fetchProductsData({ ...newFilters, store_id: userStoreId });
  };

  // Loading state
  if ((isLoading || categoriesLoading) && products.length === 0 && !hasInitialized) {
    return <Loader />;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className='flex flex-col'>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <Button
            onClick={handleAddNew}
            disabled={isCreating}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {isCreating ? 'Creating...' : 'Add Product'}
          </Button>

          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => fetchProductsData({...productFilters, store_id: userStoreId})} 
            disabled={isLoading}
            title="Refresh"
            className="ml-2"
          >
            <RotateCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

          {categories.length > 0 && (
            <FilterList
              currentFilter={selectedCategoryFilter?.label}
              onFilterChange={handleCategoryFilterChange}
              filterList={categoryFilterOptions}
            />
          )}
        </div>

        {/* Search and Actions */}
        {hasInitialized && (
          <div className='flex justify-between items-center mb-4'>
            <div className="flex items-center">
              <Input
                placeholder="Search products..."
                className='rounded-r-none'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyPress}
              />
              <Button
                onClick={handleSearchClick}
                className='rounded-l-none'
                disabled={isLoading}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {selectedRows.size === 0 && (
                <Button
                  variant={showSelect ? "default" : "outline"}
                  onClick={handleToggleSelect}
                  className="flex items-center gap-2"
                >
                  <CircleCheck className="h-4 w-4" />
                  {showSelect ? 'Cancel Select' : 'Select'}
                </Button>
              )}

              {selectedRows.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setBulkDeleteDialogOpen(true)}
                  className="flex items-center gap-2"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  {isDeleting ? 'Deleting...' : `Delete Selected (${selectedRows.size})`}
                </Button>
              )}
            </div>
          </div>
        )}

        {(isLoading || isUpdating || isDeleting) && products.length > 0 && (
          <div className="flex justify-center items-center py-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              {isLoading && 'Loading products...'}
              {isUpdating && 'Updating product...'}
              {isDeleting && 'Deleting products...'}
            </div>
          </div>
        )}
      </div>

      {products && products.length > 0 ? (
        <DraggableContent
          data={products}
          setData={() => { }}
          component='product'
          onReorder={handleReorder}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          selectedRows={selectedRows}
          toggleRowSelection={toggleRowSelection}
          showSelect={showSelect}
          permissions={['view', 'edit', 'delete', 'drag']}
        />
      ) : (
        <div className='h-full w-full flex flex-col justify-center items-center py-12'>
          <img
            width={300}
            height={300}
            src='/no-data.png'
            alt="no-data-found"
            className="opacity-50"
          />
          <h4 className='text-gray-400 font-bold mt-4'>
            {isLoading ? 'LOADING PRODUCTS...' : (searchInput.trim() || selectedCategoryFilter) ? 'NO RESULTS FOUND' : 'NO PRODUCTS FOUND'}
          </h4>
          {!isLoading && (
            <p className="text-gray-500 text-sm mt-2">
              {(searchInput.trim() || selectedCategoryFilter)
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first product'
              }
            </p>
          )}
        </div>
      )}

      {pagination && pagination.total > pagination.limit && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            disabled={pagination.page <= 1 || isLoading}
            onClick={() => handlePaginationChange(pagination.page - 1)}
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600">
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
          </span>

          <Button
            variant="outline"
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit) || isLoading}
            onClick={() => handlePaginationChange(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <SideSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        title={editingItem ? "Edit Product" : "Add Product"}
        description={editingItem ? "Update product details" : "Provide details to create a new product"}
        resizable={true}
      >
        <DynamicForm
          fields={formFields}
          onSubmit={handleFormSubmit}
          initialValues={editingItem || {}}
        />
      </SideSheet>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setItemToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (itemToDelete) handleDelete(itemToDelete);
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedRows.size} selected products? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBulkDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : `Delete ${selectedRows.size} Products`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;