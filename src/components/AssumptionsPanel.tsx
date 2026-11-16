import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import type { ConversionAssumptions } from '../types';
import { NumberField, SectionCard, ToggleField } from './Field';
import { DEFAULT_ASSUMPTIONS } from '../conversion';

export function AssumptionsPanel({
  value,
  onChange,
}: {
  value: ConversionAssumptions;
  onChange: (v: ConversionAssumptions) => void;
}) {
  const set = <K extends keyof ConversionAssumptions>(key: K, v: ConversionAssumptions[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <SectionCard
      title="Conversion assumptions"
      icon={<SlidersHorizontal size={16} className="text-orange-400" />}
      accentClass="border-orange-500/30"
    >
      <p className="text-xs text-slate-400 -mt-1">
        These ratios drive every calculation. They are reasonable technical defaults, not a
        published or contractual price list — adjust them to match guidance from your
        Splunk/Cisco account team or an existing migration/trade-in agreement.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <NumberField
          label="APM units → APM hosts"
          value={value.apmUnitToHostRatio}
          onChange={(v) => set('apmUnitToHostRatio', v)}
          step={0.1}
          accent="orange"
        />
        <NumberField
          label="Server instances → IM hosts"
          value={value.serverToHostRatio}
          onChange={(v) => set('serverToHostRatio', v)}
          step={0.1}
          accent="orange"
        />
        <NumberField
          label="DB instances → IM hosts (if not already counted)"
          value={value.dbInstanceToHostRatio}
          onChange={(v) => set('dbInstanceToHostRatio', v)}
          step={0.1}
          accent="orange"
        />
        <NumberField
          label="DB instances → Database Monitoring"
          value={value.dbInstanceToDbMonitoringRatio}
          onChange={(v) => set('dbInstanceToDbMonitoringRatio', v)}
          step={0.1}
          accent="orange"
        />
        <NumberField
          label="Containers per IM host"
          value={value.containersPerHost}
          onChange={(v) => set('containersPerHost', v)}
          step={1}
          accent="orange"
        />
        <NumberField
          label="Page views per RUM session"
          value={value.pageViewsPerSession}
          onChange={(v) => set('pageViewsPerSession', v)}
          step={0.5}
          accent="orange"
        />
        <NumberField
          label="App launches per RUM session"
          value={value.launchesPerSession}
          onChange={(v) => set('launchesPerSession', v)}
          step={0.1}
          accent="orange"
        />
        <NumberField
          label="Synthetic run ratio"
          value={value.syntheticRunRatio}
          onChange={(v) => set('syntheticRunRatio', v)}
          step={0.1}
          accent="orange"
        />
        <NumberField
          label="Avg. analytics event size"
          value={value.avgEventSizeKb}
          onChange={(v) => set('avgEventSizeKb', v)}
          suffix="KB"
          step={0.1}
          accent="orange"
        />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <ToggleField
          label={`Apply sizing headroom (${value.headroomPct}%)`}
          checked={value.applyHeadroom}
          onChange={(v) => set('applyHeadroom', v)}
          hint="Common buffer for growth before true-up"
        />
        <input
          type="number"
          disabled={!value.applyHeadroom}
          className="w-20 rounded-lg bg-slate-900/70 border border-slate-700 px-2 py-1 text-slate-100 text-sm disabled:opacity-40"
          value={value.headroomPct}
          min={0}
          step={5}
          onChange={(e) => set('headroomPct', parseFloat(e.target.value) || 0)}
        />
      </div>

      <button
        type="button"
        onClick={() => onChange(DEFAULT_ASSUMPTIONS)}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-orange-400 transition-colors pt-1"
      >
        <RotateCcw size={12} />
        Reset assumptions to defaults
      </button>
    </SectionCard>
  );
}
