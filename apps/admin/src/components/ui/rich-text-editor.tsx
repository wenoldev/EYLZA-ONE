"use client"

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Heading1,
    Heading2,
    Underline as UnderlineIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
} from 'lucide-react'
import { Button } from './button'

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null
    }

    const addLink = () => {
        const url = window.prompt('URL')
        if (url) {
            editor.chain().focus().setLink({ href: url }).run()
        }
    }

    return (
        <div className="flex flex-wrap gap-1 border-b p-2 bg-gray-50 dark:bg-zinc-950 dark:border-zinc-800 sticky top-0 z-10">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'bg-gray-200 dark:bg-zinc-800' : ''}
                type="button"
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'bg-gray-200 dark:bg-zinc-800' : ''}
                type="button"
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive('underline') ? 'bg-gray-200 dark:bg-zinc-800' : ''}
                type="button"
            >
                <UnderlineIcon className="h-4 w-4" />
            </Button>
            <div className="w-[1px] h-6 bg-gray-300 dark:bg-zinc-700 mx-1 self-center" />
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-zinc-800' : ''}
                type="button"
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-zinc-800' : ''}
                type="button"
            >
                <Heading2 className="h-4 w-4" />
            </Button>
            <div className="w-[1px] h-6 bg-gray-300 dark:bg-zinc-700 mx-1 self-center" />
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 dark:bg-zinc-800' : ''}
                type="button"
            >
                <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 dark:bg-zinc-800' : ''}
                type="button"
            >
                <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 dark:bg-zinc-800' : ''}
                type="button"
            >
                <AlignRight className="h-4 w-4" />
            </Button>
            <div className="w-[1px] h-6 bg-gray-300 dark:bg-zinc-700 mx-1 self-center" />
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-zinc-800' : ''}
                type="button"
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-zinc-800' : ''}
                type="button"
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-zinc-800' : ''}
                type="button"
            >
                <Quote className="h-4 w-4" />
            </Button>
            <div className="w-[1px] h-6 bg-gray-300 dark:bg-zinc-700 mx-1 self-center" />
            <Button
                variant="ghost"
                size="sm"
                onClick={addLink}
                className={editor.isActive('link') ? 'bg-gray-200 dark:bg-zinc-800' : ''}
                type="button"
            >
                <LinkIcon className="h-4 w-4" />
            </Button>
            <div className="w-[1px] h-6 bg-gray-300 dark:bg-zinc-700 mx-1 self-center" />
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                type="button"
            >
                <Undo className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                type="button"
            >
                <Redo className="h-4 w-4" />
            </Button>
        </div>
    )
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[300px]',
            },
        },
    })

    return (
        <div className="border dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}
