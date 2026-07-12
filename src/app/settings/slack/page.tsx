'use client';

import { useState } from 'react';
import PageHead from '@/components/PageHead';
import { toast } from '@/components/Toast';
import { Icon } from '@/lib/icons';
import { SECTION_META } from '@/lib/data';

export default function SlackPage() {
  const meta = SECTION_META.slack;
  const [connected, setConnected] = useState(false);

  return (
    <>
      <PageHead
        title={meta.title}
        blurb={meta.blurb}
        actions={
          connected ? (
            <span className="pill pill--live"><span className="dot" /> Connected</span>
          ) : (
            <span className="pill">Not connected</span>
          )
        }
      />

      {!connected ? (
        <section className="card">
          <div className="card__row" style={{ borderTop: 'none' }}>
            <div className="logo-tile" style={{ color: '#611f69' }}>
              <Icon.slack size={20} />
            </div>
            <div className="card__row-main">
              <div className="card__row-title">Connect workspace</div>
              <div className="card__row-sub">
                Install the app in your Slack workspace so teammates can message Dan from
                channels and DMs.
              </div>
            </div>
            <button className="btn btn--primary" onClick={() => { setConnected(true); toast('Slack connected'); }}>
              Add to Slack <Icon.external size={15} />
            </button>
          </div>
        </section>
      ) : (
        <>
          <section className="card">
            <div className="card__row" style={{ borderTop: 'none' }}>
              <div className="logo-tile" style={{ color: '#611f69' }}><Icon.slack size={20} /></div>
              <div className="card__row-main">
                <div className="card__row-title">finanshels.slack.com</div>
                <div className="card__row-sub">Connected as Dan · 12 channels available</div>
              </div>
              <button className="btn btn--sm" onClick={() => { setConnected(false); toast('Slack disconnected'); }}>
                Disconnect
              </button>
            </div>
          </section>

          <section className="card">
            <div className="card__head">
              <div className="card__head-icon"><Icon.bell size={18} /></div>
              <div>
                <div className="card__title">Default channel</div>
                <div className="card__desc">Where scheduled digests and alerts are posted.</div>
              </div>
            </div>
            <div className="card__body">
              <div className="field">
                <div className="input-wrap">
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }}>#</span>
                  <input className="input" defaultValue="finance-ops" style={{ paddingLeft: 30 }} />
                </div>
                <button className="btn btn--primary" onClick={() => toast('Channel saved')}>Save</button>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
