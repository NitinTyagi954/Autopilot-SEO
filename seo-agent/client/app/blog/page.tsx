import Link from 'next/link';
import { api } from '@/lib/api';
import { Post } from '@/types';
import { formatDate } from '@/lib/utils';
import { Globe, ArrowRight, BookOpen, Clock, Tag, Sparkles } from 'lucide-react';

export const revalidate = 0; // Fresh fetching for public view

export default async function PublicBlogListPage() {
  let posts: Post[] = [];
  try {
    const res = await api.posts.listPublic();
    posts = Array.isArray(res) ? res : res.results || [];
  } catch (err) {
    console.error('Error fetching public blog posts:', err);
  }

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const remainingPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      {/* Blog Navbar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/blog" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 group-hover:bg-blue-700 transition-colors flex items-center justify-center text-white font-bold text-sm shadow-sm">
              A
            </div>
            <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Autopilot Publications
            </span>
          </Link>
          <div className="flex items-center space-x-3">
            <Link
              href="/posts/new"
              className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-lg shadow-sm transition-colors"
            >
              Write Post
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
            >
              Admin Dashboard →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header Hero */}
        <div className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-4 border border-blue-100 dark:border-blue-900">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven Publishing & SEO Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Latest Articles & Deep Dives
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm sm:text-base max-w-2xl leading-relaxed">
            Engineered for high search visibility, clean semantic structure, and maximum reader engagement.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">No published posts yet</h2>
            <p className="text-slate-500 text-sm mt-1 mb-6">
              Create an article in the dashboard and set its status to "Published" to see it live here.
            </p>
            <Link
              href="/posts/new"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
            >
              Write First Article
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured Hero Post */}
            {featuredPost && (
              <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="p-8 sm:p-10 space-y-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-md">
                      Featured • {featuredPost.category_detail?.name || 'General'}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-400">{formatDate(featuredPost.published_at || featuredPost.created_at)}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                  </h2>

                  {featuredPost.excerpt && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                  )}

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-2 font-medium">
                      <span>By {featuredPost.author || 'Admin'}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-400">/{featuredPost.slug}</span>
                    </div>

                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center space-x-1.5 text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-1 transition-transform"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            )}

            {/* Grid of Remaining Posts */}
            {remainingPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {remainingPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          {post.category_detail?.name || 'Article'}
                        </span>
                        <span className="text-xs text-slate-400">{formatDate(post.published_at || post.created_at)}</span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors leading-snug">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>

                      {post.excerpt && (
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <span>By {post.author || 'Admin'}</span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
