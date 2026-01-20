
import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files?.[0]) handleFile(files[0])
  }

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") onChange(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex items-center justify-between w-full group">
      {label && <span className="text-xs font-semibold text-muted-foreground/80">{label}</span>}
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2.5 px-3 py-1.5 border border-border/60 rounded-xl hover:border-primary/40 hover:bg-muted/30 transition-all bg-background shadow-sm max-w-[180px]">
            <div className="w-8 h-8 rounded-lg border border-black/5 shadow-inner overflow-hidden bg-muted/30 shrink-0">
              {value ? (
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Upload className="w-3 h-3 text-muted-foreground/40" />
                </div>
              )}
            </div>
            <span className="text-[11px] font-medium text-foreground/70 truncate tracking-tight">
              {value ? "Change Image" : "Choose Image"}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-4 bg-white dark:bg-gray-950 border-border/40 shadow-2xl rounded-2xl" side="bottom" align="end" sideOffset={12}>
          <div className="space-y-4">
            {value && (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-border/40 mb-2">
                <img src={value} className="w-full h-full object-cover" />
                <button
                  onClick={() => onChange("")}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-black/70 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
                isDragging ? "border-primary bg-primary/5 scale-[0.98]" : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
              )}
            >
              <div className="space-y-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-foreground">Click or Drag</p>
                  <p className="text-[10px] text-muted-foreground">PNG, JPG up to 5MB</p>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
