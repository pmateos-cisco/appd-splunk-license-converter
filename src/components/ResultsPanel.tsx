import { Server, Activity, Users, Radar, FileText } from 'lucide-react';
import type { SplunkLineItem } from '../types';

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'im-hosts': Server,
  'apm-hosts': Activity,
  'rum-sessions': Users,
  synthetic: Radar,
  'log-observer': FileText,
};

function fmt(n: number, decimals = 0) {
  return n.toLocaleString(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  });
}

export function ResultsPanel({ lineItems }: { lineItems: SplunkLineItem[] }) {
  return (
    <div className="space-y-4">
      {lineItems.map((item) => {
        const Icon = ICONS[item.key] ?? Server;
        return (
          <div
            key={item.key}
            className="rounded-xl border border-orange-500/30 bg-slate-900/40 p-4 space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Icon size={16} className="text-orange-400" />
                <h3 className="text-sm font-semibold tracking-wide text-slate-200 uppercase">
                  {item.product}
                </h3>
              </div>
            </div>

            <div className="flex items-end gap-2 flex-wrap">
              <span className="text-3xl font-bold text-orange-300 tabular-nums">
                {fmt(item.quantityWithHeadroom, item.unit === 'GB/day' ? 1 : 0)}
              </span>
              <span className="text-sm text-slate-400 mb-1">{item.unit}</span>
              <span className="text-xs text-slate-500 mb-1">({item.metric})</span>
            </div>

            {item.packs !== undefined && item.packSize && (
              <div className="text-xs text-slate-400">
                ≈ <span className="text-slate-200 font-medium">{fmt(item.packs)}</span> pack(s) of{' '}
                {fmt(item.packSize)} {item.unit.split('/')[0]}
              </div>
            )}

            <p className="text-xs text-slate-500 leading-relaxed">{item.note}</p>
            <p className="text-[11px] text-slate-600 italic">Source: {item.sourceNote}</p>
          </div>
        );
      })}
    </div>
  );
}
