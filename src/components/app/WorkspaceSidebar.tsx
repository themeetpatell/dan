'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { APP_NAV, RECENT_CHATS } from '@/lib/app-data';
import { useDataSource } from '@/lib/first-run';
import { Icon } from '@/lib/icons';
import { toast } from '@/components/Toast';
import NotificationsFlyout from './NotificationsFlyout';

export default function WorkspaceSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, source } = useDataSource();
  const [activeRecent, setActiveRecent] = useState<string | null>(null);
  const [recents, setRecents] = useState(RECENT_CHATS);
  const [collapsed, setCollapsed] = useState(false);

  /* Sample chat history ships with demo data only. */
  const showRecents = ready && source === 'demo' && recents.length > 0;

  useEffect(() => {
    setCollapsed(document.documentElement.dataset.sidebar === 'collapsed');
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    document.documentElement.dataset.sidebar = next ? 'collapsed' : 'expanded';
    localStorage.setItem('dan-collapsed', next ? '1' : '0');
  };

  const isNavActive = (slug: string, href: string) => {
    if (slug === 'new') return pathname === '/';
    return pathname.startsWith(href);
  };

  const openRecent = (id: string) => {
    setActiveRecent(id);
    router.push(`/chat?c=${id}`);
  };

  const deleteRecent = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setRecents((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <aside className="sidebar">
      <div className="ws-brand">
        <div className="brandmark">D</div>
        <div className="ws-brand__name rail-hide">Company 8</div>
      </div>

      <nav className="nav" aria-label="Workspace">
        <div>
          <div className="nav__group">Workspace</div>
          {APP_NAV.map((item) => {
            const NavIcon = Icon[item.icon];
            return (
              <Link
                key={item.slug}
                href={item.href}
                className="nav__item has-tip"
                data-active={isNavActive(item.slug, item.href)}
                onClick={() => setActiveRecent(null)}
                aria-label={item.label}
              >
                <NavIcon size={18} />
                <span className="nav__label">{item.label}</span>
                <span className="tip" aria-hidden="true">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {showRecents && (
        <div className="rail-hide">
          <div className="nav__group">Recent</div>
          {recents.map((chat) => (
            <div
              key={chat.id}
              className="recent-item"
              data-active={activeRecent === chat.id}
              onClick={() => openRecent(chat.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openRecent(chat.id)}
            >
              <Icon.chat size={16} />
              <span className="recent-item__label">{chat.title}</span>
              <button
                className="recent-item__del"
                onClick={(e) => deleteRecent(e, chat.id)}
                aria-label={`Delete ${chat.title}`}
              >
                <Icon.trash size={14} />
              </button>
            </div>
          ))}
        </div>
        )}
      </nav>

      <div className="sidebar__foot">
        <button
          className="foot-row rail-hide"
          onClick={() => toast('Slack connect flow — configure in Settings › Slack')}
        >
          <Icon.slack size={16} />
          <span className="foot-row__label">Connect Slack</span>
        </button>

        <div className="rail-hide">
          <NotificationsFlyout />
        </div>

        <div className="account rail-hide">
          <div className="monogram" style={{ background: 'hsl(28 45% 55%)' }}>
            MP
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="account__name">Meet Patel</div>
            <div className="account__role">Owner</div>
          </div>
          <div className="account__actions">
            <Link className="icon-btn" href="/settings/general" aria-label="Settings">
              <Icon.gear size={17} />
            </Link>
            <button className="icon-btn" onClick={toggle} aria-label="Collapse sidebar">
              <Icon.panelClose size={17} />
            </button>
            <button className="icon-btn" aria-label="Sign out">
              <Icon.logout size={17} />
            </button>
          </div>
        </div>

        {/* Collapsed icon stack */}
        <div className="rail-stack rail-only">
          <div className="monogram has-tip" style={{ background: 'hsl(28 45% 55%)' }}>
            MP
            <span className="tip" aria-hidden="true">Meet Patel · Owner</span>
          </div>
          <NotificationsFlyout variant="rail" />
          <Link className="icon-btn has-tip" href="/settings/general" aria-label="Settings">
            <Icon.gear size={18} />
            <span className="tip" aria-hidden="true">Settings</span>
          </Link>
          <button className="icon-btn has-tip" onClick={toggle} aria-label="Expand sidebar">
            <Icon.panelOpen size={18} />
            <span className="tip" aria-hidden="true">Expand</span>
          </button>
          <button className="icon-btn has-tip" aria-label="Sign out">
            <Icon.logout size={18} />
            <span className="tip" aria-hidden="true">Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
