

import { cn } from "@/lib/utils"

interface SidebarProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

const filters = ["All", "Favorite", "Free", "Paid"]

export default function Sidebar({ activeFilter, onFilterChange }: SidebarProps) {
  return (
    <aside className="w-full h-full bg-background p-6">
      <h2 className="text-sm font-semibold text-foreground mb-6">Filters</h2>

      <nav className="space-y-2 flex flex-col">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={cn(
              "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
              activeFilter === filter
                ? "bg-blue-100 text-blue-700"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            {filter}
          </button>
        ))}
      </nav>
    </aside>
  )
}
