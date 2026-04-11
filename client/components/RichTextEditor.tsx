"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useCallback } from "react";
import EditorToolbar from "@/components/rich-text-editor/EditorToolbar";
import type { RichTextEditorProps } from "@/components/rich-text-editor/types";

/**
 * RichTextEditor Component
 *
 * A fully-featured WYSIWYG editor built on top of Tiptap.
 * Provides extensive formatting capabilities including headings, lists, highlights, colors, and links.
 * Used primarily in the admin dashboard for creating rich blog posts.
 *
 * @param {RichTextEditorProps} props - Component properties for two-way HTML binding.
 */
export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      Color,
      TextStyle,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[#08B74F] underline cursor-pointer" },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Start writing your blog post...",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "max-w-none focus:outline-none min-h-[400px] px-4 py-3 text-zinc-300 text-sm",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes (e.g. form reset/edit)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-[#1b3123] rounded-lg overflow-hidden bg-[#0d1a12] focus-within:border-[#08B74F]/40 focus-within:ring-1 focus-within:ring-[#08B74F]/30 transition-all">
      <EditorToolbar editor={editor} onSetLink={setLink} />

      {/* Editor content */}
      <EditorContent editor={editor} />
    </div>
  );
}
