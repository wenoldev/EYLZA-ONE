"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Save } from "lucide-react"
import api from "@/lib/api"
import { useStoreStore } from "@/stores/storeStore"
import { toast } from "sonner"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

interface PolicyEditorProps {
    policyName: string
    policyLabel: string
}

interface PolicyData {
    id: string
    name: string
    content: string
    label: string
    updated_at: string
}

export function PolicyEditor({ policyName, policyLabel }: PolicyEditorProps) {
    const { stores, fetchStores } = useStoreStore()
    const currentStore = stores?.[0]

    const [content, setContent] = useState("<p>Loading policy content...</p>")
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [lastUpdated, setLastUpdated] = useState<string | null>(null)

    useEffect(() => {
        if (!stores || stores.length === 0) {
            fetchStores({ page: 1, limit: 1 })
        }
    }, [fetchStores, stores])

    useEffect(() => {
        const fetchPolicy = async () => {
            if (!currentStore) return

            setLoading(true)
            try {
                const response = await api.get(`/api/v1/stores/${currentStore.id}/policies`)
                if (response.data.error) {
                    toast.error(response.data.error.message)
                } else {
                    const policies: PolicyData[] = response.data.data
                    const currentPolicy = policies.find(p => p.name === policyName)
                    if (currentPolicy) {
                        setContent(currentPolicy.content)
                        setLastUpdated(currentPolicy.updated_at)
                    } else {
                        // Default content if not found
                        setContent("<p>Write your " + policyLabel + " here...</p>")
                    }
                }
            } catch (error: unknown) {
                const err = error as any;
                toast.error(err.response?.data?.error?.message || "Failed to fetch policy")
            } finally {
                setLoading(false)
            }
        }

        fetchPolicy()
    }, [currentStore, policyName, policyLabel])

    const handleSave = async () => {
        if (!currentStore) {
            toast.error("No store found")
            return
        }

        setSaving(true)
        try {
            const response = await api.post(`/api/v1/stores/${currentStore.id}/policies`, {
                name: policyName,
                label: policyLabel,
                content: content
            })

            if (response.data.error) {
                toast.error(response.data.error.message)
            } else {
                toast.success(`${policyLabel} updated successfully`)
                setLastUpdated(response.data.data.updated_at)
            }
        } catch (error: unknown) {
            const err = error as any;
            toast.error(err.response?.data?.error?.message || "Failed to save policy")
        } finally {
            setSaving(false)
        }
    }

    if (!currentStore && !loading) {
        return (
            <div className="flex items-center justify-center p-12 text-gray-500 border-2 border-dashed rounded-lg">
                Please select or create a store first to manage policies.
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">{policyLabel}</h3>
                    {lastUpdated && (
                        <p className="text-sm text-gray-500">
                            Last updated: {new Date(lastUpdated).toLocaleDateString()} at{" "}
                            {new Date(lastUpdated).toLocaleTimeString()}
                        </p>
                    )}
                </div>
                <Button onClick={handleSave} disabled={saving || loading}>
                    {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    Save {policyLabel}
                </Button>
            </div>

            {loading ? (
                <div className="flex h-[400px] items-center justify-center border rounded-md bg-white">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            ) : (
                <div className="bg-white rounded-md shadow-sm">
                    <RichTextEditor value={content} onChange={setContent} />
                </div>
            )}
        </div>
    )
}
