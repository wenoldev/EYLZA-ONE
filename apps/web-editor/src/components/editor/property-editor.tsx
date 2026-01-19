import { useState } from "react"
import type { EditorControl } from "@/types/editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { ColorPicker } from "./color-picker"
import { RichTextEditor } from "./rich-text-editor"
import { ImageUpload } from "./image-upload"
import { Trash2, Plus, GripVertical, Eye, EyeOff, X } from "lucide-react"
import { cn } from "@/lib/utils"
import get from "lodash.get"

interface PropertyEditorProps {
  field: EditorControl
  value: any
  onChange: (value: any) => void
  allProps?: Record<string, any>
}

export function PropertyEditor({ field, value, onChange, allProps }: PropertyEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Handle visibility
  if (field.visibleWhen && allProps) {
    const targetValue = get(allProps, field.visibleWhen.property)
    if (targetValue !== field.visibleWhen.value) {
      return null
    }
  }

  const fieldValue = value !== undefined ? value : field.defaultValue

  switch (field.control) {
    case "input":
      if (field.type === "number") {
        return (
          <div className="space-y-2 w-full">
            <Label className="text-xs font-medium text-muted-foreground">{field.label}</Label>
            <Input
              type="number"
              placeholder={field.placeholder}
              value={fieldValue || 0}
              onChange={(e) => onChange(Number(e.target.value))}
              className="h-10 text-sm bg-background border-input/60 hover:border-input focus:ring-1"
            />
          </div>
        )
      }
      return (
        <div className="space-y-2 w-full">
          <Label className="text-xs font-medium text-muted-foreground">{field.label}</Label>
          <Input
            type="text"
            placeholder={field.placeholder}
            value={fieldValue || ""}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 text-sm bg-background border-input/60 hover:border-input focus:ring-1"
          />
        </div>
      )

    case "textarea":
      return (
        <div className="space-y-2">
          <Label className="text-xs">{field.label}</Label>
          <textarea
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
            rows={field.rows || 3}
            placeholder={field.placeholder}
            value={fieldValue || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )

    case "switch":
      return (
        <div className="flex items-center justify-between">
          <Label className="text-xs">{field.label}</Label>
          <Switch checked={!!fieldValue} onCheckedChange={onChange} />
        </div>
      )

    case "select":
      return (
        <div className="space-y-2 w-full">
          <Label className="text-xs font-medium text-muted-foreground">{field.label}</Label>
          <Select value={String(fieldValue)} onValueChange={onChange}>
            <SelectTrigger className="w-full text-sm h-10 bg-background border-input/60 hover:border-input focus:ring-1">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)} className="text-sm">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )

    case "slider":
      return (
        <div className="space-y-3 w-full">
          <div className="flex justify-between">
            <Label className="text-xs font-medium text-muted-foreground">{field.label}</Label>
            <span className="text-xs text-muted-foreground font-mono">{fieldValue}</span>
          </div>
          <Slider
            value={[fieldValue || field.min || 0]}
            min={field.min}
            max={field.max}
            step={field.step}
            onValueChange={([val]) => onChange(val)}
            className="py-1"
          />
        </div>
      )

    case "color":
      return <ColorPicker value={fieldValue || "#000000"} onChange={onChange} label={field.label} />

    case "image":
      return <ImageUpload value={fieldValue || ""} onChange={onChange} label={field.label} />

    case "repeater":
      const items = Array.isArray(fieldValue) ? fieldValue : []

      const handleToggleVisibility = (index: number) => {
        const newItems = [...items]
        if (typeof newItems[index] === 'object') {
          newItems[index] = { ...newItems[index], visible: !newItems[index].visible }
        } else {
          newItems[index] = { id: newItems[index], visible: false }
        }
        onChange(newItems)
      }

      const onDragStart = (index: number) => {
        setDraggedIndex(index)
      }

      const onDragEnd = () => {
        setDraggedIndex(null)
      }

      const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
      }

      const onDrop = (toIndex: number) => {
        if (draggedIndex === null || draggedIndex === toIndex) return

        const newItems = [...items]
        const [movedItem] = newItems.splice(draggedIndex, 1)
        newItems.splice(toIndex, 0, movedItem)

        setDraggedIndex(null)
        onChange(newItems)
      }

      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-foreground/80">{field.label}</Label>
          </div>
          <div className="space-y-2">
            {items.map((item: any, index: number) => {
              const isObject = typeof item === 'object' && item !== null;
              const itemId = isObject ? (item.id || item.type || index) : item;
              const isVisible = isObject ? (item.visible !== false) : true;
              const label = field.options?.find(opt => opt.value === itemId)?.label || (isObject ? item.label : item) || `Item ${index + 1}`;

              return (
                <div
                  key={index}
                  draggable
                  onDragStart={() => onDragStart(index)}
                  onDragEnd={onDragEnd}
                  onDragOver={onDragOver}
                  onDrop={() => onDrop(index)}
                  className={cn(
                    "group flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 cursor-move",
                    draggedIndex === index && "opacity-50",
                    !isVisible && "opacity-60 grayscale-[0.5]",
                    draggedIndex !== null && draggedIndex !== index && "hover:border-primary/40"
                  )}
                >
                  <div className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium truncate block">
                      {label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleVisibility(index)}
                      className={cn(
                        "p-1.5 rounded-md transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 shadow-sm border border-transparent hover:border-border",
                        "hover:text-[var(--client-primary)]"
                      )}
                      title={isVisible ? "Hide" : "Show"}
                    >
                      {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )

    default:
      return null
  }
}
