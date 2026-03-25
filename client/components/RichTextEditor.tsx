'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useCallback } from 'react';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    Heading1, Heading2, Heading3,
    List, ListOrdered, Quote,
    AlignLeft, AlignCenter, AlignRight,
    Link as LinkIcon, Link2Off, Highlighter,
    Undo, Redo, RemoveFormatting, Minus,
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

const COLORS = [
    '#ffffff', '#a1a1aa', '#ef4444', '#f97316', '#eab308',
    '#22c55e', '#08B74F', '#3b82f6', '#a855f7', '#ec4899',
];

function ToolbarButton({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`w-8 h-8 flex items-center justify-center rounded-md transition-all duration-150 text-sm
                ${isActive
                    ? 'bg-[#08B74F]/20 text-[#08B74F] ring-1 ring-[#08B74F]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-700/60'
                }
                ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <div className="w-px h-6 bg-zinc-700/60 mx-1" />;
}

/**
 * RichTextEditor Component
 * 
 * A fully-featured WYSIWYG editor built on top of Tiptap.
 * Provides extensive formatting capabilities including headings, lists, highlights, colors, and links.
 * Used primarily in the admin dashboard for creating rich blog posts.
 *
 * @param {RichTextEditorProps} props - Component properties for two-way HTML binding.
 */
export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Highlight.configure({ multicolor: true }),
            Color,
            TextStyle,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-[#08B74F] underline cursor-pointer' },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Start writing your blog post...',
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'max-w-none focus:outline-none min-h-[400px] px-4 py-3 text-zinc-300 text-sm',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Sync external value changes (e.g. form reset/edit)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const setLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL:', previousUrl || 'https://');
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="border border-[#1b3123] rounded-lg overflow-hidden bg-[#0d1a12] focus-within:border-[#08B74F]/40 focus-within:ring-1 focus-within:ring-[#08B74F]/30 transition-all">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-[#0a1510] border-b border-[#1b3123]">
                {/* Undo / Redo */}
                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
                    <Undo className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
                    <Redo className="w-4 h-4" />
                </ToolbarButton>

                <Divider />

                {/* Text formatting */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
                    <UnderlineIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
                    <Strikethrough className="w-4 h-4" />
                </ToolbarButton>

                <Divider />

                {/* Headings */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1">
                    <Heading1 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 3">
                    <Heading3 className="w-4 h-4" />
                </ToolbarButton>

                <Divider />

                {/* Lists */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Blockquote">
                    <Quote className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
                    <Minus className="w-4 h-4" />
                </ToolbarButton>

                <Divider />

                {/* Alignment */}
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
                    <AlignLeft className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
                    <AlignCenter className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
                    <AlignRight className="w-4 h-4" />
                </ToolbarButton>

                <Divider />

                {/* Highlight */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight({ color: '#08B74F40' }).run()} isActive={editor.isActive('highlight')} title="Highlight">
                    <Highlighter className="w-4 h-4" />
                </ToolbarButton>

                {/* Text Color */}
                <div className="relative group/color">
                    <button
                        type="button"
                        title="Text Color"
                        className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700/60 transition-all cursor-pointer"
                    >
                        <span className="text-base font-bold leading-none" style={{ color: editor.getAttributes('textStyle').color || '#a1a1aa' }}>A</span>
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full" style={{ backgroundColor: editor.getAttributes('textStyle').color || '#a1a1aa' }} />
                    </button>
                    <div className="absolute top-full left-0 mt-1 hidden group-hover/color:flex flex-wrap gap-1 p-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 w-[140px]">
                        {COLORS.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => editor.chain().focus().setColor(color).run()}
                                className="w-5 h-5 rounded-full border border-zinc-600 hover:scale-125 transition-transform cursor-pointer"
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().unsetColor().run()}
                            className="w-5 h-5 rounded-full border border-zinc-600 hover:scale-125 transition-transform cursor-pointer flex items-center justify-center text-[9px] text-zinc-400 bg-zinc-900"
                            title="Reset color"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <Divider />

                {/* Link */}
                <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Add Link">
                    <LinkIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')} title="Remove Link">
                    <Link2Off className="w-4 h-4" />
                </ToolbarButton>

                <Divider />

                {/* Clear formatting */}
                <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting">
                    <RemoveFormatting className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Editor content */}
            <EditorContent editor={editor} />
        </div>
    );
}
