import { useState, useEffect, useCallback } from 'react'
import CurrentTheme from './current-theme'
import DraftThemes from './draft-themes'
import ThemePreview from './theme-preview'
import { useAuthStore } from '@/stores/authStore';
import { useStoreStore } from '@/stores/storeStore';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface StoreTheme {
    id: string
    name: string
    status: string
    updated_at: string
    theme_id?: string
    global_config?: Record<string, unknown>
}

const EditTheme = () => {
    const { user, session } = useAuthStore();
    const { stores } = useStoreStore();
    const [selectedTheme, setSelectedTheme] = useState<StoreTheme | null>(null)
    const [themes, setThemes] = useState<StoreTheme[]>([])
    const [loading, setLoading] = useState(true)

    const fetchThemes = useCallback(async () => {
        if (!stores?.[0]?.id) return
        try {
            setLoading(true)
            const response = await api.get(`/api/v1/stores/${stores[0].id}/themes`)
            if (response.data?.data?.themes) {
                const fetchedThemes: StoreTheme[] = response.data.data.themes
                setThemes(fetchedThemes)

                const published = fetchedThemes.find((t) => t.status === 'published')
                if (published) {
                    setSelectedTheme(published)
                } else if (fetchedThemes.length > 0) {
                    setSelectedTheme(fetchedThemes[0])
                }
            }
        } catch (error) {
            console.error("Failed to fetch themes", error)
            toast.error("Failed to load themes")
        } finally {
            setLoading(false)
        }
    }, [stores])

    useEffect(() => {
        fetchThemes()
    }, [fetchThemes])

    const navigateToEditor = (theme?: StoreTheme) => {
        const themeToEdit = theme || selectedTheme;
        if (!themeToEdit) return;

        const url = new URL(import.meta.env.VITE_EDITOR_URL);
        url.searchParams.set("uid", user?.id ?? "");
        url.searchParams.set("draftId", themeToEdit.id?.toString() ?? "");
        url.searchParams.set("access_token", session?.access_token ?? "");
        url.searchParams.set("refresh_token", session?.refresh_token ?? "");
        url.searchParams.set("expires_at", session?.expires_at?.toString() ?? "");
        window.open(url.toString(), "_blank");
    };

    const handleSelectAndEdit = (theme: StoreTheme) => {
        setSelectedTheme(theme);
        navigateToEditor(theme);
    };

    const handlePublish = async (themeId: string) => {
        if (!stores?.[0]?.id) return
        try {
            await api.post(`/api/v1/stores/${stores[0].id}/themes/${themeId}/publish`)
            toast.success("Theme published successfully")
            await fetchThemes()
        } catch (error) {
            console.error("Failed to publish theme", error)
            toast.error("Failed to publish theme")
        }
    }

    const handleDuplicate = async (themeId: string) => {
        if (!stores?.[0]?.id) return
        try {
            await api.post(`/api/v1/stores/${stores[0].id}/themes/${themeId}/duplicate`)
            toast.success("Theme duplicated successfully")
            await fetchThemes()
        } catch (error) {
            console.error("Failed to duplicate theme", error)
            toast.error("Failed to duplicate theme")
        }
    }

    const handleRename = async (themeId: string, newName: string) => {
        if (!stores?.[0]?.id) return
        try {
            await api.patch(`/api/v1/stores/${stores[0].id}/themes/${themeId}`, { name: newName })
            toast.success("Theme renamed successfully")
            await fetchThemes()
        } catch (error) {
            console.error("Failed to rename theme", error)
            toast.error("Failed to rename theme")
        }
    }

    const handleDelete = async (themeId: string) => {
        if (!stores?.[0]?.id) return
        if (!confirm("Are you sure you want to delete this theme? This action cannot be undone.")) return
        try {
            await api.delete(`/api/v1/stores/${stores[0].id}/themes/${themeId}`)
            toast.success("Theme deleted successfully")
            await fetchThemes()
        } catch (error) {
            console.error("Failed to delete theme", error)
            toast.error("Failed to delete theme")
        }
    }

    if (loading && themes.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <ThemePreview theme={selectedTheme} />
            <CurrentTheme
                theme={selectedTheme}
                openEditor={() => navigateToEditor()}
                onRename={(name) => selectedTheme && handleRename(selectedTheme.id, name)}
                onDuplicate={() => selectedTheme && handleDuplicate(selectedTheme.id)}
            />
            <DraftThemes
                themes={themes}
                onSelectTheme={handleSelectAndEdit}
                onPublish={handlePublish}
                onDuplicate={handleDuplicate}
                onRename={handleRename}
                onDelete={handleDelete}
            />
        </div>
    )
}

export default EditTheme