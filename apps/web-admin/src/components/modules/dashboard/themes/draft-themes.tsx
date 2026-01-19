import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Copy, Trash2, Globe } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface StoreTheme {
  id: string
  name: string
  status: string
  updated_at: string
  theme_id?: string
  global_config?: Record<string, unknown>
}

interface DraftThemesProps {
  themes: StoreTheme[]
  onSelectTheme: (theme: StoreTheme) => void
  onPublish: (themeId: string) => void
  onDuplicate: (themeId: string) => void
  onRename: (themeId: string, newName: string) => void
  onDelete: (themeId: string) => void
}

export default function DraftThemes({
  themes,
  onSelectTheme,
  onPublish,
  onDuplicate,
  onRename,
  onDelete
}: DraftThemesProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null)
  const [newName, setNewName] = useState("")

  const handleRename = () => {
    if (selectedThemeId && newName.trim()) {
      onRename(selectedThemeId, newName.trim())
    }
    setIsRenameOpen(false)
  }

  // Filter out the published theme (which is shown in CurrentTheme)
  const drafts = themes.filter(t => t.status === 'draft')

  return (
    <div className="border-b border-border bg-background p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Theme library</h2>
      <p className="text-sm text-muted-foreground mb-6">
        These themes are only visible to you. Publishing a theme from your library will switch it to your current theme.
      </p>

      <div className="space-y-4">
        {drafts.length === 0 && (
          <p className="text-center py-8 text-muted-foreground">No draft themes yet.</p>
        )}
        {drafts.map((theme) => (
          <div
            key={theme.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-24 h-20 rounded-lg bg-muted border border-border overflow-hidden flex-shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-500"></div>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-foreground text-sm">{theme.name}</h3>
                <p className="text-xs text-muted-foreground">Updated: {new Date(theme.updated_at).toLocaleDateString()}</p>
                <p className="text-xs text-muted-foreground">Status: {theme.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    setSelectedThemeId(theme.id)
                    setNewName(theme.name)
                    setIsRenameOpen(true)
                  }}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(theme.id)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onPublish(theme.id)}>
                    <Globe className="mr-2 h-4 w-4" />
                    Publish
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(theme.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm" onClick={() => onPublish(theme.id)}>
                Publish
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectTheme(theme)}
              >
                Edit theme
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Theme</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Theme Name</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter theme name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameOpen(false)}>Cancel</Button>
            <Button onClick={handleRename}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
