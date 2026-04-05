import { useState, useRef, useCallback, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, X, Video as VideoIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { type VideoData } from "@/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import api from "@/lib/api"
import { useStoreStore } from "@/stores/storeStore"
import { useAuthStore } from "@/stores/authStore"

interface ExtendedVideoData extends VideoData {
  id?: string;
  isUploading?: boolean;
  error?: string;
  localUrl?: string; // For immediate preview before upload finishes
}

interface UploadVideoDialogProps {
  onVideosSelected: (videos: VideoData[]) => void
  initialValues: VideoData[]
  multiple?: boolean
}

export function UploadVideoDialog({ onVideosSelected, initialValues, multiple = true }: UploadVideoDialogProps) {
  const [videos, setVideos] = useState<ExtendedVideoData[]>(initialValues || [])
  const [primaryIndex, setPrimaryIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [galleryVideos, setGalleryVideos] = useState<any[]>([])
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
        const resources = response.data.data.resources;
        const videoResources = resources.filter((res: any) => 
          res.resource_type === 'video' || 
          res.url.match(/\.(mp4|webm|ogg|mov)$/)
        );
        setGalleryVideos(videoResources)
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

  const uploadFile = async (file: File, tempId: string) => {
    try {
      const token = useAuthStore.getState().getAccessToken();
      
      // 1. Get Cloudinary signature from our backend
      const signResponse = await axios.post(
        `${import.meta.env.VITE_API_URL || ''}/api/v1/upload`, 
        { fileName: file.name, folder: 'cms/videos' },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      const { signature, timestamp, public_id, api_key, upload_url, folder } = signResponse.data.data;

      // 2. Upload directly to Cloudinary
      const cloudFormData = new FormData();
      cloudFormData.append('file', file);
      cloudFormData.append('signature', signature);
      cloudFormData.append('timestamp', timestamp.toString());
      cloudFormData.append('api_key', api_key);
      cloudFormData.append('public_id', public_id);
      cloudFormData.append('folder', folder);

      const response = await axios.post(upload_url, cloudFormData);
      const publicUrl = response.data.secure_url;
      
      setVideos((prev) => 
        prev.map(v => v.id === tempId 
          ? { ...v, video_url: publicUrl, isUploading: false, localUrl: undefined } 
          : v
        )
      );
      // toast.success(`${file.name} uploaded`);
    } catch (error) {
      console.error("Upload failed:", error);
      setVideos((prev) => 
        prev.map(v => v.id === tempId 
          ? { ...v, isUploading: false, error: 'Upload failed' } 
          : v
        )
      );
      toast.error(`Failed to upload ${file.name}`);
    }
  };

  const handleFileChange = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const filesArray = Array.from(files)
      const filesToProcess = multiple ? filesArray : [filesArray[0]]

      filesToProcess.forEach((file) => {
        if (file.size > 50 * 1024 * 1024) { // 50MB limit for videos
          toast.error(`File ${file.name} is larger than 50MB.`)
          return
        }

        const tempId = Math.random().toString(36).substring(7);
        const localUrl = URL.createObjectURL(file);
        
        const newVideo: ExtendedVideoData = {
          id: tempId,
          video_url: '', // Will be filled after upload
          isPrimary: multiple ? (videos.length === 0) : true,
          isUploading: true,
          localUrl
        };

        if (multiple) {
           setVideos(prev => [...prev, newVideo]);
        } else {
           setVideos([newVideo]);
        }

        uploadFile(file, tempId);
      })
    },
    [videos, multiple],
  )

  const handlePrimaryChange = useCallback((index: number) => {
    if (!multiple) return
    setPrimaryIndex(index)
    setVideos((prevVideos) =>
      prevVideos.map((vid, i) => ({
        ...vid,
        isPrimary: i === index,
      })),
    )
  }, [multiple])

  const handleSubmit = useCallback(() => {
    const isAnyUploading = videos.some(v => v.isUploading);
    if (isAnyUploading) {
      toast.warning("Please wait for all uploads to complete");
      return;
    }

    const successfulVideos = videos.filter(v => v.video_url && !v.error);
    const result = multiple
      ? [...successfulVideos].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
      : successfulVideos
    
    onVideosSelected(result.map(({ video_url, isPrimary }) => ({ video_url, isPrimary })))
    setOpen(false)
  }, [videos, onVideosSelected, multiple])

  const handleRemoveVideo = useCallback(
    (index: number) => {
      setVideos((prevVideos) => {
        const videoToRemove = prevVideos[index];
        if (videoToRemove.localUrl) {
          URL.revokeObjectURL(videoToRemove.localUrl);
        }
        
        const newVideos = prevVideos.filter((_, i) => i !== index)
        if (primaryIndex === index) {
          setPrimaryIndex(0)
          if (newVideos.length > 0) {
            newVideos[0].isPrimary = true
          }
        }
        return newVideos
      })
    },
    [primaryIndex],
  )

  const handleGallerySelect = (vid: any) => {
    if (multiple) {
      setVideos(prev => [
        ...prev,
        {
          video_url: vid.url,
          isPrimary: prev.length === 0
        }
      ])
    } else {
      setVideos([
        {
          video_url: vid.url,
          isPrimary: true
        }
      ])
    }
    toast.success("Video added from gallery")
  }

  const getVideoSrc = (video: ExtendedVideoData): string => {
    if (video.localUrl) return video.localUrl;
    if (typeof video.video_url === "string") return video.video_url;
    return "";
  }

  const isAnyUploading = videos.some(v => v.isUploading);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          Add Videos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Videos</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="grow flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload New</TabsTrigger>
            <TabsTrigger value="gallery">Store Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="grow overflow-y-auto space-y-4 pt-4">
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
              <VideoIcon className="mx-auto h-10 w-10 mb-2 text-muted-foreground" />
              <p className="font-medium">Drag & drop videos here or click to browse</p>
              <p className="text-sm text-muted-foreground mt-1">Maximum file size: 50MB</p>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="grow overflow-y-auto pt-4">
            {isLoadingGallery ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : galleryVideos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {galleryVideos.map((vid, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-video rounded-md overflow-hidden border hover:border-primary cursor-pointer transition-all"
                    onClick={() => handleGallerySelect(vid)}
                  >
                    <video src={vid.url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <VideoIcon className="text-white h-6 w-6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
                <VideoIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No videos found in your gallery.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="video/*"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
        />

        {videos.length > 0 && (
          <div className="mt-4 space-y-4 max-h-60 overflow-y-auto p-1">
            <h4 className="text-sm font-semibold">Selected Videos ({videos.length})</h4>
            {videos.map((video, index) => (
              <div
                key={video.id || index}
                className={`flex items-center space-x-4 p-3 rounded-lg border transition-all ${video.isPrimary ? "border-primary ring-1 ring-primary" : "hover:border-primary/50"
                  }`}
                onClick={() => handlePrimaryChange(index)}
              >
                <div className="relative h-16 w-24 min-w-[96px] rounded-md overflow-hidden border bg-muted">
                  <video
                    src={getVideoSrc(video)}
                    className="h-full w-full object-contain"
                  />
                  {video.isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                       <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div className="grow truncate">
                   <p className="text-sm font-medium truncate">
                      {video.isUploading ? 'Uploading...' : 'Video Channel'}
                   </p>
                   <div className="flex items-center gap-1">
                      {video.isUploading ? (
                        <span className="text-xs text-muted-foreground">Please wait...</span>
                      ) : video.error ? (
                        <span className="text-xs text-destructive flex items-center gap-1">
                           <AlertCircle className="h-3 w-3" /> {video.error}
                        </span>
                      ) : (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                           <CheckCircle2 className="h-3 w-3" /> Ready
                        </span>
                      )}
                   </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveVideo(index);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={() => { setVideos(initialValues || []); setOpen(false); }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={videos.length === 0 || isAnyUploading}>
            {isAnyUploading ? 'Uploading...' : 'Finish Selection'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
