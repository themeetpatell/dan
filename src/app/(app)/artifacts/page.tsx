'use client';

import { useMemo, useState } from 'react';
import PresentationView from '@/components/app/PresentationView';
import Dashboard from '@/components/app/Dashboard';
import ArtifactEmptyState from '@/components/app/ArtifactEmptyState';
import { ARTIFACTS, type Artifact } from '@/lib/app-data';
import { useDataSource } from '@/lib/first-run';
import { Icon } from '@/lib/icons';

type Tab = 'all' | 'saved' | 'unsaved';

export default function ArtifactsPage() {
  const { ready, source } = useDataSource();
  const [tab, setTab] = useState<Tab>('saved');
  const [query, setQuery] = useState('');
  const [tool, setTool] = useState('all');
  const [type, setType] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const tools = useMemo(
    () => Array.from(new Set(ARTIFACTS.map((a) => a.tool))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTIFACTS.filter((a) => {
      if (tab === 'saved' && !a.saved) return false;
      if (tab === 'unsaved' && a.saved) return false;
      if (tool !== 'all' && a.tool !== tool) return false;
      if (type !== 'all' && a.kind !== type) return false;
      if (q && !`${a.name} ${a.description} ${a.kind} ${a.tool}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [tab, query, tool, type]);

  const selected: Artifact | undefined = filtered.find((a) => a.id === selectedId);

  const hasFilters = query || tool !== 'all' || type !== 'all';
  const clear = () => {
    setQuery('');
    setTool('all');
    setType('all');
  };

  const savedCount = ARTIFACTS.filter((a) => a.saved).length;

  /* Wait for localStorage so the empty state never flashes. */
  if (!ready) return null;

  /* Sample artifacts only exist with demo data — otherwise the
     designed empty state, full width. */
  if (source !== 'demo') {
    return (
      <div className="art-view art-view--single">
        <ArtifactEmptyState subtitle="Ask Dan a question and the dashboards, reports, and presentations it creates will live here." />
      </div>
    );
  }

  return (
    <>
      <div className="art-toolbar">
        <div className="tabs">
          <button data-on={tab === 'all'} onClick={() => setTab('all')}>
            <Icon.artifacts size={15} /> All
          </button>
          <button data-on={tab === 'saved'} onClick={() => setTab('saved')}>
            <Icon.bookmark size={15} /> Saved
            <span className="tab-count">{savedCount}</span>
          </button>
          <button data-on={tab === 'unsaved'} onClick={() => setTab('unsaved')}>
            <Icon.artifacts size={15} /> Unsaved
          </button>
        </div>

        <div className="input-wrap" style={{ maxWidth: 300 }}>
          <Icon.search size={16} />
          <input
            className="input"
            style={{ height: 38 }}
            placeholder="Search name, description, type, tool…"
            aria-label="Search artifacts"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="select">
          <select value={tool} onChange={(e) => setTool(e.target.value)} aria-label="Tool">
            <option value="all">All tools</option>
            {tools.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <Icon.chevronD size={15} />
        </div>
        <div className="select">
          <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Type">
            <option value="all">All types</option>
            <option value="presentation">Presentation</option>
            <option value="dashboard">Dashboard</option>
          </select>
          <Icon.chevronD size={15} />
        </div>
        <button className="btn btn--ghost btn--sm" onClick={clear} disabled={!hasFilters}>
          <Icon.close size={14} /> Clear
        </button>
      </div>

      <div className="art-view">
        <div className="art-list">
          {filtered.length === 0 && (
            <div className="empty">
              <h3>No artifacts</h3>
              Nothing matches your filters.
            </div>
          )}
          {filtered.map((a) => (
            <button
              key={a.id}
              className="art-card"
              data-active={selected?.id === a.id}
              onClick={() => setSelectedId(a.id)}
            >
              <span className="art-card__icon">
                {a.kind === 'dashboard' ? <Icon.grid size={17} /> : <Icon.present size={17} />}
              </span>
              <span className="art-card__main">
                <span className="art-card__name">{a.name}</span>
                <span className="art-card__desc">{a.description}</span>
              </span>
              <span className="art-badge" data-kind={a.kind}>
                {a.kind.toUpperCase()}
              </span>
            </button>
          ))}
        </div>

        <div className="art-preview">
          {selected?.kind === 'dashboard' ? (
            <Dashboard />
          ) : selected ? (
            <PresentationView name={selected.name} />
          ) : (
            <ArtifactEmptyState />
          )}
        </div>
      </div>
    </>
  );
}
