import api from "@/lib/api"
import type { Query } from "@/types/api"
import { create } from "zustand"

interface QueryState {
  queries: Query[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
  }
}

interface QueryActions {
  fetchQueries: (storeId?: string, options?: { page?: number; limit?: number; userOnly?: boolean }) => Promise<void>
  fetchQuery: (id: string) => Promise<Query | null>
  createQuery: (data: {
    store_id: string
    name?: string
    email?: string
    message: string
  }) => Promise<Query | null>
  deleteQuery: (id: string) => Promise<void>
  updateQueryStatus: (id: string, status: Query["status"]) => Promise<void>
  clearQueries: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

type QueryStore = QueryState & QueryActions

const initialState: QueryState = {
  queries: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
}

export const useQueriesStore = create<QueryStore>(
    (set, get) => ({
      ...initialState,

      fetchQueries: async (storeId, options = {}) => {
        const { page = 1, limit = 20, userOnly = false } = options
        set({ loading: true, error: null })

        try {
          const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(storeId && { store_id: storeId }),
            ...(userOnly && { user_only: "true" }),
          })

          const response = await api.get(`/api/v1/queries?${params}`)

          if (response.data.error) {
            throw new Error(response.data.error.message || "Failed to fetch queries")
          }

          set({
            queries: response.data.data.queries || [],
            pagination: response.data.data.pagination || { page, limit, total: 0 },
            loading: false,
            error: null,
          })
        } catch (error) {
          console.error("Error fetching queries:", error)
          set({
            loading: false,
            error: error instanceof Error ? error.message : "Failed to fetch queries",
          })
        }
      },

      fetchQuery: async (id: string) => {
        set({ loading: true, error: null })

        try {
          const response = await api.get(`/api/v1/queries/${id}`)

          if (response.data.error) {
            throw new Error(response.data.error.message || "Failed to fetch query")
          }

          set({ loading: false, error: null })
          return response.data.data.query
        } catch (error) {
          console.error("Error fetching query:", error)
          set({
            loading: false,
            error: error instanceof Error ? error.message : "Failed to fetch query",
          })
          return null
        }
      },

      createQuery: async (data) => {
        set({ loading: true, error: null })

        try {
          const response = await api.post("/api/v1/queries", data)

          if (response.data.error) {
            throw new Error(response.data.error.message || "Failed to create query")
          }

          // Add the new query to the current list
          const currentQueries = get().queries
          set({
            queries: [response.data.data.query, ...currentQueries],
            loading: false,
            error: null,
          })

          return response.data.data.query
        } catch (error) {
          console.error("Error creating query:", error)
          set({
            loading: false,
            error: error instanceof Error ? error.message : "Failed to create query",
          })
          return null
        }
      },

      deleteQuery: async (id: string) => {
        set({ loading: true, error: null })

        try {
          const response = await api.delete(`/api/v1/queries/${id}`)

          if (response.data.error) {
            throw new Error(response.data.error.message || "Failed to delete query")
          }

          // Remove the deleted query from the current list
          const currentQueries = get().queries
          set({
            queries: currentQueries.filter((query) => query.id !== id),
            loading: false,
            error: null,
          })
        } catch (error) {
          console.error("Error deleting query:", error)
          set({
            loading: false,
            error: error instanceof Error ? error.message : "Failed to delete query",
          })
          throw error // Re-throw to handle in component
        }
      },

      updateQueryStatus: async (id: string, status: Query["status"]) => {
        set({ loading: true, error: null })

        try {
          const response = await api.patch(`/api/v1/queries/${id}`, { status })

          if (response.data.error) {
            throw new Error(response.data.error.message || "Failed to update query status")
          }

          // Update the query in the current list
          const currentQueries = get().queries
          set({
            queries: currentQueries.map((query) =>
              query.id === id ? { ...query, status, updated_at: new Date().toISOString() } : query,
            ),
            loading: false,
            error: null,
          })
        } catch (error) {
          console.error("Error updating query status:", error)
          set({
            loading: false,
            error: error instanceof Error ? error.message : "Failed to update query status",
          })
          throw error
        }
      },

      clearQueries: () => {
        set({ queries: [], error: null })
      },

      setLoading: (loading: boolean) => {
        set({ loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },
    }
  ),
)