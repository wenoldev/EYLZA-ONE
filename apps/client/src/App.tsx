import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useProductStore } from '@/store/useProductStore'
import { useCartStore } from './store/useCartStore'
import { useUIStore } from './store/useUIStore'
import { useUserStore } from './store/useUserStore'
import { useStore } from './store/useStore'

function ClientRuntimeBridge() {
     const cartStore = useCartStore()
     const uiStore = useUIStore()
     const productStore = useProductStore()
     const userStore = useUserStore()
     const store = useStore()

     useEffect(() => {
          ;(globalThis as any).__EYLZA_RUNTIME__ = 'client'
          ;(globalThis as any).__EYLZA_BRIDGE__ = {
               addToCart: (product: any, quantity = 1, attributes = {}) => {
                    cartStore.addItem(product, quantity, attributes)
                    uiStore.openCart()
               },
               useProductStore: () => productStore,
               useCartStore: () => cartStore,
               useUserStore: () => userStore,
               useStore: () => store,
               useUIStore: () => uiStore
          }

          return () => {
               delete (globalThis as any).__EYLZA_BRIDGE__
          }
     }, [cartStore, uiStore, productStore, userStore, store])

     return null
}

function App() {
     return (
          <>
               <ClientRuntimeBridge />
               <RouterProvider router={router} />
          </>
     )
}

export default App
