
import { useEffect, useState } from "react"

interface NeonProgressBarProps {
  isLoading: boolean
  progress: number
}

export function NeonProgressBar({ isLoading, progress }: NeonProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0)

  useEffect(() => {
    if (isLoading && progress < 100) {
      const timer = setTimeout(() => {
        setDisplayProgress((prev) => Math.min(prev + Math.random() * 30, progress))
      }, 300)
      return () => clearTimeout(timer)
    } else if (!isLoading) {
      setDisplayProgress(100)
      const timer = setTimeout(() => setDisplayProgress(0), 500)
      return () => clearTimeout(timer)
    }
  }, [isLoading, progress])

  if (!isLoading && displayProgress === 0) return null

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 shadow-lg shadow-cyan-500/50 transition-all duration-300"
        style={{
          width: `${displayProgress}%`,
          boxShadow: displayProgress > 0 ? "0 0 20px rgba(6, 182, 212, 0.8)" : "none",
        }}
      />
    </div>
  )
}
