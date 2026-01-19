/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/api"
import { create } from "zustand"

export interface OrderItem {
  id: string
  product_id: string
  quantity: number
  price: number
  total: number
  product?: {
    id: string
    name: string
    slug: string
    images?: string[]
  }
}

export interface Order {
  id: string
  store_id: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  shipping_address?: {
    street: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  billing_address?: {
    street: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  subtotal: number
  tax_amount?: number
  shipping_amount?: number
  discount_amount?: number
  total_amount: number
  currency: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
  payment_status: "pending" | "paid" | "failed" | "refunded"
  payment_method?: string
  notes?: string
  order_items: OrderItem[]
  created_at: string
  updated_at: string
  stores?: {
    name: string
    slug: string
    logo_url?: string
  }
}

export interface OrderFilters {
  page?: number
  limit?: number
  store_id?: string
  status?: string
  payment_status?: string
  search?: string
  date_from?: string
  date_to?: string
  min_amount?: string
  max_amount?: string
}

export interface OrderPagination {
  page: number
  limit: number
  total: number
}

interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  pagination: OrderPagination | null
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  error: string | null
  filters: OrderFilters
  fetchOrders: (filters?: OrderFilters) => Promise<void>
  fetchOrderById: (id: string) => Promise<void>
  createOrder: (orderData: Partial<Order>) => Promise<Order>
  updateOrder: (id: string, orderData: Partial<Order>) => Promise<Order>
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<Order>
  updatePaymentStatus: (id: string, paymentStatus: Order["payment_status"]) => Promise<Order>
  deleteOrder: (id: string) => Promise<void>
  bulkDeleteOrders: (ids: string[]) => Promise<void>
  bulkUpdateOrderStatus: (ids: string[], status: Order["status"]) => Promise<void>
  setFilters: (filters: OrderFilters) => void
  clearError: () => void
  clearCurrentOrder: () => void
  reset: () => void
  getOrdersByStore: (storeId: string) => Order[]
  getOrdersByStatus: (status: Order["status"]) => Order[]
  getTotalRevenue: () => number
  getRevenueByStore: (storeId: string) => number
}

export const useOrderStore = create<OrderState>(
    (set, get) => ({
      orders: [],
      currentOrder: null,
      pagination: null,
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      error: null,
      filters: {},

      fetchOrders: async (filters?: OrderFilters) => {
        set({ isLoading: true, error: null })

        try {
          const queryParams = new URLSearchParams()
          const currentFilters = { ...get().filters, ...filters }

          Object.entries(currentFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              queryParams.append(key, value.toString())
            }
          })

          const response = await api.get(`/api/v1/orders`, { params: queryParams })
          const result = response.data

          if (result.error) {
            throw new Error(result.error?.message || "Failed to fetch orders")
          }

          set({
            orders: result.data.orders || [],
            pagination: result.data.pagination || null,
            filters: currentFilters,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch orders",
            isLoading: false,
          })
          throw error
        }
      },

      fetchOrderById: async (id: string) => {
        set({ isLoading: true, error: null })

        try {
          const response = await api.get(`/api/v1/orders/${id}`)
          const result = response.data

          if (result.error) {
            throw new Error(result.error?.message || "Failed to fetch order")
          }

          set({
            currentOrder: result.data.order,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch order",
            isLoading: false,
          })
          throw error
        }
      },

      createOrder: async (orderData: Partial<Order>) => {
        set({ isCreating: true, error: null })

        try {
          const response = await api.post(`/api/v1/orders`, orderData)
          const result = response.data

          if (result.error) {
            throw new Error(result.error?.message || "Failed to create order")
          }

          const newOrder = result.data.order

          set((state) => ({
            orders: [newOrder, ...state.orders],
            isCreating: false,
            error: null,
          }))

          return newOrder
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to create order",
            isCreating: false,
          })
          throw error
        }
      },

      updateOrder: async (id: string, orderData: Partial<Order>) => {
        set({ isUpdating: true, error: null })

        try {
          const response = await api.patch(`/api/v1/orders/${id}`, orderData)
          const result = response.data

          if (result.error) {
            throw new Error(result.error?.message || "Failed to update order")
          }

          const updatedOrder = result.data.order

          set((state) => ({
            orders: state.orders.map((order) => (order.id === id ? updatedOrder : order)),
            currentOrder: state.currentOrder?.id === id ? updatedOrder : state.currentOrder,
            isUpdating: false,
            error: null,
          }))

          return updatedOrder
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to update order",
            isUpdating: false,
          })
          throw error
        }
      },

      updateOrderStatus: async (id: string, status: Order["status"]) => {
        return get().updateOrder(id, { status })
      },

      updatePaymentStatus: async (id: string, paymentStatus: Order["payment_status"]) => {
        return get().updateOrder(id, { payment_status: paymentStatus })
      },

      deleteOrder: async (id: string) => {
        set({ isDeleting: true, error: null })

        try {
          const response = await api.delete(`/api/v1/orders/${id}`)
          const result = response.data

          if (result.error) {
            throw new Error(result.error?.message || "Failed to delete order")
          }

          set((state) => ({
            orders: state.orders.filter((order) => order.id !== id),
            currentOrder: state.currentOrder?.id === id ? null : state.currentOrder,
            isDeleting: false,
            error: null,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to delete order",
            isDeleting: false,
          })
          throw error
        }
      },

      bulkDeleteOrders: async (ids: string[]) => {
        set({ isDeleting: true, error: null })

        try {
          const queryParams = new URLSearchParams()
          queryParams.append("operation", "bulk_delete")
          queryParams.append("ids", ids.join(","))

          const response = await api.get(`/api/v1/orders?${queryParams.toString()}`)
          const result = response.data

          if (result.error) {
            throw new Error(result.error?.message || "Failed to delete orders")
          }

          set((state) => ({
            orders: state.orders.filter((order) => !ids.includes(order.id)),
            isDeleting: false,
            error: null,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to delete orders",
            isDeleting: false,
          })
          throw error
        }
      },

      bulkUpdateOrderStatus: async (ids: string[], status: Order["status"]) => {
        set({ isUpdating: true, error: null })

        try {
          const response = await api.post(`/api/v1/orders`, {
            operation: "bulk_update",
            ids,
            updates: { status },
          })
          const result = response.data

          if (result.error) {
            throw new Error(result.error?.message || "Failed to update orders")
          }

          set((state) => ({
            orders: state.orders.map((order) =>
              ids.includes(order.id) ? { ...order, status, updated_at: new Date().toISOString() } : order,
            ),
            isUpdating: false,
            error: null,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to update orders",
            isUpdating: false,
          })
          throw error
        }
      },

      setFilters: (filters: OrderFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }))
      },

      clearError: () => {
        set({ error: null })
      },

      clearCurrentOrder: () => {
        set({ currentOrder: null })
      },

      reset: () => {
        set({
          orders: [],
          currentOrder: null,
          pagination: null,
          isLoading: false,
          isCreating: false,
          isUpdating: false,
          isDeleting: false,
          error: null,
          filters: {},
        })
      },

      getOrdersByStore: (storeId: string) => {
        return get().orders.filter((order) => order.store_id === storeId)
      },

      getOrdersByStatus: (status: Order["status"]) => {
        return get().orders.filter((order) => order.status === status)
      },

      getTotalRevenue: () => {
        return get()
          .orders.filter((order) => order.payment_status === "paid")
          .reduce((total, order) => total + order.total_amount, 0)
      },

      getRevenueByStore: (storeId: string) => {
        return get()
          .orders.filter((order) => order.store_id === storeId && order.payment_status === "paid")
          .reduce((total, order) => total + order.total_amount, 0)
      },
    }
  ),
)

export const useOrders = () => {
  const {
    orders,
    isLoading,
    error,
    pagination,
    filters,
    getOrdersByStore,
    getOrdersByStatus,
    getTotalRevenue,
    getRevenueByStore,
  } = useOrderStore()

  return {
    orders,
    isLoading,
    error,
    pagination,
    filters,
    getOrdersByStore,
    getOrdersByStatus,
    getTotalRevenue,
    getRevenueByStore,
  }
}

export const useOrderActions = () => {
  const {
    fetchOrders,
    fetchOrderById,
    createOrder,
    updateOrder,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    bulkDeleteOrders,
    bulkUpdateOrderStatus,
    setFilters,
    clearError,
    clearCurrentOrder,
    reset,
  } = useOrderStore()

  return {
    fetchOrders,
    fetchOrderById,
    createOrder,
    updateOrder,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    bulkDeleteOrders,
    bulkUpdateOrderStatus,
    setFilters,
    clearError,
    clearCurrentOrder,
    reset,
  }
}

export const useCurrentOrder = () => {
  const { currentOrder, isLoading, error } = useOrderStore()
  return { currentOrder, isLoading, error }
}
