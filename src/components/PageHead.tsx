import Link from 'next/link';
import { Icon } from '@/lib/icons';

export type Crumb = { label: string; href?: string };

/* Single source of truth for page headers so typography and spacing
   stay identical across settings pages: breadcrumb trail (defaults to
   Settings → title so every page anchors the same way), optional entity
   icon (connect flows, detail pages), title, blurb, and an actions slot. */
export default function PageHead({
  title,
  blurb,
  icon,
  crumbs,
  actions,
}: {
  title: string;
  blurb?: string;
  icon?: React.ReactNode;
  crumbs?: Crumb[];
  actions?: React.ReactNode;
}) {
  const trail = crumbs ?? [
    { label: 'Settings', href: '/settings/general' },
    { label: title },
  ];
  return (
    <>
      {trail.length > 0 && (
        <nav className="crumb crumb--page" aria-label="Breadcrumb">
          {trail.map((c) =>
            c.href ? (
              <span className="crumb__seg" key={c.label}>
                <Link href={c.href} className="crumb__link">
                  {c.label}
                </Link>
                <Icon.chevronR size={14} />
              </span>
            ) : (
              <b key={c.label}>{c.label}</b>
            ),
          )}
        </nav>
      )}
      <div className="page-head" data-entity={icon ? 'true' : undefined}>
        {icon}
        <div className="page-head__main">
          <h1>{title}</h1>
          {blurb && <p>{blurb}</p>}
        </div>
        {actions}
      </div>
    </>
  );
}
