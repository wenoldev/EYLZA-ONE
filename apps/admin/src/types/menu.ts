import type { LucideIcon } from "lucide-react"

// Define RouteConfig type or import it from the correct module
export type RouteConfig = {
  url: string
  queryParams?: Record<string, string>
  external?: boolean
}

export interface MenuItem {
  title: string
  route?: RouteConfig
  icon?: LucideIcon
  isActive?: boolean
  subItems?: {
    title: string
    route?: RouteConfig
  }[]
}

export interface MenuGroup {
  sectionName: string
  items: MenuItem[]
}
