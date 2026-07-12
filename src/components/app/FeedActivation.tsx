'use client';

import { useRouter } from 'next/navigation';
import ConnectSourceCta from '@/components/app/ConnectSourceCta';
import { toast } from '@/components/Toast';
import { MEMBERS } from '@/lib/data';
import { useDataSource } from '@/lib/first-run';
import { Icon } from '@/lib/icons';
import type { Insight } from '@/lib/app-data';

/* Ghosted previews of the item types Dan posts once data flows.
   Static copy — these are illustrations, not real insights. */
const PREVIEW_ITEMS: { insight: Insight; icon: keyof typeof Icon; title: string }[] = [
  {
    insight: 'Risk',
    icon: 'alert',
    title: 'Payment failure rate climbing above your healthy threshold',
  },
  {
    insight: 'Opportunity',
    icon: 'zap',
    title: 'Non-branded search traffic is an untapped growth gap',
  },
  {
    insight: 'Summary',
    icon: 'fileText',
    title: 'Your weekly business review is ready to read',
  },
];

function firstNameOfOwner(): string {
  const you = MEMBERS.find((m) => m.you);
  return you ? you.name.split(' ')[0] : 'there';
}

/* Activation state shown on the Business Feed when no data source
   is connected yet — explains the feed and routes to the connect flow. */
export default function FeedActivation() {
  const router = useRouter();
  const { setSource } = useDataSource();

  return (
    <div className="feed-state">
      <div className="feed-state__inner">
        <div className="greeting">
          <h1>
            Your feed is quiet, <span className="greeting__name">{firstNameOfOwner()}</span>
          </h1>
          <p>
            The Business Feed is where Dan surfaces risks, meaningful changes, and
            opportunities from your connected systems — before you have to ask.
          </p>
        </div>

        <div className="feed-preview" aria-hidden="true">
          {PREVIEW_ITEMS.map((item, i) => {
            const PreviewIcon = Icon[item.icon];
            return (
              <div className="feed-preview__item" key={item.insight} style={{ animationDelay: `${0.1 + i * 0.07}s` }}>
                <span className="feed-preview__badge">
                  <PreviewIcon size={12} />
                  {item.insight.toUpperCase()}
                </span>
                <span className="feed-preview__title">{item.title}</span>
              </div>
            );
          })}
        </div>

        <ConnectSourceCta
          onConnect={() => router.push('/settings/connectors/add')}
          onDemoSetup={() => {
            setSource('demo');
            toast('Demo data connected');
          }}
        />
      </div>
    </div>
  );
}
