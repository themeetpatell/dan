'use client';

import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import PageHead from '@/components/PageHead';
import { LogoTile } from '@/components/ui';
import SchemaExplorer from '@/components/SchemaExplorer';
import { toast } from '@/components/Toast';
import { Icon } from '@/lib/icons';
import { CONNECTORS, CONNECTOR_TYPES } from '@/lib/data';
import { getSchema, slugify, SYSTEM_WORKFLOWS } from '@/lib/connector-flow';

const RUN_DURATION_MS = 6000;

type WorkflowKey = (typeof SYSTEM_WORKFLOWS)[number]['key'];
type WorkflowStatus = 'complete' | 'running';

type Run = {
  id: number;
  workflow: string;
  source: string;
  when: string;
  duration: string;
  status: 'running' | 'complete' | 'cancelled';
};

export default function ConnectorDetailPage() {
  return (
    <Suspense fallback={null}>
      <ConnectorDetail />
    </Suspense>
  );
}

function ConnectorDetail() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const router = useRouter();

  const existing = CONNECTORS.find((c) => slugify(c.name) === params.id);
  const typeSlug = search.get('type') ?? params.id;
  const ctype = CONNECTOR_TYPES.find((t) => slugify(t.name) === typeSlug);
  const isFresh = search.get('fresh') === '1';

  const mark = existing?.mark ?? ctype?.mark ?? 'C';
  const color = existing?.color ?? ctype?.color ?? 'var(--text-muted)';

  const [name, setName] = useState(search.get('name') ?? existing?.name ?? params.id);
  const [desc, setDesc] = useState(search.get('desc') ?? existing?.blurb ?? '');
  const [instructions, setInstructions] = useState(search.get('ai') ?? '');
  const [tab, setTab] = useState<'workflows' | 'access'>('workflows');
  const [feedback, setFeedback] = useState('');

  const [status, setStatus] = useState<Record<WorkflowKey, WorkflowStatus>>({
    documentation: 'complete',
    risk: isFresh ? 'running' : 'complete',
  });
  const [runs, setRuns] = useState<Run[]>(() =>
    isFresh
      ? [{ id: 1, workflow: 'Risk analysis', source: 'Api', when: 'just now', duration: '458ms', status: 'running' }]
      : [
          { id: 2, workflow: 'Risk analysis', source: 'Api', when: '2d ago', duration: '41s', status: 'complete' },
          { id: 1, workflow: 'Documentation', source: 'Api', when: '2d ago', duration: '18s', status: 'complete' },
        ],
  );
  const timers = useRef<Partial<Record<WorkflowKey, ReturnType<typeof setTimeout>>>>({});
  const runSeq = useRef(10);

  const finishRun = (key: WorkflowKey, workflowName: string, outcome: Run['status']) => {
    setStatus((prev) => ({ ...prev, [key]: 'complete' }));
    setRuns((prev) =>
      prev.map((r) =>
        r.workflow === workflowName && r.status === 'running'
          ? { ...r, status: outcome, duration: r.duration === '—' ? `${RUN_DURATION_MS / 1000}s` : r.duration }
          : r,
      ),
    );
  };

  useEffect(() => {
    if (!isFresh) return;
    const t = setTimeout(() => {
      finishRun('risk', 'Risk analysis', 'complete');
      toast('Risk analysis complete');
    }, RUN_DURATION_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFresh]);

  useEffect(() => {
    const pending = timers.current;
    return () => Object.values(pending).forEach((t) => t && clearTimeout(t));
  }, []);

  const startRun = (key: WorkflowKey, workflowName: string) => {
    runSeq.current += 1;
    setStatus((prev) => ({ ...prev, [key]: 'running' }));
    setRuns((prev) => [
      { id: runSeq.current, workflow: workflowName, source: 'Manual', when: 'just now', duration: '—', status: 'running' },
      ...prev,
    ]);
    toast(`${workflowName} started`);
    timers.current[key] = setTimeout(() => {
      finishRun(key, workflowName, 'complete');
      toast(`${workflowName} complete`);
    }, RUN_DURATION_MS);
  };

  const cancelRun = (key: WorkflowKey, workflowName: string) => {
    const t = timers.current[key];
    if (t) clearTimeout(t);
    finishRun(key, workflowName, 'cancelled');
    toast(`${workflowName} cancelled`);
  };

  const schema = getSchema(existing ? params.id : typeSlug);

  return (
    <>
      <PageHead
        title={name || 'Connector'}
        icon={<LogoTile mark={mark} color={color} />}
        crumbs={[
          { label: 'Settings', href: '/settings/general' },
          { label: 'Connectors', href: '/settings/connectors' },
          { label: name || 'Connector' },
        ]}
      />

      <div className="cfg-layout">
        <div className="cfg-form">
          <p className="cfg-note">
            Connection credentials cannot be changed after creation. Update the name, description, and
            data access for this integration.
          </p>

          <div className="cfg-field">
            <label className="label" htmlFor="dc-name">
              Name<span className="req">*</span>
            </label>
            <input id="dc-name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="cfg-field">
            <label className="label" htmlFor="dc-desc">
              Description<span className="req">*</span>
            </label>
            <input id="dc-desc" className="input" value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>

          <div className="cfg-field">
            <label className="label" htmlFor="dc-ai">
              Agent instructions
            </label>
            <p className="cfg-hint">Optional guidance for how the agent should use this data source.</p>
            <textarea
              id="dc-ai"
              className="input textarea"
              rows={4}
              placeholder="e.g. Revenue is in USD; always filter test accounts."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          <div className="cfg-actions">
            <button
              className="btn btn--primary btn--block"
              disabled={!name.trim() || !desc.trim()}
              onClick={() => toast('Changes saved')}
            >
              Save changes
            </button>
            <Link href="/" className="btn btn--block">
              Open in chat
            </Link>
            <button
              className="btn btn--danger btn--block"
              onClick={() => {
                toast(`${name} removed`);
                router.push('/settings/connectors');
              }}
            >
              Remove connector
            </button>
          </div>
        </div>

        <div>
          <div className="detail-tabsbar">
            <div className="tabs">
              <button data-on={tab === 'workflows'} onClick={() => setTab('workflows')}>
                Workflows
              </button>
              <button data-on={tab === 'access'} onClick={() => setTab('access')}>
                Access config
              </button>
            </div>
            <span className="detail-tabsbar__hint">
              {tab === 'workflows'
                ? 'System workflows run automatically when a connector is added. Re-run anytime to refresh results or steer the agent with feedback.'
                : 'Read-only preview of resources and fields.'}
            </span>
          </div>

          {tab === 'workflows' ? (
            <>
              <div className="section-label">Workflows</div>
              <div className="stack" style={{ gap: 12 }}>
                {SYSTEM_WORKFLOWS.map((wf) => {
                  const st = status[wf.key];
                  const isRunning = st === 'running';
                  return (
                    <div className="wf-block" key={wf.key}>
                      <div className="wf-block__head">
                        <div className="wf-block__icon">
                          {wf.key === 'documentation' ? <Icon.fileText size={17} /> : <Icon.shield size={17} />}
                        </div>
                        <div className="wf-block__main">
                          <div className="wf-block__name">
                            {wf.name}
                            <span className="wtag" data-state={st}>
                              {isRunning ? <Icon.refresh size={11} className="spin" /> : <Icon.check size={11} />}
                              {isRunning ? 'Running' : 'Complete'}
                            </span>
                          </div>
                          <div className="wf-block__desc">
                            {wf.desc} <span className="wf-block__meta">| Last updated just now</span>
                          </div>
                        </div>
                      </div>
                      <div className="wf-block__body">
                        {wf.key === 'risk' && isRunning && (
                          <div className="cfg-field" style={{ marginBottom: 14 }}>
                            <label className="label" htmlFor="wf-feedback">
                              Feedback <span className="cfg-hint" style={{ display: 'inline', margin: 0 }}>(optional)</span>
                            </label>
                            <textarea
                              id="wf-feedback"
                              className="input textarea"
                              rows={3}
                              placeholder="e.g. Focus on subscription churn and outdated refund logic."
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                            />
                          </div>
                        )}
                        <div className="wf-block__actions">
                          {isRunning ? (
                            <>
                              <button className="btn btn--sm" disabled>
                                <Icon.refresh size={14} className="spin" />
                                Running…
                              </button>
                              <button className="btn btn--sm btn--danger" onClick={() => cancelRun(wf.key, wf.name)}>
                                <Icon.close size={14} />
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button className="btn btn--sm" onClick={() => startRun(wf.key, wf.name)}>
                              <Icon.play size={14} />
                              Run
                            </button>
                          )}
                          <button className="linklike" onClick={() => toast('Workflow view coming soon')}>
                            View workflow <Icon.external size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="section-label">Run history</div>
              <div className="rows">
                {runs.map((r) => (
                  <div className="runrow" key={r.id}>
                    <div className="runrow__main">
                      <div className="runrow__name">{r.workflow}</div>
                      <div className="runrow__meta">
                        <Icon.zap size={12} /> {r.source} · {r.when} · {r.duration}
                      </div>
                    </div>
                    <span className="wtag" data-state={r.status === 'running' ? 'running' : r.status}>
                      {r.status === 'running' && <Icon.refresh size={11} className="spin" />}
                      {r.status === 'complete' && <Icon.check size={11} />}
                      {r.status === 'cancelled' && <Icon.close size={11} />}
                      {r.status === 'running' ? 'Running' : r.status === 'complete' ? 'Complete' : 'Cancelled'}
                    </span>
                    <button className="icon-btn" aria-label="Open run" onClick={() => toast('Opening run trace')}>
                      <Icon.external size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <SchemaExplorer resources={schema} />
          )}
        </div>
      </div>
    </>
  );
}
