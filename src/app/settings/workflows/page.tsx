'use client';

import { useMemo, useState } from 'react';
import PageHead from '@/components/PageHead';
import { toast } from '@/components/Toast';
import { Icon } from '@/lib/icons';
import { SECTION_META } from '@/lib/data';

type Flow = {
  name: string;
  desc: string;
  enabled: boolean;
  created: string;
  schedule: string;
  step: string;
};

/* Turn a 5-field cron expression into something a non-engineer can read,
   e.g. "0 8 * * *" → "Daily · 08:00", "0 7 * * 1" → "Mondays · 07:00". */
const CRON_DOW = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
function cronToHuman(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return expr;
  const [min, hour, dom, mon, dow] = parts;
  const time = `${hour.padStart(2, '0')}:${min.padStart(2, '0')}`;
  if (dom === '*' && mon === '*') {
    if (dow === '*') return `Daily · ${time}`;
    const day = CRON_DOW[Number(dow)];
    if (day) return `${day} · ${time}`;
  }
  return time;
}

const FLOWS: Flow[] = [
  { name: 'Accepted Estimates to Invoice Opportunity', desc: 'Surfaces accepted estimates that have not yet been invoiced, quantifying near-term revenue opportunity and prompting conversion.', enabled: true, created: '11/07/2026, 13:32', schedule: '0 8 * * *', step: 'publish' },
  { name: 'Backlogs Pipeline Bloat', desc: 'Surfaces deals stuck in the Backlogs stage, especially those missing closing dates or with past closing dates, which inflate pipeline and distort forecasts.', enabled: true, created: '11/07/2026, 13:31', schedule: '0 7 * * 1', step: 'publish' },
  { name: 'Collection Efficiency Monitor', desc: 'Tracks the ratio of cash collected to invoices issued over the last 30 days and flags a risk when collections lag materially.', enabled: true, created: '11/07/2026, 13:30', schedule: '0 9 * * *', step: 'publish' },
  { name: 'Expense Spike Alert', desc: 'Compares rolling 30-day expenses to the prior 30 days and raises a risk card when spending jumps materially.', enabled: true, created: '11/07/2026, 13:29', schedule: '0 6 * * *', step: 'publish' },
  { name: 'Expired Estimates Re-engagement Opportunity', desc: 'Surfaces expired estimates worth reviving, quantifying lost pipeline value and prompting follow-up to re-engage prospects.', enabled: true, created: '11/07/2026, 13:28', schedule: '0 10 * * 2', step: 'publish' },
  { name: 'GA4 Channel Vanity Traffic Alert', desc: 'Flags high-volume channels with zero conversions and very low engagement, indicating budget or effort may be wasted on vanity traffic.', enabled: true, created: '11/07/2026, 13:27', schedule: '0 9 * * *', step: 'publish' },
  { name: 'GA4 Conversion Decline Alert', desc: 'Monitors period-over-period key event volume vs sessions. Flags when conversions drop while traffic rises or stays flat.', enabled: true, created: '11/07/2026, 13:32', schedule: '0 9 * * 1', step: 'publish' },
  { name: 'GA4 Form Funnel Drop-off', desc: 'Monitors form_start to form_submit completion rate and flags when users abandon forms, signaling friction or UX issues.', enabled: true, created: '11/07/2026, 13:25', schedule: '0 9 * * *', step: 'publish' },
  { name: 'GA4 Landing Page Optimization Opportunity', desc: 'Surfaces high-traffic landing pages with near-zero conversion rates so the team can prioritize CTA and copy tests.', enabled: true, created: '11/07/2026, 13:24', schedule: '0 9 * * 3', step: 'publish' },
  { name: 'GA4 Low-Quality Geo Traffic Alert', desc: 'Flags countries with high session volume but near-zero engagement and zero conversions, indicating bot traffic or mis-targeted spend.', enabled: true, created: '11/07/2026, 13:23', schedule: '0 9 * * *', step: 'publish' },
  { name: 'GA4 Mobile Conversion Gap', desc: 'Compares mobile vs desktop session conversion rates and flags when mobile lags significantly, signaling a UX optimization need.', enabled: false, created: '11/07/2026, 13:22', schedule: '0 9 * * *', step: 'publish' },
  { name: 'GA4 Tracking Health Check', desc: 'Monitors unassigned channel, (not set) source/medium, and (not set) country traffic to detect broken UTMs, consent gaps, or tagging drift.', enabled: true, created: '11/07/2026, 13:21', schedule: '0 6 * * *', step: 'publish' },
];

function Drawer({ flow, onClose }: { flow: Flow; onClose: () => void }) {
  const definition = `{
  "name": "${flow.name}",
  "retry": {
    "max_attempts": 3,
    "backoff_seconds": 60
  },
  "timeout_seconds": null,
  "labels": {},
  "steps": [
    {
      "id": "${flow.step}",
      "type": "function",
      "depends_on": [],
      "fn": "workflows.module.run",
      "prompt": null,
      "connectors": []
    }
  ]
}`;

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label={flow.name}>
        <div className="drawer__head">
          <div style={{ flex: 1 }}>
            <div className="drawer__title">{flow.name}</div>
            <div className="drawer__desc">{flow.desc}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <span className="tag">V1</span>
              <span className={`tag ${flow.enabled ? 'tag--on' : 'tag--off'}`}>
                {flow.enabled ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon.plus size={18} style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>

        <div className="drawer__body">
          <div className="drawer__actions">
            <button className="btn btn--primary btn--sm" onClick={() => toast(`Running ${flow.name}`)}>
              <Icon.chevronR size={14} /> Run now
            </button>
            <button className="btn btn--sm" onClick={() => toast(flow.enabled ? 'Disabled' : 'Enabled')}>
              {flow.enabled ? 'Disable' : 'Enable'}
            </button>
            <button className="btn btn--danger btn--sm" onClick={() => toast('Deleted')}>
              <Icon.trash size={14} /> Delete
            </button>
          </div>

          <dl className="kv">
            <div>
              <dt>Created</dt>
              <dd>{flow.created}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{flow.created}</dd>
            </div>
          </dl>

          <div className="drawer__section">
            <div className="drawer__section-head">
              <Icon.workflows size={15} /> Steps (1)
            </div>
            <div className="drawer__section-body">
              <div className="step-line">
                <span className="step-num">1</span>
                <span className="drawer__code mono">{flow.step}</span>
                <span className="tag" style={{ marginLeft: 'auto' }}>FUNCTION</span>
              </div>
            </div>
          </div>

          <div className="drawer__section">
            <div className="drawer__section-head">
              <Icon.gauge size={15} /> Schedules (1)
            </div>
            <div className="drawer__section-body">
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingTop: 4 }}>
                <span className="drawer__code mono">{flow.schedule}</span>
                <span className={`tag ${flow.enabled ? 'tag--on' : 'tag--off'}`}>
                  {flow.enabled ? 'ENABLED' : 'PAUSED'}
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                {cronToHuman(flow.schedule)} · UTC · next 13 Jul 2026, 13:00
              </div>
            </div>
          </div>

          <div className="drawer__section">
            <div className="drawer__section-head">
              <Icon.logs size={15} /> Definition
            </div>
            <div className="drawer__section-body">
              <pre className="codeblock">{definition}</pre>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function WorkflowsPage() {
  const meta = SECTION_META.workflows;
  const [tab, setTab] = useState<'definitions' | 'runs'>('definitions');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<Flow | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FLOWS.filter((f) => !q || f.name.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q));
  }, [query]);

  return (
    <>
      <PageHead title={meta.title} blurb={meta.blurb} />

      <div className="toolbar">
        <div className="tabs">
          <button data-on={tab === 'definitions'} onClick={() => setTab('definitions')}>
            <Icon.workflows size={16} /> Definitions <span className="tab-count">{FLOWS.length}</span>
          </button>
          <button data-on={tab === 'runs'} onClick={() => setTab('runs')}>
            <Icon.gauge size={16} /> Runs <span className="tab-count">0</span>
          </button>
        </div>
        <div className="spacer" />
        <div className="input-wrap" style={{ maxWidth: 280 }}>
          <Icon.search size={16} />
          <input className="input" placeholder="Search workflows…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {tab === 'definitions' ? (
        <div className="wf-grid stagger">
          {filtered.map((f) => (
            <button className="wf-card" key={f.name} onClick={() => setOpen(f)}>
              <div className="wf-card__top">
                <span className="tag">V1</span>
                <span className={`tag ${f.enabled ? 'tag--on' : 'tag--off'}`}>
                  {f.enabled ? 'ENABLED' : 'DISABLED'}
                </span>
                <span className="wf-card__time">1d ago</span>
              </div>
              <div className="wf-card__name">{f.name}</div>
              <div className="wf-card__desc">{f.desc}</div>
              <div className="wf-card__foot">
                <Icon.gauge size={13} /> <span>{cronToHuman(f.schedule)}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty">
          <h3>No runs yet</h3>
          <p>Runs will appear here once a workflow executes. Trigger one with “Run now”.</p>
        </div>
      )}

      {open && <Drawer flow={open} onClose={() => setOpen(null)} />}
    </>
  );
}
