'use client';

import { useSite } from '@/context/SiteContext';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Category } from '@/types';
import { FolderTree, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CategoriesPage() {
  const { currentSite } = useSite();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    if (!currentSite) return;
    setLoading(true);
    try {
      const res = await api.categories.list(currentSite.id);
      const list = Array.isArray(res) ? res : res.results || [];
      setCategories(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [currentSite]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSite || !name.trim()) return;
    try {
      await api.categories.create({
        site: currentSite.id,
        name,
        slug: slug.trim() || undefined,
        description,
      });
      setName('');
      setSlug('');
      setDescription('');
      loadCategories();
    } catch (err: any) {
      alert(`Error creating category: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Categories</h1>
        <p className="text-sm text-slate-500 mt-1">
          Organize blog posts into hierarchical content verticals for {currentSite?.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 h-fit">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Add Category</span>
          </h2>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Name *</label>
            <Input
              placeholder="e.g. SEO Strategy"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
              }}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Slug</label>
            <Input
              placeholder="seo-strategy"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Vertical summary..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <Button variant="primary" size="sm" type="submit" className="w-full">
            Create Category
          </Button>
        </form>

        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">No categories created yet.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Category Name</th>
                  <th className="px-5 py-3">Slug</th>
                  <th className="px-5 py-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 text-xs">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">{c.name}</td>
                    <td className="px-5 py-3 font-mono text-slate-500">{c.slug}</td>
                    <td className="px-5 py-3 text-slate-500">{c.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
