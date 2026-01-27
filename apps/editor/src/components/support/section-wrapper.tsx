
import React, { useState, memo } from "react"
import type { ComponentInstance } from "@/types/editor"
import { HoverOverlay } from "./hover-overlay"
import { SelectionBadge } from "./selection-badge"

interface SectionWrapperProps {
  component: ComponentInstance
  isSelected: boolean
  onSelect: (comp: ComponentInstance) => void
  onHover: (id: string | null) => void
  children: React.ReactNode
}

export const SectionWrapper = memo(({ component, isSelected, onSelect, onHover, children }: SectionWrapperProps) => {
  const [isHovering, setIsHovering] = useState(false)

  // Determine if this is a header/footer section (use orange) or regular section (use blue)
  const isHeaderFooter = component.type === "header" || component.type === "footer"
  const variant = isHeaderFooter ? "orange" : "blue"
  const borderColor = isHeaderFooter ? "ring-orange-500" : "ring-blue-500"

  return (
    <div
      className={`group relative transition-all duration-200 cursor-pointer ${isHovering
          ? `ring-2 ${borderColor} z-30 shadow-lg`
          : "z-10"
        }`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(component)
      }}
      onMouseEnter={() => {
        setIsHovering(true)
        onHover(component.id)
      }}
      onMouseLeave={() => {
        setIsHovering(false)
        onHover(null)
      }}
    >
      {/* The component content */}
      {children}

      {/* Hover Overlay: Visible only on hover and NOT selected */}
      <HoverOverlay isVisible={isHovering && !isSelected} variant={variant} />

      {/* Label/Badge: Always visible for header/footer, only on hover for others */}
      {(isHovering) && (
        <div className="absolute -top-6 left-0 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-1 duration-200">
          <SelectionBadge component={component} variant={variant} />
        </div>
      )}
    </div>
  )
})
