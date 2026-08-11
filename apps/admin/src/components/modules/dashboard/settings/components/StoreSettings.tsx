import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Store, Loader2, Globe, Mail, Phone, MapPin, Clock, Tag, Check, CheckCircle2 } from "lucide-react"
import { useStoreStore } from "@/stores/storeStore"
import { toast } from "sonner"
import { UploadDialog } from "@/components/common/UploadImage"
import { X, AlertCircle } from "lucide-react"
import api from "@/lib/api"

const countries = [
  { value: "US", label: "United States" },
  { value: "IN", label: "India" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
]

const currencies = [
  { value: "USD", label: "US Dollar" },
  { value: "INR", label: "Indian Rupee" },
  { value: "GBP", label: "British Pound" },
  { value: "CAD", label: "Canadian Dollar" },
  { value: "AUD", label: "Australian Dollar" },
]

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

export function StoreSettings() {
    const { stores, isLoading: storeLoading, isUpdating, error: storeError, updateStore, fetchStores } = useStoreStore()
    const currentStore = stores?.[0]

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        contact_email: "",
        phone: "",
        country: "",
        currency: "",
        city: "",
        timezone: "",
        logo_url: "",
    })

    const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken" | "error" | "invalid">("idle")
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    useEffect(() => {
        if (!stores || stores.length === 0) {
            fetchStores({ page: 1, limit: 1 })
        }
    }, [fetchStores, stores])

    useEffect(() => {
        if (currentStore) {
            setFormData({
                name: currentStore.name || "",
                slug: currentStore.slug || "",
                description: currentStore.description || "",
                contact_email: currentStore.contact_email || "",
                phone: currentStore.phone || "",
                country: currentStore.country || "IN",
                currency: currentStore.currency || "INR",
                city: currentStore.city || "",
                timezone: currentStore.timezone || "Asia/Kolkata",
                logo_url: currentStore.logo_url || "",
            })
        }
    }, [currentStore])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        
        if (id === 'slug') {
            const cleanSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, "")
            setFormData(prev => ({ ...prev, [id]: cleanSlug }))
            if (cleanSlug !== currentStore?.slug) {
                setSlugStatus("idle")
            } else {
                setSlugStatus("available")
            }
            return
        }
        
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const checkSlugAvailability = async (slug: string) => {
        if (!slug || !currentStore) return
        if (slug === currentStore.slug) {
            setSlugStatus("available")
            return
        }

        setSlugStatus("checking")

        try {
            const response = await api.get(`/api/v1/stores/check-slug`, {
                params: { slug, excludeId: currentStore.id }
            })

            if (response.data?.data?.exists) {
                setSlugStatus("taken")
            } else if (response.data?.data?.valid === false) {
                setSlugStatus("invalid")
            } else {
                setSlugStatus("available")
            }
        } catch (error: any) {
            setSlugStatus("error")
        }
    }

    useEffect(() => {
        if (formData.slug && formData.slug !== currentStore?.slug && formData.slug.length > 2) {
            const timeoutId = setTimeout(() => {
                checkSlugAvailability(formData.slug)
            }, 500)
            return () => clearTimeout(timeoutId)
        }
    }, [formData.slug, currentStore?.id])

    const handleSelectChange = (id: string, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSaveStore = async () => {
        if (!currentStore) {
            toast.error("No store found")
            return
        }

        const result = await updateStore(currentStore.id, formData)

        if (result) {
            toast.success("Store updated successfully")
        } else {
            toast.error(storeError || "Failed to update store")
        }
    }

    if (!currentStore && !storeLoading) {
        return (
            <div className="rounded-lg border border-dashed p-8 text-center bg-white dark:bg-zinc-950">
                <Store className="mx-auto h-12 w-12 text-gray-400 dark:text-zinc-500" />
                <p className="mt-2 text-gray-600 dark:text-zinc-400">No store found. Please create a store first.</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl space-y-8 pb-10">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Store Settings</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Manage your store's identity and regional settings</p>
            </div>

            {/* Logo Upload Section */}
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Store className="w-5 h-5 text-gray-700 dark:text-zinc-300" />
                    <h4 className="font-semibold text-gray-900 dark:text-zinc-100">Store Logo</h4>
                </div>
                
                <div className="flex items-start gap-6">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-black transition-colors group-hover:border-blue-400">
                            {formData.logo_url ? (
                                <img 
                                    src={formData.logo_url} 
                                    alt="Logo Preview" 
                                    className="w-full h-full object-contain p-2"
                                />
                            ) : (
                                <div className="text-center p-4">
                                    <Store className="w-8 h-8 text-gray-300 dark:text-zinc-600 mx-auto mb-2" />
                                    <p className="text-[10px] text-gray-400 dark:text-zinc-500">No logo uploaded</p>
                                </div>
                            )}
                        </div>
                        {formData.logo_url && (
                            <button 
                                onClick={() => setFormData(prev => ({ ...prev, logo_url: "" }))}
                                className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors shadow-sm"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                        <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                            Upload your store logo. This logo will be used in your storefront header, emails, and invoices.
                            Recommended size: 200x200px. Max size: 2MB.
                        </p>
                        <UploadDialog 
                            multiple={false}
                            onImagesSelected={(images) => {
                                if (images.length > 0) {
                                    const img = images[0]
                                    handleSelectChange("logo_url", typeof img.image_url === 'string' ? img.image_url : img.image_url.fileContent)
                                }
                            }}
                            initialValues={formData.logo_url ? [{ image_url: formData.logo_url, isPrimary: true }] : []}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Information */}
                <div className="space-y-6 bg-white dark:bg-zinc-950 p-6 rounded-xl border">
                    <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-5 h-5 text-gray-700 dark:text-zinc-300" />
                        <h4 className="font-semibold text-gray-900 dark:text-zinc-100">Basic Information</h4>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Store Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="My Amazing Store"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Store URL Slug</Label>
                            <div className="relative">
                                <div className="flex">
                                    <div className="flex items-center px-3 bg-gray-50 dark:bg-black border border-r-0 border-gray-300 dark:border-zinc-700 rounded-l-md text-gray-500 dark:text-zinc-400 text-sm whitespace-nowrap overflow-hidden max-w-[200px]">
                                        {baseUrl.replace(/^https?:\/\//, '')}/
                                    </div>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        placeholder="my-store"
                                        className={`rounded-l-none pr-10 ${
                                            slugStatus === 'taken' ? 'border-red-500 focus-visible:ring-red-500' : 
                                            slugStatus === 'available' && formData.slug !== currentStore?.slug ? 'border-green-500 focus-visible:ring-green-500' : ''
                                        }`}
                                    />
                                </div>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                                    {slugStatus === "checking" && <Loader2 className="w-4 h-4 animate-spin text-green-500" />}
                                    {slugStatus === "available" && formData.slug !== currentStore?.slug && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                    {slugStatus === "taken" && <AlertCircle className="w-4 h-4 text-red-500" />}
                                </div>
                            </div>
                            
                            {slugStatus === "taken" && (
                                <p className="text-[10px] text-red-600 animate-in fade-in slide-in-from-top-1">
                                    This URL is already taken. Please try a different one.
                                </p>
                            )}
                            {slugStatus === "invalid" && (
                                <p className="text-[10px] text-red-600 animate-in fade-in slide-in-from-top-1">
                                    Invalid format. Use lowercase letters, numbers and hyphens only.
                                </p>
                            )}
                            {slugStatus === "available" && formData.slug !== currentStore?.slug && (
                                <p className="text-[10px] text-green-600 animate-in fade-in slide-in-from-top-1">
                                    Great! This URL is available.
                                </p>
                            )}
                            <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-1">
                                Changing this will change your store's web address: <span className="font-medium">{baseUrl}/{formData.slug}</span>
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Store Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your store to your customers..."
                                rows={4}
                            />
                        </div>
                    </div>
                </div>

                {/* Regional & Contact */}
                <div className="space-y-6 bg-white dark:bg-zinc-950 p-6 rounded-xl border">
                    <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-5 h-5 text-gray-700 dark:text-zinc-300" />
                        <h4 className="font-semibold text-gray-900 dark:text-zinc-100">Regional & Contact</h4>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Country</Label>
                                <Select value={formData.country} onValueChange={(val) => handleSelectChange("country", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((c) => (
                                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Currency</Label>
                                <Select value={formData.currency} onValueChange={(val) => handleSelectChange("currency", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map((c) => (
                                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="New York"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Timezone</Label>
                                <Select value={formData.timezone} onValueChange={(val) => handleSelectChange("timezone", val)}>
                                    <SelectTrigger>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
                                            <SelectValue placeholder="Select Timezone" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timezones.map((tz) => (
                                            <SelectItem key={tz} value={tz}>{tz.replace("_", " ")}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contact_email">Contact Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
                                <Input
                                    id="contact_email"
                                    type="email"
                                    value={formData.contact_email}
                                    onChange={handleInputChange}
                                    placeholder="contact@store.com"
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+1 234 567 890"
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 border-t pt-6">
                <Button variant="outline" onClick={() => fetchStores({ page: 1, limit: 1 })} disabled={isUpdating}>
                    Cancel
                </Button>
                <Button 
                    onClick={handleSaveStore} 
                    disabled={isUpdating || slugStatus === 'checking' || slugStatus === 'taken' || slugStatus === 'invalid'} 
                    className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black shadow-sm transition-all"
                >
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>

            <div className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-zinc-800 p-4 rounded-lg flex items-start gap-3">
                <Globe className="w-5 h-5 text-gray-700 dark:text-zinc-300 mt-0.5" />
                <div className="text-sm">
                    <p className="font-semibold text-gray-900 dark:text-zinc-100">Store Status: <span className="capitalize">{currentStore?.status || "active"}</span></p>
                    <p className="text-gray-600 dark:text-zinc-400">Started on {currentStore?.created_at ? new Date(currentStore.created_at).toLocaleDateString() : "N/A"}</p>
                </div>
            </div>
        </div>
    )
}
