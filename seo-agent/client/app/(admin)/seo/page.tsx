'use client';

import { useSite } from '@/context/SiteContext';
import { Search, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function SeoPage() {
  const { currentSite } = useSite();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">SEO Configuration</h1>
        <p className="text-sm text-slate-500 mt-1">
          Global SEO and domain meta rules for {currentSite?.name}.
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl p-5 flex items-start space-x-3.5 text-blue-900 dark:text-blue-200">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-sm">Modular SEO Architecture</p>
          <p className="text-blue-800/80 dark:text-blue-300">
            SEO parameters are decoupled into the dedicated <code className="bg-blue-100 dark:bg-blue-900/60 px-1 py-0.5 rounded font-mono">apps.seo</code> domain. In this foundation phase, individual posts configure their focus keywords, canonical tags, robots instructions, and Open Graph previews via the 1:1 <code className="bg-blue-100 dark:bg-blue-900/60 px-1 py-0.5 rounded font-mono">PostSEO</code> relation.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Active SEO Foundation Checks</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Dedicated 1:1 PostSEO domain model & serializers</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Title length tracking (60 chars) and Meta Description limits (160 chars)</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Live Google Search snippet SERP preview</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Open Graph (social share) tags and custom canonical URLs</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Robots index/follow meta directives</span>
          </div>
        </div>
      </div>
    </div>
  );
}
