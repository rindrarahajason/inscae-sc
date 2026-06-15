'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useCallback } from 'react'
import {
  Bold, Italic, List, ListOrdered, Heading2, Heading3,
  Link as LinkIcon, Image as ImageIcon, Undo, Redo, Quote
} from 'lucide-react'

type Props = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function RichEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-violet-600 underline' } }),
      Placeholder.configure({ placeholder: placeholder ?? 'Écrivez votre contenu ici...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-stone max-w-none min-h-[200px] p-4 focus:outline-none text-sm',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  const addLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt('URL du lien :')
    if (!url) return
    editor.chain().focus().setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt('URL de l\'image :')
    if (!url) return
    editor.chain().focus().setImage({ src: url }).run()
  }, [editor])

  if (!editor) return null

  const btn = (active: boolean) =>
    `p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors ${active ? 'bg-violet-100 text-violet-700' : ''}`

  return (
    <div className="border-2 border-stone-200 rounded-xl overflow-hidden focus-within:border-violet-500 transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 p-2 border-b border-stone-100 bg-stone-50">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))} title="Gras">
          <Bold size={15} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))} title="Italique">
          <Italic size={15} />
        </button>
        <div className="w-px bg-stone-200 mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))} title="Titre H2">
          <Heading2 size={15} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive('heading', { level: 3 }))} title="Titre H3">
          <Heading3 size={15} />
        </button>
        <div className="w-px bg-stone-200 mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))} title="Liste">
          <List size={15} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))} title="Liste numérotée">
          <ListOrdered size={15} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive('blockquote'))} title="Citation">
          <Quote size={15} />
        </button>
        <div className="w-px bg-stone-200 mx-1" />
        <button type="button" onClick={addLink} className={btn(editor.isActive('link'))} title="Ajouter un lien">
          <LinkIcon size={15} />
        </button>
        <button type="button" onClick={addImage} className={btn(false)} title="Ajouter une image (URL)">
          <ImageIcon size={15} />
        </button>
        <div className="w-px bg-stone-200 mx-1" />
        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={btn(false)} title="Annuler">
          <Undo size={15} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={btn(false)} title="Rétablir">
          <Redo size={15} />
        </button>
      </div>
      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
