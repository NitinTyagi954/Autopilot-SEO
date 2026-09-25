'use client';

import React, { useState } from 'react';
import { PostSEO } from '@/types';
import { Input } from '@/components/ui/input';
import { Search, Sparkles } from 'lucide-react';

interface SeoEditorProps {
  seo: Partial<PostSEO>;
  onChange: (seo: Partial<PostSEO>) => void;
  defaultTitle?: string;
}

export function SeoEditor({ seo, onChange, defaultTitle }: SeoEditorProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'social'>('general');

  const updateField = (key: keyof PostSEO, value: any) => {
    onChange({
      ...seo,
      [key]: value,
    });
  };

  const previewTitle = seo.seo_title || defaultTitle || 'Your Post Title';
  const previewDescription =
    seo.meta_description || 'Add a meta description to see how your post appears in search engine snippet results.';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">SEO Configuration</h2>
        </div>
        <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'general' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            General & Meta
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'social' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Open Graph (Social)
          </button>
        </div>
      </div>

      {/* Search Engine SERP Preview */}
      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Google SERP Preview
        </span>
        <div className="font-sans">
          <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
            https://yourdomain.com › blog › post-slug
          </div>
          <div className="text-base font-medium text-blue-700 dark:text-blue-400 hover:underline cursor-pointer truncate">
            {previewTitle}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
            {previewDescription}
          </div>
        </div>
      </div>

      {activeTab === 'general' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Focus Keyword
            </label>
            <Input
              placeholder="e.g. agentic seo workflow"
              value={seo.focus_keyword || ''}
              onChange={(e) => updateField('focus_keyword', e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                SEO Title Tag
              </label>
              <span className="text-[11px] text-slate-400">
                {(seo.seo_title || '').length} / 60 chars
              </span>
            </div>
            <Input
              placeholder={defaultTitle || 'Title for search engines'}
              value={seo.seo_title || ''}
              onChange={(e) => updateField('seo_title', e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Meta Description
              </label>
              <span className="text-[11px] text-slate-400">
                {(seo.meta_description || '').length} / 160 chars
              </span>
            </div>
            <textarea
              rows={3}
              placeholder="Concise, compelling summary for search engine snippet..."
              value={seo.meta_description || ''}
              onChange={(e) => updateField('meta_description', e.target.value)}
              className="w-full text-sm rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Canonical URL
            </label>
            <Input
              placeholder="https://example.com/canonical-url"
              value={seo.canonical_url || ''}
              onChange={(e) => updateField('canonical_url', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={seo.robots_index ?? true}
                onChange={(e) => updateField('robots_index', e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Robots Index (allow indexing)</span>
            </label>

            <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={seo.robots_follow ?? true}
                onChange={(e) => updateField('robots_follow', e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Robots Follow (follow links)</span>
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Open Graph Title
            </label>
            <Input
              placeholder="OG Title for Twitter / LinkedIn / Facebook"
              value={seo.og_title || ''}
              onChange={(e) => updateField('og_title', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Open Graph Description
            </label>
            <textarea
              rows={3}
              placeholder="Social share description..."
              value={seo.og_description || ''}
              onChange={(e) => updateField('og_description', e.target.value)}
              className="w-full text-sm rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Open Graph Image URL
            </label>
            <Input
              placeholder="https://example.com/social-preview.jpg"
              value={seo.og_image || ''}
              onChange={(e) => updateField('og_image', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
