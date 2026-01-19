
interface HoverOverlayProps {
  isVisible: boolean
  variant?: "blue" | "orange"
}

export function HoverOverlay({ isVisible, variant = "blue" }: HoverOverlayProps) {
  const isOrange = variant === "orange"

  return (
    <div
      className={`absolute inset-0 z-40 pointer-events-none transition-all duration-200 ${isVisible ? "opacity-100" : "opacity-0"
        } ${isOrange
          ? "bg-orange-500/[0.08]"
          : "bg-blue-500/[0.08]"
        } rounded-sm`}
    />
  )
}
