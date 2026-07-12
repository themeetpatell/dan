'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHead from '@/components/PageHead';
import { Monogram } from '@/components/ui';
import { toast } from '@/components/Toast';
import { Icon } from '@/lib/icons';
import { SECTION_META } from '@/lib/data';

/* ------------------------------------------------------------------
   Demo billing data — July 2026, day 13 of 31. Everything derives
   from these constants so the story stays internally consistent.
   ------------------------------------------------------------------ */
const CAP = 50;
const PLAN_NAME = 'Growth';
const INCLUDED_USAGE = 230;
const DAYS_IN_PERIOD = 31;
const DAY_OF_PERIOD = 13;
const ALERT_PCT = 80;

const SEGMENTS = [
  { key: 'chat', label: 'Chat', spend: 18.62, color: 'var(--use-chat)' },
  { key: 'wf', label: 'Workflows', spend: 8.55, color: 'var(--use-wf)' },
  { key: 'conn', label: 'Connector syncs', spend: 2.94, color: 'var(--use-conn)' },
];

const DAILY = [1.42, 2.18, 1.05, 0.66, 2.84, 3.1, 1.92, 2.46, 1.38, 0.92, 3.65, 4.21, 4.32];

const BY_MODEL = [
  { mark: 'A', model: 'opus-4-6', provider: 'Anthropic', tokens: '41.2M in · 2.8M out', spend: 16.4 },
  { mark: 'K', model: 'kimi-k2-6', provider: 'Moonshot', tokens: '30.6M in · 1.9M out', spend: 8.94 },
  { mark: 'A', model: 'haiku-4-5', provider: 'Anthropic', tokens: '22.4M in · 1.1M out', spend: 3.29 },
  { mark: 'O', model: 'gpt-5-mini', provider: 'OpenAI', tokens: '9.8M in · 0.4M out', spend: 1.48 },
];

const BY_MEMBER = [
  { name: 'Meet Patel', initials: 'MP', hue: 28, sessions: 34, spend: 21.63 },
  { name: 'Ashish Tripathi', initials: 'AT', hue: 210, sessions: 11, spend: 8.48 },
];

const usd = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function UsagePage() {
  const meta = SECTION_META.usage;
  const [cap, setCap] = useState(String(CAP));
  const [savedCap, setSavedCap] = useState(String(CAP));
  const [threshold, setThreshold] = useState(ALERT_PCT);
  const [hardStop, setHardStop] = useState(false);

  const spent = SEGMENTS.reduce((sum, s) => sum + s.spend, 0);
  const perDay = spent / DAY_OF_PERIOD;
  const projected = perDay * DAYS_IN_PERIOD;
  const daysToCap = Math.ceil((CAP - spent) / perDay);
  const capDate = `Jul ${DAY_OF_PERIOD + daysToCap}`;
  const evenPace = CAP / DAYS_IN_PERIOD;
  const maxDaily = Math.max(...DAILY);
  const capDirty = cap !== savedCap && Number(cap) > 0;

  return (
    <>
      <PageHead title={meta.title} blurb={meta.blurb} />

      <div className="stagger">
        {/* ---- This billing period ---- */}
        <section className="card">
          <div className="card__head">
            <div className="card__head-icon">
              <Icon.gauge size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="card__title">This billing period</div>
              <div className="card__desc">
                Jul 1 – Jul 31 · resets in {DAYS_IN_PERIOD - DAY_OF_PERIOD} days
              </div>
            </div>
            <Link href="/settings/billing/plans" className="plan-chip plan-chip--link">
              <Icon.spark size={13} /> {PLAN_NAME} · {usd(INCLUDED_USAGE)}/mo included
              <span className="plan-chip__cta">Manage plan</span>
            </Link>
          </div>
          <div className="card__body">
            <div className="spend">
              <div className="spend__figure">
                <span className="spend__now">{usd(spent)}</span>
                <span className="spend__of">of {usd(CAP)}</span>
              </div>
              <div className="spend__stats">
                <div className="spend__stat">
                  <span>Avg / day</span>
                  <b>{usd(perDay)}</b>
                </div>
                <div className="spend__stat">
                  <span>Remaining</span>
                  <b>{usd(CAP - spent)}</b>
                </div>
                <div className="spend__stat">
                  <span>Projected</span>
                  <b className="is-warn">{usd(projected)}</b>
                </div>
              </div>
            </div>

            <div
              className="meter"
              role="img"
              aria-label={`${usd(spent)} of ${usd(CAP)} spent: ${SEGMENTS.map(
                (s) => `${s.label} ${usd(s.spend)}`
              ).join(', ')}. Alert set at ${threshold}%.`}
            >
              <div className="meter__track">
                {SEGMENTS.map((s) => (
                  <div
                    key={s.key}
                    className="meter__seg"
                    title={`${s.label} — ${usd(s.spend)}`}
                    style={{ width: `${(s.spend / CAP) * 100}%`, background: s.color }}
                  />
                ))}
              </div>
              <div className="meter__tick" style={{ left: `${threshold}%` }}>
                <span>{threshold}% alert</span>
              </div>
            </div>

            <div className="meter__legend">
              {SEGMENTS.map((s) => (
                <span key={s.key} className="meter__key">
                  <i style={{ background: s.color }} />
                  {s.label}
                  <b>{usd(s.spend)}</b>
                  <em>{Math.round((s.spend / spent) * 100)}%</em>
                </span>
              ))}
            </div>

            <div className="pace-note">
              <Icon.alert size={15} />
              <span>
                Spend is running ahead of pace — at the current rate the {usd(CAP)} cap is
                reached around <b>{capDate}</b>.
              </span>
              <Link href="/settings/billing/plans" className="pace-note__act">
                Upgrade plan
              </Link>
              <button
                className="pace-note__act"
                onClick={() =>
                  document.getElementById('cap-input')?.focus()
                }
              >
                Adjust cap
              </button>
            </div>
          </div>
        </section>

        {/* ---- Daily spend ---- */}
        <section className="card">
          <div className="card__head">
            <div className="card__head-icon">
              <Icon.activity size={18} />
            </div>
            <div>
              <div className="card__title">Daily spend</div>
              <div className="card__desc">
                Even pace to finish the month inside the cap is {usd(evenPace)}/day.
              </div>
            </div>
          </div>
          <div className="card__body">
            <div className="dchart">
              <div
                className="dchart__pace"
                style={{ bottom: `${(evenPace / maxDaily) * 100}%` }}
              >
                <span>{usd(evenPace)}/day pace</span>
              </div>
              <div className="dchart__bars">
                {Array.from({ length: DAYS_IN_PERIOD }, (_, i) => {
                  const value = DAILY[i];
                  if (value === undefined) {
                    return <div key={i} className="dbar is-future" title={`Jul ${i + 1}`} />;
                  }
                  return (
                    <div
                      key={i}
                      className="dbar"
                      title={`Jul ${i + 1} — ${usd(value)}`}
                    >
                      <span className="dbar__val">{usd(value)}</span>
                      <div
                        className="dbar__fill"
                        style={{ height: `${(value / maxDaily) * 100}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="dchart__axis">
                {[1, 8, 15, 22, 29].map((d) => (
                  <span key={d} style={{ left: `${((d - 0.5) / DAYS_IN_PERIOD) * 100}%` }}>
                    Jul {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---- Attribution ---- */}
        <div className="usage-grid">
          <section className="card">
            <div className="card__head">
              <div className="card__head-icon">
                <Icon.llm size={18} />
              </div>
              <div>
                <div className="card__title">By model</div>
                <div className="card__desc">Where the tokens went.</div>
              </div>
            </div>
            <div className="card__body">
              <div className="brk">
                {BY_MODEL.map((m) => (
                  <div key={m.model} className="brk__row">
                    <div className="logo-tile">
                      <span>{m.mark}</span>
                    </div>
                    <div className="brk__main">
                      <div className="brk__name">
                        <span className="mono">{m.model}</span>
                        <b>{usd(m.spend)}</b>
                      </div>
                      <div className="brk__sub">
                        <span>
                          {m.provider} · {m.tokens}
                        </span>
                        <em>{Math.round((m.spend / spent) * 100)}%</em>
                      </div>
                      <div className="brk__track">
                        <div
                          className="brk__fill"
                          style={{ width: `${(m.spend / spent) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card__head">
              <div className="card__head-icon">
                <Icon.members size={18} />
              </div>
              <div>
                <div className="card__title">By member</div>
                <div className="card__desc">Who asked, and what it cost.</div>
              </div>
            </div>
            <div className="card__body">
              <div className="brk">
                {BY_MEMBER.map((p) => (
                  <div key={p.name} className="brk__row">
                    <Monogram text={p.initials} hue={p.hue} />
                    <div className="brk__main">
                      <div className="brk__name">
                        <span>{p.name}</span>
                        <b>{usd(p.spend)}</b>
                      </div>
                      <div className="brk__sub">
                        <span>{p.sessions} sessions</span>
                        <em>{Math.round((p.spend / spent) * 100)}%</em>
                      </div>
                      <div className="brk__track">
                        <div
                          className="brk__fill"
                          style={{ width: `${(p.spend / spent) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* ---- Budget & alerts ---- */}
        <section className="card">
          <div className="card__head">
            <div className="card__head-icon">
              <Icon.shield size={18} />
            </div>
            <div>
              <div className="card__title">Budget & alerts</div>
              <div className="card__desc">
                Caps apply to the whole workspace. Owners are emailed at the alert
                threshold.
              </div>
            </div>
          </div>

          <div className="card__row">
            <div className="card__row-main">
              <div className="card__row-title">Monthly cap</div>
              <div className="card__row-sub">
                The most Dan will spend in a billing period across all members.
              </div>
            </div>
            <div className="cap-field">
              <span className="cap-field__cur">$</span>
              <input
                id="cap-input"
                className="input"
                inputMode="decimal"
                value={cap}
                onChange={(e) => setCap(e.target.value.replace(/[^0-9.]/g, ''))}
                aria-label="Monthly cap in dollars"
              />
              <button
                className="btn btn--primary"
                disabled={!capDirty}
                onClick={() => {
                  setSavedCap(cap);
                  toast(`Monthly cap set to $${Number(cap).toFixed(2)}`);
                }}
              >
                Save
              </button>
            </div>
          </div>

          <div className="card__row">
            <div className="card__row-main">
              <div className="card__row-title">Alert threshold</div>
              <div className="card__row-sub">
                Email owners when spend crosses this share of the cap.
              </div>
            </div>
            <div className="segmented" role="radiogroup" aria-label="Alert threshold">
              {[50, 80, 95].map((t) => (
                <button
                  key={t}
                  role="radio"
                  aria-checked={threshold === t}
                  data-on={threshold === t}
                  onClick={() => {
                    setThreshold(t);
                    toast(`Alerts at ${t}% of the cap`);
                  }}
                >
                  {t}%
                </button>
              ))}
            </div>
          </div>

          <div className="card__row">
            <div className="card__row-main">
              <div className="card__row-title">Pause at the cap</div>
              <div className="card__row-sub">
                When the cap is reached, Dan pauses new runs instead of billing
                overage. Owners can always resume.
              </div>
            </div>
            <button
              className="switch"
              role="switch"
              aria-checked={hardStop}
              data-on={hardStop}
              onClick={() => {
                const next = !hardStop;
                setHardStop(next);
                toast(next ? 'Dan will pause at the cap' : 'Overage allowed past the cap');
              }}
            >
              <span className="switch__knob" />
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
