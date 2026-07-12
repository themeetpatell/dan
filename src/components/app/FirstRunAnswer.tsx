'use client';

import type { FirstRunReply } from '@/lib/first-run';
import ConnectSourceCta from './ConnectSourceCta';
import { Icon } from '@/lib/icons';

interface FirstRunAnswerProps {
  reply: FirstRunReply;
  onConnect: () => void;
}

/* Structured body of Dan's first-run reply, rendered under the
   short answer bubble: bridge → guide → ask → connect banner. */
export default function FirstRunAnswer({ reply, onConnect }: FirstRunAnswerProps) {
  return (
    <div className="first-run">
      <p className="first-run__bridge">{reply.bridge}</p>
      <ul className="first-run__guide">
        {reply.guide.map((item) => (
          <li key={item}>
            <Icon.spark size={13} />
            {item}
          </li>
        ))}
      </ul>
      <p className="first-run__ask">{reply.ask}</p>
      <ConnectSourceCta onConnect={onConnect} />
    </div>
  );
}
