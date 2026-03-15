
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CircleCheck, Trash2, Search, RotateCw } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useStoreStore } from "@/stores/storeStore"
import { useQueriesStore } from "@/stores/queryStore"
import type { Query } from "@/types/api"
import DraggableContent from "@/components/common/DraggableContent"
import Loader from "@/components/common/Loader"

const QueryPage = () => {
  const [searchInput, setSearchInput] = useState("")
  const [showSelect, setShowSelect] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const { stores: storeData } = useStoreStore()
  const { queries, loading, error, fetchQueries, deleteQuery } = useQueriesStore()

  useEffect(() => {
    const fetchQueryData = async () => {
      try {
        if (storeData && storeData[0]?.id) {
          await fetchQueries(storeData[0]?.id)
        }
      } catch (error) {
        console.error("Error fetching queries:", error)
        toast.error("Failed to fetch queries. Please try again.")
      }
    }

    const debounce = setTimeout(() => {
      fetchQueryData()
    }, 300)
    return () => clearTimeout(debounce)
  }, [storeData?.[0]?.id, fetchQueries])

  const handleSearch = () => {
    // Implement search logic here if needed
  }

  const toggleRowSelection = (index: number) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteQuery(id)
      toast.success("Query deleted successfully")
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete query. Please try again.")
    }
  }

  const handleReorder = async (updatedItems: Query[]) => {
    try {
      // Update queries in the store directly instead of calling API
      useQueriesStore.setState({ queries: updatedItems })
      toast.success("Queries reordered successfully")
    } catch (error) {
      console.error("Reorder error:", error)
      toast.error("Failed to reorder queries. Please try again.")
    }
  }

  const handleBulkDelete = async () => {
    try {
      const selectedIds = Array.from(selectedRows)
        .map((index) => queries && queries[index]?.id)
        .filter((id): id is string => id !== null && id !== undefined)

      if (selectedIds.length > 0) {
        // Update queries in the store by filtering out selected IDs
        useQueriesStore.setState({
          queries: queries?.filter((query) => !selectedIds.includes(query.id)) || [],
        })
        setSelectedRows(new Set())
        toast.success(`Successfully deleted ${selectedIds.length} queries`)
      }
    } catch (error) {
      console.error("Bulk delete error:", error)
      toast.error("Failed to delete selected queries. Please try again.")
    } finally {
      setBulkDeleteDialogOpen(false)
    }
  }

  const handleToggleSelect = () => {
    setShowSelect(prev => !prev)
    if (showSelect) setSelectedRows(new Set())
  }

  // Loading state - show loader when loading and no queries exist
  if (loading && (!queries || queries.length === 0)) {
    return <Loader />
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col">
        {/* Search and Actions - only show when queries exist */}
        {queries && queries.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Input
                placeholder="Search user queries..."
                className="rounded-r-none"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch()
                  }
                }}
              />
              <Button onClick={handleSearch} className="rounded-l-none">
                <Search className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => fetchQueries(storeData?.[0]?.id)} 
                disabled={loading}
                title="Refresh"
                className="ml-2"
              >
                <RotateCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>

            {/* Selection Controls */}
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
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedRows.size})
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Loading indicator when updating existing queries */}
        {loading && queries && queries.length > 0 && (
          <div className="flex justify-center items-center py-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              Loading queries...
            </div>
          </div>
        )}
      </div>

      {/* Queries List or Empty State */}
      {queries && queries.length > 0 ? (
        <DraggableContent
          data={queries}
          setData={() => {}}
          component="queries"
          onReorder={handleReorder}
          onDelete={(id) => {
            setItemToDelete(id)
            setDeleteDialogOpen(true)
          }}
          selectedRows={selectedRows}
          toggleRowSelection={toggleRowSelection}
          showSelect={showSelect}
          permissions={["view", "delete"]}
        />
      ) : (
        // Empty State - matching CategoriesPage style
        <div className="h-full w-full flex flex-col justify-center items-center py-12">
          <img 
            width={300} 
            height={300} 
            src="/no-data.png" 
            alt="no-data-found"
            className="opacity-50"
          />
          <h4 className="text-gray-400 font-bold mt-4">
            {loading ? "LOADING QUERIES..." : "NO QUERIES FOUND"}
          </h4>
          {!loading && (
            <p className="text-gray-500 text-sm mt-2">
              {searchInput 
                ? "Try adjusting your search terms"
                : "User queries will appear here when customers ask questions"}
            </p>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this query? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setDeleteDialogOpen(false)
                setItemToDelete(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => itemToDelete && handleDelete(itemToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedRows.size} selected queries? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setBulkDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleBulkDelete}
            >
              Delete {selectedRows.size} Queries
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default QueryPage