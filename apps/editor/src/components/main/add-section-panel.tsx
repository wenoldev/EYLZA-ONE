
import type React from "react"
import { useState } from "react"
import { Search, Plus, GripHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"

import { componentGallery } from "@/lib/component-gallery"

interface AddSectionGalleryProps {
  onAddComponent: (selector: string, variant?: string) => void
  onDragStart: (e: React.DragEvent, selector: string) => void
}

export function AddSectionGallery({ onAddComponent, onDragStart }: AddSectionGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>("all")

  const gallery = componentGallery

  const filtered = gallery.filter((item) => item.label.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 border-b border-border space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            className="pl-9 text-sm h-9 bg-muted/50 border-transparent focus:bg-background focus:border-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Pills with Arrows and Fade */}
        <div className="relative group/scroll">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none opacity-0 group-hover/scroll:opacity-100 transition-opacity" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none opacity-0 group-hover/scroll:opacity-100 transition-opacity" />

          <div
            id="category-scroll"
            className="flex gap-2 overflow-x-auto scrollbar-hide px-1 scroll-smooth"
          >
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              All
            </button>
            {gallery.map(item => (
              <button
                key={item.selector}
                onClick={() => setSelectedCategory(item.selector)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === item.selector
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Scroll Arrows */}
          <button
            onClick={() => {
              const el = document.getElementById('category-scroll');
              if (el) el.scrollLeft -= 100;
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-6 h-6 flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-all z-20"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('category-scroll');
              if (el) el.scrollLeft += 100;
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-6 h-6 flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-all z-20"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {filtered.map((item) => {
          if (selectedCategory !== "all" && selectedCategory !== item.selector) return null;

          return (
            <div key={item.selector} className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">{item.label}</h3>
                <div className="h-px flex-1 bg-border/50" />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {item.variants.map((variant) => (
                  <div
                    key={variant.id}
                    draggable
                    onDragStart={(e) => {
                      onDragStart(e, item.selector)
                      e.dataTransfer.setData("variantId", variant.id)
                    }}
                    className="group relative bg-background rounded-xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-grab active:cursor-grabbing"
                  >
                    {/* Thumbnail Container */}
                    <div className="aspect-[2/1] overflow-hidden bg-muted relative">
                      <img
                        src={variant.thumbnail || "/placeholder.svg"}
                        alt={variant.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Hover Action */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onAddComponent(item.selector, variant.id)
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full text-xs font-semibold shadow-xl hover:scale-105 transition-transform"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add Section
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{variant.name}</span>
                        <GripHorizontal className="h-4 w-4 text-muted-foreground/50" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No components found</p>
          </div>
        )}
      </div>
    </div>
  )
}
