
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Link from "@tiptap/extension-link"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { FontFamily } from "@tiptap/extension-font-family"
import { 
  Bold, Italic, Underline as UnderlineIcon, List, 
  AlignLeft, AlignCenter, AlignRight, ListOrdered, 
  Link2, Unlink, Type, Palette, ChevronDown 
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useEffect, useCallback } from "react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
}

const FONTS = [
  { label: "Default", value: "default" },
  { label: "Inter", value: "Inter" },
  { label: "Poppins", value: "Poppins" },
  { label: "Roboto", value: "Roboto" },
  { label: "Serif", value: "serif" },
  { label: "Monospace", value: "monospace" },
]

const COLORS = [
  { name: "Default", color: "inherit" },
  { name: "Black", color: "#000000" },
  { name: "Gray", color: "#6b7280" },
  { name: "White", color: "#ffffff" },
  { name: "Red", color: "#ef4444" },
  { name: "Orange", color: "#f97316" },
  { name: "Yellow", color: "#eab308" },
  { name: "Green", color: "#22c55e" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Indigo", color: "#6366f1" },
  { name: "Purple", color: "#a855f7" },
  { name: "Pink", color: "#ec4899" },
]

export function RichTextEditor({ value, onChange, label, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
  })

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href
    const url = window.prompt("URL", previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    // update link
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])

  // Update editor content if value prop changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <div className="border border-border rounded-lg bg-background overflow-hidden focus-within:ring-1 focus-within:ring-primary transition-all">
        <div className="flex flex-wrap gap-0.5 p-1 border-b border-border bg-muted/30">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`h-8 w-8 p-0 ${editor.isActive("bold") ? "bg-muted text-primary" : ""}`}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`h-8 w-8 p-0 ${editor.isActive("italic") ? "bg-muted text-primary" : ""}`}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`h-8 w-8 p-0 ${editor.isActive("underline") ? "bg-muted text-primary" : ""}`}
            title="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>

          <div className="w-px h-4 bg-border mx-1 self-center" />

          <Button
            size="sm"
            variant="ghost"
            onClick={setLink}
            className={`h-8 w-8 p-0 ${editor.isActive("link") ? "bg-muted text-primary" : ""}`}
            title="Insert Link"
          >
            <Link2 className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive("link")}
            className="h-8 w-8 p-0"
            title="Remove Link"
          >
            <Unlink className="h-4 w-4" />
          </Button>

          <div className="w-px h-4 bg-border mx-1 self-center" />

          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`h-8 w-8 p-0 ${editor.isActive("bulletList") ? "bg-muted text-primary" : ""}`}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`h-8 w-8 p-0 ${editor.isActive("orderedList") ? "bg-muted text-primary" : ""}`}
            title="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <div className="w-px h-4 bg-border mx-1 self-center" />

          {/* Font Family */}
          <Select
            value={editor.getAttributes("textStyle").fontFamily || "default"}
            onValueChange={(value) => {
              if (value === "default") {
                editor.chain().focus().unsetFontFamily().run()
              } else {
                editor.chain().focus().setFontFamily(value).run()
              }
            }}
          >
            <SelectTrigger className="h-8 w-[110px] bg-transparent border-0 hover:bg-muted text-[11px] px-2 focus:ring-0">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              {FONTS.map((font) => (
                <SelectItem key={font.value} value={font.value} className="text-xs">
                  <span style={{ fontFamily: font.value === 'default' ? 'inherit' : font.value }}>{font.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="w-px h-4 bg-border mx-1 self-center" />

          {/* Color Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                title="Text Color"
              >
                <div className="flex flex-col items-center">
                  <Palette className="h-4 w-4" />
                  <div 
                    className="h-0.5 w-3 mt-0.5 rounded-full" 
                    style={{ backgroundColor: editor.getAttributes("textStyle").color || "currentColor" }} 
                  />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-2" side="bottom" align="start">
              <div className="grid grid-cols-4 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      if (color.color === "inherit") {
                        editor.chain().focus().unsetColor().run()
                      } else {
                        editor.chain().focus().setColor(color.color).run()
                      }
                    }}
                    className={cn(
                      "w-6 h-6 rounded-md border border-black/10 transition-transform hover:scale-110",
                      (editor.getAttributes("textStyle").color === color.color || (!editor.getAttributes("textStyle").color && color.color === "inherit")) && "ring-2 ring-primary ring-offset-1"
                    )}
                    style={{ backgroundColor: color.color === "inherit" ? "transparent" : color.color }}
                    title={color.name}
                  >
                    {color.color === "inherit" && <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">×</div>}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="w-px h-4 bg-border mx-1 self-center" />

          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: "left" }) ? "bg-muted text-primary" : ""}`}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: "center" }) ? "bg-muted text-primary" : ""}`}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: "right" }) ? "bg-muted text-primary" : ""}`}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="prose prose-sm max-w-none min-h-[150px] px-3 py-2">
          <EditorContent 
            editor={editor} 
            placeholder={placeholder} 
            key={editor?.isInitialized ? 'ready' : 'pending'}
          />
        </div>
      </div>
    </div>
  )
}
