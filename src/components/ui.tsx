'use client';

import { Icon } from '@/lib/icons';
import { toast } from './Toast';

export function Monogram({
  text,
  hue,
  color,
}: {
  text: string;
  hue?: number;
  color?: string;
}) {
  return (
    <div
      className="monogram"
      style={{ background: color ?? `hsl(${hue ?? 30} 45% 55%)` }}
    >
      {text}
    </div>
  );
}

// Neutral letter marks — brand color is intentionally not used so tiles
// stay quiet and consistent across the platform (Claude-style restraint).
export function LogoTile({ mark }: { mark: string; color?: string }) {
  return (
    <div className="logo-tile">
      <span>{mark}</span>
    </div>
  );
}

export function StatusPill({ status }: { status: 'live' | 'syncing' | 'error' }) {
  if (status === 'live')
    return (
      <span className="pill pill--live">
        <span className="dot" /> Connected
      </span>
    );
  if (status === 'syncing')
    return (
      <span className="pill" style={{ color: 'var(--warning)' }}>
        <span className="dot" /> Syncing
      </span>
    );
  return (
    <span
      className="pill"
      style={{
        color: 'var(--danger)',
        background: 'var(--danger-bg)',
        borderColor: 'var(--danger-border)',
      }}
    >
      <span className="dot" /> Needs attention
    </span>
  );
}

export function CopyId({ value }: { value: string }) {
  return (
    <button
      className="idchip"
      onClick={() => {
        navigator.clipboard?.writeText(value);
        toast('Workspace ID copied');
      }}
    >
      <Icon.copy size={13} />
      <span className="mono">{value}</span>
    </button>
  );
}

export function Bell({ count }: { count: number }) {
  return (
    <button className="icon-btn" aria-label="Notifications" style={{ position: 'relative' }}>
      <Icon.bell size={18} />
      {count > 0 && (
        <span
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            minWidth: 15,
            height: 15,
            padding: '0 3px',
            borderRadius: 999,
            background: 'var(--danger)',
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            display: 'grid',
            placeItems: 'center',
            lineHeight: 1,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
