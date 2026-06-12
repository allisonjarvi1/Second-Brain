import type { ReactNode } from 'react';

export function Badge({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}
