/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react"
import { useEffect, useState } from "react"
import { useOrders, useOrderActions } from "@/stores/orderStore"
import { useStoreStore } from "@/stores/storeStore"
import { DynamicTable } from "@/components/common/DynamicTable"
import { OrderDetailsSheet } from "@/components/common/OrderDetailsSheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import Loader from "@/components/common/Loader"
import FilterList from "@/components/common/FilterList"
import { RotateCw } from "lucide-react"
import type { Column, TableConfig } from "@/types"

const OrdersPage: React.FC = () => {
  const { orders, isLoading, error, pagination, filters } = useOrders()
  const {
    fetchOrders,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    bulkDeleteOrders,
    bulkUpdateOrderStatus,
    setFilters,
    clearError,
  } = useOrderActions()

  const { stores } = useStoreStore()
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [sideSheetOpen, setSideSheetOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")


  useEffect(() => {
    if (stores && stores.length > 0) {
      fetchOrders({ store_id: stores[0]?.id })
    }
  }, [stores, fetchOrders])

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const newFilters = { ...filters, search: term, page: 1 }
    setFilters(newFilters)
    fetchOrders(newFilters)
  }

  /* Updated status change handler to match new signature */
  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status as any)
      toast.success("Order status updated")
    } catch {
      toast.error("Failed to update order status")
    }
  }

  const handlePaymentStatusChange = async (orderId: string, paymentStatus: string) => {
    try {
      await updatePaymentStatus(orderId, paymentStatus as any)
      toast.success("Payment status updated")
    } catch {
      toast.error("Failed to update payment status")
    }
  }

  const handleDelete = async (orderId: string) => {
    if (window.confirm("Delete this order?")) {
      try {
        await deleteOrder(orderId)
        toast.success("Order deleted")
      } catch {
        toast.error("Failed to delete order")
      }
    }
  }

  /* New generic status change handler for DynamicTable */
  const handleTableStatusChange = async (row: any, field: string, newStatus: string) => {
    if (field === "status") {
      await handleStatusChange(row.id, newStatus)
    } else if (field === "payment_status") {
      await handlePaymentStatusChange(row.id, newStatus)
    }
  }

  const handleBulkDelete = async () => {
    if (!selectedOrders.length) return
    if (window.confirm(`Delete ${selectedOrders.length} orders?`)) {
      try {
        await bulkDeleteOrders(selectedOrders)
        setSelectedOrders([])
        toast.success("Orders deleted")
      } catch {
        toast.error("Failed to delete orders")
      }
    }
  }

  const handleBulkStatusUpdate = async (status: string) => {
    if (!selectedOrders.length) return
    try {
      await bulkUpdateOrderStatus(selectedOrders, status as any)
      setSelectedOrders([])
      toast.success("Orders updated")
    } catch {
      toast.error("Failed to update orders")
    }
  }

  /* Table columns now simplified - render moved to component */
  const columns: Column[] = [
    {
      name: "Order ID",
      value: "id",
      render: (order: any) => (
        <div className="font-mono text-sm">#{order.id.slice(-8)}</div>
      ),
    },
    {
      name: "Customer",
      value: "customer_name",
      render: (order: any) => (
        <div>
          <div className="font-medium">{order.customer_name}</div>
          <div className="text-sm text-gray-500">{order.customer_email}</div>
        </div>
      ),
    },
    {
      name: "Total",
      value: "total_amount",
      render: (order: any) => (
        <div className="font-medium">
          {order.currency} {order.total_amount.toFixed(2)}
        </div>
      ),
    },
    {
      name: "Status",
      value: "status",
      type: "status",
    },
    {
      name: "Payment",
      value: "payment_status",
      type: "status",
    },
    {
      name: "Date",
      value: "created_at",
      type: "date",
    },
  ]

  /* Table configuration for generic handling of status fields */
  const tableConfig: TableConfig = {
    onRowClick: (order) => {
      setCurrentOrder(order)
      setSideSheetOpen(true)
    },
  }

  const categoryFilterOptions = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Refunded", value: "refunded" },
  ]

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<{
    label: string
    value: string
  } | null>(null)

  const handleCategoryFilterChange = (item: { label: string; value: string } | null) => {
    setSelectedCategoryFilter(item)
    const newFilters = { ...filters, status: item?.value ?? "", page: 1 }
    setFilters(newFilters)
    fetchOrders(newFilters)
  }

  const selectedRows = new Set(selectedOrders)

  const toggleRowSelection = (id: string) => {
    const newSet = new Set(selectedRows)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedOrders(Array.from(newSet))
  }

  const toggleAllRows = (set: Set<string>) => {
    setSelectedOrders(Array.from(set))
  }

  const handleSort = (column: string, direction: "asc" | "desc") => {
    const newFilters = { ...filters, sort_by: column, sort_order: direction, page: 1 }
    setFilters(newFilters)
    fetchOrders(newFilters)
  }

  if (isLoading && orders.length === 0) return <Loader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage your store orders</p>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => fetchOrders({ ...filters, store_id: stores![0]?.id })} 
          disabled={isLoading}
          title="Refresh"
        >
          <RotateCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {orders.length > 0 && (
        <>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {selectedOrders.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusUpdate("confirmed")}
                >
                  Mark as Confirmed
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusUpdate("shipped")}
                >
                  Mark as Shipped
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  Delete Selected
                </Button>
              </div>
            )}
          </div>

          <FilterList
            currentFilter={selectedCategoryFilter?.label}
            onFilterChange={handleCategoryFilterChange}
            filterList={categoryFilterOptions}
          />

          {isLoading && (
            <div className="flex justify-center items-center py-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                Loading orders...
              </div>
            </div>
          )}
        </>
      )}

      {orders.length > 0 ? (
        <>
          <DynamicTable
            data={orders}
            columns={columns}
            onDelete={handleDelete}
            onPageChange={(page) => {
              const newFilters = { ...filters, page }
              setFilters(newFilters)
              fetchOrders(newFilters)
            }}
            currentPage={pagination?.page ?? 1}
            totalCount={pagination?.total ?? 0}
            itemsPerPage={pagination?.limit ?? 10}
            selectedRows={selectedRows}
            toggleRowSelection={toggleRowSelection}
            toggleAllRows={toggleAllRows}
            onSort={handleSort}
            // sortColumn={filters.sort_by}
            // sortDirection={filters.sort_order as "asc" | "desc"}
            /* Using generic statusConfig for both status fields */
            statusConfig={{
              status: [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
                "refunded",
              ],
              payment_status: ["pending", "paid", "failed", "refunded"],
            }}
            onRowClick={(order) => {
              setCurrentOrder(order)
              setSideSheetOpen(true)
            }}
            /* Passing new generic status change handler */
            onChangeStatus={handleTableStatusChange}
            config={tableConfig}
          />
          <OrderDetailsSheet
            isOpen={sideSheetOpen}
            onOpenChange={setSideSheetOpen}
            order={currentOrder}
            onStatusChange={handleStatusChange}
            onPaymentStatusChange={handlePaymentStatusChange}
          />
        </>
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
            {isLoading ? "LOADING ORDERS..." : "NO ORDERS FOUND"}
          </h4>
          {!isLoading && (
            <p className="text-gray-500 text-sm mt-2">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Orders will appear here when customers place them"}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default OrdersPage
