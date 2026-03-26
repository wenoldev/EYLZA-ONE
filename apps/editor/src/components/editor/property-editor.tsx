import { useState } from "react"
import type { EditorControl } from "@/types/editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { RichTextEditor } from "./rich-text-editor"
import { ColorPicker } from "./color-picker"
import { ImageUpload } from "./image-upload"
import { GripVertical, Eye, EyeOff, Settings, ArrowLeft, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import get from "lodash.get"
import set from "lodash.set"

interface PropertyEditorProps {
  field: EditorControl
  value: any
  onChange: (value: any) => void
  allProps?: Record<string, any>
}

function checkCondition(actual: any, expected: any, operator: string = "=="): boolean {
  switch (operator) {
    case "!=": return actual !== expected
    case ">": return Number(actual) > Number(expected)
    case "<": return Number(actual) < Number(expected)
    case ">=": return Number(actual) >= Number(expected)
    case "<=": return Number(actual) <= Number(expected)
    case "contains":
      if (Array.isArray(actual)) return actual.includes(expected)
      if (typeof actual === 'string') return actual.includes(String(expected))
      return false
    case "in":
      if (Array.isArray(expected)) return expected.includes(actual)
      return false
    case "==":
    default:
      return actual === expected
  }
}

export function PropertyEditor({ field, value, onChange, allProps }: PropertyEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  // Handle visibility
  if (field.visibleWhen && allProps) {
    const { property, value: expectedValue, operator } = field.visibleWhen
    const actualValue = get(allProps, property)
    if (!checkCondition(actualValue, expectedValue, operator)) {
      return null
    }
  }

  if (field.condition && allProps) {
    const { property, value: expectedValue, operator } = field.condition
    const actualValue = get(allProps, property)
    if (!checkCondition(actualValue, expectedValue, operator)) {
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
        <RichTextEditor
          label={field.label}
          placeholder={field.placeholder}
          value={fieldValue || ""}
          onChange={onChange}
        />
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
          <Select value={fieldValue ? String(fieldValue) : "default"} onValueChange={onChange}>
            <SelectTrigger className="w-full text-sm h-10 bg-background border-input/60 hover:border-input focus:ring-1">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem 
                  key={String(opt.value || "default")} 
                  value={opt.value ? String(opt.value) : "default"} 
                  className="text-sm"
                  style={field.property.includes("fontFamily") ? { fontFamily: String(opt.value) } : {}}
                >
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

      const handleAddItem = () => {
        const newItem = {} as any
        field.fields?.forEach(f => {
          if (f.defaultValue !== undefined) newItem[f.property] = f.defaultValue
        })
        onChange([...items, newItem])
        setEditingIndex(items.length)
      }

      const handleDeleteItem = (index: number) => {
        const newItems = [...items]
        newItems.splice(index, 1)
        onChange(newItems)
        if (editingIndex === index) setEditingIndex(null)
        else if (editingIndex !== null && editingIndex > index) setEditingIndex(editingIndex - 1)
      }

      const handleUpdateItemField = (index: number, prop: string, val: any) => {
        const newItems = [...items]
        const newItem = { ...newItems[index] }
        set(newItem, prop, val)
        newItems[index] = newItem
        onChange(newItems)
      }

      if (editingIndex !== null && items[editingIndex]) {
        const item = items[editingIndex]
        return (
          <div className="space-y-4 animate-in slide-in-from-right-2 duration-200">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setEditingIndex(null)}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Edit {field.itemLabel ? get(item, field.itemLabel) || `Item ${editingIndex + 1}` : `Item ${editingIndex + 1}`}
              </h4>
            </div>
            <div className="space-y-6 pt-2">
              {field.fields?.map((f) => (
                <PropertyEditor
                  key={f.property}
                  field={f}
                  value={get(item, f.property)}
                  onChange={(val) => handleUpdateItemField(editingIndex, f.property, val)}
                  allProps={item}
                />
              ))}
            </div>
          </div>
        )
      }

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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddItem}
              className="h-7 px-2 text-[10px] gap-1 border-dashed hover:border-primary/50 hover:bg-primary/5"
            >
              <Plus className="w-3 h-3" /> Add
            </Button>
          </div>
          <div className="space-y-2">
            {items.map((item: any, index: number) => {
              const isObject = typeof item === 'object' && item !== null;
              const itemId = isObject ? (item.id || item.type || index) : item;
              const isVisible = isObject ? (item.visible !== false) : true;
              const label = field.options?.find(opt => opt.value === itemId)?.label || (isObject ? get(item, field.itemLabel || 'label') : item) || `Item ${index + 1}`;

              return (
                <div
                  key={`${itemId}-${index}`}
                  draggable
                  onDragStart={() => onDragStart(index)}
                  onDragEnd={onDragEnd}
                  onDragOver={onDragOver}
                  onDrop={() => onDrop(index)}
                  className={cn(
                    "group flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 cursor-move",
                    draggedIndex === index ? "opacity-20 border-primary border-dashed bg-muted/50" : "bg-background border-border",
                    !isVisible && "opacity-60 grayscale-[0.5]",
                    draggedIndex !== null && draggedIndex !== index && "hover:border-primary/40 hover:bg-muted/10",
                    "hover:shadow-sm"
                  )}
                >
                  <div className="text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors">
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex-1 min-w-0" onClick={() => setEditingIndex(index)}>
                    <span className="text-xs font-medium truncate block cursor-pointer hover:text-primary transition-colors">
                      {label}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingIndex(index)}
                      className="p-1.5 rounded-md transition-all duration-200 hover:bg-muted text-muted-foreground hover:text-foreground"
                      title="Edit Settings"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleVisibility(index)}
                      className={cn(
                        "p-1.5 rounded-md transition-all duration-200 hover:bg-muted text-muted-foreground hover:text-foreground",
                        !isVisible && "text-primary opacity-100"
                      )}
                      title={isVisible ? "Hide" : "Show"}
                    >
                      {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDeleteItem(index)}
                      className="p-1.5 rounded-md transition-all duration-200 hover:bg-red-50 text-muted-foreground hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
