'use client';

import { useEffect, useRef, useState } from 'react';
import { NOTIFICATIONS, type Notification } from '@/lib/app-data';
import { useDataSource } from '@/lib/first-run';
import { Icon } from '@/lib/icons';

export default function NotificationsFlyout({
  variant = 'row',
}: {
  variant?: 'row' | 'rail';
}) {
  const { ready, source } = useDataSource();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>(NOTIFICATIONS);
  const anchorRef = useRef<HTMLDivElement>(null);

  /* Sample notifications ship with demo data only. */
  const visible = ready && source === 'demo' ? items : [];
  const unread = visible.filter((n) => n.unread).length;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  const readOne = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  return (
    <div className="notif-anchor" ref={anchorRef}>
      {variant === 'rail' ? (
        <button
          className="icon-btn has-tip notif-rail-btn"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
        >
          <Icon.bell size={18} />
          {unread > 0 && <span className="notif-rail-dot" />}
          <span className="tip">Notifications</span>
        </button>
      ) : (
        <button
          className="foot-row"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <Icon.bell size={17} />
          <span className="foot-row__label">Notifications</span>
          {unread > 0 && <span className="foot-row__count">{unread}</span>}
        </button>
      )}

      {open && (
        <div className="notif-pop" role="dialog" aria-label="Notifications">
          <div className="notif-head">
            <b>Notifications</b>
            {visible.length > 0 && <button onClick={markAllRead}>Mark all read</button>}
          </div>
          <div className="notif-list">
            {visible.length === 0 && (
              <div className="notif-empty">
                Nothing yet — Dan will notify you when something needs a look.
              </div>
            )}
            {visible.map((n) => (
              <div
                key={n.id}
                className="notif-item"
                data-unread={n.unread}
                onClick={() => readOne(n.id)}
              >
                <span className="notif-dot" />
                <div>
                  <div className="notif-item__title">{n.title}</div>
                  <div className="notif-item__time">{n.timeAgo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
