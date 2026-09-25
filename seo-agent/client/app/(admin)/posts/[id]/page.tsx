'use client';

import { useSite } from '@/context/SiteContext';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Post, Category, PostSEO } from '@/types';
import { TipTapEditor } from '@/components/editor/TipTapEditor';
import { SeoEditor } from '@/components/seo/SeoEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Send, Eye, Globe, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui/badge';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const { currentSite } = useSite();

  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [contentJson, setContentJson] = useState<any>(null);
  const [contentHtml, setContentHtml] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [author, setAuthor] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');

  const [previewMode, setPreviewMode] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [seo, setSeo] = useState<Partial<PostSEO>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    Promise.all([api.posts.get(postId), api.seo.get(postId).catch(() => null)])
      .then(([postData, seoData]) => {
        setPost(postData);
        setTitle(postData.title);
        setSlug(postData.slug);
        setExcerpt(postData.excerpt || '');
        setContentJson(postData.content);
        setContentHtml(postData.content_html || '');
        setCategoryId(postData.category || '');
        setAuthor(postData.author || 'Admin');
        setStatus(postData.status);
        if (postData.featured_image_detail?.url || postData.featured_image_detail?.file_url) {
          setCoverImageUrl(postData.featured_image_detail.url || postData.featured_image_detail.file_url || '');
        }
        setSeo(seoData || {});
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [postId]);

  useEffect(() => {
    if (currentSite) {
      api.categories.list(currentSite.id).then((res) => {
        const list = Array.isArray(res) ? res : res.results || [];
        setCategories(list);
      });
    }
  }, [currentSite]);

  const handleSave = async (targetStatus?: 'draft' | 'published') => {
    setSaving(true);
    try {
      const nextStatus = targetStatus || status;
      await api.posts.update(postId, {
        title,
        slug: slug.trim(),
        excerpt,
        content: contentJson,
        content_html: contentHtml,
        category: categoryId || null,
        author,
        status: nextStatus,
      });
      setStatus(nextStatus);

      // Save SEO
      await api.seo.update(postId, {
        ...seo,
        og_image: seo.og_image || coverImageUrl || undefined,
      });

      alert('Post and SEO saved successfully!');
    } catch (err: any) {
      alert(`Error saving post: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading post editor...</div>;
  }

  if (!post) {
    return <div className="p-12 text-center text-slate-400">Post not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/posts" className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Edit Post</h1>
              <StatusBadge status={status} />
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">/blog/{slug}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            variant="ghost"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-300"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span>{previewMode ? 'Exit Preview' : 'Live Preview'}</span>
          </Button>

          {status === 'published' && (
            <Link href={`/blog/${post.slug}`} target="_blank">
              <Button variant="ghost" size="sm" className="flex items-center space-x-1.5 text-xs">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>View Public Page</span>
              </Button>
            </Link>
          )}

          <Button
            variant="outline"
            onClick={() => handleSave(status === 'published' ? 'draft' : undefined)}
            disabled={saving}
            className="flex items-center space-x-2 text-xs"
          >
            <Save className="w-4 h-4" />
            <span>{status === 'published' ? 'Revert to Draft' : 'Save Draft'}</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center space-x-2 text-xs"
          >
            <Send className="w-4 h-4" />
            <span>{status === 'published' ? 'Update & Live' : 'Publish'}</span>
          </Button>
        </div>
      </div>

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
                  onChange={(e) => setTitle(e.target.value)}
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
                  Rich Text Content (TipTap)
                </label>
                <TipTapEditor
                  content={contentJson || contentHtml}
                  onChange={(json, html) => {
                    setContentJson(json);
                    setContentHtml(html);
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Excerpt
                </label>
                <textarea
                  rows={2}
                  placeholder="Short summary for archives and cards..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
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

              {/* Cover Image */}
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
