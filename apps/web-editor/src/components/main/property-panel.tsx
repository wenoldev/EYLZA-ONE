
import type { ComponentInstance, EditorElement } from "@/types/editor"
import { PropertyEditor } from "../editor/property-editor"
import { X } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import set from "lodash.set"
import get from "lodash.get"

interface PropertyPanelProps {
  component: ComponentInstance | null
  selectedElement: EditorElement | null
  onUpdateElement: (element: EditorElement) => void
  onClose: () => void
}

export function PropertyPanel({ selectedElement, component, onUpdateElement, onClose }: PropertyPanelProps) {
  if (!selectedElement) {
    return (
      <div className="flex h-full flex-col bg-card w-full">
        <div className="flex items-center justify-center p-12 text-center flex-1">
          <div className="space-y-4 max-w-[200px]">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto">
              <div className="i-lucide-box w-8 h-8 text-muted-foreground/40" />
            </div>
            <p className="text-xs font-medium text-muted-foreground">Select an element to edit its properties</p>
          </div>
        </div>
      </div>
    )
  }

  const schema = selectedElement.schema

  const handleFieldChange = (property: string, value: any) => {
    // Deep clone props to avoid mutation issues
    const newProps = JSON.parse(JSON.stringify(selectedElement.props))
    set(newProps, property, value)

    onUpdateElement({
      ...selectedElement,
      props: newProps,
    })
  }

  // Determine default expanded items (all tabs)
  const defaultValues = schema.tabs.map(tab => tab.label)

  return (
    <div className="flex h-full flex-col bg-card w-full overflow-auto">
      <ScrollArea className="flex-1 px-4 py-2">
        <div className="pb-8">
          <Accordion type="multiple" defaultValue={defaultValues} className="w-full space-y-2 border-none">
            {schema.tabs.map((tab) => (
              <AccordionItem key={tab.label} value={tab.label} className="border border-border/40 rounded-xl bg-muted/5 overflow-hidden">
                <AccordionTrigger className="px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-foreground/80 hover:no-underline hover:bg-muted/30 data-[state=open]:bg-muted/20 transition-all border-none">
                  {tab.label}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-6 pt-4 space-y-8">
                  {tab.controls.map((control, index) => (
                    <div key={control.property} className="animate-in fade-in slide-in-from-top-1 duration-300">
                      <PropertyEditor
                        field={control}
                        value={get(selectedElement.props, control.property)}
                        onChange={(value) => handleFieldChange(control.property, value)}
                        allProps={selectedElement.props}
                      />
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  )
}
