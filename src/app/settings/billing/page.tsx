'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHead from '@/components/PageHead';
import { LogoTile } from '@/components/ui';
import { toast } from '@/components/Toast';
import { Icon } from '@/lib/icons';
import { SECTION_META } from '@/lib/data';

/* ------------------------------------------------------------------
   Demo billing data — July 2026. The workspace was created Jun 16,
   so the first invoice is prorated; the plan renews with the
   calendar-month period used on Plan & Usage.
   ------------------------------------------------------------------ */
const PLAN_NAME = 'Growth';
const PLAN_PRICE = 199;
const INCLUDED_USAGE = 230;
const RENEWAL_DATE = '1 Aug 2026';
const PERIOD_END = '31 Jul 2026';

type Invoice = {
  id: string;
  date: string;
  amount: number;
  note?: string;
};

const INVOICES: Invoice[] = [
  { id: 'INV-0002', date: '1 Jul 2026', amount: 199 },
  { id: 'INV-0001', date: '16 Jun 2026', amount: 102.71, note: 'Prorated first period' },
];

type PaymentMethod = {
  id: string;
  brand: 'Visa' | 'Mastercard';
  mark: string;
  last4: string;
  expires: string;
  isDefault: boolean;
};

const INITIAL_METHODS: PaymentMethod[] = [
  { id: 'pm_1', brand: 'Visa', mark: 'V', last4: '8028', expires: '03/29', isDefault: true },
  { id: 'pm_2', brand: 'Mastercard', mark: 'M', last4: '2068', expires: '11/27', isDefault: false },
];

type BillingInfo = {
  email: string;
  name: string;
  address: string;
};

const INITIAL_INFO: BillingInfo = {
  email: 'meet@finanshels.com',
  name: 'Meet Patel',
  address: 'Publishing Pavilion, Dubai, United Arab Emirates',
};

const usd = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function BillingPage() {
  const meta = SECTION_META.billing;

  const [methods, setMethods] = useState<PaymentMethod[]>(INITIAL_METHODS);
  const [info, setInfo] = useState<BillingInfo>(INITIAL_INFO);
  const [draft, setDraft] = useState<BillingInfo>(INITIAL_INFO);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [hasBackup, setHasBackup] = useState(true);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);

  const defaultMethod = methods.find((m) => m.isDefault);

  const makeDefault = (id: string) => {
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
    const method = methods.find((m) => m.id === id);
    if (method) toast(`${method.brand} •••• ${method.last4} is now the default`);
  };

  const removeMethod = (id: string) => {
    const method = methods.find((m) => m.id === id);
    setMethods((prev) => prev.filter((m) => m.id !== id));
    if (method) toast(`${method.brand} •••• ${method.last4} removed`);
  };

  const saveInfo = () => {
    setInfo(draft);
    setIsEditingInfo(false);
    toast('Billing information updated');
  };

  return (
    <>
      <PageHead title={meta.title} blurb={meta.blurb} />

      <div className="stagger">
        {/* ---- Current plan ---- */}
        <section className="card">
          <div className="card__head">
            <div className="card__head-icon">
              <Icon.spark size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="card__title">Current plan</div>
              <div className="card__desc">
                {isCancelled
                  ? `Full access continues until ${PERIOD_END}.`
                  : `Renews ${RENEWAL_DATE}${
                      defaultMethod
                        ? ` · billed to ${defaultMethod.brand} •••• ${defaultMethod.last4}`
                        : ''
                    }`}
              </div>
            </div>
            <Link href="/settings/billing/plans" className="btn">
              Compare plans
            </Link>
          </div>
          <div className="card__body">
            <div className="spend">
              <div className="spend__figure">
                <span className="spend__now">{PLAN_NAME}</span>
                <span className="spend__of">{usd(PLAN_PRICE)}/mo</span>
              </div>
              <div className="spend__stats">
                <div className="spend__stat">
                  <span>Included usage</span>
                  <b>{usd(INCLUDED_USAGE)}/mo</b>
                </div>
                <div className="spend__stat">
                  <span>Members</span>
                  <b>Unlimited</b>
                </div>
                <div className="spend__stat">
                  <span>Usage this period</span>
                  <b>
                    <Link href="/settings/usage" style={{ color: 'inherit' }}>
                      View usage
                    </Link>
                  </b>
                </div>
              </div>
            </div>

            {isCancelled && (
              <div className="pace-note">
                <Icon.alert size={15} />
                <span>
                  Your plan is set to cancel — access ends on <b>{PERIOD_END}</b> and the
                  card on file won&rsquo;t be charged again.
                </span>
                <button
                  className="pace-note__act"
                  onClick={() => {
                    setIsCancelled(false);
                    toast('Plan resumed — renews ' + RENEWAL_DATE);
                  }}
                >
                  Resume plan
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ---- Billing history ---- */}
        <section className="card">
          <div className="card__head">
            <div className="card__head-icon">
              <Icon.fileText size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="card__title">Billing history</div>
              <div className="card__desc">Invoices for this workspace, most recent first.</div>
            </div>
            <button className="btn" onClick={() => toast('Full invoice archive coming soon')}>
              View all
            </button>
          </div>
          {INVOICES.map((inv) => (
            <div key={inv.id} className="card__row">
              <div className="card__row-main">
                <div className="card__row-title">{inv.date}</div>
                <div className="card__row-sub">
                  <span className="mono">{inv.id}</span>
                  {inv.note ? ` · ${inv.note}` : ''}
                </div>
              </div>
              <b style={{ fontSize: 14 }}>{usd(inv.amount)}</b>
              <span className="status status--ok">Paid</span>
              <button
                className="btn btn--sm"
                onClick={() => toast(`Invoice ${inv.id} downloaded`)}
              >
                <Icon.download size={14} />
                Download
              </button>
            </div>
          ))}
        </section>

        {/* ---- Billing information ---- */}
        <section className="card">
          <div className="card__head">
            <div className="card__head-icon">
              <Icon.building size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="card__title">Billing information</div>
              <div className="card__desc">Shown on invoices and receipts.</div>
            </div>
            {!isEditingInfo && (
              <button
                className="btn"
                onClick={() => {
                  setDraft(info);
                  setIsEditingInfo(true);
                }}
              >
                Edit
              </button>
            )}
          </div>
          {isEditingInfo ? (
            <div className="card__body">
              <label className="label" htmlFor="bill-email">
                Billing email
              </label>
              <input
                id="bill-email"
                className="input"
                type="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              />
              <label className="label" htmlFor="bill-name" style={{ marginTop: 14 }}>
                Name
              </label>
              <input
                id="bill-name"
                className="input"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
              <label className="label" htmlFor="bill-addr" style={{ marginTop: 14 }}>
                Address
              </label>
              <input
                id="bill-addr"
                className="input"
                value={draft.address}
                onChange={(e) => setDraft({ ...draft, address: e.target.value })}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button
                  className="btn btn--primary"
                  disabled={!draft.email.trim() || !draft.name.trim()}
                  onClick={saveInfo}
                >
                  Save
                </button>
                <button className="btn" onClick={() => setIsEditingInfo(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="card__row">
                <div className="card__row-main">
                  <div className="card__row-sub">Billing email</div>
                  <div className="card__row-title">{info.email}</div>
                </div>
              </div>
              <div className="card__row">
                <div className="card__row-main">
                  <div className="card__row-sub">Name</div>
                  <div className="card__row-title">{info.name}</div>
                </div>
              </div>
              <div className="card__row">
                <div className="card__row-main">
                  <div className="card__row-sub">Address</div>
                  <div className="card__row-title">{info.address}</div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* ---- Payment methods ---- */}
        <section className="card">
          <div className="card__head">
            <div className="card__head-icon">
              <Icon.card size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="card__title">Payment methods</div>
              <div className="card__desc">
                The default card is charged each period. Backup cards step in if it fails.
              </div>
            </div>
            <button
              className="btn"
              onClick={() => toast('Opening secure checkout to add a card')}
            >
              <Icon.plus size={15} />
              Add new
            </button>
          </div>
          {methods.map((m) => (
            <div key={m.id} className="card__row">
              <LogoTile mark={m.mark} />
              <div className="card__row-main">
                <div className="card__row-title">
                  {m.brand} •••• {m.last4}
                </div>
                <div className="card__row-sub">Expires {m.expires}</div>
              </div>
              {m.isDefault ? (
                <span className="pill pill--live">Default</span>
              ) : (
                <>
                  <button className="btn btn--sm" onClick={() => makeDefault(m.id)}>
                    Make default
                  </button>
                  <button
                    className="icon-btn"
                    aria-label={`Remove ${m.brand} ending ${m.last4}`}
                    onClick={() => removeMethod(m.id)}
                  >
                    <Icon.trash size={16} />
                  </button>
                </>
              )}
            </div>
          ))}
          <div className="card__row">
            <div className="card__row-main">
              <div className="card__row-title">Backup payment methods</div>
              <div className="card__row-sub">
                Use another payment method if your default payment method fails.
              </div>
            </div>
            <button
              className="switch"
              role="switch"
              aria-checked={hasBackup}
              data-on={hasBackup}
              onClick={() => {
                const next = !hasBackup;
                setHasBackup(next);
                toast(next ? 'Backup payment methods on' : 'Backup payment methods off');
              }}
            >
              <span className="switch__knob" />
            </button>
          </div>
        </section>

        {/* ---- Cancel plan ---- */}
        {!isCancelled && (
          <section className="card card--danger">
            <div className="card__row" style={{ borderTop: 'none' }}>
              <div className="card__head-icon">
                <Icon.alert size={18} />
              </div>
              <div className="card__row-main">
                <div className="card__row-title" style={{ color: 'var(--danger)' }}>
                  Cancel plan
                </div>
                <div className="card__row-sub">
                  {isConfirmingCancel
                    ? `Are you sure? You'll keep full access until ${PERIOD_END}, then the workspace moves to read-only.`
                    : "If you cancel, you'll keep full access to your plan features until the end of your billing period."}
                </div>
              </div>
              {isConfirmingCancel ? (
                <>
                  <button className="btn" onClick={() => setIsConfirmingCancel(false)}>
                    Keep plan
                  </button>
                  <button
                    className="btn btn--danger"
                    onClick={() => {
                      setIsCancelled(true);
                      setIsConfirmingCancel(false);
                      toast(`Plan cancelled — access until ${PERIOD_END}`);
                    }}
                  >
                    Confirm cancel
                  </button>
                </>
              ) : (
                <button className="btn btn--danger" onClick={() => setIsConfirmingCancel(true)}>
                  Cancel
                </button>
              )}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
