'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tags,
  Image as ImageIcon,
  Search,
  Settings,
  Globe,
  PlusCircle,
} from 'lucide-react';
import { useSite } from '@/context/SiteContext';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { sites, currentSite, setCurrentSite } = useSite();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Posts', href: '/posts', icon: FileText },
    { label: 'Categories', href: '/categories', icon: FolderTree },
    { label: 'Tags', href: '/tags', icon: Tags },
    { label: 'Media', href: '/media', icon: ImageIcon },
    { label: 'SEO Config', href: '/seo', icon: Search },
    { label: 'Sites', href: '/sites', icon: Globe },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            A
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight tracking-tight">
              Autopilot SEO
            </h1>
            <p className="text-[10px] text-blue-600 font-medium">Modular Monolith</p>
          </div>
        </div>
      </div>

      {/* Site Selector */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Active Site</span>
          <Link href="/sites" className="text-blue-600 hover:text-blue-700 flex items-center text-xs">
            <PlusCircle className="w-3.5 h-3.5" />
          </Link>
        </div>
        {sites.length > 0 ? (
          <select
            value={currentSite?.id || ''}
            onChange={(e) => {
              const selected = sites.find((s) => s.id === e.target.value);
              if (selected) setCurrentSite(selected);
            }}
            className="w-full text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-200 truncate cursor-pointer shadow-sm"
          >
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.domain || s.slug})
              </option>
            ))}
          </select>
        ) : (
          <Link
            href="/sites"
            className="text-xs text-blue-600 hover:underline block py-1 font-medium"
          >
            + Create your first site
          </Link>
        )}
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <span>v0.1.0 Foundation</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500" title="System Online" />
      </div>
    </aside>
  );
}
