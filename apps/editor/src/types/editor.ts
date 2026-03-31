export type PanelType = "layers" | "add-sections" | "settings" | "properties" | null
export type ViewportSize = "mobile" | "desktop" | "fullscreen"

export type DeviceType = "mobile" | "desktop"
export type Orientation = "portrait" | "landscape"

export const DEVICE_BREAKPOINTS: Record<DeviceType, number> = {
  mobile: 375,
  desktop: 1440,
}

export interface SelectionState {
  selectedId: string | null
  selectedType: "section" | "element"
  multiSelected?: string[]
}

export interface GlobalSettings {
  brandColors: {
    primary: string
    secondary: string
    background: string
    neutral: string
    success: string
    warning: string
    error: string
  }
  typography: {
    bodyFont: string
    bodyWeight: string
    headingFont: string
    headingWeight: string
    baseSize: number
  }
  logo?: {
    url: string
    width: number
    height: number
  }
  interface: {
    cornerRadius: number
    enableShadows: boolean
    stickyHeader: boolean
  }
  buttonRadius: string
  breakpoints: Record<DeviceType, number>
  presets?: Array<{
    id: string
    name: string
    settings: Partial<GlobalSettings>
  }>
}

export interface EditorSchema {
  label: string
  icon?: string
  group?: string
  tabs: EditorTab[]
}

export interface EditorTab {
  label: string
  controls: EditorControl[]
}

export interface EditorControl {
  property: string
  label: string
  control: "input" | "textarea" | "select" | "switch" | "slider" | "color" | "repeater" | "image"
  type?: "text" | "number"
  placeholder?: string
  defaultValue?: any
  rows?: number
  note?: string
  options?: Array<{ label: string; value: any }>
  min?: number
  max?: number
  step?: number
  itemLabel?: string
  fields?: EditorControl[]
  visibleWhen?: {
    property: string
    value: any
    operator?: "==" | "!=" | ">" | "<" | ">=" | "<=" | "contains" | "in"
  }
  condition?: {
    property: string
    value: any
    operator?: "==" | "!=" | ">" | "<" | ">=" | "<=" | "contains" | "in"
  }
  validation?: {
    required?: boolean
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    requiredWhen?: {
      property: string
      value: any
    }
    minItems?: number
    maxItems?: number
  }
}

export interface EditorElement {
  "data-x-id": string
  selector: string
  schema: EditorSchema
  props: Record<string, any>
}

export interface ComponentInstance extends Record<string, any> {
  id: string
  selector: string
  name: string
  props: Record<string, any>
  elements?: EditorElement[]
  visible: boolean
  isDeletable: boolean
  variant?: string
  order: number
}

export type ComponentTypeKey = "banner" | "slider" | "carousel" | "grid" | "text" | "header" | "footer"

export interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
}

export interface SectionPresetStyle {
  id: string
  name: string
  thumbnail?: string
  settings: Record<string, any>
}
