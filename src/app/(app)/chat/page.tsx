'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Message from '@/components/app/Message';
import Composer from '@/components/app/Composer';
import ArtifactPanel from '@/components/app/ArtifactPanel';
import ConnectSourceCta from '@/components/app/ConnectSourceCta';
import FirstRunAnswer from '@/components/app/FirstRunAnswer';
import { SAMPLE_CONVERSATION } from '@/lib/app-data';
import {
  buildFirstRunReply,
  FIRST_RUN_THOUGHT,
  useDataSource,
  type FirstRunReply,
} from '@/lib/first-run';
import { Icon } from '@/lib/icons';

type Msg = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  thought?: string;
  artifact?: boolean;
  firstRun?: FirstRunReply;
};

const BI_MESSAGES: Msg[] = [
  {
    id: 'bi-1',
    role: 'user',
    content:
      'Unexpected token \'N\', …"_amount": NaN, "Stag"… is not valid JSON — these kind of errors are there, fix those.',
    time: '14:42:01',
  },
  {
    id: 'bi-2',
    role: 'assistant',
    thought:
      'The dashboard dataviews are failing to serialize because pandas aggregations (SUM(Amount) on null pipeline stages, and CPC division-by-zero) emit literal NaN, which is not valid JSON. I should coerce, fill, and replace NaN/inf across every dataview before returning records.',
    content:
      'Fixed. The root cause was NaN values from pandas aggregations (especially SUM(Amount) in CRM where some pipeline stages had null amounts, and CPC division-by-zero cases) being serialized as literal NaN — which is not valid JSON. Every dataview now explicitly coerces, fills, and replaces NaN/inf values before returning records.',
    time: '14:42:44',
    artifact: true,
  },
];

function firstRunMessages(query: string, baseId: string, time: string): Msg[] {
  const reply = buildFirstRunReply(query);
  return [
    { id: `${baseId}-user`, role: 'user', content: query, time },
    {
      id: `${baseId}-assistant`,
      role: 'assistant',
      thought: FIRST_RUN_THOUGHT,
      content: reply.answer,
      firstRun: reply,
      time,
    },
  ];
}

const CANNED_SOURCE_REPLY =
  'Sure — I can pull that from your connected sources. Give me a moment to reconcile the numbers across Stripe and Zoho, then I’ll summarize the key movements and flag anything that needs attention.';

function ChatView() {
  const router = useRouter();
  const params = useSearchParams();
  const q = params.get('q');
  const c = params.get('c');

  const { ready, hasSource, source } = useDataSource();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;
    if (c === 'bi-setup') {
      setMessages(BI_MESSAGES);
      setPanelOpen(true);
      return;
    }
    if (q) {
      // A question arrived from the home composer — show it and answer live.
      const time = new Date().toLocaleTimeString('en-GB');
      setMessages([{ id: 'q-user', role: 'user', content: q, time }]);
      void requestReply(q, [{ role: 'user', content: q }]);
      return;
    }
    setMessages(SAMPLE_CONVERSATION as Msg[]);
    // Seed once the data-source state is known; params are stable per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isThinking]);

  // Fetch a live LLM reply; falls back to the scripted first-run reply only
  // when the server reports no API key is configured.
  const requestReply = async (
    text: string,
    history: { role: 'user' | 'assistant'; content: string }[],
  ) => {
    setIsThinking(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, hasSource, source }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.configured === false) {
        const time = new Date().toLocaleTimeString('en-GB');
        setMessages((prev) =>
          hasSource
            ? [
                ...prev,
                { id: `a-${prev.length}`, role: 'assistant', content: CANNED_SOURCE_REPLY, time },
              ]
            : // Scripted first-run replies embed the user message themselves,
              // so swap out the optimistic one already in the thread.
              [...prev.slice(0, -1), ...firstRunMessages(text, `u-${prev.length}`, time)],
        );
        return;
      }

      const errorText: string = !res.ok
        ? data.error ?? 'Something went wrong talking to the model.'
        : '';

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${prev.length}`,
          role: 'assistant',
          content: errorText || data.reply,
          thought: errorText ? undefined : data.thought,
          time: new Date().toLocaleTimeString('en-GB'),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${prev.length}`,
          role: 'assistant',
          content: 'I couldn’t reach the server just now — check your connection and try again.',
          time: new Date().toLocaleTimeString('en-GB'),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const send = async (text: string) => {
    if (isThinking) return;
    const time = new Date().toLocaleTimeString('en-GB');
    const history = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: text },
    ];
    setMessages((prev) => [
      ...prev,
      { id: `u-${prev.length}`, role: 'user', content: text, time },
    ]);
    await requestReply(text, history);
  };

  const goToConnectors = () => router.push('/settings/connectors/add');

  // Anchor the connect banner to the newest live reply only.
  const lastAssistantId = messages.filter((m) => m.role === 'assistant').at(-1)?.id;

  return (
    <div className="chat-view" data-split={panelOpen}>
      <div className="chat-col">
        <div className="chat-scroll">
          <div className="chat-thread">
            {messages.map((m) => (
              <Message
                key={m.id}
                role={m.role}
                content={m.content}
                time={m.time}
                thought={m.thought}
              >
                {m.firstRun && (
                  <FirstRunAnswer reply={m.firstRun} onConnect={goToConnectors} />
                )}
                {!hasSource &&
                  !m.firstRun &&
                  m.role === 'assistant' &&
                  m.id === lastAssistantId && (
                    <div className="first-run">
                      <ConnectSourceCta onConnect={goToConnectors} />
                    </div>
                  )}
                {m.artifact && (
                  <button
                    className="btn btn--sm"
                    style={{ marginTop: 12, alignSelf: 'flex-start' }}
                    onClick={() => setPanelOpen(true)}
                  >
                    <Icon.grid size={15} />
                    Finanshels Org BI Dashboard
                    <Icon.chevronR size={14} />
                  </button>
                )}
              </Message>
            ))}
            {isThinking && (
              <div className="msg msg--assistant">
                <div className="msg__bubble" style={{ color: 'var(--text-muted)' }}>
                  Thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
        <div className="chat-foot">
          <div className="chat-foot__inner">
            <Composer onSend={send} />
          </div>
        </div>
      </div>

      {panelOpen && <ArtifactPanel onClose={() => setPanelOpen(false)} />}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatView />
    </Suspense>
  );
}
