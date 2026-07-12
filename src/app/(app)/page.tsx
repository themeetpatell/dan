'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Composer from '@/components/app/Composer';
import ConnectSourceCta from '@/components/app/ConnectSourceCta';
import { toast } from '@/components/Toast';
import { ATTENTION_ITEMS, SUGGESTIONS } from '@/lib/app-data';
import { FIRST_RUN_SUGGESTIONS, useDataSource } from '@/lib/first-run';
import { Icon } from '@/lib/icons';

function greetingFor(hour: number): string {
  if (hour < 5) return 'Good evening'; // 1am is not "morning"
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/* Mirrors the activity feed's states: demo data ships with feed
   insights, a fresh real connection has none yet, and no source at
   all gets the first-run prompt. */
function subtitleFor(ready: boolean, source: string): string {
  if (!ready || source === 'none') return 'How can I help you, today?';
  if (source === 'connected')
    return 'Nothing urgent needs your attention right now';
  return 'Here’s what needs your attention';
}

export default function HomePage() {
  const router = useRouter();
  const [greeting, setGreeting] = useState('Good evening');
  const { ready, source, hasSource, setSource } = useDataSource();
  const showAttention = ready && source === 'demo';

  useEffect(() => {
    setGreeting(greetingFor(new Date().getHours()));
  }, []);

  const go = (seed: string) =>
    router.push(`/chat?q=${encodeURIComponent(seed)}`);

  return (
    <div className="home">
      <div className="home__inner">
        <div className="greeting">
          <h1>
            {greeting}, <span className="greeting__name">Meet</span>
          </h1>
          <p>{subtitleFor(ready, source)}</p>
        </div>

        {showAttention && (
          <div className="attention">
            {ATTENTION_ITEMS.map((item, i) => (
              <div className="attention__item" key={i}>
                <span className="attention__dot" />
                <div className="attention__text">
                  {item.text}
                  <button className="action-chip" onClick={() => go(item.action)}>
                    {item.action}
                    <Icon.chevronR size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={showAttention ? undefined : 'home__composer-gap'}>
          <Composer onSend={go} autoFocus />
        </div>

        {ready && hasSource && (
          <>
            <div className="try-label">Try asking</div>
            <div className="chips">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="chip" onClick={() => go(s)}>
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        {ready && !hasSource && (
          <>
            <div className="chips" style={{ marginTop: 14 }}>
              {FIRST_RUN_SUGGESTIONS.map((s) => (
                <button key={s} className="chip" onClick={() => go(s)}>
                  {s}
                </button>
              ))}
            </div>
            <ConnectSourceCta
              onConnect={() => router.push('/settings/connectors/add')}
              onDemoSetup={() => {
                setSource('demo');
                toast('Demo data connected');
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
