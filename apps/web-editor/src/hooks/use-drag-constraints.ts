
import { useCallback } from "react"
import type { ComponentInstance } from "@/types/editor"

export function useDragConstraints() {
  const canDragComponent = useCallback((component: ComponentInstance): boolean => {
    // Header and footer cannot be dragged
    return !(component.type === "header" || component.type === "footer")
  }, [])

  const canDropAtPosition = useCallback(
    (components: ComponentInstance[], draggedIndex: number, targetIndex: number): boolean => {
      const draggedComponent = components[draggedIndex]
      const targetComponent = components[targetIndex]

      if (!draggedComponent || !targetComponent) return true

      const isHeaderFooter = (c: ComponentInstance) => c.type === "header" || c.type === "footer"
      const draggedIsHF = isHeaderFooter(draggedComponent)
      const targetIsHF = isHeaderFooter(targetComponent)

      if (draggedIsHF || targetIsHF) return false

      // Check if trying to move regular section past header/footer boundaries
      const headerIndex = components.findIndex((c) => c.type === "header")
      const footerIndex = components.findIndex((c) => c.type === "footer")

      if (headerIndex !== -1 && targetIndex <= headerIndex) return false
      if (footerIndex !== -1 && targetIndex >= footerIndex) return false

      return true
    },
    [],
  )

  return { canDragComponent, canDropAtPosition }
}
