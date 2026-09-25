'use client';

import { useSite } from '@/context/SiteContext';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Tag } from '@/types';
import { Tags, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TagsPage() {
  const { currentSite } = useSite();
  const [tags, setTags] = useState<Tag[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);

  const loadTags = async () => {
    if (!currentSite) return;
    setLoading(true);
    try {
      const res = await api.tags.list(currentSite.id);
      const list = Array.isArray(res) ? res : res.results || [];
      setTags(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, [currentSite]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSite || !name.trim()) return;
    try {
      await api.tags.create({
        site: currentSite.id,
        name,
        slug: slug.trim() || undefined,
      });
      setName('');
      setSlug('');
      loadTags();
    } catch (err: any) {
      alert(`Error creating tag: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tags</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage keyword and topic tags for {currentSite?.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 h-fit">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Add Tag</span>
          </h2>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Name *</label>
            <Input
              placeholder="e.g. NextJS"
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
              placeholder="nextjs"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
          <Button variant="primary" size="sm" type="submit" className="w-full">
            Create Tag
          </Button>
        </form>

        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          {loading ? (
            <div className="text-center text-slate-400 text-sm">Loading tags...</div>
          ) : tags.length === 0 ? (
            <div className="text-center text-slate-500 text-sm">No tags added yet.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="inline-flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-full text-xs font-medium"
                >
                  <span className="text-slate-400">#</span>
                  <span>{tag.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
