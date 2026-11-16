import { Activity, Server, Database, Boxes, Smartphone, Globe, Radar, BarChart3 } from 'lucide-react';
import type { AppDynamicsEntitlements } from '../types';
import { NumberField, SectionCard, SelectField, ToggleField } from './Field';

export function AppDynamicsPanel({
  value,
  onChange,
}: {
  value: AppDynamicsEntitlements;
  onChange: (v: AppDynamicsEntitlements) => void;
}) {
  const set = <K extends keyof AppDynamicsEntitlements>(key: K, v: AppDynamicsEntitlements[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="space-y-4">
      <SectionCard
        title="APM"
        icon={<Activity size={16} className="text-emerald-400" />}
        accentClass="border-emerald-500/30"
      >
        <SelectField
          label="Edition"
          value={value.apmEdition}
          onChange={(v) => set('apmEdition', v)}
          options={[
            { value: 'premium', label: 'Premium' },
            { value: 'enterprise', label: 'Enterprise (Advanced)' },
            { value: 'peak', label: 'Peak' },
          ]}
        />
        <NumberField
          label="APM units (agent instances)"
          value={value.apmUnits}
          onChange={(v) => set('apmUnits', v)}
          hint="Java / .NET / Node / PHP / Python agents"
        />
      </SectionCard>

      <SectionCard
        title="Infrastructure"
        icon={<Server size={16} className="text-emerald-400" />}
        accentClass="border-emerald-500/30"
      >
        <NumberField
          label="Server Visibility instances"
          value={value.serverInstances}
          onChange={(v) => set('serverInstances', v)}
          hint="SIM / Machine Agent hosts"
        />
      </SectionCard>

      <SectionCard
        title="Database Monitoring"
        icon={<Database size={16} className="text-emerald-400" />}
        accentClass="border-emerald-500/30"
      >
        <NumberField
          label="Database instances (DBMON)"
          value={value.dbInstances}
          onChange={(v) => set('dbInstances', v)}
        />
        <ToggleField
          label="These DBs run on hosts already counted above"
          checked={value.dbRunsOnExistingServer}
          onChange={(v) => set('dbRunsOnExistingServer', v)}
          hint="Avoids double-counting IM hosts"
        />
      </SectionCard>

      <SectionCard
        title="Cloud Native / Kubernetes"
        icon={<Boxes size={16} className="text-emerald-400" />}
        accentClass="border-emerald-500/30"
      >
        <NumberField
          label="Monitored containers"
          value={value.containers}
          onChange={(v) => set('containers', v)}
        />
      </SectionCard>

      <SectionCard
        title="End User Monitoring — Browser"
        icon={<Globe size={16} className="text-emerald-400" />}
        accentClass="border-emerald-500/30"
      >
        <NumberField
          label="Monthly page views"
          value={value.browserPageViewsM}
          onChange={(v) => set('browserPageViewsM', v)}
          suffix="million/mo"
          step={0.5}
        />
      </SectionCard>

      <SectionCard
        title="End User Monitoring — Mobile"
        icon={<Smartphone size={16} className="text-emerald-400" />}
        accentClass="border-emerald-500/30"
      >
        <NumberField
          label="Monthly app launches"
          value={value.mobileLaunchesM}
          onChange={(v) => set('mobileLaunchesM', v)}
          suffix="million/mo"
          step={0.1}
        />
      </SectionCard>

      <SectionCard
        title="Synthetic Monitoring"
        icon={<Radar size={16} className="text-emerald-400" />}
        accentClass="border-emerald-500/30"
      >
        <NumberField
          label="Monthly check runs"
          value={value.syntheticRunsK}
          onChange={(v) => set('syntheticRunsK', v)}
          suffix="thousand/mo"
          step={1}
        />
      </SectionCard>

      <SectionCard
        title="Business iQ / Transaction Analytics"
        icon={<BarChart3 size={16} className="text-emerald-400" />}
        accentClass="border-emerald-500/30"
      >
        <NumberField
          label="Monthly analytics events"
          value={value.analyticsEventsM}
          onChange={(v) => set('analyticsEventsM', v)}
          suffix="million/mo"
          step={1}
        />
      </SectionCard>
    </div>
  );
}
