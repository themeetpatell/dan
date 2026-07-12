import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 18, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

export const Icon = {
  general: (p: P) => (
    <Base {...p}>
      <path d="M4 7h10M4 12h16M4 17h7" />
      <circle cx="18" cy="7" r="2" />
      <circle cx="13" cy="17" r="2" />
    </Base>
  ),
  members: (p: P) => (
    <Base {...p}>
      <path d="M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1" />
      <circle cx="9.5" cy="8" r="3" />
      <path d="M21 19v-1a4 4 0 0 0-3-3.87M16 5.1A3 3 0 0 1 16 11" />
    </Base>
  ),
  connectors: (p: P) => (
    <Base {...p}>
      <path d="M9 15 15 9" />
      <path d="M10.5 4.5 12 3a4.24 4.24 0 0 1 6 6l-1.5 1.5" />
      <path d="M13.5 19.5 12 21a4.24 4.24 0 0 1-6-6l1.5-1.5" />
    </Base>
  ),
  workflows: (p: P) => (
    <Base {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <path d="M10 6.5h4a3 3 0 0 1 3 3V14" />
    </Base>
  ),
  llm: (p: P) => (
    <Base {...p}>
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </Base>
  ),
  logs: (p: P) => (
    <Base {...p}>
      <path d="M8 6h12M8 12h12M8 18h12" />
      <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
    </Base>
  ),
  slack: (p: P) => (
    <Base {...p}>
      <path d="M9 3a1.8 1.8 0 1 0 0 3.6h1.8V4.8A1.8 1.8 0 0 0 9 3Z" />
      <path d="M14 9a1.8 1.8 0 1 0 3.6 0V7.2A1.8 1.8 0 1 0 14 7.2V9Z" />
      <path d="M15 21a1.8 1.8 0 1 0 0-3.6h-1.8v1.8A1.8 1.8 0 0 0 15 21Z" />
      <path d="M10 15a1.8 1.8 0 1 0-3.6 0v1.8A1.8 1.8 0 1 0 10 16.8V15Z" />
    </Base>
  ),
  back: (p: P) => (
    <Base {...p}>
      <path d="M15 6 9 12l6 6" />
    </Base>
  ),
  chevronR: (p: P) => (
    <Base {...p}>
      <path d="M9 6l6 6-6 6" />
    </Base>
  ),
  chevronD: (p: P) => (
    <Base {...p}>
      <path d="M6 9l6 6 6-6" />
    </Base>
  ),
  search: (p: P) => (
    <Base {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Base>
  ),
  copy: (p: P) => (
    <Base {...p}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2" />
    </Base>
  ),
  check: (p: P) => (
    <Base {...p}>
      <path d="M20 6 9 17l-5-5" />
    </Base>
  ),
  download: (p: P) => (
    <Base {...p}>
      <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </Base>
  ),
  trash: (p: P) => (
    <Base {...p}>
      <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7" />
    </Base>
  ),
  plus: (p: P) => (
    <Base {...p}>
      <path d="M12 5v14M5 12h14" />
    </Base>
  ),
  system: (p: P) => (
    <Base {...p}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </Base>
  ),
  sun: (p: P) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
    </Base>
  ),
  moon: (p: P) => (
    <Base {...p}>
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </Base>
  ),
  bell: (p: P) => (
    <Base {...p}>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
      <path d="M10.5 20a1.9 1.9 0 0 0 3 0" />
    </Base>
  ),
  gauge: (p: P) => (
    <Base {...p}>
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </Base>
  ),
  gear: (p: P) => (
    <Base {...p}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" />
      <circle cx="12" cy="12" r="3" />
    </Base>
  ),
  panelOpen: (p: P) => (
    <Base {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
      <path d="m14 9 3 3-3 3" />
    </Base>
  ),
  panelClose: (p: P) => (
    <Base {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
      <path d="m17 15-3-3 3-3" />
    </Base>
  ),
  logout: (p: P) => (
    <Base {...p}>
      <path d="M15 12H3m0 0 4-4m-4 4 4 4" />
      <path d="M9 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-2" />
    </Base>
  ),
  sidebarToggle: (p: P) => (
    <Base {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </Base>
  ),
  spark: (p: P) => (
    // Four-point sparkle — a concave star, not the plus-shaped glyph that read
    // as a "+" at chip sizes (M7). Single closed path so it scales cleanly.
    <Base {...p}>
      <path d="M12 2.5c.6 4.6 1.9 5.9 6.5 6.5-4.6.6-5.9 1.9-6.5 6.5-.6-4.6-1.9-5.9-6.5-6.5 4.6-.6 5.9-1.9 6.5-6.5Z" />
      <path d="M18.5 15.5c.3 2 .8 2.5 2.5 2.8-1.7.3-2.2.8-2.5 2.7-.3-1.9-.8-2.4-2.5-2.7 1.7-.3 2.2-.8 2.5-2.8Z" />
    </Base>
  ),
  key: (p: P) => (
    <Base {...p}>
      <circle cx="7.5" cy="15.5" r="3.5" />
      <path d="M10 13 20 3m-3 0 3 3m-6 0 2.5 2.5" />
    </Base>
  ),
  calendar: (p: P) => (
    <Base {...p}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </Base>
  ),
  filter: (p: P) => (
    <Base {...p}>
      <path d="M4 5h16l-6 8v5l-4 2v-7Z" />
    </Base>
  ),
  external: (p: P) => (
    <Base {...p}>
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </Base>
  ),
  building: (p: P) => (
    <Base {...p}>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01M10 21v-3h4v3" />
    </Base>
  ),
  activity: (p: P) => (
    <Base {...p}>
      <path d="M3 12h4l3 8 4-16 3 8h4" />
    </Base>
  ),
  newChat: (p: P) => (
    <Base {...p}>
      <path d="M8 12h8M12 8v8" />
      <path d="M21 12a9 9 0 1 1-4-7.5" />
    </Base>
  ),
  artifacts: (p: P) => (
    <Base {...p}>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" />
      <path d="M12 12v9" />
    </Base>
  ),
  send: (p: P) => (
    <Base {...p}>
      <path d="M4 12 20 4l-6 16-3-7-7-1Z" />
    </Base>
  ),
  paperclip: (p: P) => (
    <Base {...p}>
      <path d="M21 11.5 12.5 20a5 5 0 0 1-7-7l8-8a3.3 3.3 0 0 1 4.7 4.7l-8 8a1.7 1.7 0 0 1-2.4-2.4l7.3-7.3" />
    </Base>
  ),
  bookmark: (p: P) => (
    <Base {...p}>
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
    </Base>
  ),
  present: (p: P) => (
    <Base {...p}>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M12 16v4M8 20h8" />
    </Base>
  ),
  reset: (p: P) => (
    <Base {...p}>
      <path d="M4 4v5h5" />
      <path d="M4 9a8 8 0 1 1-1.5 5" />
    </Base>
  ),
  refresh: (p: P) => (
    <Base {...p}>
      <path d="M21 12a9 9 0 1 1-2.6-6.3M21 4v4h-4" />
    </Base>
  ),
  grid: (p: P) => (
    <Base {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1.4" />
      <rect x="14" y="3" width="7" height="7" rx="1.4" />
      <rect x="3" y="14" width="7" height="7" rx="1.4" />
      <rect x="14" y="14" width="7" height="7" rx="1.4" />
    </Base>
  ),
  expand: (p: P) => (
    <Base {...p}>
      <path d="M9 3H5a2 2 0 0 0-2 2v4M15 3h4a2 2 0 0 1 2 2v4M21 15v4a2 2 0 0 1-2 2h-4M3 15v4a2 2 0 0 0 2 2h4" />
    </Base>
  ),
  close: (p: P) => (
    <Base {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Base>
  ),
  layers: (p: P) => (
    <Base {...p}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </Base>
  ),
  info: (p: P) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.5h.01" />
    </Base>
  ),
  brain: (p: P) => (
    <Base {...p}>
      <path d="M9 4a2.5 2.5 0 0 0-2.5 2.5A2.5 2.5 0 0 0 4 9v.5A2.5 2.5 0 0 0 5 14a2.5 2.5 0 0 0 2 4 2.5 2.5 0 0 0 2 2V4Z" />
      <path d="M15 4a2.5 2.5 0 0 1 2.5 2.5A2.5 2.5 0 0 1 20 9v.5a2.5 2.5 0 0 1-1 4.5 2.5 2.5 0 0 1-2 4 2.5 2.5 0 0 1-2 2V4Z" />
    </Base>
  ),
  chevronU: (p: P) => (
    <Base {...p}>
      <path d="M6 15l6-6 6 6" />
    </Base>
  ),
  fileText: (p: P) => (
    <Base {...p}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </Base>
  ),
  image: (p: P) => (
    <Base {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m4 17 5-5 4 4 3-3 4 4" />
    </Base>
  ),
  clock: (p: P) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Base>
  ),
  zap: (p: P) => (
    <Base {...p}>
      <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" />
    </Base>
  ),
  alert: (p: P) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4.5M12 16h.01" />
    </Base>
  ),
  play: (p: P) => (
    <Base {...p}>
      <path d="m8 5 11 7-11 7V5Z" />
    </Base>
  ),
  shield: (p: P) => (
    <Base {...p}>
      <path d="M12 3 5 5.8v5.4c0 4.6 3 7.9 7 9.8 4-1.9 7-5.2 7-9.8V5.8L12 3Z" />
    </Base>
  ),
  chat: (p: P) => (
    <Base {...p}>
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.2 0-2.35-.25-3.4-.7L4 21l1.7-5.1a8.5 8.5 0 1 1 15.3-4.4Z" />
    </Base>
  ),
  card: (p: P) => (
    <Base {...p}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3 10h18" />
      <path d="M7 14.5h4" />
    </Base>
  ),
};

export type IconName = keyof typeof Icon;
