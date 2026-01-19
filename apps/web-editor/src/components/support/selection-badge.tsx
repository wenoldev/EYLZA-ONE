
import type { ComponentInstance } from "@/types/editor"
import { LayoutGrid } from "lucide-react"

interface SelectionBadgeProps {
  component: ComponentInstance
  variant?: "blue" | "orange"
}

export function SelectionBadge({ component, variant = "blue" }: SelectionBadgeProps) {
  const isOrange = variant === "orange"

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${isOrange ? "bg-orange-500" : "bg-blue-500"
        } text-white text-[10px] uppercase tracking-wider font-bold rounded-t-md px-2.5 py-1 shadow-lg pointer-events-none`}
    >
      <LayoutGrid className="h-3 w-3" />
      <span>{component.name}</span>
    </div>
  )
}
