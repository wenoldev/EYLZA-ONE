import { useState, useEffect, useRef } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, Ban, Palette } from "lucide-react"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleColorChange = (newColor: string) => {
    setLocalValue(newColor)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      onChange(newColor)
    }, 100)
  }

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleColorChange(e.target.value)
  }

  const themeColors = [
    { name: "Primary", color: "var(--client-primary, #3b82f6)" },
    { name: "Secondary", color: "var(--client-secondary, #10b981)" },
    { name: "Accent", color: "var(--client-accent, #f59e0b)" },
  ]

  const isTransparent = localValue === "transparent" || localValue === ""
  
  // Format color for display (e.g. hex or short name)
  const displayValue = isTransparent ? "None" : localValue;

  return (
    <div className="flex items-center justify-between w-full group py-1">
      {label && <span className="text-xs font-medium text-muted-foreground/90 shrink-0 mr-2">{label}</span>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 px-2.5 py-1.5 border border-border/50 rounded-lg hover:border-primary/30 hover:bg-muted/30 transition-all bg-background/50 max-w-[140px] overflow-hidden">
             <div
              className="w-4 h-4 rounded-full border border-black/10 shadow-sm flex items-center justify-center overflow-hidden shrink-0"
              style={{ backgroundColor: isTransparent ? "transparent" : localValue }}
            >
              {isTransparent && <Ban className="w-3 h-3 text-red-500/60" />}
            </div>
            <span className="text-[11px] font-mono text-foreground/60 uppercase tracking-tighter truncate">
              {displayValue}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2 bg-white dark:bg-gray-950 border-border/40 shadow-xl rounded-full" side="bottom" align="end" sideOffset={8}>
          <div className="flex items-center gap-1.5 px-1">
            {/* None Option */}
             <button
                onClick={() => handleColorChange("transparent")}
                title="None"
                className={cn(
                  "w-8 h-8 rounded-full border border-black/10 shadow-sm hover:scale-110 transition-all flex items-center justify-center bg-white",
                  isTransparent && "ring-2 ring-primary/40 ring-offset-2"
                )}
              >
                <Ban className="w-4 h-4 text-red-500/60" />
              </button>

            {/* Theme Colors */}
            {themeColors.map((item) => (
              <button
                key={item.name}
                onClick={() => handleColorChange(item.color)}
                title={item.name}
                className={cn(
                  "w-8 h-8 rounded-full border border-black/10 shadow-sm hover:scale-110 transition-all relative flex items-center justify-center",
                  localValue === item.color && "ring-2 ring-primary/40 ring-offset-2"
                )}
                style={{ backgroundColor: item.color }}
              >
                {localValue === item.color && <Check className="w-3.5 h-3.5 text-primary drop-shadow-sm" />}
              </button>
            ))}

            <div className="w-px h-4 bg-border/40 mx-0.5" />

            {/* Custom Color Trigger */}
            <div 
              className="relative w-8 h-8 rounded-full overflow-hidden border border-black/10 shadow-sm shrink-0 hover:scale-110 transition-all flex items-center justify-center bg-linear-to-br from-red-400 via-green-400 to-blue-400"
              title="Custom Color"
            >
              <Palette className="w-4 h-4 text-white drop-shadow-sm pointer-events-none" />
              <input
                type="color"
                className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer p-0 border-0 bg-transparent opacity-0"
                value={localValue.startsWith("#") ? localValue : "#000000"}
                onChange={handleCustomColorChange}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
