import { Undo, Redo, Smartphone, Monitor, Maximize, Moon, Sun, PanelRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useEditorStore } from "@/store/useEditorStore"

export function TopBar() {
  const {
    storeData,
    pages,
    undo, redo, canUndo, canRedo,
    viewportSize, setViewportSize,
    currentPage, setCurrentPage,
    saveChanges, hasChanges,
    showRightPanel, setShowRightPanel
  } = useEditorStore()

  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newValue = !prev
      localStorage.setItem("theme-dark", String(newValue))
      document.documentElement.classList.toggle("dark", newValue)
      return newValue
    })
  }

  if (!mounted) return null

  return (
    <div className="flex h-14 items-center justify-between border-b border-border bg-card px-4 gap-4 flex-wrap sm:flex-nowrap">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        <h1 className="font-semibold truncate text-sm sm:text-base">{storeData?.name || 'TechStore'}</h1>
        <p className="text-xs text-muted-foreground hidden sm:block">Edit your store</p>

        <div className="border-l border-border pl-2 sm:pl-4 hidden sm:block">
          <Select value={currentPage} onValueChange={setCurrentPage}>
            <SelectTrigger className="w-24 sm:w-32 h-8 text-xs sm:text-sm">
              <SelectValue placeholder="Page" />
            </SelectTrigger>
            <SelectContent>
              {pages.map((page: any) => (
                <SelectItem key={page.id} value={page.name}>
                  {page.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <TooltipProvider>
          <div className="flex items-center gap-1 border-r border-border pr-2 sm:pr-4 hidden sm:flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={undo} disabled={!canUndo()} className="h-8 w-8">
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={redo} disabled={!canRedo()} className="h-8 w-8">
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={viewportSize === "mobile" ? "default" : "ghost"}
                  onClick={() => setViewportSize("mobile")}
                  className="h-8 w-8"
                >
                  <Smartphone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mobile</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={viewportSize === "desktop" ? "default" : "ghost"}
                  onClick={() => setViewportSize("desktop")}
                  className="h-8 w-8"
                >
                  <Monitor className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Desktop</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={viewportSize === "fullscreen" ? "default" : "ghost"}
                  onClick={() => setViewportSize("fullscreen")}
                  className="h-8 w-8"
                >
                  <Maximize className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fullscreen</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={toggleTheme} className="h-8 w-8">
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isDark ? "Light" : "Dark"} mode</TooltipContent>
            </Tooltip>

            <div className="w-px h-4 bg-border mx-1 hidden sm:block" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={showRightPanel ? "default" : "ghost"}
                  onClick={() => setShowRightPanel(!showRightPanel)}
                  className="h-8 w-8"
                >
                  <PanelRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{showRightPanel ? "Hide" : "Show"} Properties</TooltipContent>
            </Tooltip>
          </div>

          <Button
            size="sm"
            className="hidden sm:flex"
            onClick={saveChanges}
            disabled={!hasChanges()}
          >
            Save
          </Button>
        </TooltipProvider>
      </div>
    </div>
  )
}

