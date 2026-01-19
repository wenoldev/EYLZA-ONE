
import { useState, useEffect, useRef } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update local value when prop value changes (e.g. from undo/redo)
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

  const presets = [
    { name: "Primary", color: "var(--client-primary, #3b82f6)" },
    { name: "Secondary", color: "var(--client-secondary, #10b981)" },
    { name: "Accent", color: "var(--client-accent, #f59e0b)" },
  ]

  return (
    <div className="flex items-center justify-between w-full group">
      {label && <span className="text-xs font-semibold text-muted-foreground/80">{label}</span>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2.5 px-3 py-1.5 border border-border/60 rounded-md hover:border-primary/40 hover:bg-muted/30 transition-all bg-background shadow-sm">
            <div
              className="w-5 h-5 rounded-full border border-black/5 shadow-inner"
              style={{ backgroundColor: localValue }}
            />
            <span className="text-[11px] font-mono font-medium text-foreground/70 uppercase tracking-tight">{localValue}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[180px] p-4 bg-white dark:bg-gray-950 border-border/40 shadow-2xl rounded-2xl" side="bottom" align="end" sideOffset={12}>
          <div className="space-y-4">
            {/* Presets */}
            <div className="flex items-center justify-between px-1">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleColorChange(preset.color)}
                  className={cn(
                    "w-9 h-9 rounded-full border border-black/5 shadow-sm hover:scale-110 transition-all relative flex items-center justify-center overflow-hidden",
                    localValue === preset.color && "ring-2 ring-primary ring-offset-2"
                  )}
                  style={{ backgroundColor: preset.color }}
                  title={preset.name}
                >
                  {localValue === preset.color && <Check className="w-4 h-4 text-white drop-shadow-md z-10" />}
                </button>
              ))}
            </div>

            <div className="h-px bg-border/40" />

            {/* Custom Option */}
            <div className="flex items-center gap-3 px-1">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-black/5 shadow-sm hover:scale-110 transition-transform">
                <input
                  type="color"
                  className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer p-0 border-0"
                  value={localValue.startsWith("#") ? localValue : "#000000"}
                  onChange={handleCustomColorChange}
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Custom</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
