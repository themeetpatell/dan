'use client';

import { useState } from 'react';
import type { FeedItem as FeedItemType } from '@/lib/app-data';
import { toast } from '@/components/Toast';
import { Icon } from '@/lib/icons';

export default function FeedItem({ item }: { item: FeedItemType }) {
  const [open, setOpen] = useState(item.id === 'stale-invoices');

  const stop = (e: React.MouseEvent, msg: string) => {
    e.stopPropagation();
    toast(msg);
  };

  const toggle = () => setOpen((v) => !v);

  return (
    <article className={`feed-item ${open ? '' : 'collapsed'}`} data-open={open}>
      <div className="feed-item__head">
        <div className="feed-badges">
          <span className="badge-risk">
            <Icon.alert size={12} /> {item.insight.toUpperCase()}
          </span>
          <span className="badge-prio">
            <Icon.zap size={12} /> {item.priority}
          </span>
        </div>

        {/* One real button owns the toggle — actions sit outside it so screen
            readers never announce the card and its actions as one control. */}
        <button
          type="button"
          className="feed-item__toggle"
          onClick={toggle}
          aria-expanded={open}
          aria-label={`${open ? 'Collapse' : 'Expand'} ${item.title}`}
        >
          <span className="feed-item__body">
            <span className="feed-item__line">
              <span className="feed-item__title">{item.title}</span>
              <span className="feed-item__summary">{item.summary}</span>
            </span>
          </span>
          <span className="feed-item__meta">{item.timeAgo}</span>
          <Icon.chevronD size={16} className="feed-chevron" />
        </button>

        <div className="feed-item__actions">
          <button
            className="icon-btn"
            aria-label="Open"
            onClick={(e) => stop(e, 'Opening analysis…')}
          >
            <Icon.external size={16} />
          </button>
          <button
            className="icon-btn"
            aria-label="Mark resolved"
            onClick={(e) => stop(e, 'Marked as resolved')}
          >
            <Icon.check size={16} />
          </button>
          <button
            className="icon-btn icon-btn--danger"
            aria-label="Dismiss"
            onClick={(e) => stop(e, 'Dismissed')}
          >
            <Icon.trash size={16} />
          </button>
        </div>
      </div>

      {open && (
        <div className="feed-detail">
          <div className="feed-detail__heading">{item.detail.heading}</div>
          <ul className="feed-detail__bullets">
            {item.detail.bullets.map((b, i) => (
              <li key={i}>
                <span>
                  {b.label}: <b>{b.value}</b>
                </span>
              </li>
            ))}
          </ul>
          {item.detail.note && (
            <p className="feed-detail__note">{item.detail.note}</p>
          )}
          <button
            className="btn btn--sm"
            onClick={() => toast(`${item.detail.actionLabel} — starting`)}
          >
            {item.detail.actionLabel}
          </button>
          <div className="feed-detail__tags">
            {item.tags.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
