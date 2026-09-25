'use client';

import { useSite } from '@/context/SiteContext';
import { ExternalLink, Bell } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const { currentSite } = useSite();

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-8 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {currentSite ? (
          <div className="flex items-center space-x-2 text-sm">
            <span className="font-semibold text-slate-800 dark:text-slate-100">{currentSite.name}</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-500 font-mono text-xs">{currentSite.domain || currentSite.slug}</span>
          </div>
        ) : (
          <span className="text-sm text-slate-400">No site selected</span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {currentSite && (
          <Link
            href={`/blog`}
            target="_blank"
            className="flex items-center space-x-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md"
          >
            <span>View Public Blog</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-semibold text-slate-700 dark:text-slate-200">
          AD
        </div>
      </div>
    </header>
  );
}
