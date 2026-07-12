'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import PageHead from '@/components/PageHead';
import { LogoTile, StatusPill } from '@/components/ui';
import { toast } from '@/components/Toast';
import { Icon } from '@/lib/icons';
import { CONNECTORS, SECTION_META, type Connector } from '@/lib/data';
import { slugify } from '@/lib/connector-flow';
import { useDataSource } from '@/lib/first-run';

export default function ConnectorsPage() {
  const meta = SECTION_META.connectors;
  const { ready, source, hasSource, setSource } = useDataSource();
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<Connector[]>(CONNECTORS);

  const q = query.trim().toLowerCase();

  const connected = useMemo(
    () =>
      items.filter(
        (c) =>
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.blurb.toLowerCase().includes(q),
      ),
    [items, q],
  );

  const liveCount = items.filter((i) => i.status === 'live').length;

  /* Sources (and everything they populate) only exist once demo data
     is set up or a connector flow has completed. */
  const showSources = ready && hasSource;

  const removeDemoData = () => {
    setSource('none');
    toast('Demo data removed — workspace is back to a clean state');
  };

  if (!ready) return null;

  return (
    <>
      <PageHead
        title={meta.title}
        blurb={meta.blurb}
        actions={
          <Link href="/settings/connectors/add" className="btn btn--primary">
            <Icon.plus size={16} />
            Add connector
          </Link>
        }
      />

      {source === 'demo' && (
        <div className="demo-banner">
          <div className="demo-banner__main">
            <b>Demo data is active</b>
            <span>
              Sample connectors, feed insights, artifacts, and notifications
              are populated so you can explore Dan.
            </span>
          </div>
          <button className="btn btn--sm" onClick={removeDemoData}>
            <Icon.trash size={15} />
            Remove demo data
          </button>
        </div>
      )}

      <div className="toolbar">
        <div className="input-wrap" style={{ maxWidth: 320 }}>
          <Icon.search size={16} />
          <input
            className="input"
            placeholder="Search connectors…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="spacer" />
        {(() => {
          const shownLive = showSources ? liveCount : 0;
          // Green only when something is actually live; 0 reads as a neutral
          // gray pill, not a success state.
          return (
            <span className={`pill ${shownLive > 0 ? 'pill--live' : ''}`}>
              <span className="dot" /> {shownLive} live
            </span>
          );
        })()}
      </div>

      {showSources && connected.length > 0 ? (
        <div className="rows">
          {connected.map((c) => (
            <div className="row" key={c.name}>
              <LogoTile mark={c.mark} color={c.color} />
              <div className="row__main">
                <div className="row__title">
                  {c.name}
                  <span className="row__vendor">· {c.vendor}</span>
                </div>
                <div className="row__sub">{c.blurb}</div>
              </div>
              <StatusPill status={c.status} />
              <span className="row__meta">Synced {c.lastSync}</span>
              <div className="row__actions">
                <Link href={`/settings/connectors/${slugify(c.name)}`} className="btn btn--sm">
                  Manage
                </Link>
                <button
                  className="icon-btn icon-btn--danger"
                  aria-label={`Remove ${c.name}`}
                  onClick={() => {
                    setItems((prev) => prev.filter((x) => x.name !== c.name));
                    toast(`${c.name} disconnected`);
                  }}
                >
                  <Icon.trash size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">
          <h3>{q ? `Nothing matches “${query}”` : 'No connectors yet'}</h3>
          <p>
            {q
              ? 'Try a different search — or add a new source.'
              : 'Add your first source to let Dan answer questions from your data.'}
          </p>
        </div>
      )}
    </>
  );
}
