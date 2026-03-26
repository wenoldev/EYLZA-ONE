
import { useCallback } from "react"
import type { ComponentInstance, EditorElement } from "@/types/editor"

export interface UseEditorSelectionProps {
  selectedComponent: ComponentInstance | null
  selectedElement: EditorElement | null
  onSelectComponent: (comp: ComponentInstance | null) => void
  onSelectElement: (element: EditorElement | null) => void
}

export function useEditorSelection({
  selectedComponent,
  selectedElement,
  onSelectComponent,
  onSelectElement,
}: UseEditorSelectionProps) {
  const handleLayerSelect = useCallback(
    (component: ComponentInstance) => {
      onSelectComponent(component)
      const element: EditorElement = {
        "data-x-id": `${component.selector}_${component.id}`,
        selector: component.selector,
        schema: {
          label: component.name,
          tabs: [],
        },
        props: component.props,
      }
      onSelectElement(element)
    },
    [onSelectComponent, onSelectElement],
  )

  const handleCanvasSelect = useCallback(
    (element: EditorElement, component: ComponentInstance) => {
      onSelectComponent(component)
      onSelectElement(element)
    },
    [onSelectComponent, onSelectElement],
  )

  const handleDeselect = useCallback(() => {
    onSelectComponent(null)
    onSelectElement(null)
  }, [onSelectComponent, onSelectElement])

  return {
    isSelected: selectedComponent !== null,
    selectedComponent,
    selectedElement,
    handleLayerSelect,
    handleCanvasSelect,
    handleDeselect,
  }
}
