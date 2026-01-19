

import { Search, ChevronDown, PanelLeft } from "lucide-react"
import { useState } from "react"

interface TopBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

const sortOptions = ["Default", "Popular", "Newest"]

export default function TopBar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  isSidebarOpen,
  onToggleSidebar,
}: TopBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div className="border-b border-border bg-background px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-lg hover:bg-muted transition-colors ${!isSidebarOpen ? "bg-muted text-foreground" : "text-muted-foreground"
              }`}
            title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            <PanelLeft size={20} />
          </button>
          {/* <h1 className="text-2xl font-bold text-foreground">Theme Template Chooser</h1> */}
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium text-foreground transition-colors"
            >
              Sort: {sortBy}
              <ChevronDown size={16} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-background border border-border rounded-lg shadow-lg z-50">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      onSortChange(option)
                      setIsDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${sortBy === option ? "bg-blue-100 text-blue-700" : "text-foreground hover:bg-muted"
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background">
            <Search size={18} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Search templates…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent border-none outline-none w-48 text-sm placeholder:text-muted-foreground text-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
