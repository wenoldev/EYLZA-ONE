import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useProductStore } from '@/store/useProductStore'
import { useCartStore } from './store/useCartStore'
import { useUIStore } from './store/useUIStore'

function ClientRuntimeBridge() {
     const { addItem } = useCartStore()
     const { openCart } = useUIStore()
     const productStore = useProductStore()

     useEffect(() => {
          ;(globalThis as any).__EYLZA_RUNTIME__ = 'client'
          ;(globalThis as any).__EYLZA_BRIDGE__ = {
               addToCart: (product: any, quantity = 1, attributes = {}) => {
                    addItem(product, quantity, attributes)
                    openCart()
               },
               useProductStore: () => productStore
          }

          return () => {
               delete (globalThis as any).__EYLZA_BRIDGE__
          }
     }, [addItem, openCart, productStore])

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
