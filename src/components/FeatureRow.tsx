import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

export function FeatureRow({
  icon,
  appdLabel,
  splunkLabel,
  appdContent,
  splunkContent,
}: {
  icon: ReactNode;
  appdLabel: string;
  splunkLabel: string;
  appdContent: ReactNode;
  splunkContent: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 px-4 sm:px-5 py-3 border-b border-slate-800 bg-slate-950/40">
        <span className="text-slate-500">{icon}</span>
        <span className="text-sm font-semibold text-emerald-400">{appdLabel}</span>
        <ArrowRight size={14} className="text-slate-600 shrink-0" />
        <span className="text-sm font-semibold text-orange-400">{splunkLabel}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        <div className="p-4 sm:p-5">{appdContent}</div>
        <div className="p-4 sm:p-5">{splunkContent}</div>
      </div>
    </div>
  );
}
