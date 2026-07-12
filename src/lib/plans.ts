/* ------------------------------------------------------------------
   Pricing plans — the ladder monetizes how operationally important Dan
   becomes (monitoring cadence, systems reconciled, decision memory,
   governance), NOT infrastructure counts. Free → Growth → Business →
   Enterprise. Every paid tier keeps members unlimited, the included
   Dan-usage pool exceeds the sticker (metered at model cost, no
   markup), and annual billing gives 2 months free.

   Feature copy is grounded in what Dan actually ships: the Activity
   Feed (Risk/Opportunity/Summary signals), Dan-created scheduled
   workflows, artifacts (dashboards & presentations), connectors,
   multi-model routing + bring-your-own-key, usage caps & alerts,
   roles, and the Debug Logs audit trail.
   ------------------------------------------------------------------ */

// Annual = pay for 10 months (2 months free) → ~16.7% effective saving.
export const ANNUAL_MONTHS_BILLED = 10;

export const REASSURANCE =
  'Paid plans include unlimited members. Usage is transparent, capped by you, and charged without an AI markup.';

export type PlanId = 'free' | 'growth' | 'business' | 'enterprise';

export type Plan = {
  id: PlanId;
  name: string;
  tagline: string;
  positioning: string;
  monthlyPrice: number | null; // null = custom / quote-only
  includedUsage: string;
  bonus?: string; // included-value bonus, e.g. '+16% value'
  features: string[];
  cta: string;
  ctaNote?: string;
  isCurrent?: boolean;
  isRecommended?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Understand what Dan can do with your data.',
    positioning: 'Explore Dan',
    monthlyPrice: 0,
    includedUsage: '$5/mo of Dan usage',
    features: [
      '2 connectors · daily sync',
      'Up to 3 members',
      'Chat with your business data',
      'Dashboards & presentations',
      'Activity Feed with limited signals',
      'Weekly business digest',
      '7-day history',
      'Community support',
    ],
    cta: 'Start free',
    ctaNote: 'No card required',
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'Run your company with proactive intelligence.',
    positioning: 'Run your business with Dan',
    monthlyPrice: 199,
    includedUsage: '$230/mo of Dan usage',
    bonus: '+16% value',
    features: [
      'Everything in Free',
      'Unlimited connectors · 15-min sync',
      'Cross-system reconciliation',
      'Shared Activity Feed · daily digest',
      'Unlimited Dan-run workflows',
      'Automated risk & opportunity monitoring',
      'Saved artifact library',
      'Multi-model routing · bring your own model key',
      'Usage export & API',
      '180-day history',
      'Priority support',
    ],
    cta: 'Upgrade to Growth',
    ctaNote: 'Prorated today · cancel anytime',
    isCurrent: true,
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'Coordinate decisions across every team.',
    positioning: 'Operate across teams',
    monthlyPrice: 499,
    includedUsage: '$625/mo of Dan usage',
    bonus: '+25% value',
    features: [
      'Everything in Growth',
      'SAML SSO · advanced roles & permissions',
      'Complete audit log · admin console',
      'Group usage controls & spend policy',
      'Custom alert routing',
      'Unlimited history',
      'Guided onboarding · quarterly reviews',
    ],
    cta: 'Choose Business',
    ctaNote: 'Includes SSO & audit log',
    isRecommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Deploy Dan with enterprise-grade control.',
    positioning: 'Govern Dan company-wide',
    monthlyPrice: null,
    includedUsage: 'Custom committed usage pool',
    features: [
      'Everything in Business',
      'SCIM provisioning · Enterprise RBAC',
      'Private database & VPC connectivity',
      'Private cloud or self-hosted deployment',
      'Data residency & custom retention',
      'Custom connectors & workflows',
      '99.9% uptime SLA · dedicated success manager',
      'Invoicing & procurement support',
    ],
    cta: 'Contact sales',
    ctaNote: 'Custom annual contract',
  },
];

/* The four questions that stall an upgrade. */
export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: 'What counts as Dan usage?',
    a: 'The model work Dan spends investigating questions, running monitors, reconciling systems, and building artifacts — metered at provider cost with no markup, itemized on Plan & Usage.',
  },
  {
    q: 'Can I switch plans anytime?',
    a: 'Yes. Upgrades are prorated and take effect immediately; downgrades apply at the end of the billing period, so you never lose time you paid for.',
  },
  {
    q: 'What happens when I hit my included usage?',
    a: 'Nothing surprising. Set a cap to pause Dan at the limit, or keep going at model cost. Owners are alerted at your chosen threshold either way.',
  },
  {
    q: 'Why is SSO on Business and not Enterprise-only?',
    a: 'SSO and audit logs are normal requirements for a scaling company. They belong to Business so a serious buyer never has to open an Enterprise contract just to log in securely.',
  },
];

/* Feature matrix — one value per plan, in PLANS order (4 columns).
   `true` renders a check, `false` renders an em dash, strings render as-is. */
export type CompareValue = string | boolean;

export type CompareRow = {
  label: string;
  values: [CompareValue, CompareValue, CompareValue, CompareValue];
};

export type CompareGroup = {
  title: string;
  rows: CompareRow[];
};

export const COMPARE_GROUPS: CompareGroup[] = [
  {
    title: 'Usage & intelligence',
    rows: [
      { label: 'Included Dan usage', values: ['$5/mo', '$230/mo', '$625/mo', 'Custom pool'] },
      { label: 'Included-value bonus', values: [false, '16%', '25%', 'Volume-based'] },
      { label: 'Usage beyond allowance', values: ['Blocked', 'At model cost', 'At model cost', 'Contractual'] },
      { label: 'Spend caps & alerts', values: [true, true, true, true] },
      { label: 'Usage ledger (by model & member)', values: ['Basic', true, 'Advanced', 'Enterprise'] },
      { label: 'Multi-model routing', values: ['Basic', true, true, 'Custom'] },
      { label: 'Bring your own model key', values: [false, true, true, true] },
      { label: 'Usage export & API', values: [false, true, true, true] },
    ],
  },
  {
    title: 'Data & connectors',
    rows: [
      { label: 'Connectors', values: ['2', 'Unlimited', 'Unlimited', 'Unlimited'] },
      { label: 'Data-sync frequency', values: ['Daily', '15 min', '15 min', 'Custom / real-time'] },
      { label: 'Cross-system reconciliation', values: ['Limited demo', true, 'Advanced', 'Custom'] },
      { label: 'Custom / MCP connectors', values: [false, 'Add-on', 'Add-on', true] },
      { label: 'Private database & VPC connectivity', values: [false, false, 'Add-on', true] },
      { label: 'Data residency', values: [false, false, false, 'Custom'] },
    ],
  },
  {
    title: 'Activity Feed & monitoring',
    rows: [
      { label: 'Activity Feed', values: ['Limited signals', 'Shared', 'Shared', 'Multi-entity'] },
      { label: 'Risk & opportunity detection', values: ['Limited', true, 'Advanced', 'Custom'] },
      { label: 'Dan-run workflows (monitors)', values: [false, 'Unlimited', 'Unlimited', 'Custom'] },
      { label: 'Digest frequency', values: ['Weekly', 'Daily', 'Custom', 'Custom'] },
      { label: 'Recommended actions', values: ['Limited', true, true, 'Governed'] },
      { label: 'Alert channels', values: ['In-app', 'In-app + Slack + email', 'Custom routing', 'Enterprise routing'] },
    ],
  },
  {
    title: 'Chat & artifacts',
    rows: [
      { label: 'Ask business questions', values: [true, true, true, true] },
      { label: 'Dashboards', values: ['Limited', true, true, true] },
      { label: 'Presentations', values: ['Limited', true, true, true] },
      { label: 'Saved artifact library', values: [false, true, true, 'Governed'] },
    ],
  },
  {
    title: 'Team, memory & governance',
    rows: [
      { label: 'Members', values: ['Up to 3', 'Unlimited', 'Unlimited', 'Unlimited'] },
      { label: 'Roles & permissions', values: [false, 'Standard', 'Advanced', 'Enterprise RBAC'] },
      { label: 'History retention', values: ['7 days', '180 days', 'Unlimited', 'Custom'] },
      { label: 'SAML SSO', values: [false, false, true, true] },
      { label: 'SCIM provisioning', values: [false, false, false, true] },
      { label: 'Audit log', values: [false, 'Basic', 'Complete', 'Compliance-grade'] },
      { label: 'Admin console', values: [false, 'Basic', 'Advanced', 'Global admin'] },
      { label: 'Group usage controls', values: [false, false, true, true] },
    ],
  },
  {
    title: 'Security, deployment & support',
    rows: [
      { label: 'Encrypted in transit & at rest', values: [true, true, true, true] },
      { label: 'Data excluded from training', values: [true, true, true, true] },
      { label: 'Support', values: ['Community', 'Priority', 'Priority + onboarding', 'Dedicated'] },
      { label: 'Onboarding', values: ['Self-serve', 'Guided resources', 'Guided onboarding', 'Implementation program'] },
      { label: 'Success reviews', values: [false, false, 'Quarterly', 'Custom cadence'] },
      { label: 'Uptime SLA', values: [false, false, 'Standard target', '99.9% contractual'] },
      { label: 'Private deployment', values: [false, false, false, true] },
      { label: 'Custom security review', values: [false, false, 'Standard docs', true] },
      { label: 'Invoicing', values: [false, 'Annual only', true, true] },
    ],
  },
];
