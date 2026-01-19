import type React from "react"
import { X } from "lucide-react"

interface SidePanelProps {
  isOpen: boolean
  togglePanel: () => void
  position?: "left" | "right"
  title?: string
  icon?: React.ReactNode
  children: React.ReactNode
  width?: string
}

const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  togglePanel,
  position = "right",
  title = "",
  icon,
  children,
  width = "w-80"
}) => {
  const positionClasses = {
    left: "left-0",
    right: "right-0"
  }

  const transformClasses = {
    left: isOpen ? "translate-x-0" : "-translate-x-full",
    right: isOpen ? "translate-x-0" : "translate-x-full"
  }

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={togglePanel}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-0 ${positionClasses[position]} h-full ${width} bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          transformClasses[position]
        } flex flex-col`}
      >
        {(title || icon) && (
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-2">
              {icon}
              {title && <span className="font-bold text-lg text-gray-800">{title}</span>}
            </div>
            <button 
              onClick={togglePanel} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close panel"
            >
              <X size={24} />
            </button>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default SidePanel