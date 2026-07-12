'use client';

import Link from 'next/link';
import { Icon } from '@/lib/icons';

/* Healthy-data state: a source is connected and synced, but Dan has
   no feed-worthy items. Distinct from the no-connector activation
   state — the system is working, there is just nothing urgent. */
export default function FeedHealthy() {
  return (
    <div className="feed-state">
      <div className="feed-state__inner feed-state__inner--center">
        <div className="feed-healthy__tile">
          <Icon.check size={22} />
        </div>

        <h2 className="feed-healthy__headline">
          Nothing urgent needs your attention right now
        </h2>
        <p className="feed-healthy__copy">
          Dan is monitoring your connected data and will update this feed when
          something meaningful changes.
        </p>

        <div className="feed-healthy__pulse">
          <span className="feed-healthy__dot" aria-hidden="true" />
          Live monitoring active
        </div>

        <div className="feed-healthy__actions">
          <Link href="/" className="btn btn--primary">
            <Icon.chat size={16} />
            Ask Dan a question
          </Link>
          <Link href="/settings/connectors/add" className="btn">
            <Icon.plus size={16} />
            Connect another source
          </Link>
          <Link href="/settings/connectors" className="feed-healthy__link">
            View connected sources
            <Icon.chevronR size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
