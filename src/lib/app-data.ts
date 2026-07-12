import type { IconName } from './icons';

/* ============================================================
   Dan — Main app mock data
   Static fixtures that drive the workspace shell, activity
   feed, chat, artifacts, and dashboards. No backend.
   ============================================================ */

/* ---------------- Workspace navigation ---------------- */
export type AppNavItem = {
  slug: string;
  label: string;
  icon: IconName;
  href: string;
};

export const APP_NAV: AppNavItem[] = [
  { slug: 'activity', label: 'Activity Feed', icon: 'activity', href: '/activity' },
  { slug: 'new', label: 'New chat', icon: 'newChat', href: '/' },
  { slug: 'artifacts', label: 'Artifacts', icon: 'artifacts', href: '/artifacts' },
];

export type RecentChat = { id: string; title: string };

export const RECENT_CHATS: RecentChat[] = [
  { id: 'traffic-ctr', title: 'Traffic & CTR Trends' },
  { id: 'weekly-crm', title: 'Weekly CRM Report' },
  { id: 'lost-deals', title: 'Lost Deals Analysis' },
  { id: 'bi-setup', title: 'Finanshels BI Setup' },
  { id: 'hi', title: 'hi' },
];

/* ---------------- Activity feed ---------------- */
export type Insight = 'Risk' | 'Opportunity' | 'Summary';
export type Priority = 'P1' | 'P2' | 'P3';

export type FeedItem = {
  id: string;
  insight: Insight;
  priority: Priority;
  title: string;
  summary: string;
  timeAgo: string;
  detail: {
    heading: string;
    bullets: { label: string; value: string }[];
    note?: string;
    actionLabel: string;
  };
  tags: string[];
};

export const FEED_ITEMS: FeedItem[] = [
  {
    id: 'stale-invoices',
    insight: 'Risk',
    priority: 'P2',
    title: '1205 stale open invoices totaling 5,178,852 AED',
    summary:
      '1237 open invoices (1205 older than 30 days) represent 5,290,094 AED in uncollected revenue. Oldest is 725 days.',
    timeAgo: '1d ago',
    detail: {
      heading:
        'Follow up on aged open invoices immediately — 1205 invoices are past 30 days and total 5,178,852 AED.',
      bullets: [
        { label: 'Open invoices', value: '1237 of 3196 total in period' },
        { label: 'Total open amount', value: '5,290,094 AED' },
        { label: 'Average age', value: '254 days' },
        { label: 'Stale invoices (> 30 days)', value: '1205 totaling 5,178,852 AED' },
        { label: 'Oldest open invoice', value: '725 days' },
      ],
      note: 'Review whether these are collectible, system migration artifacts, or require write-off.',
      actionLabel: 'Review stale invoices',
    },
    tags: ['STRIPE - FINANSHELS', 'INVOICES', 'COLLECTIONS', 'RISK', 'REVENUE'],
  },
  {
    id: 'payment-failure',
    insight: 'Risk',
    priority: 'P2',
    title: 'Payment failure rate at 22.5% (21.8% by value)',
    summary:
      '16 of 71 charges failed in the last 7 days, leaving 43,352.40 AED uncaptured. Top reason: card declined (16 charges).',
    timeAgo: '1d ago',
    detail: {
      heading:
        'Recover failed payments — a 22.5% failure rate is well above the 8% healthy threshold.',
      bullets: [
        { label: 'Failed charges', value: '16 of 71 (7 days)' },
        { label: 'Uncaptured value', value: '43,352.40 AED' },
        { label: 'Failure rate by value', value: '21.8%' },
        { label: 'Top reason', value: 'Card declined (16)' },
      ],
      note: 'Enable automatic retries and dunning emails to recover a portion of these charges.',
      actionLabel: 'Review failed charges',
    },
    tags: ['STRIPE - FINANSHELS', 'PAYMENTS', 'RISK', 'REVENUE'],
  },
  {
    id: 'impression-share',
    insight: 'Risk',
    priority: 'P2',
    title: '4 Search campaigns losing impression share',
    summary:
      '4 Search campaigns are losing most auctions; no campaigns exceed spend-concentration thresholds.',
    timeAgo: '1d ago',
    detail: {
      heading: 'Raise bids or budgets on 4 Search campaigns losing impression share.',
      bullets: [
        { label: 'Concentration risks', value: '0 campaigns' },
        { label: 'Low impression share', value: '4 Search campaigns' },
        { label: 'Lost to budget', value: '38% average' },
        { label: 'Lost to rank', value: '24% average' },
      ],
      actionLabel: 'Review impression share',
    },
    tags: ['GOOGLE ADS', 'CAMPAIGNS', 'RISK'],
  },
  {
    id: 'zero-conversion',
    insight: 'Risk',
    priority: 'P2',
    title: '5 campaigns reporting zero conversion values',
    summary:
      '5 high-spend campaigns recorded 116 conversions but near-zero conversion values this week.',
    timeAgo: '1d ago',
    detail: {
      heading: 'Fix conversion value tracking on 5 high-spend campaigns.',
      bullets: [
        { label: 'Affected campaigns', value: '5' },
        { label: 'Conversions recorded', value: '116' },
        { label: 'Conversion value', value: 'near-zero' },
        { label: 'Weekly spend at risk', value: '12,480 AED' },
      ],
      note: 'Likely a tag or value parameter issue — ROAS cannot be trusted until resolved.',
      actionLabel: 'Inspect tracking',
    },
    tags: ['GOOGLE ADS', 'CONVERSIONS', 'RISK', 'TRACKING'],
  },
  {
    id: 'cpc-escalation',
    insight: 'Risk',
    priority: 'P2',
    title: 'CPC escalation: 6 campaigns flagged, 18 extreme keywords',
    summary:
      '6 campaigns exceeded CPC thresholds this week, with some keywords exceeding 1,000 AED per click.',
    timeAgo: '1d ago',
    detail: {
      heading: 'Cap bids on 18 extreme keywords driving runaway CPC.',
      bullets: [
        { label: 'Flagged campaigns', value: '6' },
        { label: 'Extreme keywords', value: '18' },
        { label: 'Peak CPC', value: '1,024 AED / click' },
        { label: 'Median flagged CPC', value: '186 AED / click' },
      ],
      actionLabel: 'Review keyword bids',
    },
    tags: ['GOOGLE ADS', 'KEYWORDS', 'RISK', 'SPEND'],
  },
  {
    id: 'overdue-bills',
    insight: 'Risk',
    priority: 'P2',
    title: '9 overdue bills worth 488,336 AED',
    summary:
      'Overdue payables stand at 488,336 AED (86% of outstanding), with Finanshels Accounting Technologies FZ LLC accounting for th…',
    timeAgo: '1d ago',
    detail: {
      heading: 'Settle or reschedule 9 overdue vendor bills to protect supplier terms.',
      bullets: [
        { label: 'Overdue bills', value: '9' },
        { label: 'Overdue value', value: '488,336 AED' },
        { label: 'Share of outstanding', value: '86%' },
        { label: 'Largest vendor', value: 'Finanshels Accounting Technologies FZ LLC' },
      ],
      actionLabel: 'Review payables',
    },
    tags: ['ZOHO BOOKS', 'PAYABLES', 'RISK'],
  },
  {
    id: 'overdue-invoices',
    insight: 'Risk',
    priority: 'P2',
    title: '237 overdue invoices worth 550,257 AED',
    summary:
      'Overdue receivables stand at 550,257 AED (89% of outstanding), with 402,480 AED in the 1-30 day bucket.',
    timeAgo: '1d ago',
    detail: {
      heading: 'Chase 237 overdue receivables before they age further.',
      bullets: [
        { label: 'Overdue invoices', value: '237' },
        { label: 'Overdue value', value: '550,257 AED' },
        { label: 'Share of outstanding', value: '89%' },
        { label: '1-30 day bucket', value: '402,480 AED' },
      ],
      actionLabel: 'Review receivables',
    },
    tags: ['ZOHO BOOKS', 'RECEIVABLES', 'COLLECTIONS', 'RISK'],
  },
  {
    id: 'expired-closing',
    insight: 'Risk',
    priority: 'P2',
    title: 'Open pipeline has expired closing dates',
    summary:
      '390 open deals have past closing dates (6.7% of pipeline), including 56,648 AED in stale value.',
    timeAgo: '1d ago',
    detail: {
      heading: 'Re-date or close 390 deals with expired close dates to restore forecast accuracy.',
      bullets: [
        { label: 'Expired deals', value: '390' },
        { label: 'Share of pipeline', value: '6.7%' },
        { label: 'Stale value', value: '56,648 AED' },
      ],
      actionLabel: 'Review pipeline hygiene',
    },
    tags: ['ZOHO CRM', 'PIPELINE', 'RISK'],
  },
  {
    id: 'zero-amount',
    insight: 'Risk',
    priority: 'P2',
    title: 'Pipeline distorted by zero-amount deals',
    summary:
      '621 open deals have a 0 AED amount (10.7% of open pipeline), including 373 in Qualified Opportunity.',
    timeAgo: '1d ago',
    detail: {
      heading: 'Add amounts to 621 zero-value deals so pipeline coverage is trustworthy.',
      bullets: [
        { label: 'Zero-amount deals', value: '621' },
        { label: 'Share of open pipeline', value: '10.7%' },
        { label: 'In Qualified Opportunity', value: '373' },
      ],
      actionLabel: 'Review deal amounts',
    },
    tags: ['ZOHO CRM', 'PIPELINE', 'RISK', 'DATA QUALITY'],
  },
  {
    id: 'backlog-bloat',
    insight: 'Risk',
    priority: 'P2',
    title: 'Backlogs pipeline is bloated with stale deals',
    summary:
      '2,095 deals sit in Backlogs — 60.8% have no close date and 34 have past close dates worth 43,502 AED.',
    timeAgo: '1d ago',
    detail: {
      heading: 'Triage the Backlogs stage — most deals are missing close dates.',
      bullets: [
        { label: 'Deals in Backlogs', value: '2,095' },
        { label: 'Missing close date', value: '60.8%' },
        { label: 'Past close date', value: '34 worth 43,502 AED' },
      ],
      actionLabel: 'Review backlog',
    },
    tags: ['ZOHO CRM', 'PIPELINE', 'RISK'],
  },
  {
    id: 'task-hygiene',
    insight: 'Risk',
    priority: 'P2',
    title: 'Task hygiene crisis',
    summary:
      '55,150 tasks are Not Started (61.0% of all tasks) vs only 22 successfully completed — activity tracking is broken.',
    timeAgo: '1d ago',
    detail: {
      heading: 'Investigate task tracking — completion is effectively not being recorded.',
      bullets: [
        { label: 'Not Started tasks', value: '55,150 (61.0%)' },
        { label: 'Completed tasks', value: '22' },
        { label: 'Total tasks', value: '90,410' },
      ],
      note: 'Either reps are not logging activity or the sync is dropping status updates.',
      actionLabel: 'Review task data',
    },
    tags: ['ZOHO CRM', 'ACTIVITY', 'RISK', 'DATA QUALITY'],
  },
];

/* ---------------- Chat models ---------------- */
export type ModelProvider = 'openai' | 'google' | 'moonshot' | 'anthropic';

export type ChatModel = {
  id: string;
  label: string;
  provider: ModelProvider;
  tier: 'pro' | 'standard' | 'fast';
};

export const PROVIDER_META: Record<ModelProvider, { name: string; color: string; mark: string }> = {
  openai: { name: 'OpenAI', color: '#0f9d6e', mark: '◉' },
  google: { name: 'Google', color: '#6f8bef', mark: '✦' },
  moonshot: { name: 'Moonshot', color: '#7a6cf0', mark: '☾' },
  anthropic: { name: 'Anthropic', color: '#c8734a', mark: '✳' },
};

export const CHAT_MODELS: ChatModel[] = [
  { id: 'gpt-5.2-pro', label: 'gpt-5.2-pro', provider: 'openai', tier: 'pro' },
  { id: 'gpt-5.3-codex', label: 'gpt-5.3-codex', provider: 'openai', tier: 'pro' },
  { id: 'gpt-5.3-chat', label: 'gpt-5.3-chat', provider: 'openai', tier: 'standard' },
  { id: 'gpt-5.2', label: 'gpt-5.2', provider: 'openai', tier: 'standard' },
  { id: 'gpt-5.1', label: 'gpt-5.1', provider: 'openai', tier: 'standard' },
  { id: 'gpt-5-mini', label: 'gpt-5-mini', provider: 'openai', tier: 'fast' },
  { id: 'gpt-5-nano', label: 'gpt-5-nano', provider: 'openai', tier: 'fast' },
  { id: 'gemini-2-5-pro', label: 'gemini-2-5-pro', provider: 'google', tier: 'pro' },
  { id: 'gemini-2-5-flash', label: 'gemini-2-5-flash', provider: 'google', tier: 'fast' },
  { id: 'claude-opus-4-8', label: 'claude-opus-4.8', provider: 'anthropic', tier: 'pro' },
  { id: 'claude-sonnet-5', label: 'claude-sonnet-5', provider: 'anthropic', tier: 'standard' },
  { id: 'kimi-k2.6', label: 'kimi-k2.6', provider: 'moonshot', tier: 'standard' },
];

export const SUGGESTIONS = [
  'How can you help me?',
  'Audience geography',
  'Payout summary',
  'Recent changes',
  'Top customers by revenue',
];

export type AttentionItem = { text: string; action: string };

/* Home-page attention bullets are derived from the business feed so
   the two surfaces never drift: risks first, then by priority. */
const ATTENTION_ITEM_COUNT = 3;
const INSIGHT_RANK: Record<Insight, number> = { Risk: 0, Opportunity: 1, Summary: 2 };
const PRIORITY_RANK: Record<Priority, number> = { P1: 0, P2: 1, P3: 2 };

export const ATTENTION_ITEMS: AttentionItem[] = [...FEED_ITEMS]
  .sort(
    (a, b) =>
      INSIGHT_RANK[a.insight] - INSIGHT_RANK[b.insight] ||
      PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority],
  )
  .slice(0, ATTENTION_ITEM_COUNT)
  .map((item) => ({ text: item.summary, action: item.detail.actionLabel }));

/* ---------------- Notifications ---------------- */
export type Notification = { id: string; title: string; timeAgo: string; unread: boolean };

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Risk analysis completed for Stripe - Finanshels', timeAgo: '1d ago', unread: true },
  { id: 'n2', title: 'Stripe Refund & Dispute Monitor completed', timeAgo: '1d ago', unread: true },
  { id: 'n3', title: 'Stripe Revenue Concentration Risk completed', timeAgo: '1d ago', unread: true },
  { id: 'n4', title: 'Stripe Weekly Collection Summary completed', timeAgo: '1d ago', unread: true },
  { id: 'n5', title: 'Stripe Subscription Past Due Alert completed', timeAgo: '1d ago', unread: true },
  { id: 'n6', title: 'Stripe Stale Open Invoice Risk completed', timeAgo: '1d ago', unread: true },
];

/* ---------------- Conversation ---------------- */
export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  thought?: string;
};

export const SAMPLE_CONVERSATION: ChatMessage[] = [
  { id: 'm1', role: 'user', content: 'hi', time: '23:09:46' },
  {
    id: 'm2',
    role: 'assistant',
    content: 'Hey! Ready to help. What would you like to analyze today?',
    time: '23:09:50',
    thought:
      'The user said "hi" - this is just a greeting. I should respond briefly and ask what they need help with, or offer assistance with data analysis using their connected tools. No need for tool calls here.',
  },
];

/* ---------------- Artifacts ---------------- */
export type ArtifactKind = 'presentation' | 'dashboard';

export type Artifact = {
  id: string;
  name: string;
  description: string;
  kind: ArtifactKind;
  saved: boolean;
  tool: string;
};

export const ARTIFACTS: Artifact[] = [
  {
    id: 'a1',
    name: 'Finanshels Weekly Business Review',
    description: 'Finanshels Weekly Business Review',
    kind: 'presentation',
    saved: true,
    tool: 'Stripe',
  },
  {
    id: 'a2',
    name: 'Finanshels Org BI Dashboard',
    description: 'Finanshels Org BI Dashboard',
    kind: 'dashboard',
    saved: true,
    tool: 'Stripe',
  },
  {
    id: 'a3',
    name: 'Finanshels Weekly Business Review',
    description: 'Finanshels Weekly Business Review',
    kind: 'presentation',
    saved: true,
    tool: 'Zoho CRM',
  },
  {
    id: 'a4',
    name: 'Finanshels Org BI Dashboard',
    description: 'Finanshels Org BI Dashboard',
    kind: 'dashboard',
    saved: true,
    tool: 'Zoho Books',
  },
];

export type Slide = { title: string; kind: 'title' | 'section'; body?: string };

export const PRESENTATION_SLIDES: Slide[] = [
  { title: 'Finanshels Weekly Business Review', kind: 'title' },
  {
    title: 'Executive Summary',
    kind: 'section',
    body: 'Revenue collection improved week-over-week while aged receivables remain the primary risk. Ad spend efficiency held steady; pipeline hygiene needs attention.',
  },
  {
    title: 'Cash & Collections',
    kind: 'section',
    body: 'Cash collected trended up against invoiced revenue, but 5.2M AED remains uncollected across 1,205 stale invoices.',
  },
  {
    title: 'Growth & Marketing',
    kind: 'section',
    body: 'Branded search carries most SEO traffic; non-branded VAT and corporate-tax content is a clear opportunity gap.',
  },
];

/* ---------------- Chart series ---------------- */
export type WeeklyPoint = {
  week: string;
  invoiced: number;
  collected: number;
  expenses: number;
};

export const FINANCIAL_HEALTH: WeeklyPoint[] = [
  { week: '2026-06-08', invoiced: 118, collected: 74, expenses: 61 },
  { week: '2026-06-15', invoiced: 152, collected: 96, expenses: 70 },
  { week: '2026-06-22', invoiced: 189, collected: 132, expenses: 84 },
  { week: '2026-06-29', invoiced: 141, collected: 108, expenses: 66 },
  { week: '2026-07-06', invoiced: 176, collected: 149, expenses: 79 },
];

export type CashFlowPoint = {
  week: string;
  charge: number;
  fee: number;
  payout: number;
  refund: number;
};

export const CASH_FLOW: CashFlowPoint[] = [
  { week: '2026-06-08', charge: 142, fee: -8, payout: -96, refund: -3 },
  { week: '2026-06-15', charge: 168, fee: -10, payout: -120, refund: -5 },
  { week: '2026-06-22', charge: 195, fee: -12, payout: -150, refund: -2 },
  { week: '2026-06-29', charge: 131, fee: -7, payout: -104, refund: -6 },
  { week: '2026-07-06', charge: 176, fee: -11, payout: -138, refund: -4 },
];

export const CASH_FLOW_SERIES: { key: keyof Omit<CashFlowPoint, 'week'>; label: string; color: string }[] = [
  { key: 'charge', label: 'charge', color: 'var(--cat-1)' },
  { key: 'fee', label: 'fee', color: 'var(--cat-2)' },
  { key: 'payout', label: 'payout', color: 'var(--cat-3)' },
  { key: 'refund', label: 'refund', color: 'var(--cat-4)' },
];
