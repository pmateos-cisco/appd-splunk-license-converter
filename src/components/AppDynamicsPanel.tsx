import { Server, Boxes, Globe, Smartphone } from 'lucide-react';
import type { AppDynamicsEntitlements, ConversionAssumptions } from '../types';
import { NumberField, SelectField, ToggleField } from './Field';

type Setter = <K extends keyof AppDynamicsEntitlements>(
  key: K,
  v: AppDynamicsEntitlements[K],
) => void;

function useSetter(
  value: AppDynamicsEntitlements,
  onChange: (v: AppDynamicsEntitlements) => void,
): Setter {
  return (key, v) => onChange({ ...value, [key]: v });
}

function SubLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-2">
      {icon}
      {text}
    </div>
  );
}

export function ApmSection({
  value,
  onChange,
}: {
  value: AppDynamicsEntitlements;
  onChange: (v: AppDynamicsEntitlements) => void;
}) {
  const set = useSetter(value, onChange);
  return (
    <div className="space-y-3">
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
    </div>
  );
}

export function InfrastructureSection({
  value,
  onChange,
}: {
  value: AppDynamicsEntitlements;
  onChange: (v: AppDynamicsEntitlements) => void;
}) {
  const set = useSetter(value, onChange);
  return (
    <div className="space-y-5">
      <div>
        <SubLabel icon={<Server size={12} />} text="Server Visibility" />
        <NumberField
          label="Server Visibility instances"
          value={value.serverInstances}
          onChange={(v) => set('serverInstances', v)}
          hint="SIM / Machine Agent hosts"
        />
      </div>

      <div>
        <SubLabel icon={<Boxes size={12} />} text="Cloud Native / Kubernetes" />
        <NumberField
          label="Monitored containers"
          value={value.containers}
          onChange={(v) => set('containers', v)}
        />
      </div>
    </div>
  );
}

export function DatabaseSection({
  value,
  onChange,
}: {
  value: AppDynamicsEntitlements;
  onChange: (v: AppDynamicsEntitlements) => void;
}) {
  const set = useSetter(value, onChange);
  return (
    <div className="space-y-3">
      <NumberField
        label="Database instances (DBMON)"
        value={value.dbInstances}
        onChange={(v) => set('dbInstances', v)}
      />
      <ToggleField
        label="These DB hosts are already counted in Infrastructure Monitoring"
        checked={value.dbRunsOnExistingServer}
        onChange={(v) => set('dbRunsOnExistingServer', v)}
        hint="Avoids double-counting IM hosts above — Database Monitoring itself is still counted either way"
      />
    </div>
  );
}

export function EndUserMonitoringSection({
  value,
  onChange,
  assumptions,
  onAssumptionsChange,
}: {
  value: AppDynamicsEntitlements;
  onChange: (v: AppDynamicsEntitlements) => void;
  assumptions: ConversionAssumptions;
  onAssumptionsChange: (v: ConversionAssumptions) => void;
}) {
  const set = useSetter(value, onChange);
  return (
    <div className="space-y-5">
      <div>
        <SubLabel icon={<Globe size={12} />} text="Browser RUM" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <NumberField
            label="Monthly page views"
            value={value.browserPageViewsM}
            onChange={(v) => set('browserPageViewsM', v)}
            suffix="million/mo"
            step={0.5}
          />
          <NumberField
            label="Sessions per page view"
            value={assumptions.sessionsPerPageView}
            onChange={(v) =>
              onAssumptionsChange({ ...assumptions, sessionsPerPageView: v })
            }
            step={0.1}
          />
        </div>
      </div>

      <div>
        <SubLabel icon={<Smartphone size={12} />} text="Mobile RUM" />
        <NumberField
          label="Monthly app launches"
          value={value.mobileLaunchesM}
          onChange={(v) => set('mobileLaunchesM', v)}
          suffix="million/mo"
          step={0.1}
        />
      </div>
    </div>
  );
}

export function SyntheticSection({
  value,
  onChange,
}: {
  value: AppDynamicsEntitlements;
  onChange: (v: AppDynamicsEntitlements) => void;
}) {
  const set = useSetter(value, onChange);
  return (
    <NumberField
      label="Monthly check runs"
      value={value.syntheticRunsK}
      onChange={(v) => set('syntheticRunsK', v)}
      suffix="thousand/mo"
      step={1}
    />
  );
}

export function AnalyticsSection({
  value,
  onChange,
}: {
  value: AppDynamicsEntitlements;
  onChange: (v: AppDynamicsEntitlements) => void;
}) {
  const set = useSetter(value, onChange);
  return (
    <NumberField
      label="Monthly analytics events"
      value={value.analyticsEventsM}
      onChange={(v) => set('analyticsEventsM', v)}
      suffix="million/mo"
      step={1}
    />
  );
}
