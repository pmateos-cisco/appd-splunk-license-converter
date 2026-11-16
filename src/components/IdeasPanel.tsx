import { useEffect, useState } from 'react';
import { ExternalLink, Lightbulb, MessageCircle, RefreshCw } from 'lucide-react';
import { IDEAS_API_URL, IDEAS_LIST_URL, NEW_IDEA_URL } from '../config';
import { SectionCard } from './Field';

interface IdeaIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: 'open' | 'closed';
  comments: number;
  created_at: string;
  pull_request?: unknown;
}

const CACHE_KEY = 'appd-splunk-idea-registry-cache-v1';
const CACHE_TTL_MS = 5 * 60 * 1000;

function readCache(): IdeaIssue[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(data: IdeaIssue[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // sessionStorage unavailable — skip caching
  }
}

export function IdeasPanel() {
  const [issues, setIssues] = useState<IdeaIssue[] | null>(() => readCache());
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(() =>
    readCache() ? 'ready' : 'loading',
  );

  async function load(force = false) {
    if (force) setStatus('loading');
    try {
      const res = await fetch(IDEAS_API_URL, {
        headers: { Accept: 'application/vnd.github+json' },
      });
      if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
      const data: IdeaIssue[] = (await res.json()).filter((i: IdeaIssue) => !i.pull_request);
      setIssues(data);
      writeCache(data);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => {
    // Only fetch on mount if we didn't already have a fresh cached copy to show.
    if (!readCache()) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SectionCard
      title="Ideas & feedback"
      icon={<Lightbulb size={16} className="text-orange-400" />}
      accentClass="border-orange-500/30"
    >
      <p className="text-xs text-slate-400 -mt-1">
        This is a sizing tool, not a finished product — if you want a feature, a conversion fixed,
        or a different assumption baked in by default, suggest it. Ideas are tracked as GitHub
        issues on this repo so they're visible and don't get lost.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <a
          href={NEW_IDEA_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg
            bg-orange-500/15 border border-orange-500/50 text-orange-300 hover:bg-orange-500/25 transition-colors"
        >
          <Lightbulb size={14} />
          Suggest an idea
        </a>
        <a
          href={IDEAS_LIST_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg
            border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
        >
          <ExternalLink size={14} />
          View all ideas on GitHub
        </a>
        <button
          type="button"
          onClick={() => load(true)}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg
            border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="pt-1">
        {status === 'loading' && (
          <p className="text-xs text-slate-500">Loading recent suggestions…</p>
        )}

        {status === 'error' && (
          <p className="text-xs text-slate-500">
            Couldn't load the list right now (GitHub's public API is rate-limited).{' '}
            <a href={IDEAS_LIST_URL} target="_blank" rel="noreferrer" className="underline hover:text-orange-300">
              View it directly on GitHub instead
            </a>
            .
          </p>
        )}

        {status === 'ready' && issues && issues.length === 0 && (
          <p className="text-xs text-slate-500">
            No suggestions yet — be the first to{' '}
            <a href={NEW_IDEA_URL} target="_blank" rel="noreferrer" className="underline hover:text-orange-300">
              suggest one
            </a>
            .
          </p>
        )}

        {status === 'ready' && issues && issues.length > 0 && (
          <ul className="space-y-1.5">
            {issues.map((issue) => (
              <li key={issue.id}>
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs text-slate-300 hover:text-orange-300 transition-colors group"
                >
                  <span
                    className={`shrink-0 h-1.5 w-1.5 rounded-full ${
                      issue.state === 'open' ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  <span className="truncate flex-1">{issue.title}</span>
                  {issue.comments > 0 && (
                    <span className="shrink-0 inline-flex items-center gap-1 text-slate-500">
                      <MessageCircle size={11} />
                      {issue.comments}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SectionCard>
  );
}
