import React from 'react';
import { cn } from '@/lib/utils';
import { PostStatus } from '@/types';

interface BadgeProps {
  status?: PostStatus;
  children?: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className }: BadgeProps) {
  const current = status || 'draft';
  const styles: Record<PostStatus, string> = {
    draft: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
    published: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    archived: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize tracking-wide',
        styles[current],
        className
      )}
    >
      {children || current}
    </span>
  );
}
