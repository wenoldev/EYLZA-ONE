
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface TypographySettingsProps {
  typography: {
    headingFont: string
    bodyFont: string
    baseSize: number
    [key: string]: any
  }
  onChange: (key: string, value: any) => void
}

export function TypographySettings({ typography, onChange }: TypographySettingsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Headings Font</Label>
        <Select
          value={typography.headingFont}
          onValueChange={(val) => onChange("headingFont", val)}
        >
          <SelectTrigger className="w-full text-sm h-9 bg-background border-input/60 hover:border-input focus:ring-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Inter" className="font-sans">Inter</SelectItem>
            <SelectItem value="Geist" className="font-sans">Geist</SelectItem>
            <SelectItem value="System" className="font-sans">System</SelectItem>
            <SelectItem value="Serif" className="font-serif">Serif</SelectItem>
            <SelectItem value="Mono" className="font-mono">Mono</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Body Font</Label>
        <Select
          value={typography.bodyFont}
          onValueChange={(val) => onChange("bodyFont", val)}
        >
          <SelectTrigger className="w-full text-sm h-9 bg-background border-input/60 hover:border-input focus:ring-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Inter" className="font-sans">Inter</SelectItem>
            <SelectItem value="Geist" className="font-sans">Geist</SelectItem>
            <SelectItem value="System" className="font-sans">System</SelectItem>
            <SelectItem value="Serif" className="font-serif">Serif</SelectItem>
            <SelectItem value="Mono" className="font-mono">Mono</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex justify-between">
          <Label className="text-xs font-medium text-muted-foreground">Base Size</Label>
          <span className="text-xs text-muted-foreground font-mono">{typography.baseSize || 16}px</span>
        </div>
        <Slider
          value={[typography.baseSize || 16]}
          min={12}
          max={24}
          step={1}
          onValueChange={([val]) => onChange("baseSize", val)}
          className="py-1"
        />
      </div>
    </div>
  )
}
