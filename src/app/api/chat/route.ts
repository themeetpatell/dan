import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

/* ============================================================
   Dan — chat completion route
   Two provider paths, configured via .env.local:
   1. ANTHROPIC_API_KEY            → Claude (claude-opus-4-8)
   2. LLM_API_KEY (+ LLM_BASE_URL, → any OpenAI-compatible API
      LLM_MODEL)                     (Groq, OpenRouter, Zhipu…)
   Anthropic wins when both are set. With neither, returns
   { configured: false } so the client falls back to the
   scripted demo replies.
   ============================================================ */

const ANTHROPIC_MODEL = 'claude-opus-4-8';
const DEFAULT_OPENAI_BASE_URL = 'https://api.groq.com/openai/v1';
const DEFAULT_OPENAI_MODEL = 'moonshotai/kimi-k2-instruct-0905';
const MAX_TOKENS = 4096;
const MAX_HISTORY_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 8000;
const OPENAI_TIMEOUT_MS = 60_000;

type ChatMessage = { role: 'user' | 'assistant'; content: string };
type ChatResult = { reply: string; thought?: string };
type SourceState = 'none' | 'demo' | 'connected';

/* Demo dataset (Finanshels sample). When demo data is active, Dan answers
   from these figures as if freshly queried — the whole point of the demo is
   to feel real, so it must NOT hedge with "I would pull…". Currency is AED. */
const DEMO_FACTS = [
  'Connected demo sources: Stripe (payments), Zoho Books (accounting), Zoho CRM (pipeline), Google Analytics 4, Google Search Console. All figures are in AED.',
  'Receivables: 1,237 open invoices totalling 5,290,094 AED uncollected; 1,205 are stale (>30 days) worth 5,178,852 AED; average age 254 days; oldest 725 days.',
  'Payments (Stripe, last 7 days): 22.5% charge-failure rate (16 of 71 failed), 43,352 AED uncaptured; top reason card_declined.',
  'Payables (Zoho Books): 9 overdue bills worth 488,336 AED — 86% of outstanding; largest vendor is Finanshels Accounting Technologies FZ LLC.',
  'Pipeline (Zoho CRM): 390 open deals have expired close dates; 621 deals sit at 0 AED; 2,095 deals are stuck in Backlogs; 55,150 tasks are Not Started vs 22 completed.',
  'Marketing (Google Ads/GA4): 4 Search campaigns are losing impression share; 6 campaigns show runaway CPC; 5 high-spend campaigns report near-zero conversion value.',
  'Weekly financials trend up: last week 176k invoiced, 149k collected, 79k expenses.',
];

function buildSystemPrompt(source: SourceState): string {
  const base = [
    'You are Dan, a business data analyst embedded in the Dan analytics product.',
    'You answer business questions — revenue, pipeline, marketing, product, and finance — in a warm, direct, human voice. Never sound canned or robotic.',
    'Keep replies conversational and concise: a short greeting gets a short reply; an analytical question gets a focused, structured answer.',
    'Reply in plain text only — no markdown headers, no bullet syntax unless genuinely listing items.',
  ];
  if (source === 'demo') {
    base.push(
      'The workspace has demo data connected. Treat the facts below as live results you just queried from the connected sources — answer directly with these specific numbers and never say you "would pull" data or "cannot run queries".',
      ...DEMO_FACTS.map((f) => `• ${f}`),
      'If a question asks for a breakdown these facts do not contain (e.g. a per-customer ranking), lead with the most relevant real figures above, then note the one extra cut you would add — in a single sentence, not a hedge.',
    );
  } else if (source === 'connected') {
    base.push(
      'The workspace has live connected sources: Stripe (payments), Zoho Books (accounting), Zoho CRM (sales pipeline), Google Analytics 4 (web traffic), and Google Search Console (search).',
      'You may reason about what those sources could show, but you cannot run live queries in this conversation — be honest about that and describe what you would pull rather than inventing exact numbers.',
    );
  } else {
    base.push(
      'No data source is connected yet, so you cannot cite real numbers.',
      'Structure every substantive reply as four short beats, written as flowing prose with no labels or headings:',
      '1. Answer the question briefly and genuinely — even if it is off-topic like weather, respond helpfully instead of refusing or lecturing. Never invent facts you cannot know (live weather, news, their metrics); for those, say so in a friendly way and point them to the right place.',
      '2. Bridge from their question to what Dan can do — connect the topic to querying their billing, CRM, product, and analytics data directly.',
      '3. Guide them with one or two concrete things you would deliver once their data is connected — exact figures, breakdowns, trends, or proactive monitoring relevant to their question.',
      '4. Close with a single short line inviting them to connect a data source so you can answer with their live numbers. A connect button is shown right below your reply, so keep this to one sentence and do not repeat it.',
      'For pure small talk (a bare "hi" or "thanks"), reply naturally in one or two lines and skip beats 2–4.',
    );
  }
  return base.join('\n');
}

// The chat bubble renders plain text, so markdown markers would show up
// literally. Some models (gpt-oss especially) emit them despite the prompt.
function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,4}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/^[ \t]*[-*]\s+/gm, '• ');
}

function parseMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const cleaned: ChatMessage[] = [];
  for (const item of raw.slice(-MAX_HISTORY_MESSAGES)) {
    if (typeof item !== 'object' || item === null) return null;
    const { role, content } = item as Record<string, unknown>;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') {
      return null;
    }
    const trimmed = content.slice(0, MAX_MESSAGE_CHARS).trim();
    if (trimmed) cleaned.push({ role, content: trimmed });
  }
  if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== 'user') return null;
  return cleaned;
}

/* ---------------- Provider: Anthropic ---------------- */

async function callAnthropic(
  apiKey: string,
  system: string,
  messages: ChatMessage[],
): Promise<ChatResult> {
  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: MAX_TOKENS,
    thinking: { type: 'adaptive', display: 'summarized' },
    system,
    messages,
  });

  if (response.stop_reason === 'refusal') {
    return {
      reply:
        'I can’t help with that one — try asking me something about your business data instead.',
    };
  }

  let reply = '';
  let thought = '';
  for (const block of response.content) {
    if (block.type === 'text') reply += block.text;
    else if (block.type === 'thinking' && block.thinking) thought += block.thinking;
  }
  return { reply: reply.trim(), thought: thought.trim() || undefined };
}

/* ---------------- Provider: OpenAI-compatible (Groq, OpenRouter, Zhipu…) ---------------- */

class OpenAICompatError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function callOpenAICompatible(
  apiKey: string,
  system: string,
  messages: ChatMessage[],
): Promise<ChatResult> {
  const baseUrl = (process.env.LLM_BASE_URL || DEFAULT_OPENAI_BASE_URL).replace(/\/$/, '');
  const model = process.env.LLM_MODEL || DEFAULT_OPENAI_MODEL;

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: MAX_TOKENS,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
    signal: AbortSignal.timeout(OPENAI_TIMEOUT_MS),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('OpenAI-compatible provider error', res.status, detail.slice(0, 500));
    throw new OpenAICompatError(res.status, detail.slice(0, 200));
  }

  const data: unknown = await res.json();
  const message = (data as { choices?: { message?: Record<string, unknown> }[] })?.choices?.[0]
    ?.message;
  const reply = typeof message?.content === 'string' ? message.content.trim() : '';
  // Reasoning models expose raw, unsummarized chain-of-thought as `reasoning`
  // (OpenRouter) or `reasoning_content` (Groq, Zhipu, DeepSeek). It leaks
  // prompt-compliance chatter ("respond as Dan… no markdown headers"), so we
  // never surface it. Only Anthropic's `display: 'summarized'` thinking is
  // safe to show, and that comes through the Anthropic path.
  return { reply };
}

/* ---------------- Route handlers ---------------- */

export async function GET() {
  const provider = process.env.ANTHROPIC_API_KEY
    ? 'anthropic'
    : process.env.LLM_API_KEY
      ? 'openai-compatible'
      : null;
  return NextResponse.json({ configured: provider !== null, provider });
}

export async function POST(request: Request) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openAIKey = process.env.LLM_API_KEY;
  if (!anthropicKey && !openAIKey) {
    return NextResponse.json({ configured: false });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { messages: rawMessages, hasSource, source: rawSource } = (body ?? {}) as Record<
    string,
    unknown
  >;
  const messages = parseMessages(rawMessages);
  if (!messages) {
    return NextResponse.json(
      { error: 'Expected non-empty messages array ending with a user message.' },
      { status: 400 },
    );
  }

  // Prefer the explicit source state; fall back to the legacy boolean so older
  // clients still resolve to a sensible connected/none branch.
  const source: SourceState =
    rawSource === 'demo' || rawSource === 'connected' || rawSource === 'none'
      ? rawSource
      : hasSource === true
        ? 'connected'
        : 'none';
  const system = buildSystemPrompt(source);

  try {
    const result = anthropicKey
      ? await callAnthropic(anthropicKey, system, messages)
      : await callOpenAICompatible(openAIKey as string, system, messages);

    if (!result.reply) {
      return NextResponse.json(
        { error: 'The model returned an empty reply. Please try again.' },
        { status: 502 },
      );
    }
    return NextResponse.json({
      configured: true,
      ...result,
      reply: stripMarkdown(result.reply),
    });
  } catch (error: unknown) {
    return NextResponse.json(...mapProviderError(error));
  }
}

function mapProviderError(error: unknown): [body: { error: string }, init: { status: number }] {
  if (error instanceof Anthropic.AuthenticationError) {
    return [{ error: 'The ANTHROPIC_API_KEY in .env.local is invalid or revoked.' }, { status: 401 }];
  }
  if (error instanceof Anthropic.RateLimitError) {
    return [
      { error: 'Rate limited by the model provider — wait a moment and try again.' },
      { status: 429 },
    ];
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return [
      { error: 'Could not reach the model provider. Check your network and try again.' },
      { status: 502 },
    ];
  }
  if (error instanceof Anthropic.APIError) {
    console.error('Anthropic API error', error.status, error.message);
    return [
      { error: 'The model provider returned an error. Please try again.' },
      { status: 502 },
    ];
  }
  if (error instanceof OpenAICompatError) {
    if (error.status === 401 || error.status === 403) {
      return [
        { error: 'The LLM_API_KEY in .env.local is invalid — check the key and provider.' },
        { status: 401 },
      ];
    }
    if (error.status === 404) {
      return [
        { error: 'Model not found — check LLM_MODEL and LLM_BASE_URL in .env.local.' },
        { status: 502 },
      ];
    }
    if (error.status === 429) {
      return [
        { error: 'Rate limited — free tiers have daily caps. Wait a moment and try again.' },
        { status: 429 },
      ];
    }
    return [
      { error: 'The model provider returned an error. Please try again.' },
      { status: 502 },
    ];
  }
  if (error instanceof Error && error.name === 'TimeoutError') {
    return [{ error: 'The model took too long to respond. Please try again.' }, { status: 504 }];
  }
  console.error('Unexpected chat route error', error);
  return [{ error: 'Something went wrong. Please try again.' }, { status: 500 }];
}
