'use client';

import { useEffect, useState } from 'react';
import { NOTIFICATIONS } from '@/lib/app-data';
import { useDataSource } from '@/lib/first-run';
import { Icon } from '@/lib/icons';
import { Bell } from './ui';

type Theme = 'system' | 'light' | 'dark';

function applyTheme(t: Theme) {
  const dark =
    t === 'dark' ||
    (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme-pref', t);
  localStorage.setItem('dan-theme', t);
  window.dispatchEvent(new CustomEvent('dan-theme', { detail: t }));
}

export default function TopBar() {
  const [theme, setTheme] = useState<Theme>('system');
  const { ready, source } = useDataSource();
  useEffect(() => {
    setTheme((localStorage.getItem('dan-theme') as Theme) || 'system');
  }, []);

  // Same store the workspace flyout reads — sample notifications exist only
  // with demo data, so the badge is 0 on a clean workspace (was hardcoded 74).
  const unread =
    ready && source === 'demo' ? NOTIFICATIONS.filter((n) => n.unread).length : 0;

  const cycle = () => {
    const order: Theme[] = ['system', 'light', 'dark'];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    applyTheme(next);
  };

  const ThemeIcon = theme === 'dark' ? Icon.moon : theme === 'light' ? Icon.sun : Icon.system;

  // Breadcrumbs live in each page's PageHead so they sit at the same
  // position on every route — the topbar is controls only.
  return (
    <div className="topbar">
      <div className="spacer" />
      <div className="input-wrap" style={{ maxWidth: 240 }}>
        <Icon.search size={16} />
        <input className="input" style={{ height: 38 }} placeholder="Search settings…" />
      </div>
      <button className="icon-btn" onClick={cycle} aria-label={`Theme: ${theme}`} title={`Theme: ${theme}`}>
        <ThemeIcon size={18} />
      </button>
      <Bell count={unread} />
    </div>
  );
}
