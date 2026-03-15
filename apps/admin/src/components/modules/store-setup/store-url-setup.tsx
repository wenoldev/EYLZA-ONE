
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Check, X, Loader2 } from "lucide-react"
import type { StoreFormData } from "./index"
import api from "@/lib/api"
import { toast } from "sonner"

interface StoreUrlStepProps {
  formData: StoreFormData
  updateFormData: (data: Partial<StoreFormData>) => void
  onBack: () => void
  onSubmit: () => void
  loading: boolean
}

const timezones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Kolkata",
  "Australia/Sydney",
]

export function StoreUrlStep({ formData, updateFormData, onBack, onSubmit, loading }: StoreUrlStepProps) {
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken" | "error" | "invalid">("idle")
  const [customSlug, setCustomSlug] = useState(formData.slug)
  const baseUrl = window.location.origin;
  // Generate slug from store name
  useEffect(() => {
    if (formData.name && !customSlug) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
      setCustomSlug(generatedSlug)
      updateFormData({ slug: generatedSlug })
    }
  }, [formData.name, customSlug, updateFormData])

  const checkSlugAvailability = async (slug: string) => {
    if (!slug) return

    setSlugStatus("checking")

    try {
      const response = await api.get(`/api/v1/stores/check-slug`, {
        params: { slug }
      })

      // Check if the response indicates the slug exists
      if (response.data?.data?.exists) {
        setSlugStatus("taken")
        toast.error("Slug is already taken", {
          description: `The slug "${slug}" is already being used by another store.`
        })
      } else if (response.data?.data?.valid === false) {
        setSlugStatus("invalid")
        toast.error("Invalid slug format", {
          description: response.data?.error?.message || "Use lowercase letters, numbers, and hyphens only."
        })
      } else {
        setSlugStatus("available")
        toast.success("Slug is available", {
          description: `The slug "${slug}" is available for use.`
        })
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setSlugStatus("error")

      const errorMessage = error.response?.data?.error?.message || error.message || "Unable to check slug availability"

      toast.error("Error checking slug", {
        description: errorMessage
      })
    }
  }

  useEffect(() => {
    if (customSlug && customSlug.length > 2) {
      const timeoutId = setTimeout(() => {
        checkSlugAvailability(customSlug)
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [customSlug])

  const handleSlugChange = (value: string) => {
    const cleanSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, "")
    setCustomSlug(cleanSlug)
    updateFormData({ slug: cleanSlug })
    setSlugStatus("idle")
  }

  const isValid = formData.slug && formData.timezone && slugStatus === "available"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Choose your store URL and finalize setup.</h2>
          <p className="text-sm text-gray-600 mt-2">
            This will be your store's unique web address. Choose something memorable and easy to share.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="storeUrl" className="text-base font-medium text-gray-900 mb-2 block">
            What's your store URL?
          </Label>
          <p className="text-sm text-gray-600 mb-4">
            Your store will be available at:{" "}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">{baseUrl}/{customSlug}</span>
          </p>
          <div className="relative">
            <div className="flex">
              <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md text-gray-500 text-sm">
                {baseUrl}/
              </div>
              <Input
                id="storeUrl"
                placeholder="store-name"
                value={customSlug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="rounded-l-none"
              />
            </div>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {slugStatus === "checking" && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}
              {slugStatus === "available" && <Check className="w-5 h-5 text-blue-600" />}
              {slugStatus === "taken" && <X className="w-5 h-5 text-red-600" />}
            </div>
          </div>
          {slugStatus === "taken" && (
            <p className="text-sm text-red-600 mt-2">This URL is already taken. Please try a different one.</p>
          )}
          {slugStatus === "available" && <p className="text-sm text-blue-600 mt-2">Great! This URL is available.</p>}
        </div>

        <div>
          <Label className="text-base font-medium text-gray-900 mb-2 block">Select your timezone</Label>
          <Select value={formData.timezone} onValueChange={(timezone) => updateFormData({ timezone })}>
            <SelectTrigger>
              <SelectValue placeholder="Choose timezone" />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((timezone) => (
                <SelectItem key={timezone} value={timezone}>
                  {timezone.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Store Summary</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-medium">Name:</span> {formData.name}
            </p>
            <p>
              <span className="font-medium">Location:</span> {formData.city}, {formData.state}
            </p>
            <p>
              <span className="font-medium">Currency:</span> {formData.currency}
            </p>
            <p>
              <span className="font-medium">URL:</span>{baseUrl}/{formData.slug}
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={!isValid || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating Store...
          </>
        ) : (
          "Finish & Choose Plan"
        )}
      </Button>
    </div>
  )
}
