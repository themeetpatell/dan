'use client';

import { useCallback, useEffect, useState } from 'react';

/* ============================================================
   Dan — First-run (no data source) experience
   Client-side state for whether the workspace has a data
   source yet, plus the token-light structured reply Dan gives
   before any connector is configured. No backend.
   ============================================================ */

export type DataSourceState = 'none' | 'demo' | 'connected';

const STORAGE_KEY = 'dan.data-source';

function readStoredState(): DataSourceState {
  if (typeof window === 'undefined') return 'none';
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw === 'demo' || raw === 'connected' ? raw : 'none';
}

/* Every mounted useDataSource() instance subscribes here, so a
   setSource() call from one component (e.g. the demo-data Setup
   button) immediately re-renders every page that gates on the
   data source — feed, home, chat, artifacts. */
const subscribers = new Set<(next: DataSourceState) => void>();

function writeStoredState(next: DataSourceState): void {
  window.localStorage.setItem(STORAGE_KEY, next);
  subscribers.forEach((notify) => notify(next));
}

/** Persist "connected" from anywhere (e.g. end of the connector add flow). */
export function markDataSourceConnected(): void {
  if (typeof window === 'undefined') return;
  writeStoredState('connected');
}

export function useDataSource(): {
  /** False until localStorage has been read on the client. */
  ready: boolean;
  source: DataSourceState;
  hasSource: boolean;
  setSource: (next: DataSourceState) => void;
} {
  const [source, setSourceState] = useState<DataSourceState>('none');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSourceState(readStoredState());
    setReady(true);
    subscribers.add(setSourceState);
    return () => {
      subscribers.delete(setSourceState);
    };
  }, []);

  const setSource = useCallback((next: DataSourceState) => {
    writeStoredState(next);
  }, []);

  return { ready, source, hasSource: source !== 'none', setSource };
}

/* ---------------- First-run suggestions ---------------- */

export const FIRST_RUN_SUGGESTIONS = [
  'Top customers by revenue',
  'MRR trends',
  'Churn by user cohort',
];

/* ---------------- Structured first-run reply ----------------
   Standard low-token format, no tool calls:
   1. answer  — answer the query in short
   2. bridge  — connect the query to what Dan can do
   3. guide   — how Dan's intelligence would handle it
   4. ask     — prompt to connect a data source
*/

export type FirstRunReply = {
  answer: string;
  bridge: string;
  guide: string[];
  ask: string;
};

type ReplyTemplate = { match: RegExp; reply: FirstRunReply };

const CONNECT_ASK =
  'Connect a data source below and ask me again — I’ll answer with your live numbers.';

const REPLY_TEMPLATES: ReplyTemplate[] = [
  {
    match: /top\s+customer|customer.*revenue|biggest\s+(account|client)/i,
    reply: {
      answer:
        'Top customers are usually ranked by collected revenue per customer over a window — last 90 days is a good default, with invoiced vs. collected shown side by side.',
      bridge:
        'This is exactly what I’m built for: once I can read your billing source (Stripe, Zoho Books, or your warehouse), I compute this directly from real transactions instead of estimates.',
      guide: [
        'Rank customers by collected vs. invoiced revenue',
        'Flag concentration risk when a few accounts dominate',
        'Track movement — who’s growing, who’s slipping',
      ],
      ask: CONNECT_ASK,
    },
  },
  {
    match: /mrr|arr|recurring revenue|revenue trend/i,
    reply: {
      answer:
        'An MRR trend normalizes subscription revenue by month and splits every movement into new, expansion, contraction, and churned MRR.',
      bridge:
        'With your subscriptions connected, I don’t just chart MRR — I explain each month’s movement and what drove it.',
      guide: [
        'Break MRR into new / expansion / contraction / churn',
        'Alert you when a month deviates from trend',
        'Reconcile MRR against actual cash collected',
      ],
      ask: CONNECT_ASK,
    },
  },
  {
    match: /churn|retention|cohort/i,
    reply: {
      answer:
        'Churn by cohort groups users by their signup month and tracks how many stay active in each period after — so you see whether newer cohorts retain better than older ones.',
      bridge:
        'Once your product analytics or CRM is connected, I build these cohorts from real user activity rather than a one-off export.',
      guide: [
        'Build monthly retention cohorts automatically',
        'Compare cohorts before and after product changes',
        'Flag cohorts churning faster than your baseline',
      ],
      ask: CONNECT_ASK,
    },
  },
  {
    match: /how can you help|what can you do|who are you|^hi$|^hello|^hey/i,
    reply: {
      answer:
        'I’m Dan — I answer business questions straight from your data: revenue, pipeline, marketing, product, and finance.',
      bridge:
        'Right now no data source is connected, so I can only speak in generalities instead of your actual numbers.',
      guide: [
        'Ask questions in plain English, get answers with the working shown',
        'Get dashboards, reports, and weekly reviews as artifacts',
        'Let me watch your metrics and flag risks proactively',
      ],
      ask: CONNECT_ASK,
    },
  },
];

const FALLBACK_REPLY: FirstRunReply = {
  answer:
    'Short version: I can work that out precisely — but no data source is connected yet, so I can only answer in general terms right now.',
  bridge:
    'Questions like this are where I’m strongest: once I can query your data directly, I return the exact figures with the working shown.',
  guide: [
    'Query your sources directly — no exports, no spreadsheets',
    'Cross-check numbers across billing, CRM, and analytics',
    'Turn one-off questions into monitored, recurring insights',
  ],
  ask: CONNECT_ASK,
};

export function buildFirstRunReply(query: string): FirstRunReply {
  const trimmed = query.trim();
  const matched = REPLY_TEMPLATES.find((t) => t.match.test(trimmed));
  return matched ? matched.reply : FALLBACK_REPLY;
}

export const FIRST_RUN_THOUGHT =
  'No data sources are connected in this workspace. Route to the lightweight first-run format — answer the question in short, bridge to Dan’s capabilities, and prompt to connect a source. No tool calls, no deep analysis, minimal tokens.';
