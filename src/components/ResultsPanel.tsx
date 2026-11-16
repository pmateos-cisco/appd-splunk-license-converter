import type { SplunkLineItem } from '../types';

function fmt(n: number, decimals = 0) {
  return n.toLocaleString(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  });
}

export function ResultCard({ item }: { item: SplunkLineItem }) {
  return (
    <div className="space-y-2">
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
    </div>
  );
}
