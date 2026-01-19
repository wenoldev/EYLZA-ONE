import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Copy } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Theme {
  id: string
  name: string
  updated_at?: string
  status?: string
}

interface CurrentThemeProps {
  theme: Theme | null
  openEditor: () => void
  onRename: (name: string) => void
  onDuplicate: () => void
}

export default function CurrentTheme({ theme, openEditor, onRename, onDuplicate }: CurrentThemeProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const [newName, setNewName] = useState(theme?.name || "")

  if (!theme) return null;

  const handleRename = () => {
    if (newName.trim() && newName !== theme.name) {
      onRename(newName.trim())
    }
    setIsRenameOpen(false)
  }

  return (
    <div className="border-b border-border bg-background p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-24 h-20 rounded-lg bg-muted border border-border overflow-hidden flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-slate-400 to-slate-600"></div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-foreground">{theme.name}</h3>
              <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
                Current theme
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Last updated: {theme.updated_at ? new Date(theme.updated_at).toLocaleDateString() : 'N/A'}</p>
            <p className="text-sm text-muted-foreground">Status: {theme.status || 'Active'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal size={16} className="mr-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                setNewName(theme.name)
                setIsRenameOpen(true)
              }}>
                <Pencil className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="bg-slate-900 hover:bg-slate-800" size="sm" onClick={openEditor}>
            Edit theme
          </Button>
        </div>
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
