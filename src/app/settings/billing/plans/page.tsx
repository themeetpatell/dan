'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHead from '@/components/PageHead';
import { toast } from '@/components/Toast';
import { Icon } from '@/lib/icons';
import { SECTION_META } from '@/lib/data';
import {
  ANNUAL_MONTHS_BILLED,
  COMPARE_GROUPS,
  FAQS,
  PLANS,
  REASSURANCE,
  type CompareValue,
  type Plan,
} from '@/lib/plans';

type Cycle = 'annual' | 'monthly';

const fmt = (n: number) => `$${n.toLocaleString('en-US')}`;

type PriceView = {
  figure: string; // headline number, e.g. '$166' or 'Custom'
  per?: string; // '/mo'
  was?: string; // strikethrough monthly, annual only
  sub: string; // cycle line under the figure
};

function priceView(plan: Plan, cycle: Cycle): PriceView {
  if (plan.monthlyPrice === null) {
    return { figure: 'Custom', sub: 'Annual contract' };
  }
  if (plan.monthlyPrice === 0) {
    return { figure: '$0', per: '/mo', sub: 'Free forever' };
  }
  const monthly = plan.monthlyPrice;
  if (cycle === 'annual') {
    const annualTotal = monthly * ANNUAL_MONTHS_BILLED;
    const effective = Math.round(annualTotal / 12);
    return {
      figure: fmt(effective),
      per: '/mo',
      was: fmt(monthly),
      sub: `${fmt(annualTotal)}/yr · 2 months free`,
    };
  }
  return { figure: fmt(monthly), per: '/mo', sub: 'Billed monthly' };
}

function PlanCta({ plan }: { plan: Plan }) {
  if (plan.isCurrent) {
    return (
      <>
        <button className="btn btn--block" disabled>
          <Icon.check size={15} />
          Current plan
        </button>
        <div className="plan-card__note">Renews automatically each period</div>
      </>
    );
  }
  const message =
    plan.monthlyPrice === null
      ? 'Connecting you with sales — we usually reply within a day'
      : plan.monthlyPrice === 0
        ? 'Switch to Free takes effect at the end of the billing period'
        : `Switching to ${plan.name} — opening secure checkout`;
  const variant = plan.isRecommended
    ? ' btn--primary'
    : plan.monthlyPrice === 0
      ? ' btn--ghost'
      : '';
  return (
    <>
      <button className={`btn btn--block${variant}`} onClick={() => toast(message)}>
        {plan.cta}
      </button>
      {plan.ctaNote && <div className="plan-card__note">{plan.ctaNote}</div>}
    </>
  );
}

function CompareCell({ value }: { value: CompareValue }) {
  if (value === true) {
    return (
      <span className="plans-table__yes" aria-label="Included">
        <Icon.check size={15} />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="plans-table__no" aria-label="Not included">
        —
      </span>
    );
  }
  return <>{value}</>;
}

export default function PlansPage() {
  const meta = SECTION_META.plans;
  const [cycle, setCycle] = useState<Cycle>('annual');

  return (
    <>
      <PageHead
        title={meta.title}
        blurb={meta.blurb}
        crumbs={[
          { label: 'Settings', href: '/settings/general' },
          { label: 'Billing', href: '/settings/billing' },
          { label: meta.title },
        ]}
      />

      <div className="stagger">
        {/* ---- Billing cycle ---- */}
        <div className="plans-toggle">
          <div className="segmented" role="radiogroup" aria-label="Billing cycle">
            {(['annual', 'monthly'] as const).map((c) => (
              <button
                key={c}
                role="radio"
                aria-checked={cycle === c}
                data-on={cycle === c}
                onClick={() => setCycle(c)}
              >
                {c === 'annual' ? 'Annual' : 'Monthly'}
                {c === 'annual' && <span className="plans-toggle__tag">2 months free</span>}
              </button>
            ))}
          </div>
        </div>

        {/* ---- Plan cards ---- */}
        <div className="plans-grid">
          {PLANS.map((plan) => {
            const price = priceView(plan, cycle);
            return (
              <section
                key={plan.id}
                className="plan-card"
                data-recommended={plan.isRecommended || undefined}
                data-current={plan.isCurrent || undefined}
              >
                <div className="plan-card__top">
                  <span className="plan-card__name">{plan.name}</span>
                  {plan.isRecommended && (
                    <span className="plan-card__flag">
                      <Icon.spark size={12} /> Recommended
                    </span>
                  )}
                  {plan.isCurrent && <span className="pill pill--live">Current</span>}
                </div>
                <div className="plan-card__pos">{plan.positioning}</div>
                <p className="plan-card__tagline">{plan.tagline}</p>

                <div className="plan-card__price">
                  {price.was && <s className="plan-card__was">{price.was}</s>}
                  <span className="plan-card__figure">{price.figure}</span>
                  {price.per && <span className="plan-card__per">{price.per}</span>}
                </div>
                <div className="plan-card__cycle">{price.sub}</div>

                <div className="plan-card__usage">
                  <Icon.gauge size={14} />
                  {plan.includedUsage}
                  {plan.bonus && <span className="plan-card__bonus">{plan.bonus}</span>}
                </div>

                <ul className="plan-card__features">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <Icon.check size={14} />
                      {f}
                    </li>
                  ))}
                </ul>

                <PlanCta plan={plan} />
              </section>
            );
          })}
        </div>

        {/* ---- Reassurance ---- */}
        <div className="plans-assure">
          <Icon.shield size={14} />
          {REASSURANCE}
        </div>

        {/* ---- How usage works ---- */}
        <section className="card">
          <div className="card__row" style={{ borderTop: 'none' }}>
            <div className="card__head-icon">
              <Icon.info size={18} />
            </div>
            <div className="card__row-main">
              <div className="card__row-title">How Dan usage works</div>
              <div className="card__row-sub">
                Every plan includes a monthly pool that covers chat, monitors, connector
                syncs, and reconciliation — metered at model cost with no markup. Past the
                pool, paid plans keep going at cost, and your caps and alerts on{' '}
                <Link href="/settings/usage" style={{ color: 'inherit', fontWeight: 600 }}>
                  Plan &amp; Usage
                </Link>{' '}
                keep spend in check.
              </div>
            </div>
          </div>
        </section>

        {/* ---- Full comparison ---- */}
        <section className="card">
          <div className="card__head">
            <div className="card__head-icon">
              <Icon.layers size={18} />
            </div>
            <div>
              <div className="card__title">Compare all features</div>
              <div className="card__desc">Everything in each plan, side by side.</div>
            </div>
          </div>
          <div className="plans-table-wrap">
            <table className="plans-table">
              <thead>
                <tr>
                  <th scope="col" aria-label="Feature" />
                  {PLANS.map((plan) => {
                    const price = priceView(plan, cycle);
                    return (
                      <th
                        scope="col"
                        key={plan.id}
                        data-recommended={plan.isRecommended || undefined}
                      >
                        <span className="plans-table__plan">{plan.name}</span>
                        <span className="plans-table__price">
                          {plan.monthlyPrice === null
                            ? 'Custom'
                            : `${price.figure}${price.per ?? ''}`}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              {COMPARE_GROUPS.map((group) => (
                <tbody key={group.title}>
                  <tr className="plans-table__group">
                    <th scope="rowgroup" colSpan={PLANS.length + 1}>
                      {group.title}
                    </th>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      {row.values.map((value, i) => (
                        <td
                          key={PLANS[i].id}
                          data-recommended={PLANS[i].isRecommended || undefined}
                        >
                          <CompareCell value={value} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </section>

        {/* ---- FAQ ---- */}
        <section className="card">
          <div className="card__head">
            <div className="card__head-icon">
              <Icon.chat size={18} />
            </div>
            <div>
              <div className="card__title">Common questions</div>
              <div className="card__desc">
                Anything else? Ask Dan in chat, or email support@dan.finance.
              </div>
            </div>
          </div>
          {FAQS.map((faq) => (
            <div key={faq.q} className="card__row">
              <div className="card__row-main">
                <div className="card__row-title">{faq.q}</div>
                <div className="card__row-sub">{faq.a}</div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
