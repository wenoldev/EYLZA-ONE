import { useEffect, useState } from "react"
import { useEditorStore } from "@/store/useEditorStore"
import api from "@/lib/api"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Theme {
    id: string
    name: string
    preview_url?: string
    config?: {
        version?: string
        global?: any
    }
}

export function ThemeSettings() {
    const storeData = useEditorStore(state => state.storeData)
    const activeThemeId = useEditorStore(state => state.activeThemeId)
    const globalConfig = useEditorStore(state => state.globalConfig)
    const setGlobalConfig = useEditorStore(state => state.setGlobalConfig)
    const [themes, setThemes] = useState<Theme[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchThemes = async () => {
            setLoading(true)
            try {
                const res = await api.get("/themes")
                setThemes(res.data.data.themes || [])
            } catch (err) {
                console.error("Failed to fetch themes:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchThemes()
    }, [])

    const handleThemeSelect = async (theme: Theme) => {
        if (!storeData?.id) return

        try {
            // Install the new theme (creates a copy in vendor schema)
            const response = await api.post(`/stores/${storeData.id}/themes`, {
                theme_id: theme.id,
                name: theme.name, // Use the system theme name as default
                global_config: theme.config
            })

            const newTheme = response.data.data.theme

            // Set the new theme as published/active
            await api.post(`/stores/${storeData.id}/themes/current`, {
                themeId: newTheme.id
            })

            // Update local state
            setGlobalConfig({
                ...globalConfig,
                themeId: newTheme.id,
                global: newTheme.global_config || {}
            })
            // reload to reflect changes or use a cleaner state update mechanism
            alert(`Theme "${theme.name}" installed and activated!`)
            window.location.reload()

        } catch (err) {
            console.error("Failed to change theme:", err)
            alert("Failed to change theme")
        }
    }

    if (loading) return <div className="flex justify-center p-4"><Loader2 className="animate-spin h-5 w-5" /></div>

    return (
        <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
                <div
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme)}
                    className={cn(
                        "group relative cursor-pointer overflow-hidden rounded-lg border-2 bg-muted/30 transition-all hover:border-primary/50",
                        activeThemeId === theme.id ? "border-primary" : "border-transparent"
                    )}
                >
                    <div className="aspect-[4/3] w-full bg-muted">
                        {theme.preview_url ? (
                            <img src={theme.preview_url} alt={theme.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">No Preview</div>
                        )}
                    </div>
                    <div className="p-2">
                        <p className="text-[11px] font-medium truncate">{theme.name}</p>
                    </div>
                    {activeThemeId === theme.id && (
                        <div className="absolute right-2 top-2 rounded-full bg-primary p-1 text-primary-foreground shadow-sm">
                            <Check className="h-2.5 w-2.5" />
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
