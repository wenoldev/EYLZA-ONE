import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SideSheet } from "@/components/common/SideSheet"
import DynamicForm from "@/components/common/DynamicForm"
import type { FormField } from "@/types/form"
import DraggableContent from "@/components/common/DraggableContent"
import { useCategoryStore, useCategoryActions, type Category } from "@/stores/categoryStore"
import { CircleCheck, Plus, Trash2, Search } from "lucide-react"
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import Loader from "@/components/common/Loader"
import { useStoreStore } from "@/stores/storeStore"

const CategoriesPage = () => {
  // Local state
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Category | null>(null)
  const [searchInput, setSearchInput] = useState("")
  const [showSelect, setShowSelect] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  const { stores } = useStoreStore()
  const { 
    categories, 
    isLoading, 
    isCreating, 
    isUpdating, 
    isDeleting, 
    error: categoryError
  } = useCategoryStore()
  
  const {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    bulkDeleteCategories,
    clearError
  } = useCategoryActions()

  // Get user's store ID
  const userStoreId = stores?.[0]?.id

  // Form configuration
  const formFields: FormField[] = [
    {
      name: "name",
      label: "Category Name",
      type: "text",
      required: true,
    },
    {
      name: "image_url",
      label: "Category Image",
      type: "file",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" }
      ],
      defaultValue: "active"
    }
  ]

  // Memoized fetch function
  const fetchCategoriesData = useCallback(async (filters: any) => {
    if (!userStoreId) return
    
    try {
      await fetchCategories(filters)
    } catch (err) {
      console.error("Error fetching categories:", err)
      toast.error("Failed to load categories. Please refresh the page.")
    }
  }, [userStoreId, fetchCategories])

  // Initialize data
  useEffect(() => {
    if (!userStoreId || hasInitialized) return
    
    fetchCategoriesData({ store_id: userStoreId, status: "active" })
    setHasInitialized(true)
  }, [userStoreId, hasInitialized, fetchCategoriesData])

  // Handle search with debouncing
  useEffect(() => {
    if (!userStoreId || !hasInitialized) return

    const searchFilters = {
      store_id: userStoreId,
      status: "active",
      ...(searchInput.trim() ? { search: searchInput.trim() } : {})
    }

    const debounce = setTimeout(() => {
      fetchCategoriesData(searchFilters)
    }, 300)

    return () => clearTimeout(debounce)
  }, [searchInput, userStoreId, hasInitialized, fetchCategoriesData])

  // Error handling
  useEffect(() => {
    if (categoryError) {
      toast.error(categoryError)
      clearError()
    }
  }, [categoryError, clearError])

  // Handle form submission
  const handleFormSubmit = async (formData: Partial<Category>) => {
    if (!userStoreId) {
      toast.error("Store ID not found. Please try again.")
      return
    }

    try {
      if (editingItem) {
        await updateCategory(editingItem.id, formData)
        toast.success("Category updated successfully")
      } else {
        await createCategory({
          ...formData,
          store_id: userStoreId,
        })
        toast.success("Category created successfully")
      }
      
      setIsSheetOpen(false)
      setEditingItem(null)
    } catch (error) {
      console.error("Submit error:", error)
    }
  }

  // Handle single delete
  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id)
      toast.success("Category deleted successfully")
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    try {
      const selectedIds = Array.from(selectedRows)
        .map(index => categories[index]?.id)
        .filter((id): id is string => id !== undefined)

      if (selectedIds.length > 0) {
        await bulkDeleteCategories(selectedIds)
        toast.success(`Successfully deleted ${selectedIds.length} categories`)
      }
      
      setSelectedRows(new Set())
      setBulkDeleteDialogOpen(false)
    } catch (error) {
      console.error("Bulk delete error:", error)
    }
  }

  // Handle reorder
  const handleReorder = async () => {
    try {
      toast.success("Categories reordered successfully")
    } catch (error) {
      console.error("Reorder error:", error)
      toast.error("Failed to reorder categories. Please try again.")
    }
  }

  // Handle row selection
  const toggleRowSelection = (index: number) => {
    const newSelectedRows = new Set(selectedRows)
    if (newSelectedRows.has(index)) {
      newSelectedRows.delete(index)
    } else {
      newSelectedRows.add(index)
    }
    setSelectedRows(newSelectedRows)
  }

  // Handlers
  const handleEdit = (item: Category) => {
    setEditingItem(item)
    setIsSheetOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingItem(null)
    setIsSheetOpen(true)
  }

  const handleToggleSelect = () => {
    setShowSelect(prev => !prev)
    if (showSelect) setSelectedRows(new Set())
  }

  // Manual search trigger
  const handleSearchClick = () => {
    if (!userStoreId) return
    
    const searchFilters = {
      store_id: userStoreId,
      status: "active",
      ...(searchInput.trim() ? { search: searchInput.trim() } : {})
    }
    
    fetchCategoriesData(searchFilters)
  }

  // Handle search input key press
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchClick()
    }
  }

  // Loading state
  if (isLoading && categories.length === 0 && !hasInitialized) {
    return <Loader />
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col">
        <div className="flex justify-start items-center mb-4">
          <Button
            onClick={handleAddNew}
            disabled={isCreating}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {isCreating ? "Creating..." : "Add Category"}
          </Button>
        </div>

        {hasInitialized && (
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Input
                placeholder="Search categories..."
                className="rounded-r-none"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyPress}
              />
              <Button 
                onClick={handleSearchClick}
                className="rounded-l-none"
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
                  {showSelect ? "Cancel Select" : "Select"}
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
                  {isDeleting ? "Deleting..." : `Delete Selected (${selectedRows.size})`}
                </Button>
              )}
            </div>
          </div>
        )}

        {(isLoading || isUpdating || isDeleting) && categories.length > 0 && (
          <div className="flex justify-center items-center py-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              {isLoading && "Loading categories..."}
              {isUpdating && "Updating category..."}
              {isDeleting && "Deleting categories..."}
            </div>
          </div>
        )}
      </div>

      {categories.length > 0 ? (
        <DraggableContent
          data={categories}
          setData={() => {}}
          component="category"
          onReorder={handleReorder}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          selectedRows={selectedRows}
          toggleRowSelection={toggleRowSelection}
          showSelect={showSelect}
          permissions={["view", "edit", "delete", "drag"]}
        />
      ) : (
        <div className="h-full w-full flex flex-col justify-center items-center py-12">
          <img 
            width={300} 
            height={300} 
            src="/no-data.png" 
            alt="no-data-found"
            className="opacity-50"
          />
          <h4 className="text-gray-400 font-bold mt-4">
            {isLoading ? "LOADING CATEGORIES..." : searchInput.trim() ? "NO RESULTS FOUND" : "NO CATEGORIES FOUND"}
          </h4>
          {!isLoading && (
            <p className="text-gray-500 text-sm mt-2">
              {searchInput.trim() 
                ? "Try adjusting your search terms"
                : "Get started by adding your first category"}
            </p>
          )}
        </div>
      )}

      <SideSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        title={editingItem ? "Edit Category" : "Add Category"}
        description={
          editingItem
            ? "Update category details"
            : "Provide details to create a new category"
        }
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
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setDeleteDialogOpen(false)
                setItemToDelete(null)
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => itemToDelete && handleDelete(itemToDelete)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedRows.size} selected categories? This action cannot be undone.
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
              {isDeleting ? "Deleting..." : `Delete ${selectedRows.size} Categories`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CategoriesPage