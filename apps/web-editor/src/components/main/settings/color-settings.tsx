
import { Label } from "@/components/ui/label"
import { ColorPicker } from "../../editor/color-picker"

interface ColorSettingsProps {
  colors: {
    primary: string
    secondary: string
    background: string
    [key: string]: string
  }
  onChange: (key: string, value: string) => void
}

export function ColorSettings({ colors, onChange }: ColorSettingsProps) {
  return (
    <div className="space-y-4">
      <Label className="text-xs font-medium text-muted-foreground block">Brand Colors</Label>
      <div className="space-y-4">
        <ColorPicker
          label="Primary Color"
          value={colors.primary}
          onChange={(val) => onChange("primary", val)}
        />
        <ColorPicker
          label="Secondary Color"
          value={colors.secondary}
          onChange={(val) => onChange("secondary", val)}
        />
        <ColorPicker
          label="Background"
          value={colors.background}
          onChange={(val) => onChange("background", val)}
        />
      </div>
    </div>
  )
}
