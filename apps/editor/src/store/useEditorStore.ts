import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import api from '@/lib/api';
import { toast } from 'sonner';
import type { ComponentInstance, EditorElement, ViewportSize, PanelType } from '@/types/editor';

interface HistoryState {
  pagesData: Record<string, ComponentInstance[]>;
  globalConfig: any;
  currentPage: string;
}

interface EditorHistory {
  states: HistoryState[];
  index: number;
}

interface EditorState {
  // Store Info
  storeData: any;
  activeThemeId: string | null;

  // Editor State
  currentPage: string;
  globalConfig: any;
  initialGlobalConfig: any;
  pages: any[];
  pagesData: Record<string, ComponentInstance[]>;
  initialPagesData: Record<string, ComponentInstance[]>;
  selectedComponent: ComponentInstance | null;
  selectedElement: EditorElement | null;
  activePanel: PanelType | null;
  viewportSize: ViewportSize;
  showRightPanel: boolean;

  // Loading States
  isLoading: boolean;
  isInitialLoading: boolean;
  loadProgress: number;
  loadingPages: Set<string>; // Track in-flight or failed requests

  // History
  history: EditorHistory;

  // Actions
  setStoreData: (data: any) => void;
  setActiveThemeId: (id: string | null) => void;
  setCurrentPage: (page: string) => void;
  setGlobalConfig: (config: any | ((prev: any) => any), skipHistory?: boolean) => void;
  setPages: (pages: any[]) => void;
  setPagesData: (data: Record<string, ComponentInstance[]> | ((prev: Record<string, ComponentInstance[]>) => Record<string, ComponentInstance[]>)) => void;
  setSelectedComponent: (comp: ComponentInstance | null) => void;
  setSelectedElement: (el: EditorElement | null) => void;
  setActivePanel: (panel: PanelType | null) => void;
  setViewportSize: (size: ViewportSize) => void;
  setShowRightPanel: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setIsInitialLoading: (loading: boolean) => void;
  setLoadProgress: (progress: number) => void;

  setInitialData: (global: any, pages: any[]) => void;
  fetchPageData: (slug: string) => Promise<void>;
  updatePageComponents: (newComponents: ComponentInstance[], skipHistory?: boolean) => void;
  takeSnapshot: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveChanges: () => Promise<void>;
  hasChanges: () => boolean;
  logout: () => void;
}

const getSlug = (pageName: string) => pageName.toLowerCase().replace(/\s+/g, "-");

export const editorStore = createStore<EditorState>()((set, get) => ({
  storeData: null,
  activeThemeId: null,
  currentPage: "Home",
  globalConfig: null,
  initialGlobalConfig: null,
  pages: [],
  pagesData: {},
  initialPagesData: {},
  selectedComponent: null,
  selectedElement: null,
  activePanel: "layers",
  viewportSize: "desktop",
  showRightPanel: true,
  isLoading: false,
  isInitialLoading: true,
  loadProgress: 0,
  loadingPages: new Set(),
  history: { states: [], index: -1 },

  setStoreData: (data: any) => set({ storeData: data }),
  setActiveThemeId: (id: string | null) => set({ activeThemeId: id }),
  setCurrentPage: (page: string) => set({ currentPage: page }),

  setGlobalConfig: (config: any | ((prev: any) => any), skipHistory = false) => {
    set((state: EditorState) => ({
      globalConfig: typeof config === 'function' ? config(state.globalConfig) : config
    }));
    if (!skipHistory) get().takeSnapshot();
  },

  setPages: (pages: any[]) => set({ pages }),

  setPagesData: (data: Record<string, ComponentInstance[]> | ((prev: Record<string, ComponentInstance[]>) => Record<string, ComponentInstance[]>)) => set((state: EditorState) => ({
    pagesData: typeof data === 'function' ? data(state.pagesData) : data
  })),

  setSelectedComponent: (comp: ComponentInstance | null) => set({ selectedComponent: comp }),
  setSelectedElement: (el: EditorElement | null) => set({ selectedElement: el }),
  setActivePanel: (panel: PanelType | null) => set({ activePanel: panel }),
  setViewportSize: (size: ViewportSize) => set({ viewportSize: size }),
  setShowRightPanel: (show: boolean) => set({ showRightPanel: show }),
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  setIsInitialLoading: (loading: boolean) => set({ isInitialLoading: loading }),
  setLoadProgress: (progress: number) => set({ loadProgress: progress }),

  setInitialData: (global: any, pagesList: any[]) => {
    set({
      globalConfig: global,
      initialGlobalConfig: JSON.parse(JSON.stringify(global)),
      pages: pagesList,
      pagesData: {},
      initialPagesData: {},
      history: { states: [], index: -1 }
    });
  },

  fetchPageData: async (slug: string) => {
    const { pagesData, storeData, activeThemeId, globalConfig, currentPage, loadingPages } = get();
    
    // Don't fetch if already loaded or currently loading
    if (pagesData[slug] || loadingPages.has(slug)) return;

    set((state) => ({ 
      isLoading: true,
      loadingPages: new Set(state.loadingPages).add(slug)
    }));

    try {
      const response = await api.get(`/stores/${storeData.id}/themes/${activeThemeId}/pages/${slug}`);
      const { page } = response.data.data;
      const content = page.content || [];

      set((state: EditorState) => {
        const newPagesData = { ...state.pagesData, [slug]: content };
        const newInitialPagesData = { ...state.initialPagesData, [slug]: JSON.parse(JSON.stringify(content)) };

        // If this is the first page loaded, initialize history
        let newHistory = state.history;
        if (newHistory.states.length === 0) {
          newHistory = {
            states: [{
              pagesData: JSON.parse(JSON.stringify(newPagesData)),
              globalConfig: JSON.parse(JSON.stringify(globalConfig)),
              currentPage: currentPage
            }],
            index: 0
          };
        }

        return {
          pagesData: newPagesData,
          initialPagesData: newInitialPagesData,
          history: newHistory
        };
      });
    } catch (error) {
      console.error(`Failed to fetch page data for ${slug}:`, error);
      // We keep the slug in loadingPages even on failure to prevent the infinite retry loop
      // unless we want to allow retries later (e.g. on manual refresh)
    } finally {
      set((state) => {
        const newLoadingPages = new Set(state.loadingPages);
        newLoadingPages.delete(slug);
        return { 
          isLoading: false,
          loadingPages: newLoadingPages
        };
      });
    }
  },

  updatePageComponents: (newComponents: ComponentInstance[], skipHistory = false) => {
    const { currentPage } = get();
    const slug = getSlug(currentPage);

    set((state: EditorState) => ({
      pagesData: { ...state.pagesData, [slug]: newComponents }
    }));

    if (!skipHistory) get().takeSnapshot();
  },

  takeSnapshot: () => {
    const { pagesData, globalConfig, currentPage, history } = get();

    const newState: HistoryState = {
      pagesData: JSON.parse(JSON.stringify(pagesData)),
      globalConfig: JSON.parse(JSON.stringify(globalConfig)),
      currentPage
    };

    // Don't push if state is identical to current index
    if (history.index >= 0) {
      const currentState = history.states[history.index];
      // Quick check before expensive stringify
      if (currentState.currentPage === currentPage && 
          currentState.globalConfig === globalConfig && 
          currentState.pagesData === pagesData) {
        return;
      }
      
      if (JSON.stringify(currentState) === JSON.stringify(newState)) return;
    }

    set((state: EditorState) => {
      const newStates = [...state.history.states.slice(0, state.history.index + 1), newState];

      // Limit history to 50 states
      if (newStates.length > 50) {
        newStates.shift();
      }

      return {
        history: {
          states: newStates,
          index: newStates.length - 1
        }
      };
    });
  },

  undo: () => {
    const { history } = get();
    if (history.index <= 0) return;

    const newIndex = history.index - 1;
    const prevState = history.states[newIndex];

    set({
      history: { ...history, index: newIndex },
      pagesData: JSON.parse(JSON.stringify(prevState.pagesData)),
      globalConfig: JSON.parse(JSON.stringify(prevState.globalConfig)),
      currentPage: prevState.currentPage,
      selectedComponent: null,
      selectedElement: null
    });
  },

  redo: () => {
    const { history } = get();
    if (history.index >= history.states.length - 1) return;

    const newIndex = history.index + 1;
    const nextState = history.states[newIndex];

    set({
      history: { ...history, index: newIndex },
      pagesData: JSON.parse(JSON.stringify(nextState.pagesData)),
      globalConfig: JSON.parse(JSON.stringify(nextState.globalConfig)),
      currentPage: nextState.currentPage,
      selectedComponent: null,
      selectedElement: null
    });
  },

  canUndo: () => {
    const { history } = get();
    return history.index > 0;
  },

  canRedo: () => {
    const { history } = get();
    return history.index < history.states.length - 1;
  },

  hasChanges: () => {
    const { globalConfig, initialGlobalConfig, pagesData, initialPagesData } = get();
    const hasGlobalChanges = JSON.stringify(globalConfig) !== JSON.stringify(initialGlobalConfig);
    const changedPages = Object.keys(pagesData).filter(page =>
      JSON.stringify(pagesData[page]) !== JSON.stringify(initialPagesData[page])
    );
    return hasGlobalChanges || changedPages.length > 0;
  },

  saveChanges: async () => {
    const { hasChanges, storeData, activeThemeId, globalConfig, pagesData, initialPagesData } = get();
    if (!hasChanges()) return;

    set({ isLoading: true, loadProgress: 0 });

    try {
      if (!storeData?.id || !activeThemeId) {
        throw new Error("Missing storeId or themeId");
      }

      const initialGlobalConfig = get().initialGlobalConfig;
      const hasGlobalChanges = JSON.stringify(globalConfig) !== JSON.stringify(initialGlobalConfig);

      if (hasGlobalChanges) {
        await api.patch(`/stores/${storeData.id}/themes/${activeThemeId}`, {
          global_config: globalConfig
        });
        set({ initialGlobalConfig: JSON.parse(JSON.stringify(globalConfig)) });
      }

      const changedPages = Object.keys(pagesData).filter(page =>
        JSON.stringify(pagesData[page]) !== JSON.stringify(initialPagesData[page])
      );

      for (const slug of changedPages) {
        await api.patch(`/stores/${storeData.id}/themes/${activeThemeId}/pages/${slug}`, {
          content: pagesData[slug]
        });
        set((state: EditorState) => ({
          initialPagesData: {
            ...state.initialPagesData,
            [slug]: JSON.parse(JSON.stringify(pagesData[slug]))
          }
        }));
      }

      set({ isLoading: false });
      toast.success("Changes saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      set({ isLoading: false });
      toast.error("Failed to save changes.");
    }
  },

  logout: () => {
    document.cookie = "access=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "refresh=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    set({ storeData: null });
    window.location.href = '/login';
  }
}));

export const useEditorStore = <T>(selector: (state: EditorState) => T) => useStore(editorStore, selector);
