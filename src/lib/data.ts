import type { IconName } from './icons';

export type NavItem = {
  slug: string;
  label: string;
  icon: IconName;
  badge?: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

/* Regrouped IA — the original was a flat 7-item list.
   Grouping by intent makes the surface scannable. */
export const NAV: NavGroup[] = [
  {
    title: 'Workspace',
    items: [
      { slug: 'general', label: 'General', icon: 'general' },
      { slug: 'members', label: 'Members', icon: 'members' },
      { slug: 'usage', label: 'Plan & Usage', icon: 'gauge' },
      { slug: 'billing', label: 'Billing', icon: 'card' },
    ],
  },
  {
    title: 'Data & Intelligence',
    items: [
      { slug: 'connectors', label: 'Connectors', icon: 'connectors' },
      { slug: 'llm-providers', label: 'LLM providers', icon: 'llm' },
    ],
  },
  {
    title: 'Automation',
    items: [
      { slug: 'workflows', label: 'Workflows', icon: 'workflows' },
      { slug: 'slack', label: 'Slack', icon: 'slack' },
    ],
  },
  {
    title: 'System',
    items: [{ slug: 'debug-logs', label: 'Debug Logs', icon: 'logs' }],
  },
];

export const SECTION_META: Record<string, { title: string; blurb: string }> = {
  general: {
    title: 'General',
    blurb: 'Workspace identity, appearance, and data controls.',
  },
  members: {
    title: 'Members',
    blurb: 'People with access to this workspace and their roles.',
  },
  usage: {
    title: 'Plan & Usage',
    blurb: 'What Dan has spent this period, where it went, and the caps that keep it in check.',
  },
  billing: {
    title: 'Billing',
    blurb: 'Your plan, invoices, payment methods, and how renewals are handled.',
  },
  plans: {
    title: 'Plans',
    blurb: 'Pick the plan that fits — every tier meters Dan usage at cost, and members stay unlimited on paid plans.',
  },
  connectors: {
    title: 'Connectors',
    blurb: 'Sources Dan reads from to answer questions and reconcile numbers.',
  },
  'add-connector': {
    title: 'Add connector',
    blurb: 'Choose a connector type to configure name, credentials, and access.',
  },
  'llm-providers': {
    title: 'LLM providers',
    blurb: 'Bring your own model keys. Dan routes work to the provider you choose.',
  },
  workflows: {
    title: 'Workflows',
    blurb: 'Automations Dan creates for itself as it learns your data. Review, run, pause, or delete them here.',
  },
  slack: {
    title: 'Slack',
    blurb: 'Bring Dan into your channels for answers where work happens.',
  },
  'debug-logs': {
    title: 'Debug Logs',
    blurb: 'Trace what Dan did — every query, tool call, and reconciliation.',
  },
};

export type Member = {
  name: string;
  email: string;
  joined: string;
  role: 'Owner' | 'Admin' | 'Member';
  hue: number;
  you?: boolean;
};

export const MEMBERS: Member[] = [
  {
    name: 'Meet Patel',
    email: 'meet@finanshels.com',
    joined: '16 Jun 2026',
    role: 'Owner',
    hue: 28,
    you: true,
  },
  {
    name: 'Ashish Tripathi',
    email: 'ashish.nittrichy@gmail.com',
    joined: '11 Jul 2026',
    role: 'Admin',
    hue: 210,
  },
];

export type Connector = {
  name: string;
  vendor: string;
  category: 'Analytics' | 'Accounting' | 'CRM' | 'Payments' | 'Search';
  blurb: string;
  status: 'live' | 'syncing' | 'error';
  lastSync: string;
  color: string;
  mark: string;
};

export const CONNECTORS: Connector[] = [
  {
    name: 'GA4',
    vendor: 'Finanshels',
    category: 'Analytics',
    blurb: 'Website & app traffic, acquisition channels, funnels, on-site ecommerce.',
    status: 'live',
    lastSync: '2m ago',
    color: '#E8710A',
    mark: 'GA',
  },
  {
    name: 'Zoho Books',
    vendor: 'Finanshels',
    category: 'Accounting',
    blurb: 'Invoices, payments, expenses, receivables, banking, tax — the system of record.',
    status: 'live',
    lastSync: '11m ago',
    color: '#2C7BE5',
    mark: 'ZB',
  },
  {
    name: 'Zoho CRM',
    vendor: 'Finanshels',
    category: 'CRM',
    blurb: 'Leads, contacts, deals, pipeline stages, owners, activities and sales velocity.',
    status: 'syncing',
    lastSync: 'now',
    color: '#5B8DEF',
    mark: 'ZC',
  },
  {
    name: 'Stripe',
    vendor: 'Finanshels',
    category: 'Payments',
    blurb: 'Charges, refunds, disputes, fees, subscriptions, balances and payouts.',
    status: 'live',
    lastSync: '4m ago',
    color: '#635BFF',
    mark: 'S',
  },
  {
    name: 'GSE',
    vendor: 'Finanshels',
    category: 'Search',
    blurb: 'Search Console — impressions, clicks, CTR, position, query themes, page visibility.',
    status: 'error',
    lastSync: '3h ago',
    color: '#34A853',
    mark: 'GS',
  },
];

export type ConnectorType = {
  name: string;
  kind: 'Database' | 'API';
  color: string;
  mark: string;
  desc: string;
  isNew?: boolean;
  isPopular?: boolean;
};

export const CONNECTOR_TYPES: ConnectorType[] = [
  { name: 'Clickhouse', kind: 'Database', color: '#FCD535', mark: 'CH', desc: 'Query event-scale analytics tables with sub-second aggregations.' },
  { name: 'Google BigQuery', kind: 'Database', color: '#4285F4', mark: 'BQ', desc: 'Read datasets and run SQL over your BigQuery warehouse.', isPopular: true },
  { name: 'MCP', kind: 'Database', color: '#6b6a5e', mark: 'M', desc: 'Bring any MCP server as a data source with its own tools.', isNew: true },
  { name: 'MSSQL', kind: 'Database', color: '#A6120D', mark: 'MS', desc: 'Connect SQL Server databases for reporting and reconciliation.' },
  { name: 'MySQL', kind: 'Database', color: '#00758F', mark: 'My', desc: 'Read production or replica MySQL databases safely.' },
  { name: 'Postgres', kind: 'Database', color: '#336791', mark: 'Pg', desc: 'Read-only access to Postgres schemas, tables, and views.', isPopular: true },
  { name: 'PostHog', kind: 'Database', color: '#F54E00', mark: 'Ph', desc: 'Product analytics — events, funnels, retention, and flags.', isNew: true },
  { name: 'Snowflake', kind: 'Database', color: '#29B5E8', mark: 'Sf', desc: 'Query Snowflake warehouses, shares, and marketplace data.' },
  { name: 'Zoho CRM', kind: 'Database', color: '#5B8DEF', mark: 'ZC', desc: 'Leads, deals, pipeline stages, owners, and sales activities.' },
  { name: 'Google Ads', kind: 'API', color: '#4285F4', mark: 'GA', desc: 'Campaign spend, clicks, conversions, and search terms.' },
  { name: 'Google Analytics', kind: 'API', color: '#E8710A', mark: 'GA', desc: 'GA4 traffic, acquisition, funnels, and ecommerce reports.', isPopular: true },
  { name: 'Google Search Console', kind: 'API', color: '#34A853', mark: 'GS', desc: 'Impressions, clicks, CTR, position, and page visibility.' },
  { name: 'Google Sheets', kind: 'API', color: '#0F9D58', mark: 'Sh', desc: 'Treat any spreadsheet as a queryable, living dataset.' },
  { name: 'Meta Ads', kind: 'API', color: '#0866FF', mark: 'Me', desc: 'Ad performance across Facebook and Instagram placements.' },
  { name: 'Stripe', kind: 'API', color: '#635BFF', mark: 'S', desc: 'Charges, refunds, disputes, subscriptions, and payouts.', isPopular: true },
];

export const DEMOS = [
  { name: 'Adventure Works CRM', desc: 'AdventureWorks CRM database snapshot', color: '#A6120D', mark: 'AW' },
  { name: 'Olist Ecommerce', desc: 'OList ecommerce database snapshot', color: '#336791', mark: 'OL' },
  { name: 'Sakila Movie Sales', desc: 'Sakila MySQL movie sales database snapshot', color: '#00758F', mark: 'SK' },
];
