import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Calendar, User, Tag as TagIcon, Folder, Share2, Clock, CheckCircle } from 'lucide-react';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await api.posts.getPublic(slug);
    const seo = post.seo;

    return {
      title: seo?.seo_title || `${post.title} | Autopilot SEO`,
      description: seo?.meta_description || post.excerpt || 'Read this article on Autopilot SEO.',
      robots: {
        index: seo?.robots_index ?? true,
        follow: seo?.robots_follow ?? true,
      },
      alternates: {
        canonical: seo?.canonical_url || undefined,
      },
      openGraph: {
        title: seo?.og_title || seo?.seo_title || post.title,
        description: seo?.og_description || seo?.meta_description || post.excerpt,
        images: seo?.og_image ? [{ url: seo.og_image }] : undefined,
        type: 'article',
        publishedTime: post.published_at || post.created_at,
        authors: [post.author || 'Admin'],
      },
      twitter: {
        card: 'summary_large_image',
        title: seo?.og_title || seo?.seo_title || post.title,
        description: seo?.og_description || seo?.meta_description || post.excerpt,
        images: seo?.og_image ? [seo.og_image] : undefined,
      },
    };
  } catch {
    return {
      title: 'Post Not Found — Autopilot SEO',
    };
  }
}

export default async function PublicPostPage({ params }: Props) {
  const { slug } = await params;

  let post: any = null;
  try {
    post = await api.posts.getPublic(slug);
  } catch (err) {
    notFound();
  }

  if (!post || post.status !== 'published') {
    notFound();
  }

  // Calculate estimated reading time
  const fullText = (post.content_html || '').replace(/<[^>]*>?/gm, ' ');
  const words = fullText.trim() ? fullText.trim().split(/\s+/).length : 0;
  const readTimeMin = Math.max(1, Math.ceil(words / 200));

  // JSON-LD Structured Data Schema for Article SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.seo?.seo_title || post.title,
    description: post.seo?.meta_description || post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author || 'Admin',
    },
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.created_at,
    image: post.seo?.og_image || post.featured_image_detail?.file_url || undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.seo?.canonical_url || `https://autopilotseo.com/blog/${post.slug}`,
    },
  };

  // Render TipTap content (either server html or JSON fallback)
  const renderContent = () => {
    if (post.content_html) {
      return (
        <div
          className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-base sm:text-lg"
          dangerouslySetInnerHTML={{ __html: post.content_html }}
        />
      );
    }

    if (post.content && post.content.content) {
      return (
        <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-base sm:text-lg">
          {post.content.content.map((block: any, i: number) => {
            if (block.type === 'heading') {
              const Tag = `h${block.attrs?.level || 2}` as keyof JSX.IntrinsicElements;
              return <Tag key={i} className="font-bold text-xl my-4 text-slate-900 dark:text-slate-100">{block.content?.[0]?.text}</Tag>;
            }
            if (block.type === 'paragraph') {
              return <p key={i} className="my-3">{block.content?.map((c: any) => c.text).join('')}</p>;
            }
            return null;
          })}
        </div>
      );
    }

    return <p className="text-slate-500 italic">No content in this post.</p>;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Blog Navbar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/blog" className="flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>All Articles</span>
          </Link>
          <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
            <span>{post.site_name || 'Autopilot SEO'}</span>
          </div>
        </div>
      </header>

      {/* Post Article */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-10 space-y-4">
          {post.category_detail && (
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-md">
              <Folder className="w-3 h-3" />
              <span>{post.category_detail.name}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed pt-1">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5 font-medium text-slate-700 dark:text-slate-300">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>{post.author || 'Admin'}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{readTimeMin} min read</span>
              </div>
            </div>

            <div className="font-mono text-slate-400 text-[11px] bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
              /blog/{post.slug}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {(post.seo?.og_image || post.featured_image_detail) && (
          <div className="mb-10 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
            <img
              src={post.seo?.og_image || post.featured_image_detail?.file_url || post.featured_image_detail?.url}
              alt={post.title}
              className="w-full h-auto object-cover max-h-[460px]"
            />
          </div>
        )}

        {/* Body Content */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 shadow-sm leading-relaxed">
          {renderContent()}
        </div>

        {/* Tags footer */}
        {post.tags_detail && post.tags_detail.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
            <TagIcon className="w-4 h-4 text-slate-400" />
            <div className="flex flex-wrap gap-2">
              {post.tags_detail.map((t: any) => (
                <span key={t.id} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-1 rounded-md font-medium">
                  #{t.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Verified SEO Footer badge */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800/80 border border-blue-100 dark:border-slate-700/60 rounded-xl p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                SEO-Verified Architecture
              </p>
              <p className="text-[11px] text-slate-500">
                Structured JSON-LD schema, open graph tags, canonical references, and mobile responsive typography.
              </p>
            </div>
          </div>
          <Link
            href="/blog"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0 ml-4"
          >
            More Articles →
          </Link>
        </div>
      </article>
    </div>
  );
}
