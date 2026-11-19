import type {
  AppDynamicsEntitlements,
  ConversionAssumptions,
  ConversionResult,
  SplunkLineItem,
} from './types';

export const DEFAULT_APPD: AppDynamicsEntitlements = {
  apmUnits: 500,
  apmEdition: 'enterprise',
  serverInstances: 200,
  dbInstances: 25,
  dbRunsOnExistingServer: false,
  containers: 800,
  browserPageViewsM: 10,
  mobileLaunchesM: 2,
  syntheticRunsK: 50,
  analyticsEventsM: 20,
};

export const DEFAULT_ASSUMPTIONS: ConversionAssumptions = {
  apmUnitToHostRatio: 1,
  serverToHostRatio: 1,
  dbInstanceToHostRatio: 1,
  dbInstanceToDbMonitoringRatio: 1,
  containersPerHost: 16,
  sessionsPerPageView: 0.2,
  launchesPerSession: 1,
  syntheticRunRatio: 1,
  avgEventSizeKb: 1,
  headroomPct: 10,
  applyHeadroom: true,
};

function withHeadroom(raw: number, assumptions: ConversionAssumptions): number {
  if (!assumptions.applyHeadroom) return raw;
  return raw * (1 + assumptions.headroomPct / 100);
}

function round(n: number, decimals = 0): number {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

export function convert(
  appd: AppDynamicsEntitlements,
  a: ConversionAssumptions,
): ConversionResult {
  const lineItems: SplunkLineItem[] = [];

  // 1. APM hosts
  const rawApmHosts = appd.apmUnits * a.apmUnitToHostRatio;
  lineItems.push({
    key: 'apm-hosts',
    product: 'APM',
    metric: 'Monitored hosts',
    rawQuantity: rawApmHosts,
    quantityWithHeadroom: withHeadroom(rawApmHosts, a),
    unit: 'hosts',
    note: `${appd.apmUnits} AppD APM unit(s) (${appd.apmEdition} edition) \u00D7 ${a.apmUnitToHostRatio}. Splunk APM is a single SKU (no Premium/Enterprise/Peak tiers) \u2014 AlwaysOn Profiling and Trace Analyzer are separate add-ons that roughly cover AppD's higher-tier diagnostics features.`,
    sourceNote: 'AppDynamics: APM (Java/.NET/Node/PHP/Python agents)',
  });

  // 2. Infrastructure Monitoring hosts (Server Visibility + containers, plus the
  // underlying DB host itself when it isn't already one of the servers above —
  // this is host-level OS monitoring, separate from Database Monitoring below).
  const hostsFromServers = appd.serverInstances * a.serverToHostRatio;
  const hostsFromDbHosts = appd.dbRunsOnExistingServer
    ? 0
    : appd.dbInstances * a.dbInstanceToHostRatio;
  const hostsFromContainers = appd.containers / Math.max(a.containersPerHost, 0.0001);
  const rawImHosts = hostsFromServers + hostsFromDbHosts + hostsFromContainers;
  lineItems.push({
    key: 'im-hosts',
    product: 'Infrastructure Monitoring',
    metric: 'Monitored hosts',
    rawQuantity: rawImHosts,
    quantityWithHeadroom: withHeadroom(rawImHosts, a),
    unit: 'hosts',
    note: `From ${round(hostsFromServers)} Server Visibility host(s) + ${round(
      hostsFromDbHosts,
    )} host(s) for DB servers not already counted + ${round(
      hostsFromContainers,
      1,
    )} host-equivalent(s) from ${appd.containers} container(s) at ${
      a.containersPerHost
    }/host. This is OS/host-level monitoring only — see Database Monitoring below for the DB engine metrics themselves.`,
    sourceNote: 'AppDynamics: Server Visibility (SIM), Cloud Native containers',
  });

  // 3. Database Monitoring — Splunk O11y has its own Database Monitoring
  // product (query performance, DB-engine metrics), distinct from generic
  // Infrastructure Monitoring, mirroring AppDynamics' separate DBMON license.
  const rawDbMonitoring = appd.dbInstances * a.dbInstanceToDbMonitoringRatio;
  lineItems.push({
    key: 'db-monitoring',
    product: 'Database Monitoring',
    metric: 'Monitored database instances',
    rawQuantity: rawDbMonitoring,
    quantityWithHeadroom: withHeadroom(rawDbMonitoring, a),
    unit: 'databases',
    note: `${appd.dbInstances} AppD Database Monitoring (DBMON) instance(s) \u00D7 ${a.dbInstanceToDbMonitoringRatio}. Needed regardless of whether the underlying DB host also carries an Infrastructure Monitoring host license (see above) — Database Monitoring and host-level Infrastructure Monitoring are licensed separately in both products.`,
    sourceNote: 'AppDynamics: Database Monitoring (DBMON)',
  });

  // 4. RUM sessions
  const browserSessionsM = appd.browserPageViewsM * a.sessionsPerPageView;
  const mobileSessionsM = (appd.mobileLaunchesM) / Math.max(a.launchesPerSession, 0.0001);
  const rawRumSessions = (browserSessionsM + mobileSessionsM) * 1_000_000;
  const rumPackSize = 1000;
  lineItems.push({
    key: 'rum-sessions',
    product: 'RUM (Real User Monitoring)',
    metric: 'Sessions / month',
    rawQuantity: rawRumSessions,
    quantityWithHeadroom: withHeadroom(rawRumSessions, a),
    unit: 'sessions/mo',
    packSize: rumPackSize,
    packs: Math.ceil(withHeadroom(rawRumSessions, a) / rumPackSize),
    note: `${round(browserSessionsM, 2)}M sessions from Browser RUM (${appd.browserPageViewsM}M page views \u00D7 ${a.sessionsPerPageView} sessions/page view) + ${round(
      mobileSessionsM,
      2,
    )}M sessions from Mobile RUM (${appd.mobileLaunchesM}M launches \u00F7 ${a.launchesPerSession}/session). Splunk RUM is sold in packs of ${rumPackSize.toLocaleString()} sessions/month.`,
    sourceNote: 'AppDynamics: End User Monitoring (Browser RUM, Mobile RUM)',
  });

  // 5. Synthetic Monitoring
  const rawSyntheticRuns = appd.syntheticRunsK * 1000 * a.syntheticRunRatio;
  const synPackSize = 1000;
  lineItems.push({
    key: 'synthetic',
    product: 'Synthetic Monitoring',
    metric: 'Check runs / month',
    rawQuantity: rawSyntheticRuns,
    quantityWithHeadroom: withHeadroom(rawSyntheticRuns, a),
    unit: 'runs/mo',
    packSize: synPackSize,
    packs: Math.ceil(withHeadroom(rawSyntheticRuns, a) / synPackSize),
    note: `${appd.syntheticRunsK}K AppD synthetic check runs/month \u00D7 ${a.syntheticRunRatio}. Splunk Synthetics is sold in packs of ${synPackSize.toLocaleString()} run units/month.`,
    sourceNote: 'AppDynamics: Synthetic Monitoring',
  });

  // 6. Log Observer (proxy for Business iQ / Transaction Analytics)
  const rawGbPerMonth = (appd.analyticsEventsM * 1_000_000 * a.avgEventSizeKb) / (1024 * 1024);
  const rawGbPerDay = rawGbPerMonth / 30;
  lineItems.push({
    key: 'log-observer',
    product: 'Log Observer / Log Observer Connect',
    metric: 'Ingest, GB/day',
    rawQuantity: rawGbPerDay,
    quantityWithHeadroom: withHeadroom(rawGbPerDay, a),
    unit: 'GB/day',
    note: `${appd.analyticsEventsM}M Business iQ analytics events/month \u00D7 ${a.avgEventSizeKb} KB/event \u2248 ${round(
      rawGbPerMonth,
      1,
    )} GB/month. Business iQ has no 1:1 Splunk O11y product match; Log Observer ingest is the closest proxy for ad-hoc event/transaction analytics. Consider whether this volume is better absorbed as extra APM trace data or Infrastructure custom metrics (MTS) instead, depending on how the data is used.`,
    sourceNote: 'AppDynamics: Business iQ / Transaction Analytics',
  });

  return { lineItems };
}
