
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { ColorPicker } from "../../editor/color-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface HeaderSettingsProps {
  header: any
  onChange: (path: string, value: any) => void
}

export function HeaderSettings({ header, onChange }: HeaderSettingsProps) {
  if (!header) return null

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">General</Label>
        <div className="space-y-4">
          <ColorPicker
            label="Background Color"
            value={header.general?.backgroundColor || "#ffffff"}
            onChange={(val) => onChange("general.backgroundColor", val)}
          />
          <ColorPicker
            label="Text Color"
            value={header.general?.textColor || "#333333"}
            onChange={(val) => onChange("general.textColor", val)}
          />
          <div className="space-y-2">
            <Label className="text-xs">Background Style</Label>
            <Select
              value={header.general?.backgroundStyle || "fill"}
              onValueChange={(val) => onChange("general.backgroundStyle", val)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fill">Fill</SelectItem>
                <SelectItem value="transparent">Transparent</SelectItem>
                <SelectItem value="glass">Glass</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border/40">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Top Bar</Label>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Show Top Bar</Label>
          <Switch
            checked={header.topBar?.show}
            onCheckedChange={(val) => onChange("topBar.show", val)}
          />
        </div>
        {header.topBar?.show && (
          <div className="space-y-2">
            <Label className="text-xs">Content</Label>
            <Input
              value={header.topBar?.content || ""}
              onChange={(e) => onChange("topBar.content", e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-border/40">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Main Bar</Label>
        <div className="space-y-2">
          <Label className="text-xs">Search Design</Label>
          <Select
            value={header.mainBar?.searchDesign || "input"}
            onValueChange={(val) => onChange("mainBar.searchDesign", val)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="input">Input Field</SelectItem>
              <SelectItem value="icon">Icon Only</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
