import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string | number;
  product_id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  attributes?: Record<string, string>;
}

interface CartState {
  items: CartItem[];
  addItem: (product: any, quantity?: number, attributes?: Record<string, string>) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, attributes = {}) => {
        const { items } = get();
        const existingItem = items.find(
          (item) => item.product_id === product.id && JSON.stringify(item.attributes) === JSON.stringify(attributes)
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item === existingItem ? { ...item, quantity: item.quantity + quantity } : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: `${product.id}-${Date.now()}`,
                product_id: product.id,
                name: product.name,
                price: product.price,
                image: product.image_url || product.image || '/placeholder.svg',
                quantity,
                attributes,
              },
            ],
          });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
