import type { ReactNode } from 'react';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  min?: number;
  step?: number;
  accent?: string;
  hint?: string;
}

export function NumberField({
  label,
  value,
  onChange,
  suffix,
  min = 0,
  step = 1,
  accent = 'emerald',
  hint,
}: NumberFieldProps) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
      </div>
      <div className="relative">
        <input
          type="number"
          className={`w-full rounded-lg bg-slate-900/70 border border-slate-700 px-3 py-2 text-slate-100 text-sm
            focus:outline-none focus:ring-2 focus:ring-${accent}-500/50 focus:border-${accent}-500
            [appearance:textfield]`}
          value={Number.isFinite(value) ? value : 0}
          min={min}
          step={step}
          onChange={(e) => onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps<T>) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-slate-300 mb-1">{label}</div>
      <select
        className="w-full rounded-lg bg-slate-900/70 border border-slate-700 px-3 py-2 text-slate-100 text-sm
          focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 accent-orange-500"
      />
      <span>
        <span className="text-sm font-medium text-slate-300 block">{label}</span>
        {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
      </span>
    </label>
  );
}

export function SectionCard({
  title,
  icon,
  children,
  accentClass = 'border-emerald-500/30',
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  accentClass?: string;
}) {
  return (
    <div className={`rounded-xl border ${accentClass} bg-slate-900/40 p-4 space-y-3`}>
      <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-200 uppercase">
        {icon}
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
