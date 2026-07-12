'use client';

import { useState } from 'react';

export interface BarSeries {
  key: string;
  label: string;
  color: string;
}

export interface BarDatum {
  label: string;
  values: Record<string, number>;
}

interface BarChartProps {
  data: BarDatum[];
  series: BarSeries[];
  unit?: string;
  height?: number;
  label?: string;
}

/** Round to a "nice" number for axis bounds (1/2/5 * 10^n). */
function niceNum(value: number): number {
  if (value === 0) return 0;
  const exp = Math.floor(Math.log10(Math.abs(value)));
  const frac = Math.abs(value) / 10 ** exp;
  const niceFrac = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10;
  return Math.sign(value) * niceFrac * 10 ** exp;
}

const W = 540;
const PAD = { left: 46, right: 14, top: 14, bottom: 42 };

export default function BarChart({ data, series, unit, height = 260, label }: BarChartProps) {
  const [hover, setHover] = useState<{
    x: number;
    y: number;
    label: string;
    value: number;
    color: string;
    group: string;
  } | null>(null);

  const H = height;
  const px0 = PAD.left;
  const px1 = W - PAD.right;
  const py0 = PAD.top;
  const py1 = H - PAD.bottom;

  const allValues = data.flatMap((d) => series.map((s) => d.values[s.key] ?? 0));
  const rawMax = Math.max(0, ...allValues);
  const rawMin = Math.min(0, ...allValues);
  const top = niceNum(rawMax) || 1;
  const bottom = rawMin < 0 ? -niceNum(-rawMin) : 0;

  const yScale = (v: number) => py1 - ((v - bottom) / (top - bottom)) * (py1 - py0);
  const zeroY = yScale(0);

  const ticks: number[] = [];
  const tickCount = 4;
  for (let i = 0; i <= tickCount; i++) {
    ticks.push(bottom + ((top - bottom) * i) / tickCount);
  }

  const groupW = (px1 - px0) / data.length;
  const bandW = groupW * 0.66;
  const barW = bandW / series.length;

  const fmt = (v: number) => {
    const rounded = Math.round(v);
    return `${rounded}K`;
  };

  return (
    <div className="chart-wrap">
      <svg
        className="chart-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={label ?? 'Bar chart'}
        onMouseLeave={() => setHover(null)}
      >
        {unit && (
          <text className="bar-axis" x={px0 - 40} y={py0 + 2}>
            {unit}
          </text>
        )}

        {/* gridlines + y labels */}
        {ticks.map((t, i) => {
          const y = yScale(t);
          return (
            <g key={i}>
              <line className="grid-line" x1={px0} x2={px1} y1={y} y2={y} />
              <text className="bar-axis" x={px0 - 8} y={y + 3} textAnchor="end">
                {fmt(t)}
              </text>
            </g>
          );
        })}

        {/* zero baseline */}
        <line className="bar-baseline" x1={px0} x2={px1} y1={zeroY} y2={zeroY} />

        {/* bars */}
        {data.map((d, gi) => {
          const gx = px0 + gi * groupW + (groupW - bandW) / 2;
          return (
            <g key={d.label}>
              {series.map((s, si) => {
                const v = d.values[s.key] ?? 0;
                const bx = gx + si * barW;
                const vy = yScale(v);
                const y = v >= 0 ? vy : zeroY;
                const h = Math.abs(vy - zeroY);
                return (
                  <rect
                    key={s.key}
                    className="bar"
                    x={bx + 1}
                    y={y}
                    width={Math.max(barW - 2, 1)}
                    height={Math.max(h, 0.5)}
                    rx={2}
                    fill={s.color}
                    onMouseEnter={() =>
                      setHover({
                        x: (bx + barW / 2) * (100 / W),
                        y: Math.min(y, zeroY),
                        label: s.label,
                        value: v,
                        color: s.color,
                        group: d.label,
                      })
                    }
                  />
                );
              })}
            </g>
          );
        })}

        {/* x labels (rotated) */}
        {data.map((d, gi) => {
          const cx = px0 + gi * groupW + groupW / 2;
          return (
            <text
              key={d.label}
              className="bar-axis"
              x={cx}
              y={py1 + 16}
              textAnchor="end"
              transform={`rotate(-32 ${cx} ${py1 + 16})`}
            >
              {d.label}
            </text>
          );
        })}
      </svg>

      {hover && (
        <div
          className="chart-tip"
          data-show="true"
          /* both axes as % of the viewBox so the tip tracks the
             rendered (scaled) size, not raw viewBox units */
          style={{ left: `${hover.x}%`, top: `${(hover.y / H) * 100}%` }}
        >
          <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 3 }}>{hover.group}</div>
          <div className="tip-row">
            <i style={{ background: hover.color }} />
            {hover.label}: {fmt(hover.value)} {unit ?? ''}
          </div>
        </div>
      )}
    </div>
  );
}
