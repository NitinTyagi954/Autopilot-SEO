'use client';

import { useSite } from '@/context/SiteContext';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Globe, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SitesPage() {
  const { sites, currentSite, setCurrentSite, refreshSites } = useSite();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [domain, setDomain] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const created = await api.sites.create({
        name,
        slug: slug.trim() || undefined,
        domain: domain.trim(),
        description,
      });
      await refreshSites();
      setCurrentSite(created);
      setName('');
      setSlug('');
      setDomain('');
      setDescription('');
      setShowCreate(false);
    } catch (err: any) {
      alert(`Error creating site: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, siteName: string) => {
    if (!confirm(`Are you sure you want to delete ${siteName}? This will remove all associated posts.`)) return;
    try {
      await api.sites.delete(id);
      await refreshSites();
    } catch (err: any) {
      alert(`Error deleting site: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Websites</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your multiple publications, domains, and site configurations.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreate(!showCreate)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>{showCreate ? 'Cancel' : 'New Website'}</span>
        </Button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Add New Website</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Site Name *</label>
              <Input
                placeholder="e.g. Acme Tech Blog"
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
                placeholder="acme-tech-blog"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Domain</label>
              <Input
                placeholder="blog.acme.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <Input
                placeholder="Brief summary of publication"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Save Site'}
            </Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sites.map((site) => {
          const isSelected = currentSite?.id === site.id;
          return (
            <div
              key={site.id}
              className={`bg-white dark:bg-slate-900 border rounded-xl p-6 shadow-sm transition-all ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{site.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">{site.domain || site.slug}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(site.id, site.name)}
                  className="text-slate-400 hover:text-red-600 p-1.5 rounded transition-colors"
                  title="Delete site"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {site.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 line-clamp-2">
                  {site.description}
                </p>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {site.posts_count || 0} posts
                </span>
                <Button
                  variant={isSelected ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentSite(site)}
                >
                  {isSelected ? 'Active Site' : 'Select Site'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
