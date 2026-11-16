// Core data model for the AppDynamics -> Splunk Observability Cloud
// licensing/entitlement converter.

export interface AppDynamicsEntitlements {
  /** Application Performance Monitoring agent/unit count (Java, .NET, Node, PHP, Python...) */
  apmUnits: number;
  /** APM edition selected in AppDynamics (affects feature parity note only, not raw math) */
  apmEdition: 'premium' | 'enterprise' | 'peak';
  /** Server Visibility / Infrastructure Monitoring (SIM) - monitored OS instances */
  serverInstances: number;
  /** Database Monitoring (DBMON) - monitored database instances */
  dbInstances: number;
  /** Whether the monitored DB instances already run on a server counted in serverInstances */
  dbRunsOnExistingServer: boolean;
  /** Cloud Native / Kubernetes - monitored containers */
  containers: number;
  /** Browser RUM - monthly page views, in millions */
  browserPageViewsM: number;
  /** Mobile RUM - monthly app launches/sessions, in millions */
  mobileLaunchesM: number;
  /** Synthetic Monitoring - total monthly check-run executions, in thousands */
  syntheticRunsK: number;
  /** Business iQ / Transaction Analytics - monthly analytics events, in millions */
  analyticsEventsM: number;
}

export interface ConversionAssumptions {
  /** 1 AppD APM unit maps to this many Splunk APM hosts */
  apmUnitToHostRatio: number;
  /** 1 AppD SIM server instance maps to this many Splunk Infrastructure Monitoring hosts */
  serverToHostRatio: number;
  /** 1 AppD DBMON instance maps to this many incremental Splunk IM hosts (when not already covered) */
  dbInstanceToHostRatio: number;
  /** How many monitored containers roll up into one Splunk IM host-equivalent license */
  containersPerHost: number;
  /** Average Browser RUM page views per user session */
  pageViewsPerSession: number;
  /** Average Mobile RUM app launches per user session */
  launchesPerSession: number;
  /** 1 AppD synthetic check run maps to this many Splunk Synthetic run units */
  syntheticRunRatio: number;
  /** Average size, in KB, of a Business iQ analytics event once represented as log data */
  avgEventSizeKb: number;
  /** Sizing buffer/headroom applied on top of the raw conversion, as a percentage */
  headroomPct: number;
  /** Whether the headroom buffer is applied */
  applyHeadroom: boolean;
}

export interface SplunkLineItem {
  key: string;
  product: string;
  metric: string;
  rawQuantity: number;
  quantityWithHeadroom: number;
  unit: string;
  packSize?: number;
  packs?: number;
  note: string;
  sourceNote: string;
}

export interface ConversionResult {
  lineItems: SplunkLineItem[];
}
