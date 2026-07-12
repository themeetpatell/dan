'use client';

import { useRouter } from 'next/navigation';
import PageHead from '@/components/PageHead';
import DateRange from '@/components/DateRange';
import { LineChart, BarChart, Legend, type Series } from '@/components/Charts';
import { Icon } from '@/lib/icons';
import { SECTION_META } from '@/lib/data';
import { LLM_PROVIDERS, ProviderLogo } from '@/lib/providers';

// Total cost leads (the headline number), then a clean 6-tile grid — the
// old 7th tile (redundant Total tokens = input + output) orphaned a row.
const STATS: { label: string; value: string }[] = [
  { label: 'Total cost', value: '$30.11' },
  { label: 'API calls', value: '289' },
  { label: 'Input tokens', value: '40,139,911' },
  { label: 'Output tokens', value: '610,154' },
  { label: 'Input cost', value: '$28.15' },
  { label: 'Output cost', value: '$1.96' },
];

// Synthetic daily series roughly matching the reference curve (flat then a spike).
const OVER_TIME: Series[] = [
  ['17 Jun', 1_200_000, 24_000], ['19 Jun', 1_600_000, 30_000], ['21 Jun', 1_900_000, 34_000],
  ['23 Jun', 2_200_000, 38_000], ['25 Jun', 2_600_000, 41_000], ['27 Jun', 3_000_000, 45_000],
  ['29 Jun', 3_300_000, 48_000], ['1 Jul', 3_700_000, 52_000], ['3 Jul', 4_100_000, 56_000],
  ['5 Jul', 4_600_000, 60_000], ['7 Jul', 6_800_000, 78_000], ['9 Jul', 4_400_000, 61_000],
  ['11 Jul', 23_600_000, 210_000],
].map(([label, input, output]) => ({ label: label as string, input: input as number, output: output as number }));

const BY_PROVIDER: Series[] = [
  { label: 'Moonshot', input: 38_400_000, output: 520_000 },
  { label: 'Anthropic', input: 1_900_000, output: 78_000 },
  { label: 'OpenAI', input: 39_000, output: 12_000 },
];

const BY_MODEL: Series[] = [
  { label: 'kimi-k2-6', input: 38_400_000, output: 520_000 },
  { label: 'opus-4-6', input: 1_700_000, output: 70_000 },
  { label: 'gpt-5', input: 39_000, output: 12_000 },
];

export default function LLMProvidersPage() {
  const meta = SECTION_META['llm-providers'];
  const router = useRouter();

  return (
    <>
      <PageHead
        title={meta.title}
        blurb={meta.blurb}
        actions={<span className="pill"><Icon.spark size={13} /> $30.11 this cycle</span>}
      />

      {/* Bring your own keys */}
      <section className="card">
        <div className="card__head" style={{ paddingBottom: 8 }}>
          <div className="card__head-icon"><Icon.key size={18} /></div>
          <div>
            <div className="card__title">Bring your own model APIs</div>
            <div className="card__desc">Connect a provider key to route Dan’s work through your own account.</div>
          </div>
        </div>
        <div className="card__body">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
            {LLM_PROVIDERS.map((p) => (
              <button
                key={p.slug}
                className="tile"
                onClick={() => router.push(`/settings/llm-providers/connect/${p.slug}`)}
              >
                <div className="logo-tile">
                  <ProviderLogo slug={p.slug} size={20} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="tile__name">{p.name}</div>
                  <div className="tile__kind">
                    {p.connected && <span className="dot" />}
                    {p.connected ? 'Connected' : 'Add key'}
                  </div>
                </div>
                {p.connected ? (
                  <Icon.check size={16} className="tile__arrow" />
                ) : (
                  <Icon.plus size={16} className="tile__arrow" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Usage */}
      <div className="section-label" style={{ marginTop: 26 }}>Usage</div>

      <div className="stats">
        {STATS.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat__label">{s.label}</div>
            <div className="stat__value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="controls">
        <DateRange />
        <div className="spacer" />
        <div className="select">
          <select><option>All providers</option><option>Anthropic</option><option>Moonshot</option></select>
          <Icon.chevronD size={15} />
        </div>
        <div className="select">
          <select><option>All models</option><option>kimi-k2-6</option><option>opus-4-6</option></select>
          <Icon.chevronD size={15} />
        </div>
      </div>

      <div className="panel">
        <div className="panel__head">
          <div className="panel__title">Token usage over time</div>
          <Legend />
        </div>
        <LineChart data={OVER_TIME} />
      </div>

      <div className="chart-cols" style={{ marginTop: 14 }}>
        <div className="panel">
          <div className="panel__head">
            <div className="panel__title">Usage by provider</div>
            <Legend />
          </div>
          <BarChart data={BY_PROVIDER} label="Usage by provider" />
        </div>
        <div className="panel">
          <div className="panel__head">
            <div className="panel__title">Usage by model</div>
            <Legend />
          </div>
          <BarChart data={BY_MODEL} label="Usage by model" />
        </div>
      </div>
    </>
  );
}
