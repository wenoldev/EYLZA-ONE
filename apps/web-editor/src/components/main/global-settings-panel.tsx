import { Palette, Type, Layout, PanelTop, PanelBottom, FileEdit } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ColorSettings } from "./settings/color-settings"
import { TypographySettings } from "./settings/typography-settings"
import { InterfaceSettings } from "./settings/interface-settings"
import { HeaderSettings } from "./settings/header-settings"
import { FooterSettings } from "./settings/footer-settings"
import { ThemeSettings } from "./settings/theme-settings"
import { DraftSettings } from "./settings/draft-settings"

interface GlobalSettingsPanelProps {
  config: any
  onConfigChange: (newConfig: any) => void
}

export function GlobalSettingsPanel({ config, onConfigChange }: GlobalSettingsPanelProps) {

  const updateGlobal = (section: string, key: string, value: any) => {
    const newConfig = { ...config }
    if (!newConfig.global) newConfig.global = {}
    if (!newConfig.global[section]) newConfig.global[section] = {}

    newConfig.global[section] = {
      ...newConfig.global[section],
      [key]: value
    }

    onConfigChange(newConfig)
  }

  const updateHeader = (path: string, value: any) => {
    const newConfig = { ...config }
    if (!newConfig.header) newConfig.header = {}

    const parts = path.split('.')
    let current = newConfig.header

    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {}
      current[parts[i]] = { ...current[parts[i]] }
      current = current[parts[i]]
    }

    current[parts[parts.length - 1]] = value
    onConfigChange(newConfig)
  }

  const updateFooter = (path: string, value: any) => {
    const newConfig = { ...config }
    if (!newConfig.footer) newConfig.footer = {}

    const parts = path.split('.')
    let current = newConfig.footer

    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {}
      current[parts[i]] = { ...current[parts[i]] }
      current = current[parts[i]]
    }

    current[parts[parts.length - 1]] = value
    onConfigChange(newConfig)
  }

  return (
    <div className="flex h-full flex-col bg-card overflow-auto">
      <ScrollArea className="flex-1 px-4 py-2">
        <Accordion type="multiple" defaultValue={["colors", "typography"]} className="w-full">

          {/* Colors */}
          <AccordionItem value="colors" className="border-b border-border/60">
            <AccordionTrigger className="px-5 py-3 text-sm font-medium hover:no-underline hover:bg-muted/30 data-[state=open]:bg-muted/20">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                Colors
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-3">
              <ColorSettings
                colors={config.global?.colors || {}}
                onChange={(key, val) => updateGlobal("colors", key, val)}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Typography */}
          <AccordionItem value="typography" className="border-b border-border/60">
            <AccordionTrigger className="px-5 py-3 text-sm font-medium hover:no-underline hover:bg-muted/30 data-[state=open]:bg-muted/20">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-muted-foreground" />
                Typography
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-3">
              <TypographySettings
                typography={config.global?.others || {}}
                onChange={(key, val) => updateGlobal("others", key, val)}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Theme */}
          <AccordionItem value="theme" className="border-b border-border/60">
            <AccordionTrigger className="px-5 py-3 text-sm font-medium hover:no-underline hover:bg-muted/30 data-[state=open]:bg-muted/20">
              <div className="flex items-center gap-2">
                <Layout className="h-4 w-4 text-muted-foreground" />
                Theme Management
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-3">
              <ThemeSettings />
            </AccordionContent>
          </AccordionItem>

          {/* Drafts */}
          <AccordionItem value="drafts" className="border-b border-border/60">
            <AccordionTrigger className="px-5 py-3 text-sm font-medium hover:no-underline hover:bg-muted/30 data-[state=open]:bg-muted/20">
              <div className="flex items-center gap-2">
                <FileEdit className="h-4 w-4 text-muted-foreground" />
                Draft Versions
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-3">
              <DraftSettings />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  )
}
