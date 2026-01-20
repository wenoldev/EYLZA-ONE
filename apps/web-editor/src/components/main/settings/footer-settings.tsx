
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ColorPicker } from "../../editor/color-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FooterSettingsProps {
  footer: any
  onChange: (path: string, value: any) => void
}

export function FooterSettings({ footer, onChange }: FooterSettingsProps) {
  if (!footer) return null

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">General</Label>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Design</Label>
            <Select
              value={footer.props?.general?.design || "design1"}
              onValueChange={(val: string) => onChange("props.general.design", val)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="design1">Design 1</SelectItem>
                <SelectItem value="design2">Design 2</SelectItem>
                <SelectItem value="design3">Design 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ColorPicker
            label="Background Color"
            value={footer.props?.general?.backgroundColor || "#ffffff"}
            onChange={(val: string) => onChange("props.general.backgroundColor", val)}
          />
          <ColorPicker
            label="Text Color"
            value={footer.props?.general?.textColor || "#1f2937"}
            onChange={(val: string) => onChange("props.general.textColor", val)}
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border/40">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sections</Label>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Hide Footer</Label>
          <Switch
            checked={footer.props?.sections?.hideFooter}
            onCheckedChange={(val: boolean) => onChange("props.sections.hideFooter", val)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Show Social Icons</Label>
          <Switch
            checked={footer.props?.sections?.showSocialIcons}
            onCheckedChange={(val: boolean) => onChange("props.sections.showSocialIcons", val)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Show Payment Methods</Label>
          <Switch
            checked={footer.props?.sections?.showPaymentMethods}
            onCheckedChange={(val: boolean) => onChange("props.sections.showPaymentMethods", val)}
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border/40">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Content</Label>
        <div className="space-y-2">
          <Label className="text-xs">Copyright Text</Label>
          <Input
            value={footer.props?.content?.copyrightText || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("props.content.copyrightText", e.target.value)}
            className="h-8 text-xs"
          />
        </div>
      </div>
    </div>
  )
}
