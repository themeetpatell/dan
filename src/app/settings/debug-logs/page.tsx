'use client';

import { useMemo, useState } from 'react';
import PageHead from '@/components/PageHead';
import { toast } from '@/components/Toast';
import { Icon } from '@/lib/icons';
import { SECTION_META } from '@/lib/data';

type Tab = 'tools' | 'query' | 'memory';
type Log = { cat: string; id: string; desc: string; ok: boolean; ms: string; time: string; mono?: boolean };

/* One date format across the app: "11 Jul 2026, 11:41" — parses the raw
   "DD/MM/YYYY, HH:MM:SS" fixtures and drops the noisy seconds. */
const LOG_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function fmtLogTime(t: string): string {
  const m = t.match(/^(\d{2})\/(\d{2})\/(\d{4}),\s*(\d{2}):(\d{2})/);
  if (!m) return t;
  const [, dd, mm, yyyy, hh, min] = m;
  return `${Number(dd)} ${LOG_MONTHS[Number(mm) - 1]} ${yyyy}, ${hh}:${min}`;
}

const TOOL_FILTERS = ['All', 'create workflow', 'db get table schema', 'db list schemas', 'db run query', 'delete workflow', 'execute ipython cell', 'execute workflow', 'get connector documentation', 'ipython variables', 'list api endpoints', 'query api endpoint', 'update workflow'];
const QUERY_FILTERS = ['All', 'stripe', 'zoho books', 'zoho crm', 'google analytics', 'google search console'];
const MEMORY_FILTERS = ['All', 'read', 'write', 'search'];

const TOOL_LOGS: Log[] = [
  { cat: 'execute ipython cell', id: 'EB654620', desc: 'Analyze General Sales pipeline structure', ok: true, ms: '14ms', time: '11/07/2026, 11:41:09' },
  { cat: 'db run query', id: 'EB654620', desc: 'Get General Sales pipeline stages only', ok: true, ms: '1.3s', time: '11/07/2026, 11:40:59' },
  { cat: 'db run query', id: 'EB654620', desc: 'Get complete pipeline-stage breakdown', ok: false, ms: '927ms', time: '11/07/2026, 11:40:58' },
  { cat: 'execute ipython cell', id: 'EB654620', desc: 'Inspect CRM stages by pipeline data', ok: true, ms: '55ms', time: '11/07/2026, 11:40:42' },
  { cat: 'db run query', id: 'EB654620', desc: 'Analyze stages by pipeline', ok: true, ms: '1.4s', time: '11/07/2026, 11:40:31' },
  { cat: 'db run query', id: 'EB654620', desc: 'Find all CRM pipeline names', ok: false, ms: '921ms', time: '11/07/2026, 11:40:30' },
  { cat: 'db get table schema', id: 'EB654620', desc: 'Get full Deals table schema', ok: true, ms: '1ms', time: '11/07/2026, 11:40:19' },
  { cat: 'get skill instructions', id: 'EB654620', desc: 'Learn Zoho CRM querying best practices', ok: false, ms: '—', time: '11/07/2026, 11:40:19' },
  { cat: 'create workflow', id: '25CD88C6', desc: 'Creating refund and dispute monitor workflow', ok: true, ms: '2.8s', time: '11/07/2026, 11:29:45' },
  { cat: 'create workflow', id: '25CD88C6', desc: 'Creating revenue concentration risk workflow', ok: true, ms: '15.2s', time: '11/07/2026, 11:28:30' },
  { cat: 'update workflow', id: '25CD88C6', desc: 'Updating weekly collection summary to clarify payout effect', ok: true, ms: '4.4s', time: '11/07/2026, 11:27:06' },
];

const QUERY_LOGS: Log[] = [
  { cat: 'zoho books', id: 'CON_TMEJ', desc: '{ "endpoint": "expenses", "path_params": {}, "query_params": {…} }', ok: true, ms: '', time: '12/07/2026, 19:10:41', mono: true },
  { cat: 'zoho books', id: 'CON_TMEJ', desc: '{ "endpoint": "customerpayments", "path_params": {}, "query_params": {…} }', ok: true, ms: '', time: '12/07/2026, 19:10:40', mono: true },
  { cat: 'google analytics', id: 'CON_PJSX', desc: '{ "endpoint": "run_report", "path_params": {}, "query_params": {…} }', ok: true, ms: '', time: '12/07/2026, 19:10:35', mono: true },
  { cat: 'google ads', id: 'CON_INCB', desc: '{ "endpoint": "gaql_search", "path_params": {}, "query_params": {…} }', ok: true, ms: '', time: '12/07/2026, 19:10:35', mono: true },
  { cat: 'zoho crm', id: 'CON_UOBK', desc: 'SELECT Lead_Source, COUNT(id) as lead_count FROM Leads WHERE…', ok: true, ms: '', time: '12/07/2026, 19:10:35', mono: true },
  { cat: 'google search console', id: 'CON_CVWF', desc: '{ "endpoint": "search_analytics", "path_params": {}, "query_params": {…} }', ok: true, ms: '', time: '12/07/2026, 19:10:34', mono: true },
  { cat: 'zoho crm', id: 'CON_UOBK', desc: 'SELECT Stage, COUNT(id) as deal_count, SUM(Amount) as total…', ok: true, ms: '', time: '12/07/2026, 19:10:34', mono: true },
  { cat: 'stripe', id: 'CON_SJXD', desc: '{ "endpoint": "balance_transactions", "path_params": {}, … }', ok: true, ms: '', time: '12/07/2026, 19:10:15', mono: true },
];

const MEMORY_LOGS: Log[] = [
  { cat: 'write', id: 'MEM_A1', desc: 'Stored: “Finanshels reports revenue in AED; convert Stripe USD payouts.”', ok: true, ms: '3ms', time: '11/07/2026, 14:02:11' },
  { cat: 'read', id: 'MEM_A1', desc: 'Recalled reconciliation preferences for revenue questions', ok: true, ms: '1ms', time: '11/07/2026, 14:01:58' },
  { cat: 'search', id: 'MEM_A1', desc: 'query: “which number to trust for MRR”', ok: true, ms: '12ms', time: '11/07/2026, 13:55:02' },
];

const TABS: { key: Tab; label: string; icon: keyof typeof Icon }[] = [
  { key: 'tools', label: 'Tools', icon: 'gear' },
  { key: 'query', label: 'Query', icon: 'logs' },
  { key: 'memory', label: 'Memory', icon: 'spark' },
];

export default function DebugLogsPage() {
  const meta = SECTION_META['debug-logs'];
  const [tab, setTab] = useState<Tab>('tools');
  const [filter, setFilter] = useState('All');

  const { logs, filters } = useMemo(() => {
    if (tab === 'query') return { logs: QUERY_LOGS, filters: QUERY_FILTERS };
    if (tab === 'memory') return { logs: MEMORY_LOGS, filters: MEMORY_FILTERS };
    return { logs: TOOL_LOGS, filters: TOOL_FILTERS };
  }, [tab]);

  const rows = filter === 'All' ? logs : logs.filter((l) => l.cat === filter);

  return (
    <>
      <PageHead
        title={meta.title}
        blurb={meta.blurb}
        actions={<span className="pill pill--live"><span className="dot" /> Live</span>}
      />

      <div className="toolbar">
        <div className="tabs">
          {TABS.map((t) => {
            const TabIcon = Icon[t.icon];
            return (
              <button key={t.key} data-on={tab === t.key} onClick={() => { setTab(t.key); setFilter('All'); }}>
                <TabIcon size={16} /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="chips" style={{ marginBottom: 16 }}>
        {filters.map((f) => (
          <button key={f} className="chip" data-on={filter === f} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="rows">
        {rows.map((l, i) => (
          <div className="log-row" key={i}>
            <span className="log-row__tool">{l.cat}</span>
            <span className="log-id">{l.id}</span>
            <span className={`log-row__desc ${l.mono ? 'mono' : ''}`}>{l.desc}</span>
            <span className={`status ${l.ok ? 'status--ok' : 'status--err'}`}>{l.ok ? 'OK' : 'ERROR'}</span>
            {l.ms && <span className="row__meta">{l.ms}</span>}
            <span className="row__meta" style={{ width: 150, textAlign: 'right' }}>{fmtLogTime(l.time)}</span>
            <span className="log-view" onClick={() => toast('Opening log detail')}>View details</span>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="log-row" style={{ color: 'var(--text-muted)', padding: 22 }}>No log entries for this filter.</div>
        )}
      </div>
    </>
  );
}
