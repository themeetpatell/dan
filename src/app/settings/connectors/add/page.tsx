'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import PageHead from '@/components/PageHead';
import { toast } from '@/components/Toast';
import { Icon } from '@/lib/icons';
import { CONNECTORS, CONNECTOR_TYPES, DEMOS, SECTION_META, type ConnectorType } from '@/lib/data';
import { slugify } from '@/lib/connector-flow';
import { useDataSource } from '@/lib/first-run';

function DirHead({ label, count }: { label: string; count?: number }) {
  return (
    <div className="dir-head">
      {label}
      <Icon.chevronR size={15} />
      {count !== undefined && <span className="count">{count}</span>}
    </div>
  );
}

function DirItem({ type }: { type: ConnectorType }) {
  return (
    <Link className="dir-item" href={`/settings/connectors/add/${slugify(type.name)}`}>
      <div className="logo-tile">
        <span>{type.mark}</span>
      </div>
      <div className="dir-item__main">
        <div className="dir-item__name">
          {type.name}
          {type.isNew && <span className="minitag minitag--new">New</span>}
          {type.isPopular && <span className="minitag">Popular</span>}
        </div>
        <div className="dir-item__desc">{type.desc}</div>
      </div>
      <span className="dir-item__add" aria-hidden>
        <Icon.plus size={16} />
      </span>
    </Link>
  );
}

function DirSection({ label, items }: { label: string; items: ConnectorType[] }) {
  if (items.length === 0) return null;
  return (
    <section className="dir-section">
      <DirHead label={label} count={items.length} />
      <div className="dir-grid">
        {items.map((t) => (
          <DirItem key={`${label}-${t.name}`} type={t} />
        ))}
      </div>
    </section>
  );
}

export default function AddConnectorPage() {
  const meta = SECTION_META['add-connector'];
  const router = useRouter();
  const { setSource } = useDataSource();
  const [tab, setTab] = useState<'connectors' | 'demos'>('connectors');
  const [query, setQuery] = useState('');

  const startDemo = (name: string) => {
    setSource('demo');
    toast(`${name} demo data connected`);
    router.push('/activity');
  };

  const q = query.trim().toLowerCase();

  const filtered = useMemo(
    () => CONNECTOR_TYPES.filter((t) => t.name.toLowerCase().includes(q)),
    [q],
  );

  const popular = filtered.filter((t) => t.isPopular || t.isNew);
  const databases = filtered.filter((t) => t.kind === 'Database');
  const apis = filtered.filter((t) => t.kind === 'API');

  return (
    <>
      <PageHead
        title={meta.title}
        crumbs={[
          { label: 'Settings', href: '/settings/general' },
          { label: 'Connectors', href: '/settings/connectors' },
          { label: 'Add connector' },
        ]}
        blurb={
          tab === 'connectors'
            ? meta.blurb
            : 'Pick a sample database with pre-configured credentials to explore Dan.'
        }
        actions={
          <div className="segmented">
            <button data-on={tab === 'connectors'} onClick={() => setTab('connectors')}>
              Connectors
            </button>
            <button data-on={tab === 'demos'} onClick={() => setTab('demos')}>
              Demos
            </button>
          </div>
        }
      />

      {tab === 'connectors' ? (
        <>
          <div className="toolbar">
            <div className="input-wrap" style={{ maxWidth: 360 }}>
              <Icon.search size={16} />
              <input
                className="input"
                placeholder={`Search ${CONNECTOR_TYPES.length} connector types…`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {!q && CONNECTORS.length > 0 && (
            <section className="dir-section">
              <DirHead label="Installed" count={CONNECTORS.length} />
              <div className="dir-strip">
                {CONNECTORS.map((c) => (
                  <Link
                    key={c.name}
                    className="dir-strip__item"
                    href={`/settings/connectors/${slugify(c.name)}`}
                    title={c.name}
                  >
                    {c.mark}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {!q && <DirSection label="Featured" items={popular} />}
          <DirSection label="Databases" items={databases} />
          <DirSection label="APIs" items={apis} />

          {filtered.length === 0 && (
            <div className="empty">
              <h3>No connector types match “{query}”</h3>
              <p>Try a broader term, or request a connector from support.</p>
            </div>
          )}
        </>
      ) : (
        <section className="dir-section">
          <DirHead label="Sample databases" count={DEMOS.length} />
          <div className="dir-grid">
            {DEMOS.map((d) => (
              <button
                key={d.name}
                className="dir-item"
                onClick={() => startDemo(d.name)}
              >
                <div className="logo-tile">
                  <span>{d.mark}</span>
                </div>
                <div className="dir-item__main">
                  <div className="dir-item__name">{d.name}</div>
                  <div className="dir-item__desc">{d.desc}</div>
                </div>
                <span className="dir-item__add" aria-hidden>
                  <Icon.plus size={16} />
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
