'use client';

import { useSite } from '@/context/SiteContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Category, Tag, PostSEO } from '@/types';
import { TipTapEditor } from '@/components/editor/TipTapEditor';
import { SeoEditor } from '@/components/seo/SeoEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Send, Eye, Image as ImageIcon, Sparkles, Tag as TagIcon } from 'lucide-react';
import Link from 'next/link';

export default function NewPostPage() {
  const router = useRouter();
  const { currentSite } = useSite();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [contentJson, setContentJson] = useState<any>(null);
  const [contentHtml, setContentHtml] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [author, setAuthor] = useState('Admin');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  
  const [previewMode, setPreviewMode] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [seo, setSeo] = useState<Partial<PostSEO>>({
    focus_keyword: '',
    seo_title: '',
    meta_description: '',
    canonical_url: '',
    robots_index: true,
    robots_follow: true,
    og_title: '',
    og_description: '',
    og_image: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentSite) {
      api.categories.list(currentSite.id).then((res) => {
        const list = Array.isArray(res) ? res : res.results || [];
        setCategories(list);
      });
    }
  }, [currentSite]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
    }
    // Auto sync SEO title if empty
    if (!seo.seo_title) {
      setSeo((prev) => ({ ...prev, seo_title: val }));
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!currentSite) {
      alert('Please select or create a site first.');
      return;
    }
    if (!title.trim()) {
      alert('Please enter a post title.');
      return;
    }

    setSaving(true);
    try {
      // 1. Create post
      const newPost = await api.posts.create({
        site: currentSite.id,
        title,
        slug: slug.trim() || undefined,
        excerpt,
        content: contentJson,
        content_html: contentHtml,
        category: categoryId || null,
        author,
        status,
      });

      // 2. Save 1:1 SEO
      const postSeo = {
        ...seo,
        og_image: seo.og_image || coverImageUrl || undefined,
      };
      await api.seo.update(newPost.id, postSeo);

      if (status === 'published') {
        router.push(`/blog/${newPost.slug}`);
      } else {
        router.push('/posts');
      }
    } catch (err: any) {
      alert(`Error saving post: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/posts" className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Create New Article</h1>
            <p className="text-xs text-slate-500">Draft rich SEO-driven blog posts with real-time metadata validation</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            variant="ghost"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-300"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span>{previewMode ? 'Exit Live Preview' : 'Live Preview'}</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="flex items-center space-x-2 text-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center space-x-2 text-xs"
          >
            <Send className="w-4 h-4" />
            <span>Publish Now</span>
          </Button>
        </div>
      </div>

      {/* Live Preview Drawer / Split Screen */}
      {previewMode ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 shadow-sm space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Live Reader Preview
            </span>
            <span className="text-xs text-slate-400">/{slug || 'post-slug'}</span>
          </div>

          {coverImageUrl && (
            <div className="w-full h-72 rounded-xl overflow-hidden shadow-sm">
              <img src={coverImageUrl} alt={title} className="w-full h-full object-cover" />
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
            {title || 'Untitled Blog Post'}
          </h1>

          <div className="flex items-center space-x-3 text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>By {author || 'Admin'}</span>
            <span>•</span>
            <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <div
            className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 pt-4"
            dangerouslySetInnerHTML={{ __html: contentHtml || '<p className="italic text-slate-400">No content entered yet...</p>' }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <Input
                  placeholder="Post title here..."
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="text-xl font-bold py-6 px-4"
                />
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400">slug: /blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-slug"
                  className="bg-transparent focus:outline-none flex-1 font-mono text-blue-600 dark:text-blue-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Rich Text Content (TipTap Editor)
                </label>
                <TipTapEditor
                  onChange={(json, html) => {
                    setContentJson(json);
                    setContentHtml(html);
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Post Excerpt / Brief Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="Short, engaging summary for blog listing cards and RSS feeds..."
                  value={excerpt}
                  onChange={(e) => {
                    setExcerpt(e.target.value);
                    if (!seo.meta_description) {
                      setSeo((prev) => ({ ...prev, meta_description: e.target.value.slice(0, 160) }));
                    }
                  }}
                  className="w-full text-sm rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* SEO Configuration Section */}
            <SeoEditor seo={seo} onChange={setSeo} defaultTitle={title} />
          </div>

          {/* Sidebar Settings Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800">
                Publishing Settings
              </h2>

              {/* Cover / Featured Image */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Cover Image URL</span>
                </label>
                <Input
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="text-xs"
                />
                {coverImageUrl && (
                  <div className="mt-2.5 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 h-28 w-full bg-slate-50 dark:bg-slate-950">
                    <img src={coverImageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full text-xs font-medium bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
                  <TagIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tags (Comma-separated)</span>
                </label>
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="seo, nextjs, marketing"
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Author
                </label>
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name"
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
