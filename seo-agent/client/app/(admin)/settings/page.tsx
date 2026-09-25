'use client';

import { useSite } from '@/context/SiteContext';
import { Settings, Database, Server, Code } from 'lucide-react';

export default function SettingsPage() {
  const { currentSite } = useSite();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          System and environment settings for Autopilot SEO.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">System Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 font-semibold text-slate-800 dark:text-slate-200">
              <Code className="w-4 h-4 text-blue-600" />
              <span>Frontend</span>
            </div>
            <p className="text-slate-500">Next.js App Router, TypeScript, Tailwind CSS, TipTap Editor</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 font-semibold text-slate-800 dark:text-slate-200">
              <Server className="w-4 h-4 text-emerald-600" />
              <span>Backend API</span>
            </div>
            <p className="text-slate-500">Django 5 + Django REST Framework, Modular Monolith architecture</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 font-semibold text-slate-800 dark:text-slate-200">
              <Database className="w-4 h-4 text-purple-600" />
              <span>Database</span>
            </div>
            <p className="text-slate-500">PostgreSQL (or SQLite dev fallback) with UUID primary keys</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          Current Active Site UUID: <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">{currentSite?.id || 'None'}</code>
        </div>
      </div>
    </div>
  );
}
