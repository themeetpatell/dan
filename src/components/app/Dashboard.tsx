'use client';

import { useEffect, useState } from 'react';
import BarChart, { type BarDatum, type BarSeries } from './BarChart';
import {
  FINANCIAL_HEALTH,
  CASH_FLOW,
  CASH_FLOW_SERIES,
} from '@/lib/app-data';
import { Icon } from '@/lib/icons';
import { toast } from '@/components/Toast';

const HEALTH_SERIES: BarSeries[] = [
  { key: 'invoiced', label: 'invoiced revenue', color: 'var(--cat-1)' },
  { key: 'collected', label: 'cash collected', color: 'var(--cat-4)' },
  { key: 'expenses', label: 'total expenses', color: 'var(--cat-3)' },
];

const healthData: BarDatum[] = FINANCIAL_HEALTH.map((p) => ({
  label: p.week,
  values: { invoiced: p.invoiced, collected: p.collected, expenses: p.expenses },
}));

const cashData: BarDatum[] = CASH_FLOW.map((p) => ({
  label: p.week,
  values: { charge: p.charge, fee: p.fee, payout: p.payout, refund: p.refund },
}));

function Legend({ series }: { series: BarSeries[] }) {
  return (
    <div className="chart-legend">
      {series.map((s) => (
        <span key={s.key}>
          <i style={{ background: s.color }} /> {s.label}
        </span>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 750);
    return () => clearTimeout(t);
  }, []);

  const reload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 650);
  };

  return (
    <>
      <div className="artifact-title">Finanshels Org BI Dashboard</div>

      <div className="period">
        <span className="period__label">Period</span>
        <input type="date" defaultValue="2026-06-08" aria-label="Start date" />
        <span className="period__dash">–</span>
        <input type="date" defaultValue="2026-07-12" aria-label="End date" />
        <div className="period__spacer" />
        <button onClick={reload}>
          <Icon.reset size={14} /> Reset
        </button>
        <button onClick={reload}>
          <Icon.refresh size={14} /> Apply
        </button>
      </div>

      {loading ? (
        <div className="skel">
          <div className="skel-bar" style={{ width: '55%' }} />
          <div className="skel-bar" style={{ width: '80%' }} />
          <div className="skel-bar" style={{ width: '68%' }} />
        </div>
      ) : (
        <div className="stats" style={{ marginBottom: 14 }}>
          <div className="stat" style={{ ['--accent' as string]: 'var(--cat-1)' }}>
            <div className="stat__label">Invoiced (5w)</div>
            <div className="stat__value">776K</div>
            <div className="stat__sub">AED · +12% vs prior</div>
          </div>
          <div className="stat" style={{ ['--accent' as string]: 'var(--cat-4)' }}>
            <div className="stat__label">Collected (5w)</div>
            <div className="stat__value">559K</div>
            <div className="stat__sub">AED · 72% of invoiced</div>
          </div>
          <div className="stat" style={{ ['--accent' as string]: 'var(--cat-3)' }}>
            <div className="stat__label">Expenses (5w)</div>
            <div className="stat__value">360K</div>
            <div className="stat__sub">AED · −4% vs prior</div>
          </div>
        </div>
      )}

      <div className="chart-cols">
        <div className="panel">
          <div className="chart-head">
            <div>
              <div className="chart-title">Financial Health Weekly</div>
              <div className="panel__desc">
                Weekly invoiced revenue, cash collected, and total expenses trend
              </div>
            </div>
          </div>
          <BarChart
            data={healthData}
            series={HEALTH_SERIES}
            unit="AED"
            label="Financial Health Weekly bar chart"
          />
          <Legend series={HEALTH_SERIES} />
        </div>

        <div className="panel">
          <div className="chart-head">
            <div style={{ flex: 1 }}>
              <div className="chart-title">Stripe Cash Flow by Category</div>
              <div className="panel__desc">
                Weekly Stripe net cash flow broken down by charges, refunds, fees, and payouts
              </div>
            </div>
            <div className="panel__export">
              <button onClick={() => toast('PNG exported')}>
                <Icon.image size={14} /> PNG
              </button>
              <button onClick={() => toast('CSV exported')}>
                <Icon.download size={14} /> CSV
              </button>
            </div>
          </div>
          <BarChart
            data={cashData}
            series={CASH_FLOW_SERIES}
            unit="AED"
            label="Stripe Cash Flow by Category bar chart"
          />
          <Legend series={CASH_FLOW_SERIES} />
        </div>
      </div>
    </>
  );
}
