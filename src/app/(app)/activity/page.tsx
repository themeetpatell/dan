'use client';

import { useMemo, useState } from 'react';
import FeedActivation from '@/components/app/FeedActivation';
import FeedHealthy from '@/components/app/FeedHealthy';
import FeedItem from '@/components/app/FeedItem';
import { FEED_ITEMS, type FeedItem as FeedItemType } from '@/lib/app-data';
import { useDataSource } from '@/lib/first-run';
import { Icon } from '@/lib/icons';

type GroupBy = 'insight' | 'priority' | 'tag' | 'none';

export default function ActivityPage() {
  const { ready, source } = useDataSource();
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState('all');
  const [insight, setInsight] = useState('all');
  const [tag, setTag] = useState('all');
  const [groupBy, setGroupBy] = useState<GroupBy>('insight');

  const allTags = useMemo(
    () => Array.from(new Set(FEED_ITEMS.flatMap((i) => i.tags))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FEED_ITEMS.filter((i) => {
      if (priority !== 'all' && i.priority !== priority) return false;
      if (insight !== 'all' && i.insight !== insight) return false;
      if (tag !== 'all' && !i.tags.includes(tag)) return false;
      if (q && !(`${i.title} ${i.summary}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [query, priority, insight, tag]);

  const groups = useMemo(() => {
    if (groupBy === 'none') return [{ label: 'All activity', items: filtered }];
    const map = new Map<string, FeedItemType[]>();
    for (const item of filtered) {
      const keys =
        groupBy === 'tag' ? item.tags : [groupBy === 'priority' ? item.priority : item.insight];
      for (const k of keys) {
        if (!map.has(k)) map.set(k, []);
        map.get(k)!.push(item);
      }
    }
    return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
  }, [filtered, groupBy]);

  /* Wait for localStorage before choosing a state so the
     activation screen never flashes for returning users. */
  if (!ready) return null;

  /* No usable connector or dataset → dedicated activation state. */
  if (source === 'none') return <FeedActivation />;

  /* Connected and synced, but Dan has produced no feed-worthy items
     yet (fresh connection) → healthy-data state, distinct from the
     activation screen. Demo data ships with insights, so it falls
     through to the populated feed below. */
  if (source === 'connected') return <FeedHealthy />;

  return (
    <>
      <div className="feed-toolbar">
        <button className="icon-btn" aria-label="Refresh" title="Refresh feed">
          <Icon.refresh size={17} />
        </button>

        <div className="input-wrap feed-toolbar__search">
          <Icon.search size={16} />
          <input
            className="input"
            placeholder="Search activity…"
            aria-label="Search activity"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="select">
          <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority">
            <option value="all">All priorities</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
          </select>
          <Icon.chevronD size={15} />
        </div>
        <div className="select">
          <select value={insight} onChange={(e) => setInsight(e.target.value)} aria-label="Insight">
            <option value="all">All insights</option>
            <option value="Risk">Risk</option>
            <option value="Opportunity">Opportunity</option>
            <option value="Summary">Summary</option>
          </select>
          <Icon.chevronD size={15} />
        </div>
        <div className="select">
          <select value={tag} onChange={(e) => setTag(e.target.value)} aria-label="Tag">
            <option value="all">All tags</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <Icon.chevronD size={15} />
        </div>

        <div className="feed-toolbar__group">
          <div className="select">
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupBy)}
              aria-label="Group by"
            >
              <option value="insight">By insight</option>
              <option value="priority">By priority</option>
              <option value="tag">By tag</option>
              <option value="none">No grouping</option>
            </select>
            <Icon.chevronD size={15} />
          </div>
          <button className="icon-btn" aria-label="Add view" title="Save this view">
            <Icon.plus size={17} />
          </button>
          <button className="icon-btn" aria-label="Grid view" title="Grid view">
            <Icon.grid size={17} />
          </button>
        </div>
      </div>

      <div className="feed-scroll">
        {/* gate on filtered, not groups — "no grouping" always yields one
            (possibly empty) group, which used to suppress the empty state */}
        {filtered.length === 0 && (
          <div className="empty">
            <h3>No activity matches your filters</h3>
            Try clearing the search or filters.
          </div>
        )}
        {filtered.length > 0 && groups.map((group) => (
          <section key={group.label}>
            <div className="feed-grouplabel">
              {group.label.toUpperCase()}
              <span className="count">
                {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="feed-list">
              {group.items.map((item) => (
                <FeedItem key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
