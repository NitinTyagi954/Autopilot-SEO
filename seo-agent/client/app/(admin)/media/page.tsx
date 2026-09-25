'use client';

import { useSite } from '@/context/SiteContext';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Media } from '@/types';
import { Image as ImageIcon, UploadCloud, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function MediaPage() {
  const { currentSite } = useSite();
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [altText, setAltText] = useState('');

  const loadMedia = async () => {
    if (!currentSite) return;
    setLoading(true);
    try {
      const res = await api.media.list(currentSite.id);
      const list = Array.isArray(res) ? res : res.results || [];
      setMediaList(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [currentSite]);

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSite || !url.trim() || !filename.trim()) return;
    try {
      await api.media.create({
        site: currentSite.id,
        url,
        filename,
        alt_text: altText,
        storage_provider: 'local',
      });
      setUrl('');
      setFilename('');
      setAltText('');
      loadMedia();
    } catch (err: any) {
      alert(`Error saving media: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Media Library</h1>
        <p className="text-sm text-slate-500 mt-1">
          Abstract storage interface (supports local storage, CDN, S3, or Cloudflare R2).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form onSubmit={handleAddMedia} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 h-fit">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <UploadCloud className="w-4 h-4 text-blue-600" />
            <span>Add Media Reference</span>
          </h2>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Asset URL *</label>
            <Input
              placeholder="https://images.unsplash.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Filename *</label>
            <Input
              placeholder="hero-banner.jpg"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Alt Text</label>
            <Input
              placeholder="Descriptive alt text for SEO"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>
          <Button variant="primary" size="sm" type="submit" className="w-full">
            Save Asset
          </Button>
        </form>

        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          {loading ? (
            <div className="text-center text-slate-400 text-sm">Loading media...</div>
          ) : mediaList.length === 0 ? (
            <div className="text-center text-slate-500 text-sm py-12">
              <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <span>No media assets saved for this site yet.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {mediaList.map((m) => (
                <div key={m.id} className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden group">
                  <div className="h-28 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    {m.url || m.file_url ? (
                      <img src={m.file_url || m.url} alt={m.alt_text} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                    ) : (
                      <FileText className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div className="p-2 text-[11px]">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{m.filename}</p>
                    <p className="text-slate-400 truncate">{m.storage_provider.toUpperCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
