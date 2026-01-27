import { Settings, Layers, PlusCircle, Sliders } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { PanelType } from "@/types/editor"

interface LeftToolbarProps {
  activePanel: PanelType
  onTogglePanel: (panel: PanelType) => void
}

export function LeftToolbar({ activePanel, onTogglePanel }: LeftToolbarProps) {
  const tools = [
    { id: "layers", icon: <Layers className="h-5 w-5" />, label: "Layers", panel: "layers" as PanelType },
    {
      id: "add-sections",
      icon: <PlusCircle className="h-5 w-5" />,
      label: "Add Sections",
      panel: "add-sections" as PanelType,
    },
    { id: "properties", icon: <Sliders className="h-5 w-5" />, label: "Properties", panel: "properties" as PanelType },
    { id: "settings", icon: <Settings className="h-5 w-5" />, label: "Settings", panel: "settings" as PanelType },
  ]

  return (
    <div className="flex w-16 flex-col items-center border-r border-border bg-card py-4">
      <TooltipProvider>
        {tools.map((tool) => (
          <Tooltip key={tool.id} delayDuration={300}>
            <TooltipTrigger asChild>
              <button
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${activePanel === tool.panel
                  ? "bg-muted text-foreground ring-1 ring-border"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                onClick={() => onTogglePanel(activePanel === tool.panel ? null : tool.panel)}
              >
                {tool.icon}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{tool.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}
