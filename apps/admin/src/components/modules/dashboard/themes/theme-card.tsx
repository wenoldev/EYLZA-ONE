

import type React from "react"

import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Theme } from "@/types/themes"
import { formatCurrency } from "@/utils/currency"
import { Button } from "@/components/ui/button"

interface ThemeCardProps {
  theme: Theme,
  onFavoriteToggle: (e: React.MouseEvent) => void,
  onSelect: () => void,
  onPreview: () => void
}

export default function ThemeCard({ theme, onFavoriteToggle, onSelect, onPreview }: ThemeCardProps) {
  return (
    <div className="group flex flex-col bg-card rounded-xl border border-border overflow-hidden transition-all hover:shadow-lg">
      {/* Preview Image Container */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img src={theme.preview || "/placeholder.svg"} alt={theme.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

        {/* Overlay with Buttons */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="sm"
            className="w-28 font-medium"
            onClick={(e) => { e.stopPropagation(); onPreview(); }}
          >
            Preview
          </Button>
          <Button
            variant="default"
            size="sm"
            className="w-28 font-medium bg-primary text-primary-foreground"
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
          >
            {theme.isPaidTheme && !(theme as any).isPurchased ? "Buy Now" : "Select"}
          </Button>
        </div>

        {/* Favorite Button */}
        <button
          onClick={onFavoriteToggle}
          className="absolute top-3 right-3 p-2 rounded-lg bg-white/90 shadow-sm transition-all hover:bg-white"
          aria-label="Add to favorites"
        >
          <Heart
            size={18}
            className={cn(
              "transition-colors",
              theme.isFavorite ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary",
            )}
          />
        </button>
      </div>

      {/* Theme Info */}
      <div className="p-4 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-sm truncate">{theme.name}</h3>
          {theme.isPaidTheme && (
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
              {formatCurrency(theme.price || 0)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{theme.category}</p>
          {!theme.isPaidTheme && (
            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase">
              Free
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
