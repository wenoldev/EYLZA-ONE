
import React, { useMemo, Suspense, memo } from "react"
import type { ComponentInstance, ViewportSize } from "@/types/editor"
import { ComponentRegistry } from "@eylza/dynamic-components"
import { SectionWrapper } from "../support/section-wrapper"
import Loader from '@/components/common/Loader'

interface CanvasProps {
  components: ComponentInstance[]
  selectedComponent: ComponentInstance | null
  onSelectComponent: (comp: ComponentInstance) => void
  onHoverComponent: (id: string | null) => void
  onRemoveComponent: (id: string) => void
  onDuplicateComponent: (id: string) => void
  onAddComponentDrop: (selector: string, index: number, variant?: string) => void
  viewportSize: ViewportSize
}

const CanvasItem = memo(({
  component,
  isSelected,
  onSelect,
  onHover,
  index,
  dropIndicator,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  viewportSize
}: {
  component: ComponentInstance
  isSelected: boolean
  onSelect: (comp: ComponentInstance) => void
  onHover: (id: string | null) => void
  index: number
  dropIndicator: number | null
  handleDragOver: (e: React.DragEvent, index: number) => void
  handleDragLeave: () => void
  handleDrop: (e: React.DragEvent, index: number) => void
  viewportSize: ViewportSize
}) => {
  const selector = component.selector || (component as any).type
  const Component = ComponentRegistry[selector as keyof typeof ComponentRegistry] as any
  if (!Component) return null

  return (
    <div key={component.id || `canvas-${index}`}>
      <div
        onDragOver={(e) => handleDragOver(e, index)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, index)}
        className={`transition-all duration-200 relative z-20 ${dropIndicator === index
          ? "h-12 bg-primary/10 border-2 border-dashed border-primary rounded-lg my-2"
          : "h-0"
          }`}
      >
        {dropIndicator === index && (
          <div className="absolute inset-0 flex items-center justify-center text-primary text-xs font-medium">
            Drop to add section here
          </div>
        )}
      </div>

      <SectionWrapper
        component={component}
        isSelected={isSelected}
        onSelect={onSelect}
        onHover={onHover}
      >
        <Suspense fallback={<Loader />}>
          {["header", "footer"].includes(selector) ? (
            <Component
              config={component.props}
              data-x-id={`${selector}_${component.id}`}
              viewportSize={viewportSize}
            />
          ) : (
            <Component
              {...component.props}
              data-x-id={`${selector}_${component.id}`}
              viewportSize={viewportSize}
            />
          )}
        </Suspense>
      </SectionWrapper>
    </div>
  )
})

export const Canvas = memo(({
  components,
  selectedComponent,
  onSelectComponent,
  onHoverComponent,
  onAddComponentDrop,
  viewportSize,
}: CanvasProps) => {
  const [dropIndicator, setDropIndicator] = React.useState<number | null>(null)
  const handleDragOver = React.useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
    setDropIndicator(index)
  }, [])

  const handleDragLeave = React.useCallback(() => {
    setDropIndicator(null)
  }, [])

  const handleDrop = React.useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    const type = e.dataTransfer.getData("componentType")
    const variant = e.dataTransfer.getData("variantId")
    if (type) {
      onAddComponentDrop(type, index, variant)
    }
    setDropIndicator(null)
  }, [onAddComponentDrop])

  const canvasClasses = useMemo(() => {
    const classes = {
      mobile: "max-w-xs sm:max-w-sm mx-auto",
      desktop: "max-w-2xl lg:max-w-4xl mx-auto",
      fullscreen: "w-full max-w-full",
      iframe: "w-full max-w-full",
    }
    return classes[viewportSize] || classes.desktop
  }, [viewportSize])

  return (
    <div className="flex-1 overflow-auto bg-muted/30 p-2 sm:p-4 md:p-8">
      <div className={`${canvasClasses} space-y-0 transition-all`}>
        {components.length === 0 ? (
          <div className="flex h-64 sm:h-96 items-center justify-center rounded-lg border-2 border-dashed border-border bg-card shadow-sm">
            <p className="text-muted-foreground text-center px-4 text-sm sm:text-base">
              Drag components here or use the Add Sections panel
            </p>
          </div>
        ) : (
          components.map((component, index) => (
            <CanvasItem
              key={component.id}
              component={component}
              isSelected={selectedComponent?.id === component.id}
              onSelect={onSelectComponent}
              onHover={onHoverComponent}
              index={index}
              dropIndicator={dropIndicator}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              viewportSize={viewportSize}
            />
          ))
        )}

        <div
          onDragOver={(e) => handleDragOver(e, components.length)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, components.length)}
          className={`transition-all duration-200 relative z-20 ${dropIndicator === components.length
            ? "h-12 bg-primary/10 border-2 border-dashed border-primary rounded-lg my-2"
            : "h-0"
            }`}
        >
          {dropIndicator === components.length && (
            <div className="text-primary text-xs font-medium">Drop to add section at the end</div>
          )}
        </div>
      </div>
    </div>
  )
})
