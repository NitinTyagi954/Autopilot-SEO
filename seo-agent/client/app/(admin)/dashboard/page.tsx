'use client';

import { useSite } from '@/context/SiteContext';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Post } from '@/types';
import Link from 'next/link';
import { FileText, PlusCircle, CheckCircle2, Clock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { currentSite, sites, isLoading: sitesLoading } = useSite();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentSite) return;
    setLoading(true);
    api.posts
      .list({ site: currentSite.id })
      .then((res) => {
        const list = Array.isArray(res) ? res : res.results || [];
        setPosts(list);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [currentSite]);

  if (sitesLoading) {
    return <div className="p-8 text-slate-500">Loading workspace...</div>;
  }

  if (sites.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center max-w-lg mx-auto mt-12 shadow-sm">
        <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4 opacity-80" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Welcome to Autopilot SEO</h2>
        <p className="text-sm text-slate-500 mb-6">
          To get started with post drafting, publishing, and SEO optimizations, create your first website.
        </p>
        <Link href="/sites">
          <Button variant="primary">Create Website</Button>
        </Link>
      </div>
    );
  }

  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Site overview and editorial pipeline for <span className="font-semibold text-slate-700 dark:text-slate-300">{currentSite?.name}</span>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/posts/new">
            <Button variant="primary" className="flex items-center space-x-2">
              <PlusCircle className="w-4 h-4" />
              <span>Create Post</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Total Posts</span>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-3">{posts.length}</div>
          <p className="text-xs text-slate-400 mt-1">Across all categories & tags</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Published Posts</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-3">{publishedCount}</div>
          <p className="text-xs text-slate-400 mt-1">Live on public blog /blog/[slug]</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Drafts in Progress</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-3">{draftCount}</div>
          <p className="text-xs text-slate-400 mt-1">Not accessible to search engines</p>
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Recent Posts</h2>
          <Link href="/posts" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
            View all posts →
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-slate-500 mb-4">No blog posts found for this site yet.</p>
            <Link href="/posts/new">
              <Button variant="outline" size="sm">Create your first blog post</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {posts.slice(0, 5).map((post) => (
              <div key={post.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="space-y-1">
                  <Link href={`/posts/${post.id}`} className="font-medium text-sm text-slate-800 dark:text-slate-200 hover:text-blue-600">
                    {post.title}
                  </Link>
                  <div className="text-xs text-slate-400 flex items-center space-x-3">
                    <span>slug: /{post.slug}</span>
                    <span>•</span>
                    <span>{post.category_detail?.name || 'Uncategorized'}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <StatusBadge status={post.status} />
                  <Link href={`/posts/${post.id}`}>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
