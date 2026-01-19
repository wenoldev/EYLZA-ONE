import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import api from '@/lib/api';
import { ComponentInstance, EditorElement, ViewportSize, PanelType } from '@/types/editor';

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

export const editorStore = createStore<EditorState>((set, get) => ({
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
  history: { states: [], index: -1 },

  setStoreData: (data) => set({ storeData: data }),
  setActiveThemeId: (id) => set({ activeThemeId: id }),
  setCurrentPage: (page) => set({ currentPage: page }),

  setGlobalConfig: (config, skipHistory = false) => {
    set((state) => ({
      globalConfig: typeof config === 'function' ? config(state.globalConfig) : config
    }));
    if (!skipHistory) get().takeSnapshot();
  },

  setPages: (pages) => set({ pages }),

  setPagesData: (data) => set((state) => ({
    pagesData: typeof data === 'function' ? data(state.pagesData) : data
  })),

  setSelectedComponent: (comp) => set({ selectedComponent: comp }),
  setSelectedElement: (el) => set({ selectedElement: el }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setViewportSize: (size) => set({ viewportSize: size }),
  setShowRightPanel: (show) => set({ showRightPanel: show }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsInitialLoading: (loading) => set({ isInitialLoading: loading }),
  setLoadProgress: (progress) => set({ loadProgress: progress }),

  setInitialData: (global, pagesList) => {
    set({
      globalConfig: global,
      initialGlobalConfig: JSON.parse(JSON.stringify(global)),
      pages: pagesList,
      pagesData: {},
      initialPagesData: {},
      history: { states: [], index: -1 }
    });
  },

  fetchPageData: async (slug) => {
    const { pagesData, storeData, activeThemeId, globalConfig, currentPage } = get();
    if (pagesData[slug]) return;

    set({ isLoading: true });
    try {
      const response = await api.get(`/stores/${storeData.id}/themes/${activeThemeId}/pages/${slug}`);
      const { page } = response.data.data;
      const content = page.content || [];

      set((state) => {
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
    } finally {
      set({ isLoading: false });
    }
  },

  updatePageComponents: (newComponents, skipHistory = false) => {
    const { currentPage } = get();
    const slug = getSlug(currentPage);

    set((state) => ({
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
      if (JSON.stringify(currentState) === JSON.stringify(newState)) return;
    }

    set((state) => {
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
        set((state) => ({
          initialPagesData: {
            ...state.initialPagesData,
            [slug]: JSON.parse(JSON.stringify(pagesData[slug]))
          }
        }));
      }

      set({ isLoading: false });
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      set({ isLoading: false });
      alert("Failed to save changes.");
    }
  },

  logout: () => {
    document.cookie = "access=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "refresh=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    set({ storeData: null });
    window.location.href = '/login';
  }
}));

export const useEditorStore = () => useStore(editorStore);
