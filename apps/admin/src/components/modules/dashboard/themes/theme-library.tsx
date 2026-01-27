import Sidebar from "./sidebar"
import { useState } from "react"
import ThemeGrid from "./theme-grid"
import TopBar from "./top-bar"



interface ThemeLibraryProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  onSelectTheme: (theme: any) => void
}

export default function ThemeLibrary({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onSelectTheme,
}: ThemeLibraryProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex-1 flex bg-background h-full overflow-hidden">
      {isSidebarOpen && (
        <div className="w-56 h-full overflow-y-auto border-r border-border flex-shrink-0">
          <Sidebar activeFilter={activeFilter} onFilterChange={onFilterChange} />
        </div>
      )}
      <main className="flex-1 flex flex-col overflow-hidden h-full">
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <ThemeGrid filter={activeFilter} search={searchQuery} sort={sortBy} onSelectTheme={onSelectTheme} />
      </main>
    </div>
  )
}
