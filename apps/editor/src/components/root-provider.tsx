import type React from "react"
import { ThemeProvider } from "@/lib/theme-provider"

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}
