
import { useState, useRef, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { type ImageData } from "@/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import api from "@/lib/api"
import { useStoreStore } from "@/stores/storeStore"

interface UploadDialogProps {
  onImagesSelected: (images: ImageData[]) => void
  initialValues: ImageData[]
  multiple?: boolean
}

export function UploadDialog({ onImagesSelected, initialValues, multiple = true }: UploadDialogProps) {
  const [images, setImages] = useState<ImageData[]>(initialValues || [])
  const [primaryIndex, setPrimaryIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [galleryImages, setGalleryImages] = useState<any[]>([])
  const [isLoadingGallery, setIsLoadingGallery] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { stores } = useStoreStore()
  const storeId = stores?.[0]?.id

  const fetchGallery = useCallback(async () => {
    if (!storeId) return
    setIsLoadingGallery(true)
    try {
      const response = await api.get(`/api/v1/gallery?store_id=${storeId}`)
      if (response.data.data.resources) {
        setGalleryImages(response.data.data.resources)
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error)
      toast.error("Failed to load gallery")
    } finally {
      setIsLoadingGallery(false)
    }
  }, [storeId])

  useEffect(() => {
    if (open && activeTab === "gallery") {
      fetchGallery()
    }
  }, [open, activeTab, fetchGallery])

  const handleFileChange = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const newImages: ImageData[] = []
      let loadedCount = 0
      const filesArray = Array.from(files)
      const filesToProcess = multiple ? filesArray : [filesArray[0]]

      filesToProcess.forEach((file, index) => {
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
              isPrimary: multiple ? (index === 0 && images.length === 0) : true,
            })
            loadedCount++

            if (loadedCount === filesToProcess.length) {
              setImages((prevImages) => multiple ? [...prevImages, ...newImages] : newImages)
            }
          }
        }
        reader.readAsDataURL(file)
      })
    },
    [images, multiple],
  )

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    const files: File[] = []
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile()
        if (file) files.push(file)
      }
    }
    if (files.length > 0) {
      if (!multiple) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(files[0])
        handleFileChange(dataTransfer.files)
      } else {
        const dataTransfer = new DataTransfer()
        files.forEach(file => dataTransfer.items.add(file))
        handleFileChange(dataTransfer.files)
      }
    }
  }, [handleFileChange, multiple])

  const handlePrimaryChange = useCallback((index: number) => {
    if (!multiple) return
    setPrimaryIndex(index)
    setImages((prevImages) =>
      prevImages.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    )
  }, [multiple])

  const handleSubmit = useCallback(() => {
    const sortedImages = multiple
      ? [...images].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
      : images
    onImagesSelected(sortedImages)
    setOpen(false)
  }, [images, onImagesSelected, multiple])

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

  const handleGallerySelect = (img: any) => {
    if (multiple) {
      setImages(prev => [
        ...prev,
        {
          image_url: img.url,
          isPrimary: prev.length === 0
        }
      ])
    } else {
      setImages([
        {
          image_url: img.url,
          isPrimary: true
        }
      ])
    }
    toast.success("Image added from gallery")
  }

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onPaste={handlePaste}>
        <DialogHeader>
          <DialogTitle>Add Images</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload New</TabsTrigger>
            <TabsTrigger value="gallery">Store Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="flex-grow overflow-y-auto space-y-4 pt-4">
            <div
              className={`border-2 border-dashed rounded-lg p-10 text-center transition-all duration-300 ${isDragging ? "bg-muted/50 scale-[1.02]" : "hover:bg-muted/50"
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
              <Upload className="mx-auto h-10 w-10 mb-2 text-muted-foreground" />
              <p className="font-medium">Drag & drop images here, click to browse, or paste from clipboard</p>
              <p className="text-sm text-muted-foreground mt-1">Maximum file size: 5MB</p>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="flex-grow overflow-y-auto pt-4">
            {isLoadingGallery ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : galleryImages.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-square rounded-md overflow-hidden border hover:border-primary cursor-pointer transition-all"
                    onClick={() => handleGallerySelect(img)}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <ImageIcon className="text-white h-6 w-6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
                <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No images found in your gallery.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
        />

        {images.length > 0 && (
          <div className="mt-4 space-y-4 max-h-60 overflow-y-auto p-1">
            <h4 className="text-sm font-semibold">Selected Images ({images.length})</h4>
            {images.map((image, index) => (
              <div
                key={index}
                className={`flex items-center space-x-4 p-3 rounded-lg border transition-all ${image.isPrimary ? "border-primary ring-1 ring-primary" : "hover:border-primary/50"
                  }`}
                onClick={() => handlePrimaryChange(index)}
              >
                <div className="relative h-16 w-16 min-w-[64px] rounded-md overflow-hidden border bg-muted">
                  <img
                    src={getImageSrc(image) || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex-grow">
                  {image.isPrimary ? (
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Primary Image</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Click to make primary</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(index);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={() => { setImages(initialValues); setOpen(false); }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={images.length === 0}>
            Finish Selection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
