import { create } from 'zustand';
import { api, setApiStoreId } from '@/lib/api';
import type { HeaderConfig } from '@/components/dynamic/types/Header';
import type { FooterConfig } from '@/components/dynamic/types/Footer';

export interface StoreTheme {
    id: string;
    store_id: string;
    theme_id: string;
    name: string;
    global_config: {
        global?: {
            colors?: Record<string, string>;
            typography?: unknown;
        };
        header?: { props: HeaderConfig };
        footer?: { props: FooterConfig };
        [key: string]: unknown;
    };
    status: string;
    pages: {
        id: string;
        name: string;
        slug: string;
        content: unknown[];
    }[];
}

export interface Store {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    description: string | null;
    contact_email: string | null;
    phone: string | null;
    status: string | null;
    currency: string | null;
    country: string | null;
    city: string | null;
    timezone: string | null;
    color: string | null;
}

interface StoreState {
    themeData: StoreTheme | null;
    store: Store | null;
    isLoading: boolean;
    error: string | null;
    storeId: string | null;
    pagesContent: Record<string, unknown[]>;

    // Actions
    setStoreId: (id: string | null) => void;
    fetchStoreId: (slug: string) => Promise<void>;
    fetchTheme: () => Promise<void>;
    fetchPageContent: (slug: string) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
    themeData: null,
    store: null,
    isLoading: false,
    error: null,
    storeId: null,
    pagesContent: {},

    setStoreId: (id: string | null) => {
        set({ storeId: id });
        setApiStoreId(id);
    },

    fetchStoreId: async (slug: string) => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.get('/public/store-id', { slug });
            if (data?.storeId) {
                get().setStoreId(data.storeId);
                await get().fetchTheme();
            } else {
                set({ error: "Store not found", isLoading: false });
            }
        } catch (err) {
            console.error("Failed to fetch store ID:", err);
            set({ error: "Store not found", isLoading: false });
        }
    },

    fetchTheme: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await api.get('/public/store-theme', { storeId: get().storeId || '' });
            if (data?.theme) {
                const themeData = data.theme as StoreTheme;
                const store = data.store as Store;

                get().setStoreId(store?.id);
                set({
                    themeData,
                    store
                });

                if (store?.name) {
                    document.title = store.name;
                }

                // Apply global styles
                const config = themeData.global_config;
                if (config?.global?.colors) {
                    const root = document.documentElement;
                    const colors = config.global.colors;
                    if (colors.primary) root.style.setProperty('--client-primary', colors.primary);
                    if (colors.secondary) root.style.setProperty('--client-secondary', colors.secondary);
                    if (colors.background) root.style.setProperty('--client-background', colors.background);
                    if (colors.fontFamily) root.style.setProperty('--client-font-family', colors.fontFamily);
                }
            } else {
                set({ error: "No published theme found" });
            }
        } catch (err: unknown) {
            console.error("Failed to fetch theme:", err);
            const errorMessage = err instanceof Error ? err.message : "Failed to load store theme";
            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchPageContent: async (slug: string) => {
        const { pagesContent, storeId } = get();
        if (pagesContent[slug]) return;

        set({ isLoading: true });
        try {
            const data = await api.get(`/public/store-pages/${slug}`, { storeId: storeId || '' });
            if (data?.page) {
                set((state) => ({
                    pagesContent: {
                        ...state.pagesContent,
                        [slug]: data.page.content || []
                    }
                }));
            }
        } catch (err) {
            console.error(`Failed to fetch page content for ${slug}:`, err);
        } finally {
            set({ isLoading: false });
        }
    }
}));
