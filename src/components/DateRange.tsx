'use client';

import { useState } from 'react';
import { Icon } from '@/lib/icons';

type Preset = 'All' | '24h' | '7d' | '30d' | 'custom';

const PRESETS: Exclude<Preset, 'custom'>[] = ['All', '24h', '7d', '30d'];
const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;

function fmtDateTime(d: Date): string {
  const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const time = d
    .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    .toLowerCase();
  return `${date}, ${time}`;
}

function fmtDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function presetLabel(preset: Preset, from: string, to: string): string {
  if (preset === 'custom' && from && to) return `${fmtDate(from)} — ${fmtDate(to)}`;
  if (preset === 'All') return 'All time';
  const now = new Date();
  const spans: Record<string, number> = { '24h': DAY_MS, '7d': 7 * DAY_MS, '30d': 30 * DAY_MS };
  const start = new Date(now.getTime() - spans[preset]);
  return `${fmtDateTime(start)} — ${fmtDateTime(now)}`;
}

export default function DateRange() {
  const [preset, setPreset] = useState<Preset>('30d');
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  // Applied custom range (drafts above only commit on Apply).
  const [applied, setApplied] = useState<{ from: string; to: string }>({ from: '', to: '' });

  const canApply = from.length > 0 && to.length > 0 && from <= to;

  const apply = () => {
    setApplied({ from, to });
    setPreset('custom');
    setOpen(false);
  };

  return (
    <>
      <div className="range-seg">
        {PRESETS.map((r) => (
          <button key={r} data-on={preset === r} onClick={() => setPreset(r)}>
            {r}
          </button>
        ))}
      </div>
      <div className="control-div" />
      <div className="date-pop-wrap">
        <button
          className="date-btn"
          data-on={preset === 'custom'}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <Icon.calendar size={15} />
          {presetLabel(preset, applied.from, applied.to)}
          <Icon.chevronD size={14} />
        </button>

        {open && (
          <>
            <div className="pop-backdrop" onClick={() => setOpen(false)} />
            <div className="popover" role="dialog" aria-label="Custom date range">
              <div className="popover__fields">
                <div>
                  <label className="label" htmlFor="dr-from">
                    From
                  </label>
                  <input
                    id="dr-from"
                    type="date"
                    className="input"
                    value={from}
                    max={to || undefined}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="dr-to">
                    To
                  </label>
                  <input
                    id="dr-to"
                    type="date"
                    className="input"
                    value={to}
                    min={from || undefined}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </div>
              </div>
              <div className="popover__actions">
                <button className="btn" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button className="btn btn--primary" disabled={!canApply} onClick={apply}>
                  Apply
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
