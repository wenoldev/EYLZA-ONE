"use client"

import { useEffect, useRef } from "react"
import type {
  ComponentInstance,
  EditorElement,
} from "@/types/editor"
import { editorSchemas } from "@/components/editor/schemas"
import { Canvas } from "./canvas"
import { PropertyPanel } from "./property-panel"
import { LayersPanelAdvanced } from "./layers-panel"
import { LeftToolbar } from "./left-toolbar"
import { TopBar } from "./top-bar"
import { AddSectionGallery } from "./add-section-panel"
import { NeonProgressBar } from "../common/neon-progress-bar"
import { GlobalSettingsPanel } from "./global-settings-panel"
import { X } from "lucide-react"
import { EditorSkeleton } from "../common/editor-skeleton"
import { componentGallery } from "@/lib/component-gallery"
import { useEditorStore } from "@/store/useEditorStore"
import api from "@/lib/api"

export function WebBuilder() {
  const storeData = useEditorStore(state => state.storeData)
  const activeThemeId = useEditorStore(state => state.activeThemeId)
  const currentPage = useEditorStore(state => state.currentPage)
  const globalConfig = useEditorStore(state => state.globalConfig)
  const setGlobalConfig = useEditorStore(state => state.setGlobalConfig)
  const pagesData = useEditorStore(state => state.pagesData)
  const selectedComponent = useEditorStore(state => state.selectedComponent)
  const setSelectedComponent = useEditorStore(state => state.setSelectedComponent)
  const selectedElement = useEditorStore(state => state.selectedElement)
  const setSelectedElement = useEditorStore(state => state.setSelectedElement)
  const activePanel = useEditorStore(state => state.activePanel)
  const setActivePanel = useEditorStore(state => state.setActivePanel)
  const viewportSize = useEditorStore(state => state.viewportSize)
  const isLoading = useEditorStore(state => state.isLoading)
  const setIsLoading = useEditorStore(state => state.setIsLoading)
  const isInitialLoading = useEditorStore(state => state.isInitialLoading)
  const setIsInitialLoading = useEditorStore(state => state.setIsInitialLoading)
  const loadProgress = useEditorStore(state => state.loadProgress)
  const setLoadProgress = useEditorStore(state => state.setLoadProgress)
  const updatePageComponents = useEditorStore(state => state.updatePageComponents)
  const takeSnapshot = useEditorStore(state => state.takeSnapshot)
  const setInitialData = useEditorStore(state => state.setInitialData)
  const fetchPageData = useEditorStore(state => state.fetchPageData)

  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadAll = async () => {
      if (!storeData?.id || !activeThemeId) return
      setIsInitialLoading(true)
      try {
        const response = await api.get(`/stores/${storeData.id}/themes/${activeThemeId}`)
        const { theme } = response.data.data

        const global = theme.global_config || {}
        const pagesList = theme.pages || []

        setInitialData(global, pagesList)
      } catch (error) {
        console.error("Failed to load theme:", error)
        setInitialData({}, [])
      } finally {
        setIsInitialLoading(false)
      }
    }
    loadAll()
  }, [setIsInitialLoading, setInitialData, storeData?.id, activeThemeId])

  useEffect(() => {
    if (isInitialLoading) return;
    const slug = currentPage.toLowerCase().replace(/\s+/g, "-")
    fetchPageData(slug)
  }, [currentPage, fetchPageData, isInitialLoading])

  useEffect(() => {
    if (!globalConfig?.global) return

    const { colors, others } = globalConfig.global || {}
    const root = document.documentElement

    if (colors?.primary) root.style.setProperty("--client-primary", colors.primary)
    if (colors?.secondary) root.style.setProperty("--client-secondary", colors.secondary)
    if (colors?.background) root.style.setProperty("--client-background", colors.background)
    if (colors?.fontFamily) root.style.setProperty("--client-font-family", colors.fontFamily)

    if (others?.font) root.style.setProperty("--client-font-body", others.font)
  }, [globalConfig])

  const currentPageSlug = currentPage.toLowerCase().replace(/\s+/g, "-")
  const currentPageComponents = pagesData[currentPageSlug] || []
  
  const fullPageComponents = [
    ...(globalConfig?.header ? [{ ...globalConfig.header, selector: 'header', isGlobal: true }] : []),
    ...currentPageComponents,
    ...(globalConfig?.footer ? [{ ...globalConfig.footer, selector: 'footer', isGlobal: true }] : []),
  ]

  const simulateLoading = async () => {
    setIsLoading(true)
    setLoadProgress(0)
    for (let i = 0; i <= 100; i += Math.random() * 40) {
      setLoadProgress(Math.min(i, 100))
      await new Promise(r => setTimeout(r, 200))
    }
    setLoadProgress(100)
    setIsLoading(false)
  }

  const handleAddComponent = (selector: string, variantId?: string) => {
    simulateLoading()

    const newComp = createNewComponent(selector, variantId, currentPageComponents.length)

    const updated = [...currentPageComponents]
    updated.push(newComp)

    updatePageComponents(updated)
  }

  const handleAddComponentDrop = (selector: string, index: number, variantId?: string) => {
    const newComp = createNewComponent(selector, variantId, index)

    let target = index
    if (target < 0) target = 0
    if (target > currentPageComponents.length) target = currentPageComponents.length

    const updated = [
      ...currentPageComponents.slice(0, target),
      newComp,
      ...currentPageComponents.slice(target),
    ]

    updatePageComponents(updated)
  }

  const createNewComponent = (selector: string, variantId: string | undefined, order: number): ComponentInstance => {
    const galleryItem = componentGallery.find(item => item.selector === selector)
    const variant = galleryItem?.variants?.find((v: any) => v.id === variantId)

    const defaults = variant?.defaultProps || getSchemaDefaults(selector)

    return {
      id: `${selector}-${Date.now()}`,
      selector,
      name: `${selector.charAt(0).toUpperCase() + selector.slice(1)} ${currentPageComponents.filter(c => (c.selector || (c as any).type) === selector).length + 1}`,
      visible: true,
      isDeletable: !["header", "footer"].includes(selector),
      variant: variantId,
      order,
      props: defaults,
    }
  }

  const getSchemaDefaults = (selector: string) => {
    const schema = editorSchemas[selector]
    if (!schema) return {}

    const defaults: any = {}
    schema.tabs?.forEach((tab: any) => {
      tab.controls?.forEach((ctrl: any) => {
        const path = ctrl.property.split('.')
        let obj = defaults
        for (let i = 0; i < path.length - 1; i++) {
          obj[path[i]] = obj[path[i]] || {}
          obj = obj[path[i]]
        }
        obj[path[path.length - 1]] = ctrl.defaultValue
      })
    })
    return defaults
  }

  const handleRemoveComponent = (id: string) => {
    const comp = currentPageComponents.find(c => c.id === id)
    if (!comp?.isDeletable) return

    const updated = currentPageComponents.filter(c => c.id !== id)
    updatePageComponents(updated)
    setSelectedComponent(null)
    setSelectedElement(null)
  }

  const handleDuplicateComponent = (id: string) => {
    const idx = currentPageComponents.findIndex(c => c.id === id)
    if (idx === -1) return

    const comp = currentPageComponents[idx]
    const selector = comp.selector || (comp as any).type
    const copy = {
      ...comp,
      id: `${selector}-${Date.now()}`,
      name: `${comp.name} (Copy)`,
    }

    const updated = [...currentPageComponents]
    updated.splice(idx + 1, 0, copy)
    updatePageComponents(updated)
  }

  const handleToggleVisibility = (id: string) => {
    const updated = currentPageComponents.map(c =>
      c.id === id ? { ...c, visible: !c.visible } : c
    )
    updatePageComponents(updated)
  }

  const handleReorderComponent = (from: number, to: number) => {
    const headerOffset = globalConfig?.header ? 1 : 0
    const fromIdx = from - headerOffset
    const toIdx = to - headerOffset

    // Clamp toIdx within page components range
    const maxIdx = currentPageComponents.length - 1
    const clampedToIdx = Math.max(0, Math.min(maxIdx, toIdx))

    if (fromIdx < 0 || fromIdx > maxIdx) return

    const updated = [...currentPageComponents]
    const [moved] = updated.splice(fromIdx, 1)
    updated.splice(clampedToIdx, 0, moved)
    updatePageComponents(updated)
  }

  const handleSelectComponent = (comp: ComponentInstance) => {
    const selector = comp.selector || (comp as any).type
    setSelectedComponent(comp)
    setSelectedElement({
      "data-x-id": `${selector}_${comp.id}`,
      selector: selector,
      schema: editorSchemas[selector] || { label: comp.name, tabs: [] },
      props: comp.props,
    })
    setActivePanel("properties")
  }

  const snapshotTimerRef = useRef<NodeJS.Timeout | null>(null)

  const debouncedTakeSnapshot = () => {
    if (snapshotTimerRef.current) clearTimeout(snapshotTimerRef.current)
    snapshotTimerRef.current = setTimeout(() => {
      takeSnapshot()
    }, 1000) // 1 second debounce
  }

  const handleUpdateElement = (element: EditorElement) => {
    if (!selectedComponent) return

    const isGlobal = "isGlobal" in selectedComponent

    if (isGlobal) {
      setGlobalConfig((prev: any) => {
        if (!prev) return prev
        const copy = { ...prev }
        if (selectedComponent.selector === "header") {
          copy.header = { ...copy.header, props: element.props }
        } else if (selectedComponent.selector === "footer") {
          copy.footer = { ...copy.footer, props: element.props }
        }
        return copy
      }, true) // skipHistory: true
    } else {
      const updated = currentPageComponents.map(c =>
        c.id === selectedComponent.id ? { ...c, props: element.props } : c
      )
      updatePageComponents(updated, true) // skipHistory: true
    }

    setSelectedElement(element)
    debouncedTakeSnapshot()
  }

  if (isInitialLoading) {
    return <EditorSkeleton />
  }

  if (!globalConfig) {
    return <div className="flex h-screen items-center justify-center">Error loading global config</div>
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      <NeonProgressBar isLoading={isLoading} progress={loadProgress} />

      <TopBar />

      <div className="flex flex-1 overflow-hidden gap-0">
        {viewportSize !== "fullscreen" && (
          <>
            <LeftToolbar activePanel={activePanel} onTogglePanel={setActivePanel} />

            {activePanel && (
              <div className="w-80 border-r border-border bg-card flex flex-col shadow-sm z-20 overflow-hidden shrink-0">
                {/* Panel Header */}
                <div className="flex items-center justify-between border-b border-border px-4 h-14 shrink-0">
                  <h3 className="font-bold text-[11px] uppercase tracking-[0.1em] text-muted-foreground/80">
                    {activePanel === 'properties' ? (selectedComponent?.name || 'Properties') : activePanel}
                  </h3>
                  <button
                    onClick={() => setActivePanel(null)}
                    className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground/60 hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Panel Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {activePanel === "layers" && (
                    <LayersPanelAdvanced
                      components={fullPageComponents}
                      selectedComponent={selectedComponent}
                      onSelectComponent={handleSelectComponent}
                      onRemoveComponent={handleRemoveComponent}
                      onDuplicateComponent={handleDuplicateComponent}
                      onReorderComponent={handleReorderComponent}
                      onToggleVisibility={handleToggleVisibility}
                    />
                  )}

                  {activePanel === "add-sections" && (
                    <AddSectionGallery
                      onAddComponent={handleAddComponent}
                      onDragStart={(e, selector) => {
                        e.dataTransfer.effectAllowed = "copy"
                        e.dataTransfer.setData("componentType", selector)
                      }}
                    />
                  )}

                  {activePanel === "settings" && (
                    <GlobalSettingsPanel
                      config={globalConfig}
                      onConfigChange={(newConfig) => {
                        setGlobalConfig(newConfig, true)
                        debouncedTakeSnapshot()
                      }}
                    />
                  )}

                  {activePanel === "properties" && (
                    <PropertyPanel
                      component={selectedComponent}
                      selectedElement={selectedElement}
                      onUpdateElement={handleUpdateElement}
                      onClose={() => {
                        setSelectedComponent(null)
                        setSelectedElement(null)
                        setActivePanel(null)
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex-1 overflow-auto flex flex-col">
          <div ref={canvasRef} className="relative flex-1">
            <Canvas
              components={fullPageComponents}
              selectedComponent={selectedComponent}
              onSelectComponent={handleSelectComponent}
              onHoverComponent={() => { }}
              onRemoveComponent={handleRemoveComponent}
              onDuplicateComponent={handleDuplicateComponent}
              onAddComponentDrop={handleAddComponentDrop}
              viewportSize={viewportSize}
            />
          </div>
        </div>

        {/* Right side is now empty to give more space */}
      </div>
    </div>
  )
}
