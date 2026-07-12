'use client';

import ThoughtProcess from './ThoughtProcess';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  time: string;
  thought?: string;
  children?: React.ReactNode;
}

export default function Message({ role, content, time, thought, children }: MessageProps) {
  return (
    <div className={`msg msg--${role}`}>
      {role === 'assistant' && thought && <ThoughtProcess text={thought} />}
      <div className="msg__bubble">{content}</div>
      {children}
      {/* Minute precision, revealed on hover — seconds-level stamps on every
          bubble were noise Claude/GPT don't show. */}
      <div className="msg__time">{time.replace(/^(\d{1,2}:\d{2}):\d{2}/, '$1')}</div>
    </div>
  );
}
