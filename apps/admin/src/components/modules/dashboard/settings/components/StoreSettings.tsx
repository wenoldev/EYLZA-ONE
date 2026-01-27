"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Store, Loader2 } from "lucide-react"
import { useStoreStore } from "@/stores/storeStore"
import { toast } from "sonner"

export function StoreSettings() {
    const { stores, loading: storeLoading, error: storeError, fetchStores, updateStore } = useStoreStore()
    const currentStore = stores?.[0]

    const [storeName, setStoreName] = useState("")
    const [storeDescription, setStoreDescription] = useState("")
    const [storeContactEmail, setStoreContactEmail] = useState("")
    const [storePhone, setStorePhone] = useState("")

    useEffect(() => {
        if (!stores || stores.length === 0) {
            fetchStores({ page: 1, limit: 1 })
        }
    }, [fetchStores, stores])

    useEffect(() => {
        if (currentStore) {
            setStoreName(currentStore.name || "")
            setStoreDescription(currentStore.description || "")
            setStoreContactEmail(currentStore.contact_email || "")
            setStorePhone(currentStore.phone || "")
        }
    }, [currentStore])

    const handleSaveStore = async () => {
        if (!currentStore) {
            toast.error("No store found")
            return
        }

        const result = await updateStore(currentStore.id, {
            name: storeName,
            description: storeDescription,
            contact_email: storeContactEmail,
            phone: storePhone,
        })

        if (result) {
            toast.success("Store updated successfully")
        } else {
            toast.error(storeError || "Failed to update store")
        }
    }

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-900">Store</h3>
                <p className="text-sm text-gray-500">Manage your store information</p>
            </div>

            {!currentStore && !storeLoading ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                    <Store className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600">No store found. Please create a store first.</p>
                </div>
            ) : (
                <>
                    <div>
                        <Label htmlFor="storeName">Store Name</Label>
                        <Input
                            id="storeName"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            placeholder="My Store"
                        />
                    </div>

                    <div>
                        <Label htmlFor="storeDescription">Description</Label>
                        <Textarea
                            id="storeDescription"
                            value={storeDescription}
                            onChange={(e) => setStoreDescription(e.target.value)}
                            placeholder="Store description..."
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="storeEmail">Contact Email</Label>
                            <Input
                                id="storeEmail"
                                type="email"
                                value={storeContactEmail}
                                onChange={(e) => setStoreContactEmail(e.target.value)}
                                placeholder="store@example.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="storePhone">Phone</Label>
                            <Input
                                id="storePhone"
                                value={storePhone}
                                onChange={(e) => setStorePhone(e.target.value)}
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Store Status</Label>
                        <p className="mt-1 text-gray-700 capitalize">{currentStore?.status || "N/A"}</p>
                    </div>

                    <div>
                        <Label>Created</Label>
                        <p className="mt-1 text-gray-700">
                            {currentStore?.created_at
                                ? new Date(currentStore.created_at).toLocaleDateString()
                                : "N/A"}
                        </p>
                    </div>

                    <Button onClick={handleSaveStore} disabled={storeLoading}>
                        {storeLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Store
                    </Button>
                </>
            )}
        </div>
    )
}
