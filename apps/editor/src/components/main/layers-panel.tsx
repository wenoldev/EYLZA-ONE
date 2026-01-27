import type React from "react"
import { useState } from "react"
import type { ComponentInstance } from "@/types/editor"
import { Trash2, Eye, EyeOff, GripVertical, MoreVertical, Copy, ArrowUp, ArrowDown } from "lucide-react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LayersPanelProps {
  components: ComponentInstance[]
  selectedComponent: ComponentInstance | null
  onSelectComponent: (comp: ComponentInstance) => void
  onRemoveComponent: (id: string) => void
  onDuplicateComponent: (id: string) => void
  onReorderComponent: (fromIndex: number, toIndex: number) => void
  onToggleVisibility: (id: string) => void
}

export function LayersPanelAdvanced({
  components,
  selectedComponent,
  onSelectComponent,
  onRemoveComponent,
  onDuplicateComponent,
  onReorderComponent,
  onToggleVisibility,
}: LayersPanelProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const isHeader = (comp: ComponentInstance) => comp.type === "header" && !comp.isDeletable
  const isFooter = (comp: ComponentInstance) => comp.type === "footer" && !comp.isDeletable

  const handleDragStart = (e: React.DragEvent, index: number) => {
    const component = components[index]
    if (isHeader(component) || isFooter(component)) {
      e.preventDefault()
      return
    }
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== toIndex) {
      const fromComponent = components[draggedIndex]

      if (isHeader(fromComponent) || isFooter(fromComponent)) return

      onReorderComponent(draggedIndex, toIndex)
    }
    setDraggedIndex(null)
  }

  return (
    <div className="flex flex-col h-full bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border/40 bg-muted/5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Page Layers</span>
      </div>
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {components.map((component, index) => {
            const isSelected = selectedComponent?.id === component.id
            const isHidden = !component.visible
            const isLocked = isHeader(component) || isFooter(component)

            return (
              <div key={component.id}>
                <div
                  draggable={!isLocked}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`group flex items-center gap-2 rounded px-2 py-2 transition text-xs sm:text-sm cursor-move ${isSelected ? "bg-muted text-foreground ring-1 ring-border" : "hover:bg-muted/50"
                    } ${isHidden ? "opacity-50" : ""} ${isLocked ? "cursor-not-allowed opacity-75" : ""}`}
                  onClick={() => onSelectComponent(component)}
                >
                  {!isLocked ? (
                    <GripVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 opacity-50 hidden sm:block" />
                  ) : (
                    <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  )}
                  <span className="flex-1 truncate font-medium">{component.name}</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleVisibility(component.id)
                    }}
                    className="opacity-0 transition group-hover:opacity-100 p-1 rounded hover:bg-background"
                    title={isHidden ? "Show" : "Hide"}
                  >
                    {isHidden ? (
                      <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    ) : (
                      <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    )}
                  </button>

                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="opacity-0 transition group-hover:opacity-100 p-1 rounded hover:bg-background"
                      >
                        <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="min-w-[160px] bg-card border border-border rounded-md shadow-lg z-[100] py-1 text-xs animate-in fade-in zoom-in duration-200"
                        sideOffset={5}
                        align="end"
                      >
                        {!isLocked ? (
                          <>
                            <DropdownMenu.Item
                              onClick={() => onDuplicateComponent(component.id)}
                              className="flex items-center gap-2 px-3 py-2 outline-none hover:bg-muted cursor-pointer"
                            >
                              <Copy className="h-3 w-3" />
                              Duplicate
                            </DropdownMenu.Item>

                            <DropdownMenu.Item
                              disabled={index <= 1 && components[0]?.type === "header"}
                              onClick={() => onReorderComponent(index, index - 1)}
                              className="flex items-center gap-2 px-3 py-2 outline-none hover:bg-muted cursor-pointer data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                            >
                              <ArrowUp className="h-3 w-3" />
                              Move Up
                            </DropdownMenu.Item>

                            <DropdownMenu.Item
                              disabled={index >= components.length - 2 && components[components.length - 1]?.type === "footer"}
                              onClick={() => onReorderComponent(index, index + 1)}
                              className="flex items-center gap-2 px-3 py-2 outline-none hover:bg-muted cursor-pointer data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                            >
                              <ArrowDown className="h-3 w-3" />
                              Move Down
                            </DropdownMenu.Item>

                            <DropdownMenu.Separator className="h-px bg-border my-1" />

                            <DropdownMenu.Item
                              onClick={() => onRemoveComponent(component.id)}
                              className="flex items-center gap-2 px-3 py-2 outline-none hover:bg-destructive/10 text-destructive cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </DropdownMenu.Item>
                          </>
                        ) : (
                          <DropdownMenu.Item disabled className="px-3 py-2 text-muted-foreground opacity-50">
                            {isHeader(component) ? "Header is fixed" : "Footer is fixed"}
                          </DropdownMenu.Item>
                        )}
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
