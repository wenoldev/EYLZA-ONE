import { useState } from "react"
import ThemeLibrary from "./theme-library"

export default function ThemeSelectorPage() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("Default")
  return (
    <div className="flex flex-col h-container bg-background">
      <ThemeLibrary
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onSelectTheme={() => { }}
      />
    </div>
  )
}
