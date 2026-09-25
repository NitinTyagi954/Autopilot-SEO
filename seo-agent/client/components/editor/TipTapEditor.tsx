'use client';

import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TipTapEditorProps {
  content?: any;
  onChange?: (json: any, html: string) => void;
  editable?: boolean;
}

export function TipTapEditor({ content, onChange, editable = true }: TipTapEditorProps) {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: content || '<p>Write your blog post content here...</p>',
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getJSON(), editor.getHTML());
      }
    },
  });

  if (!editor) {
    return (
      <div className="h-64 flex items-center justify-center border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400">
        Loading rich text editor...
      </div>
    );
  }

  // Calculate simple word count and reading time
  const textContent = editor.getText();
  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter target URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // Set link via HTML insertion if Link extension isn't in StarterKit
    editor.chain().focus().extendMarkRange('link').setLink?.({ href: url }).run();
  };

  const insertImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    const imgTag = `<img src="${imageUrl}" alt="${imageAlt || 'Article illustration'}" class="rounded-xl my-4 max-h-[450px] w-full object-cover shadow-sm" />`;
    editor.commands.insertContent(imgTag);
    setImageUrl('');
    setImageAlt('');
    setShowImageDialog(false);
  };

  const ToolbarButton = ({
    isActive,
    onClick,
    children,
    title,
  }: {
    isActive?: boolean;
    onClick: () => void;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300',
        isActive && 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-semibold'
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
      {editable && (
        <div className="flex flex-wrap items-center justify-between gap-1 p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur">
          <div className="flex flex-wrap items-center gap-1">
            <ToolbarButton
              title="Heading 1 (H1)"
              isActive={editor.isActive('heading', { level: 1 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              <Heading1 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Heading 2 (H2 - SEO Section)"
              isActive={editor.isActive('heading', { level: 2 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Heading 3 (H3 - Subsection)"
              isActive={editor.isActive('heading', { level: 3 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Heading3 className="w-4 h-4" />
            </ToolbarButton>

            <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

            <ToolbarButton
              title="Bold (Ctrl+B)"
              isActive={editor.isActive('bold')}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Italic (Ctrl+I)"
              isActive={editor.isActive('italic')}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="w-4 h-4" />
            </ToolbarButton>

            <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

            <ToolbarButton
              title="Bullet List"
              isActive={editor.isActive('bulletList')}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Numbered List"
              isActive={editor.isActive('orderedList')}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Blockquote / Callout"
              isActive={editor.isActive('blockquote')}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Code Snippet"
              isActive={editor.isActive('codeBlock')}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <Code className="w-4 h-4" />
            </ToolbarButton>

            <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

            <ToolbarButton
              title="Insert Image"
              onClick={() => setShowImageDialog(!showImageDialog)}
            >
              <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </ToolbarButton>

            <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

            <ToolbarButton
              title="Undo"
              onClick={() => editor.chain().focus().undo().run()}
            >
              <Undo className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Redo"
              onClick={() => editor.chain().focus().redo().run()}
            >
              <Redo className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Real-time Editor SEO Stats */}
          <div className="flex items-center space-x-3 text-xs text-slate-500 font-mono px-2 py-0.5">
            <span>{wordCount} words</span>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">~{readTimeMin} min read</span>
          </div>
        </div>
      )}

      {/* Insert Image Mini-Modal / Bar */}
      {showImageDialog && (
        <form onSubmit={insertImage} className="bg-slate-100 dark:bg-slate-800/90 p-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <input
            type="url"
            placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 min-w-[240px] text-xs px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="SEO Alt text description"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            className="w-48 text-xs px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md font-medium"
          >
            Add Image
          </button>
          <button
            type="button"
            onClick={() => setShowImageDialog(false)}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1.5"
          >
            Cancel
          </button>
        </form>
      )}

      <div className="p-4 sm:p-6 min-h-[360px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
