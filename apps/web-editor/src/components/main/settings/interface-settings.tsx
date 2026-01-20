
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface InterfaceSettingsProps {
  interfaceSettings: {
    cornerRadius: number
    enableShadows: boolean
    stickyHeader: boolean
    [key: string]: any
  }
  onChange: (key: string, value: any) => void
}

export function InterfaceSettings({ interfaceSettings, onChange }: InterfaceSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-muted-foreground">Corner Radius</Label>
          <span className="text-[10px] font-mono text-muted-foreground">{interfaceSettings?.cornerRadius || 0}px</span>
        </div>
        <Slider
          value={[interfaceSettings?.cornerRadius || 0]}
          min={0}
          max={24}
          step={1}
          onValueChange={([val]: number[]) => onChange("cornerRadius", val)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-xs font-medium text-foreground">Enable Shadows</Label>
          <p className="text-[10px] text-muted-foreground">Add depth to cards</p>
        </div>
        <Switch
          checked={interfaceSettings?.enableShadows}
          onCheckedChange={(val: boolean) => onChange("enableShadows", val)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-xs font-medium text-foreground">Sticky Header</Label>
          <p className="text-[10px] text-muted-foreground">Keep menu visible</p>
        </div>
        <Switch
          checked={interfaceSettings?.stickyHeader}
          onCheckedChange={(val: boolean) => onChange("stickyHeader", val)}
        />
      </div>
    </div>
  )
}
