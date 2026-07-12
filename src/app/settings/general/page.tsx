'use client';

import { useEffect, useState } from 'react';
import PageHead from '@/components/PageHead';
import { CopyId, Monogram } from '@/components/ui';
import { toast } from '@/components/Toast';
import { Icon } from '@/lib/icons';
import { MEMBERS, SECTION_META } from '@/lib/data';

/* ============================================================
   General settings — flat Claude-style rows.
   Profile, Preferences, and Notifications autosave to
   localStorage; workspace controls keep explicit actions.
   ============================================================ */

type Theme = 'system' | 'light' | 'dark';

type Prefs = {
  fullName: string;
  nickname: string;
  notifyCompletions: boolean;
  notifyMetricAlerts: boolean;
  notifyWeeklyDigest: boolean;
};

const PREFS_KEY = 'dan-prefs';

const ME = MEMBERS.find((m) => m.you) ?? MEMBERS[0];

const DEFAULT_PREFS: Prefs = {
  fullName: ME.name,
  nickname: ME.name.split(' ')[0],
  notifyCompletions: true,
  notifyMetricAlerts: true,
  notifyWeeklyDigest: false,
};

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<Prefs>) };
  } catch {
    return DEFAULT_PREFS;
  }
}

function setTheme(t: Theme) {
  const dark =
    t === 'dark' ||
    (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme-pref', t);
  localStorage.setItem('dan-theme', t);
  window.dispatchEvent(new CustomEvent('dan-theme', { detail: t }));
}

/* ---------------- Row primitives ---------------- */

function Row({
  label,
  sub,
  children,
  stack,
}: {
  label: string;
  sub?: string;
  children: React.ReactNode;
  stack?: boolean;
}) {
  return (
    <div className={`set-row${stack ? ' set-row--stack' : ''}`}>
      <div className="set-row__main">
        <div className="set-row__label">{label}</div>
        {sub && <div className="set-row__sub">{sub}</div>}
      </div>
      <div className="set-row__control">{children}</div>
    </div>
  );
}

function Switch({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      className="switch"
      role="switch"
      aria-checked={on}
      aria-label={label}
      data-on={on}
      onClick={onToggle}
    >
      <span className="switch__knob" />
    </button>
  );
}

/* ---------------- Page ---------------- */

export default function GeneralPage() {
  const meta = SECTION_META.general;

  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [themePref, setThemePref] = useState<Theme>('system');

  const [orgName, setOrgName] = useState('Company 8');
  const [orgSaved, setOrgSaved] = useState('Company 8');

  useEffect(() => {
    setPrefs(loadPrefs());
    setThemePref((localStorage.getItem('dan-theme') as Theme) || 'system');
    const sync = (e: Event) => setThemePref((e as CustomEvent<Theme>).detail);
    window.addEventListener('dan-theme', sync);
    return () => window.removeEventListener('dan-theme', sync);
  }, []);

  const update = (patch: Partial<Prefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const themeOptions: { key: Theme; icon: keyof typeof Icon; label: string }[] = [
    { key: 'system', icon: 'system', label: 'System theme' },
    { key: 'light', icon: 'sun', label: 'Light theme' },
    { key: 'dark', icon: 'moon', label: 'Dark theme' },
  ];

  const orgDirty = orgName.trim() !== orgSaved && orgName.trim().length > 0;

  return (
    <>
      <PageHead title={meta.title} blurb={meta.blurb} />

      <div className="set-page stagger">
        {/* ---------------- Profile ---------------- */}
        <section className="set-section">
          <h2 className="set-title">Profile</h2>

          <Row label="Avatar">
            <Monogram text={ME.name.split(' ').map((p) => p[0]).join('').slice(0, 2)} hue={ME.hue} />
          </Row>

          <Row label="Full name">
            <input
              className="input"
              aria-label="Full name"
              value={prefs.fullName}
              onChange={(e) => update({ fullName: e.target.value })}
            />
          </Row>

          <Row label="What should Dan call you?">
            <input
              className="input"
              aria-label="Nickname"
              value={prefs.nickname}
              onChange={(e) => update({ nickname: e.target.value })}
            />
          </Row>

        </section>

        {/* ---------------- Preferences ---------------- */}
        <section className="set-section">
          <h2 className="set-title">Preferences</h2>

          <Row label="Appearance">
            <div className="segmented segmented--icons" role="radiogroup" aria-label="Theme">
              {themeOptions.map((o) => {
                const OptIcon = Icon[o.icon];
                return (
                  <button
                    key={o.key}
                    role="radio"
                    aria-checked={themePref === o.key}
                    aria-label={o.label}
                    data-on={themePref === o.key}
                    onClick={() => {
                      setThemePref(o.key);
                      setTheme(o.key);
                    }}
                  >
                    <OptIcon size={16} />
                  </button>
                );
              })}
            </div>
          </Row>

        </section>

        {/* ---------------- Notifications ---------------- */}
        <section className="set-section">
          <h2 className="set-title">Notifications</h2>

          <Row
            label="Response completions"
            sub="Get notified when Dan has finished a response. Useful for long-running questions."
          >
            <Switch
              label="Response completions"
              on={prefs.notifyCompletions}
              onToggle={() => update({ notifyCompletions: !prefs.notifyCompletions })}
            />
          </Row>

          <Row
            label="Metric alerts"
            sub="Let Dan flag unusual movements in revenue, pipeline, or traffic proactively."
          >
            <Switch
              label="Metric alerts"
              on={prefs.notifyMetricAlerts}
              onToggle={() => update({ notifyMetricAlerts: !prefs.notifyMetricAlerts })}
            />
          </Row>

          <Row
            label="Weekly digest"
            sub="A Monday-morning summary of the week’s key business movements."
          >
            <Switch
              label="Weekly digest"
              on={prefs.notifyWeeklyDigest}
              onToggle={() => update({ notifyWeeklyDigest: !prefs.notifyWeeklyDigest })}
            />
          </Row>
        </section>

        {/* ---------------- Workspace ---------------- */}
        <section className="set-section">
          <h2 className="set-title">Workspace</h2>

          <Row label="Workspace name" sub="Shown across the workspace and in the sidebar.">
            <input
              className="input"
              aria-label="Workspace name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
            <button
              className="btn btn--primary"
              disabled={!orgDirty}
              onClick={() => {
                setOrgSaved(orgName.trim());
                toast('Workspace name saved');
              }}
            >
              Save
            </button>
          </Row>

          <Row label="Workspace ID">
            <CopyId value="BIW7XQ" />
          </Row>

          <Row
            label="Export workspace data"
            sub="Download a JSON archive of metadata, members, sessions, messages, integrations, and artifacts. Secrets are excluded."
          >
            <button className="btn" onClick={() => toast('Export queued — we’ll email a link')}>
              <Icon.download size={15} />
              Create export
            </button>
          </Row>
        </section>

        {/* ---------------- Danger zone ---------------- */}
        <section className="set-section">
          <h2 className="set-title" style={{ color: 'var(--danger)' }}>
            Danger zone
          </h2>

          <Row
            label="Delete organization"
            sub="Permanently delete this workspace and all associated data. Only owners and admins can perform this action. This cannot be undone."
          >
            <button className="btn btn--danger">Delete organization</button>
          </Row>
        </section>
      </div>
    </>
  );
}
