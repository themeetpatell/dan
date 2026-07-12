'use client';

import { Icon } from '@/lib/icons';

/* Small connector marks previewed inside the banner.
   Marks stay --text-secondary per the design rule: no
   brand-colored monogram letters. */
const PREVIEW_LOGOS = [
  { mark: 'GA', name: 'Google Analytics' },
  { mark: 'S', name: 'Stripe' },
  { mark: 'Pg', name: 'Postgres' },
  { mark: 'Sf', name: 'Snowflake' },
];

const CONNECTOR_COUNT_LABEL = '24+';

interface ConnectSourceCtaProps {
  onConnect: () => void;
  /** Omit to hide the demo-data card (e.g. inside a chat reply). */
  onDemoSetup?: () => void;
}

export default function ConnectSourceCta({ onConnect, onDemoSetup }: ConnectSourceCtaProps) {
  return (
    <div className="source-cta">
      <div className="source-cta__card">
        <div className="source-cta__tile">
          <Icon.connectors size={19} />
        </div>
        <div className="source-cta__text">
          <strong>Connect a data source</strong>
          <span>Google Analytics, CRM, Snowflake &amp; more — Dan starts answering instantly.</span>
        </div>
        <div className="source-cta__logos" aria-hidden="true">
          {PREVIEW_LOGOS.map((logo) => (
            <span key={logo.name} className="source-cta__logo" title={logo.name}>
              {logo.mark}
            </span>
          ))}
          <span className="source-cta__logo source-cta__logo--more">{CONNECTOR_COUNT_LABEL}</span>
        </div>
        <button className="btn" onClick={onConnect}>
          Connect
        </button>
      </div>

      {onDemoSetup && (
        <>
          <div className="source-cta__or" aria-hidden="true">
            OR
          </div>
          <div className="source-cta__card">
            <div className="source-cta__tile">
              <Icon.layers size={19} />
            </div>
            <div className="source-cta__text">
              <strong>Use Demo Data</strong>
              <span>Try sample databases without connecting your own data.</span>
            </div>
            <button className="btn" onClick={onDemoSetup}>
              Setup
            </button>
          </div>
        </>
      )}
    </div>
  );
}
