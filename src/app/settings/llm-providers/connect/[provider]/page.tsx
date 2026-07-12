'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import PageHead from '@/components/PageHead';
import { toast } from '@/components/Toast';
import { findProvider, ProviderLogo } from '@/lib/providers';

export default function ConnectProviderPage() {
  const params = useParams<{ provider: string }>();
  const router = useRouter();
  const provider = findProvider(params.provider);

  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');

  if (!provider) {
    return (
      <div className="empty" style={{ marginTop: 40 }}>
        <h3>Unknown provider</h3>
        <p>
          <Link href="/settings/llm-providers">Back to LLM providers</Link>
        </p>
      </div>
    );
  }

  const canSave = apiKey.trim().length > 0;

  const save = () => {
    toast(`${provider.name} key saved`);
    router.push('/settings/llm-providers');
  };

  return (
    <>
      <PageHead
        title={`Connect ${provider.name}`}
        icon={
          <div className="logo-tile">
            <ProviderLogo slug={provider.slug} size={22} />
          </div>
        }
        crumbs={[
          { label: 'Settings', href: '/settings/general' },
          { label: 'LLM providers', href: '/settings/llm-providers' },
          { label: provider.name },
        ]}
      />

      <div className="connect-panel">
        <div className="connect-note">
          API keys are stored with your workspace. Use a dedicated key when possible.
        </div>
        <div className="connect-body">
          <div className="connect-provider">
            <div className="logo-tile">
              <ProviderLogo slug={provider.slug} size={22} />
            </div>
            <div>
              <div className="label" style={{ marginBottom: 2 }}>
                Provider
              </div>
              <div className="connect-provider__name">{provider.name}</div>
            </div>
          </div>

          <div className="connect-fields">
            <div>
              <label className="label" htmlFor="pv-key">
                API key
              </label>
              <input
                id="pv-key"
                className="input"
                type="password"
                placeholder={provider.connected ? '•••••••• (replace existing key)' : provider.keyPlaceholder}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div>
              <label className="label" htmlFor="pv-url">
                Base URL
              </label>
              <input
                id="pv-url"
                className="input"
                placeholder={provider.urlPlaceholder}
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
              />
              <p className="cfg-hint" style={{ marginTop: 6 }}>
                Optional — leave blank to use the default endpoint.
              </p>
            </div>
          </div>

          <button className="btn btn--primary btn--block" disabled={!canSave} onClick={save}>
            Save
          </button>
        </div>
      </div>
    </>
  );
}
