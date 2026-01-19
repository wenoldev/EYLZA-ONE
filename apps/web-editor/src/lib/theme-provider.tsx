
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("theme-dark")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = saved !== null ? saved === "true" : prefersDark
    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle("dark", shouldBeDark)
  }, [])

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newValue = !prev
      localStorage.setItem("theme-dark", String(newValue))
      document.documentElement.classList.toggle("dark", newValue)
      return newValue
    })
  }

  // Don't render children until mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return <ThemeContext.Provider value={{ isDark, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
