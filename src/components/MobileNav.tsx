'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@/lib/icons';

/**
 * Mobile navigation shell. On narrow viewports the persistent sidebar
 * becomes an off-canvas drawer; this renders the fixed top bar with the
 * hamburger toggle plus the dimming backdrop. Desktop hides both via CSS.
 *
 * Drawer open/closed state lives on <html data-drawer> so the sidebar
 * (a sibling in the layout grid) can react in pure CSS without prop drilling.
 */
export default function MobileNav({ title = 'Dan' }: { title?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const setDrawer = useCallback((next: boolean) => {
    setOpen(next);
    document.documentElement.dataset.drawer = next ? 'open' : 'closed';
  }, []);

  // Any route change closes the drawer — tapping a nav link navigates,
  // and we don't want the panel lingering over the new page.
  useEffect(() => {
    setDrawer(false);
  }, [pathname, setDrawer]);

  // Escape closes; also make sure we never leave the attribute stuck open
  // if this component unmounts mid-transition.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawer(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.dataset.drawer = 'closed';
    };
  }, [setDrawer]);

  return (
    <>
      <header className="mobile-topbar">
        <button
          className="mobile-topbar__menu"
          onClick={() => setDrawer(true)}
          aria-label="Open navigation"
          aria-expanded={open}
        >
          <Icon.menu size={20} />
        </button>
        <div className="mobile-topbar__brand">
          <div className="brandmark">D</div>
          <span>{title}</span>
        </div>
      </header>

      <button
        className="drawer-backdrop"
        aria-label="Close navigation"
        tabIndex={open ? 0 : -1}
        onClick={() => setDrawer(false)}
      />
    </>
  );
}
