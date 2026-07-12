'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV, MEMBERS, CONNECTORS } from '@/lib/data';
import { useDataSource } from '@/lib/first-run';
import { Icon } from '@/lib/icons';

export default function Sidebar() {
  const pathname = usePathname();
  const active = pathname.split('/')[2] ?? 'general';
  const { hasSource } = useDataSource();
  const [collapsed, setCollapsed] = useState(false);

  // Nav counts derive from the real data so the sidebar never contradicts
  // the pages it links to (connectors are 0 until a source is set up).
  const badgeFor = (slug: string): string | null => {
    if (slug === 'members') return String(MEMBERS.length);
    if (slug === 'connectors') return hasSource ? String(CONNECTORS.length) : null;
    return null;
  };

  useEffect(() => {
    setCollapsed(document.documentElement.dataset.sidebar === 'collapsed');
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    document.documentElement.dataset.sidebar = next ? 'collapsed' : 'expanded';
    localStorage.setItem('dan-collapsed', next ? '1' : '0');
  };

  return (
    <aside className="sidebar">
      <Link className="sidebar__back has-tip" href="/" aria-label="Back to workspace">
        <Icon.back size={16} />
        <span className="rail-hide">Back to workspace</span>
        <span className="tip" aria-hidden="true">Back to workspace</span>
      </Link>

      <div className="sidebar__brand">
        <div className="brandmark">D</div>
        <div className="rail-hide">
          <div className="brand__name">Company 8</div>
          <div className="brand__sub">Workspace settings</div>
        </div>
      </div>

      <nav className="nav" aria-label="Settings">
        {NAV.map((group) => (
          <div key={group.title}>
            <div className="nav__group">{group.title}</div>
            {group.items.map((item) => {
              const isActive = active === item.slug;
              const NavIcon = Icon[item.icon];
              const badge = badgeFor(item.slug);
              return (
                <Link
                  key={item.slug}
                  href={`/settings/${item.slug}`}
                  className="nav__item has-tip"
                  data-active={isActive}
                  aria-label={item.label}
                >
                  <NavIcon size={18} />
                  <span className="nav__label">{item.label}</span>
                  {badge && <span className="nav__badge">{badge}</span>}
                  <span className="tip" aria-hidden="true">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar__foot">
        <button className="btn btn--sm rail-hide" style={{ justifyContent: 'flex-start' }}>
          <Icon.slack size={16} />
          Connect Slack
        </button>

        <div className="account rail-hide">
          <div className="monogram" style={{ background: 'hsl(28 45% 55%)' }}>
            MP
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="account__name">Meet Patel</div>
            <div className="account__role">Owner</div>
          </div>
          <div className="account__actions">
            <button className="icon-btn" onClick={toggle} aria-label="Collapse sidebar">
              <Icon.panelClose size={17} />
            </button>
            <button className="icon-btn" aria-label="Settings">
              <Icon.gear size={17} />
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
          <button className="icon-btn has-tip" aria-label="Settings">
            <Icon.gear size={18} />
            <span className="tip" aria-hidden="true">Settings</span>
          </button>
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
