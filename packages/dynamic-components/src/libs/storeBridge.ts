import { getBridge, isEditorRuntime } from '../utils/runtime';

export interface CartItem {
  id: string | number;
  product_id?: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  attributes?: Record<string, any>;
  variant?: {
    finish?: string;
    message?: string;
    [key: string]: any;
  };
}

export const useCartStore = () => {
  const bridge = getBridge();
  if (bridge.useCartStore) {
    return bridge.useCartStore();
  }

  return {
    items: (isEditorRuntime()
      ? [
          {
            id: '1',
            name: 'Hidden Message Curved Bar Bracelet',
            price: 420.0,
            image:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuAbyytg4ES8ol9LjG0ATmO_BM8Du0bW9Pj12MQzXPVTU7jrjMMbY-CLtj9aaFHRG3FmBU72ztVsDkDZ19NmFRyv_Ws_UOaqRQ9G-9qcMAUMzHVFOY65gX64EahdXQDmNXl0hgd4DrwBSdEQVRNMEh2U_x1Y6rIaBpxHACyMNGeOr5FV12h_kw-UinugVHvC548mNdgdwAWepx1YwkeFSghsLPCy2_of-LyrPCbiXF9lelaD1k2tBRdMfQUudkrQhsq_kTUvbniy_x8',
            quantity: 1,
            variant: { finish: '18K Solid Gold', message: 'Forever & Always' }
          }
        ]
      : []) as CartItem[],
    addItem: (product: any, quantity = 1, attributes = {}) => {
      bridge.addToCart?.(product, quantity, attributes);
    },
    removeItem: (_id: string | number) => {},
    updateQuantity: (_id: string | number, _qty: number) => {},
    clearCart: () => {},
    getSubtotal: () => 420,
    getTotalItems: () => 1
  };
};

export const useUserStore = () => {
  const bridge = getBridge();
  if (bridge.useUserStore) {
    return bridge.useUserStore();
  }

  return {
    user: null,
    isLoading: false,
    error: null,
    login: async (_credentials: any) => {},
    logout: async () => {},
    register: async (_data: any) => {}
  };
};

export const useStore = () => {
  const bridge = getBridge();
  if (bridge.useStore) {
    return bridge.useStore();
  }

  return {
    storeId: '',
    store: { name: 'Atelier' },
    storeSlug: ''
  };
};

export const useUIStore = () => {
  const bridge = getBridge();
  if (bridge.useUIStore) {
    return bridge.useUIStore();
  }

  return {
    isCartOpen: false,
    openCart: () => {},
    closeCart: () => {},
    toggleCart: () => {}
  };
};
