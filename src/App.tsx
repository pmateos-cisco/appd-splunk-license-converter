import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRightLeft,
  Download,
  RotateCcw,
  SlidersHorizontal,
  TriangleAlert,
  X,
} from 'lucide-react';
import type { AppDynamicsEntitlements, ConversionAssumptions } from './types';
import { DEFAULT_APPD, DEFAULT_ASSUMPTIONS, convert } from './conversion';
import { AppDynamicsPanel } from './components/AppDynamicsPanel';
import { AssumptionsPanel } from './components/AssumptionsPanel';
import { ResultsPanel } from './components/ResultsPanel';

const STORAGE_KEY = 'appd-splunk-converter-state-v1';

function loadInitial(): { appd: AppDynamicsEntitlements; assumptions: ConversionAssumptions } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        appd: { ...DEFAULT_APPD, ...parsed.appd },
        assumptions: { ...DEFAULT_ASSUMPTIONS, ...parsed.assumptions },
      };
    }
  } catch {
    // ignore corrupted storage
  }
  return { appd: DEFAULT_APPD, assumptions: DEFAULT_ASSUMPTIONS };
}

export default function App() {
  const initial = useMemo(() => loadInitial(), []);
  const [appd, setAppd] = useState<AppDynamicsEntitlements>(initial.appd);
  const [assumptions, setAssumptions] = useState<ConversionAssumptions>(initial.assumptions);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ appd, assumptions }));
  }, [appd, assumptions]);

  const result = useMemo(() => convert(appd, assumptions), [appd, assumptions]);

  function resetAll() {
    setAppd(DEFAULT_APPD);
    setAssumptions(DEFAULT_ASSUMPTIONS);
  }

  function exportCsv() {
    const rows = [
      ['Product', 'Metric', 'Raw quantity', 'With headroom', 'Unit', 'Notes'],
      ...result.lineItems.map((li) => [
        li.product,
        li.metric,
        li.rawQuantity.toFixed(2),
        li.quantityWithHeadroom.toFixed(2),
        li.unit,
        li.note.replace(/\n/g, ' '),
      ]),
    ];
    const csv = rows
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'splunk-o11y-entitlements.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#111827,_#030712_60%)] text-slate-100">
      <header className="border-b border-slate-800/80 sticky top-0 z-20 backdrop-blur bg-slate-950/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center gap-3 justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <span className="text-emerald-400">AppDynamics</span>
              <ArrowRightLeft size={18} className="text-slate-500" />
              <span className="text-orange-400">Splunk O11y</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Licensing entitlement converter</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAssumptions((s) => !s)}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg
                border border-orange-500/40 text-orange-300 hover:bg-orange-500/10 transition-colors"
            >
              <SlidersHorizontal size={14} />
              Assumptions
            </button>
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg
                border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Download size={14} />
              Export CSV
            </button>
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg
                border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>
      </header>

      {!dismissedBanner && (
        <div className="bg-amber-500/10 border-b border-amber-500/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-start gap-2.5 text-amber-200 text-xs">
            <TriangleAlert size={14} className="mt-0.5 shrink-0" />
            <p className="leading-relaxed flex-1">
              This is a technical sizing estimate driven by editable assumptions, not an official
              Splunk/Cisco price list or contractual conversion. AppDynamics and Splunk
              Observability Cloud are licensed on different metrics and commercial trade-in
              ratios are negotiated deal-by-deal — validate the final numbers with your
              Splunk/Cisco account team or licensing specialist before using them in a proposal.
            </p>
            <button
              onClick={() => setDismissedBanner(true)}
              className="shrink-0 text-amber-300/70 hover:text-amber-100"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {showAssumptions && (
          <div className="mb-6">
            <AssumptionsPanel value={assumptions} onChange={setAssumptions} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                AppDynamics entitlements
              </h2>
            </div>
            <AppDynamicsPanel value={appd} onChange={setAppd} />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-orange-400">
                Splunk Observability Cloud equivalent
              </h2>
            </div>
            <ResultsPanel lineItems={result.lineItems} />
          </section>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-xs text-slate-600 border-t border-slate-800/60 mt-6">
        Figures update live as you type. Your inputs are saved locally in this browser only —
        nothing is sent to a server.
      </footer>
    </div>
  );
}
