'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import PageHead from '@/components/PageHead';
import { LogoTile } from '@/components/ui';
import SchemaExplorer from '@/components/SchemaExplorer';
import { toast } from '@/components/Toast';
import { Icon } from '@/lib/icons';
import { CONNECTOR_TYPES } from '@/lib/data';
import { getSchema, slugify } from '@/lib/connector-flow';
import { markDataSourceConnected } from '@/lib/first-run';

const AUTHORIZE_DELAY_MS = 1100;

type Stage = 'auth' | 'authorizing' | 'validated';

export default function ConnectTypePage() {
  const params = useParams<{ type: string }>();
  const router = useRouter();
  const type = CONNECTOR_TYPES.find((t) => slugify(t.name) === params.type);

  const [stage, setStage] = useState<Stage>('auth');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [instructions, setInstructions] = useState('');
  const [host, setHost] = useState('');
  const [database, setDatabase] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!type) {
    return (
      <div className="empty" style={{ marginTop: 40 }}>
        <h3>Unknown connector type</h3>
        <p>
          <Link href="/settings/connectors/add">Back to Add connector</Link>
        </p>
      </div>
    );
  }

  const isApi = type.kind === 'API';
  const canValidate = isApi || (host.trim() && database.trim() && username.trim());
  const canCreate = name.trim().length > 0 && desc.trim().length > 0;

  const authorize = () => {
    setStage('authorizing');
    setTimeout(() => {
      setStage('validated');
      toast(isApi ? `Authorized with ${type.name}` : 'Connection validated');
    }, AUTHORIZE_DELAY_MS);
  };

  const create = () => {
    markDataSourceConnected();
    toast(`${name.trim()} created`);
    const query = new URLSearchParams({
      type: params.type,
      name: name.trim(),
      desc: desc.trim(),
      fresh: '1',
    });
    if (instructions.trim()) query.set('ai', instructions.trim());
    router.push(`/settings/connectors/${slugify(name)}?${query.toString()}`);
  };

  return (
    <>
      <PageHead
        title={`Connect ${type.name}`}
        icon={<LogoTile mark={type.mark} color={type.color} />}
        crumbs={[
          { label: 'Settings', href: '/settings/general' },
          { label: 'Connectors', href: '/settings/connectors' },
          { label: 'Add connector', href: '/settings/connectors/add' },
          { label: type.name },
        ]}
      />

      {stage !== 'validated' ? (
        <div className="connect-panel">
          <div className="connect-note">
            {isApi
              ? `Sign in with ${type.name} to continue. We'll fetch the available connection options after you authorize.`
              : `Enter read-only credentials for your ${type.name} instance. We'll validate the connection before anything is saved.`}
          </div>
          <div className="connect-body">
            {!isApi && (
              <div className="connect-fields">
                <div>
                  <label className="label" htmlFor="cn-host">
                    Host
                  </label>
                  <input
                    id="cn-host"
                    className="input"
                    placeholder="db.internal.company.com:5432"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="cn-db">
                    Database
                  </label>
                  <input
                    id="cn-db"
                    className="input"
                    placeholder="analytics"
                    value={database}
                    onChange={(e) => setDatabase(e.target.value)}
                  />
                </div>
                <div className="connect-fields__pair">
                  <div>
                    <label className="label" htmlFor="cn-user">
                      Username
                    </label>
                    <input
                      id="cn-user"
                      className="input"
                      placeholder="readonly_dan"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="cn-pass">
                      Password
                    </label>
                    <input
                      id="cn-pass"
                      className="input"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            <button
              className="btn btn--primary btn--block"
              disabled={!canValidate || stage === 'authorizing'}
              onClick={authorize}
            >
              {stage === 'authorizing' ? (
                <>
                  <Icon.refresh size={16} className="spin" />
                  {isApi ? 'Waiting for authorization…' : 'Validating connection…'}
                </>
              ) : isApi ? (
                `Connect with ${type.name}`
              ) : (
                'Validate connection'
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="cfg-layout">
          <div className="cfg-form">
            <div className="cfg-validated">
              <span className="cfg-validated__ok">
                <Icon.check size={15} />
                Connection validated
              </span>
              <button className="linklike" onClick={() => setStage('auth')}>
                Edit connection
              </button>
            </div>

            <div className="cfg-field">
              <label className="label" htmlFor="cf-name">
                Name<span className="req">*</span>
              </label>
              <input
                id="cf-name"
                className="input"
                placeholder="e.g. Production warehouse"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="cfg-field">
              <label className="label" htmlFor="cf-desc">
                Description<span className="req">*</span>
              </label>
              <input
                id="cf-desc"
                className="input"
                placeholder="What this connector is used for"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            <div className="cfg-field">
              <label className="label" htmlFor="cf-ai">
                Agent instructions
              </label>
              <p className="cfg-hint">Optional guidance for how the agent should use this data source.</p>
              <textarea
                id="cf-ai"
                className="input textarea"
                rows={4}
                placeholder="e.g. Revenue is in USD; always filter test accounts."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>

            <button className="btn btn--primary btn--block" disabled={!canCreate} onClick={create}>
              Create connector
            </button>
          </div>

          <div className="schema-region">
            <div className="schema-region__head">
              <Icon.shield size={15} />
              <div>
                <div className="schema-region__title">API schema</div>
                <div className="schema-region__sub">Read-only preview of resources and fields.</div>
              </div>
            </div>
            <SchemaExplorer resources={getSchema(params.type)} />
          </div>
        </div>
      )}
    </>
  );
}
