
import { useState, useRef, useCallback } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import { type ImageData } from "@/types"

interface UploadDialogProps {
  onImagesSelected: (images: ImageData[]) => void
  initialValues: ImageData[]
}

export function UploadDialog({ onImagesSelected, initialValues }: UploadDialogProps) {
  const [images, setImages] = useState<ImageData[]>(initialValues || [])
  const [primaryIndex, setPrimaryIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const newImages: ImageData[] = []
      let loadedCount = 0

      Array.from(files).forEach((file, index) => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} is larger than 5MB. Please choose a smaller file.`)
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result && typeof e.target.result === "string") {
            const fileContent = e.target.result as string
            newImages.push({
              image_url: {
                fileName: file.name,
                fileContent,
              },
              isPrimary: index === 0 && images.length === 0,
            })
            loadedCount++

            if (loadedCount === files.length) {
              setImages((prevImages) => [...prevImages, ...newImages])
            }
          }
        }
        reader.readAsDataURL(file)
      })
    },
    [images],
  )

  const handlePrimaryChange = useCallback((index: number) => {
    setPrimaryIndex(index)
    setImages((prevImages) =>
      prevImages.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    )
  }, [])

  const handleSubmit = useCallback(() => {
    const sortedImages = [...images].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
    onImagesSelected(sortedImages)
    setOpen(false)
  }, [images, onImagesSelected])

  const handleRemoveImage = useCallback(
    (index: number) => {
      setImages((prevImages) => {
        const newImages = prevImages.filter((_, i) => i !== index)
        if (primaryIndex === index) {
          setPrimaryIndex(0)
          if (newImages.length > 0) {
            newImages[0].isPrimary = true
          }
        }
        return newImages
      })
    },
    [primaryIndex],
  )

  const getImageSrc = (image: ImageData): string => {
    if (typeof image.image_url === "string") {
      return image.image_url
    } else if (image.image_url && "fileContent" in image.image_url) {
      return image.image_url.fileContent
    }
    return "/placeholder.svg"
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          Add Images
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${isDragging ? "bg-muted/50 scale-105" : "hover:bg-muted/50"
              } cursor-pointer`}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              handleFileChange(e.dataTransfer.files)
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-8 w-8 mb-2 text-muted-foreground" />
            <p>Drag & drop your files here or click to browse</p>
            <p className="text-sm text-muted-foreground mt-1">Maximum file size: 5MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files)}
          />

          {images.length > 0 && (
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-4 rounded-lg h-28 border border-solid ${image.isPrimary ? "border-2 border-blue-400" : "dark:border-white"
                    }`}
                  onClick={() => handlePrimaryChange(index)}
                >
                  <img
                    src={getImageSrc(image) || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    width={100}
                    height={100}
                    className="rounded-md h-full object-contain"
                  />
                  <div className="flex-grow">
                    {image.isPrimary && <span className="text-sm font-medium text-primary">Primary Image</span>}
                  </div>
                  <Button variant="destructive" size="icon" onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(index);
                  }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={images.length === 0}>
              Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
