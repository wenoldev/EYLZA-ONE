import { useEffect, useState } from "react"
import { useEditorStore } from "@/store/useEditorStore"
import api from "@/lib/api"
import { Check, Loader2, Plus, FileEdit, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { setCookie } from "@/utils/cookies"

export function DraftSettings() {
    const { storeData, activeThemeId, setActiveThemeId } = useEditorStore()
    const [themes, setThemes] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [creating, setCreating] = useState(false)
    const [publishing, setPublishing] = useState<string | null>(null)

    useEffect(() => {
        const fetchThemes = async () => {
            if (!storeData?.id) return
            setLoading(true)
            try {
                const res = await api.get(`/stores/${storeData.id}/themes`)
                setThemes(res.data.data.themes || [])
            } catch (err) {
                console.error("Failed to fetch themes:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchThemes()
    }, [storeData?.id])

    const handleThemeSelect = (id: string) => {
        setActiveThemeId(id)
        setCookie('theme', id)
        // Reload to fetch the full content of the selected version
        window.location.reload()
    }

    const handleCreateDraft = async () => {
        if (!storeData?.id) return
        setCreating(true)
        try {
            const name = prompt("Enter draft name:", `Draft ${themes.length + 1}`)
            if (!name) return

            const res = await api.post(`/stores/${storeData.id}/themes`, { name })
            const newTheme = res.data.data.theme
            setThemes([newTheme, ...themes])
            handleThemeSelect(newTheme.id)
        } catch (err) {
            console.error("Failed to create draft:", err)
            alert("Failed to create draft")
        } finally {
            setCreating(false)
        }
    }

    const handlePublish = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!storeData?.id || !confirm("Are you sure you want to publish this theme? It will replace your current live site.")) return

        setPublishing(id)
        try {
            await api.post(`/stores/${storeData.id}/themes/${id}/publish`, {})
            // Update local list
            setThemes(themes.map(t => ({
                ...t,
                status: t.id === id ? 'published' : 'draft'
            })))
            alert("Published successfully!")
        } catch (err) {
            console.error("Failed to publish:", err)
            alert("Failed to publish themes")
        } finally {
            setPublishing(null)
        }
    }

    if (loading) return <div className="flex justify-center p-4"><Loader2 className="animate-spin h-5 w-5" /></div>

    return (
        <div className="space-y-3">
            <button
                onClick={handleCreateDraft}
                disabled={creating}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-primary/30 p-2 text-[11px] font-medium text-primary hover:bg-primary/5 transition-colors"
            >
                {creating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                Create New Draft
            </button>

            <div className="space-y-2">
                {themes.map((theme) => (
                    <div
                        key={theme.id}
                        onClick={() => handleThemeSelect(theme.id)}
                        className={cn(
                            "group relative flex flex-col cursor-pointer rounded-md border p-3 transition-all text-[11px]",
                            activeThemeId === theme.id
                                ? "bg-primary/5 border-primary text-primary shadow-sm"
                                : "border-border hover:bg-muted/30"
                        )}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <FileEdit className={cn("h-3.5 w-3.5 shrink-0", activeThemeId === theme.id ? "text-primary" : "text-muted-foreground")} />
                                <span className="font-semibold truncate">{theme.name}</span>
                            </div>
                            {theme.status === 'published' && (
                                <span className="px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[8px] font-bold uppercase tracking-wider">
                                    Live
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                            <span className="text-[9px] text-muted-foreground">
                                Updated {new Date(theme.updated_at).toLocaleDateString()}
                            </span>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {theme.status !== 'published' && (
                                    <button
                                        onClick={(e) => handlePublish(theme.id, e)}
                                        disabled={publishing === theme.id}
                                        className="flex items-center gap-1 rounded bg-primary px-2 py-1 text-[10px] text-primary-foreground hover:bg-primary/90"
                                    >
                                        {publishing === theme.id ? <Loader2 className="h-2 w-2 animate-spin" /> : <Send className="h-2 w-2" />}
                                        Publish
                                    </button>
                                )}
                                {activeThemeId === theme.id && <Check className="h-3 w-3 text-primary" />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
