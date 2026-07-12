'use client';

import { useId, useState } from 'react';

const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`;
const fmtFull = (n: number) => n.toLocaleString('en-US');

export type Series = { input: number; output: number; label: string };

const W = 640;
const H = 232;
/* Left gutter holds the y-axis labels so they never collide with the plot. */
const PAD = { l: 46, r: 10, t: 10, b: 24 };

type Pt = { x: number; y: number };

/* Monotone cubic interpolation (Fritsch–Carlson) — smooth without the
   overshoot a Catmull-Rom spline would add around spikes. */
function smoothPath(pts: Pt[]): string {
  const n = pts.length;
  if (n < 3) return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const dx = Array.from({ length: n - 1 }, (_, i) => pts[i + 1].x - pts[i].x);
  const slope = Array.from({ length: n - 1 }, (_, i) => (pts[i + 1].y - pts[i].y) / dx[i]);
  const tan = [slope[0], ...slope.slice(0, -1).map((m, i) => (m * slope[i + 1] > 0 ? (m + slope[i + 1]) / 2 : 0)), slope[n - 2]];

  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      tan[i] = 0;
      tan[i + 1] = 0;
      continue;
    }
    const a = tan[i] / slope[i];
    const b = tan[i + 1] / slope[i];
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      tan[i] = t * a * slope[i];
      tan[i + 1] = t * b * slope[i];
    }
  }

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const third = dx[i] / 3;
    d += ` C ${pts[i].x + third} ${pts[i].y + tan[i] * third}, ${pts[i + 1].x - third} ${
      pts[i + 1].y - tan[i + 1] * third
    }, ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  return d;
}

export function LineChart({ data }: { data: Series[] }) {
  const gradId = useId();
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.flatMap((d) => [d.input, d.output]), 1);
  const niceMax = Math.ceil(max / 5_000_000) * 5_000_000 || max;

  const iw = W - PAD.l - PAD.r;
  const ih = H - PAD.t - PAD.b;
  const x = (i: number) => PAD.l + (iw * i) / Math.max(data.length - 1, 1);
  const y = (v: number) => PAD.t + ih - (ih * v) / niceMax;
  const baseline = PAD.t + ih;

  const pts = (key: 'input' | 'output') => data.map((d, i) => ({ x: x(i), y: y(d[key]) }));
  const inputLine = smoothPath(pts('input'));
  const outputLine = smoothPath(pts('output'));
  const inputArea = `${inputLine} L ${x(data.length - 1)} ${baseline} L ${x(0)} ${baseline} Z`;

  const ticks = 5;
  const gridVals = Array.from({ length: ticks + 1 }, (_, i) => (niceMax * i) / ticks);
  const xEvery = Math.ceil(data.length / 7);

  return (
    <div
      className="chart-wrap"
      onMouseLeave={() => setHover(null)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const rx = ((e.clientX - rect.left) / rect.width) * W;
        const idx = Math.round(((rx - PAD.l) / iw) * (data.length - 1));
        setHover(Math.max(0, Math.min(data.length - 1, idx)));
      }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" role="img" aria-label="Token usage over time">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--series-input)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--series-input)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {gridVals.map((v, i) => (
          <g key={i}>
            <line className="grid-line" x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} />
            <text className="axis-label" x={PAD.l - 8} y={y(v)} dy="3.5" textAnchor="end">
              {fmt(v)}
            </text>
          </g>
        ))}
        {data.map((d, i) =>
          i % xEvery === 0 || i === data.length - 1 ? (
            <text
              key={i}
              className="axis-label"
              x={x(i)}
              y={H - 6}
              textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'}
            >
              {d.label}
            </text>
          ) : null
        )}

        <path d={inputArea} fill={`url(#${gradId})`} />
        <path d={inputLine} className="series-input" fill="none" strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
        <path d={outputLine} className="series-output" fill="none" strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />

        {hover !== null && (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={PAD.t}
            y2={baseline}
            stroke="var(--text-faint)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        )}
        {hover !== null &&
          (['input', 'output'] as const).map((k) => (
            <circle
              key={k}
              className="chart-dot"
              cx={x(hover)}
              cy={y(data[hover][k])}
              r={4}
              fill="var(--card)"
              stroke={`var(--series-${k})`}
              strokeWidth={1.75}
            />
          ))}
      </svg>

      {hover !== null && (
        <div
          className="chart-tip"
          data-show="true"
          style={{
            left: `${(x(hover) / W) * 100}%`,
            top: `${(y(Math.max(data[hover].input, data[hover].output)) / H) * 100}%`,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 5 }}>{data[hover].label}</div>
          <div className="tip-row">
            <i style={{ background: 'var(--series-input)' }} /> Input {fmtFull(data[hover].input)}
          </div>
          <div className="tip-row">
            <i style={{ background: 'var(--series-output)' }} /> Output {fmtFull(data[hover].output)}
          </div>
        </div>
      )}
    </div>
  );
}

/* Horizontal bars — with heavily skewed usage data, vertical bars collapse
   into slivers. Rows with inline values stay readable at any ratio. */
export function BarChart({ data, label }: { data: Series[]; label: string }) {
  const max = Math.max(...data.flatMap((d) => [d.input, d.output]), 1);

  return (
    <div className="hbars" role="img" aria-label={label}>
      {data.map((d) => (
        <div className="hbar" key={d.label}>
          <div className="hbar__label" title={d.label}>
            {d.label}
          </div>
          <div className="hbar__tracks">
            <div className="hbar__row">
              <div className="hbar__track">
                <div
                  className="hbar__fill"
                  style={{ width: `${Math.max((d.input / max) * 100, 0.75)}%`, background: 'var(--series-input)' }}
                />
              </div>
              <span className="hbar__value">{fmt(d.input)}</span>
            </div>
            <div className="hbar__row">
              <div className="hbar__track">
                <div
                  className="hbar__fill"
                  style={{ width: `${Math.max((d.output / max) * 100, 0.75)}%`, background: 'var(--series-output)' }}
                />
              </div>
              <span className="hbar__value">{fmt(d.output)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Legend() {
  return (
    <div className="legend">
      <span>
        <i style={{ background: 'var(--series-input)' }} /> Input
      </span>
      <span>
        <i style={{ background: 'var(--series-output)' }} /> Output
      </span>
    </div>
  );
}
