# AppDynamics → Splunk Observability Cloud Licensing Converter

A small client-side calculator that converts AppDynamics license entitlements
into an estimated equivalent set of Splunk Observability Cloud entitlements.

AppDynamics and Splunk Observability Cloud cover the same broad feature set
(APM, infrastructure monitoring, database monitoring, RUM, synthetics,
analytics) but license each capability on different units — AppDynamics on
agent "units" and monitored instances, Splunk O11y mostly on hosts, sessions,
and ingest volume. This tool maps one product's entitlements onto the other
using a set of clearly-labelled, **fully editable** conversion ratios so you
can size a migration/renewal and see the numbers update live.

> **This is a sizing aid, not an official price list.** Commercial trade-in
> ratios between AppDynamics and Splunk O11y are negotiated deal-by-deal.
> Always confirm final numbers with your Splunk/Cisco account team.

## What it converts

| AppDynamics | → | Splunk Observability Cloud |
|---|---|---|
| APM units (agent instances) | → | APM hosts |
| Server Visibility (SIM) instances | → | Infrastructure Monitoring hosts |
| Database Monitoring (DBMON) instances | → | Infrastructure Monitoring hosts |
| Cloud Native / Kubernetes containers | → | Infrastructure Monitoring host-equivalents |
| Browser RUM page views | → | RUM sessions |
| Mobile RUM app launches | → | RUM sessions |
| Synthetic Monitoring check runs | → | Synthetic Monitoring run units |
| Business iQ / Transaction Analytics events | → | Log Observer ingest (GB/day) — closest proxy, no 1:1 product match |

Every ratio above (plus an optional sizing headroom %) lives in the
**Assumptions** panel in the app and persists to `localStorage` so you can
tune it to match real guidance from an account team, then come back to it.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- lucide-react icons

Everything runs client-side; no backend, no data leaves the browser.

## Development

```bash
npm install
npm run dev      # start local dev server
npm run build    # type-check + production build
npm run lint     # oxlint
```
