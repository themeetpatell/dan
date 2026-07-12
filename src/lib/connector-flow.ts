/* Data backing the connector connect flow and detail pages:
   API schemas previewed during setup, and the system workflows
   that run when a connector is added. */

export type SchemaFieldType = 'object' | 'array' | 'string' | 'boolean' | 'integer';

export type SchemaField = {
  name: string;
  type: SchemaFieldType;
  desc: string;
};

export type SchemaResource = {
  name: string;
  desc: string;
  fields: SchemaField[];
};

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const GA_RUN_REPORT: SchemaResource = {
  name: 'run_report',
  desc: 'Run a customized GA4 Data API report for the configured property',
  fields: [
    { name: 'cohortSpec', type: 'object', desc: 'Cohort analysis specification.' },
    { name: 'comparisons', type: 'array', desc: 'Optional comparisons requested and displayed.' },
    { name: 'currencyCode', type: 'string', desc: 'A currency code in ISO4217 format, such as "AED", "USD", "JPY".' },
    { name: 'dateRanges', type: 'array', desc: 'Date ranges of data to read. Requests are allowed up to 4 date ranges.' },
    { name: 'dimensionFilter', type: 'object', desc: 'Dimension filters let you ask for only specific dimension values in the report.' },
    { name: 'dimensions', type: 'array', desc: 'The dimensions requested and displayed.' },
    { name: 'keepEmptyRows', type: 'boolean', desc: 'If false or unspecified, each row with all metrics equal to 0 will not be returned.' },
    { name: 'limit', type: 'integer', desc: 'The number of rows to return. If unspecified, 10,000 rows are returned.' },
    { name: 'metricAggregations', type: 'array', desc: 'Aggregation of metrics. Aggregated metric values will be shown in rows.' },
    { name: 'metricFilter', type: 'object', desc: 'The filter clause of metrics. Applied after aggregating rows of the report.' },
    { name: 'metrics', type: 'array', desc: 'The metrics requested and displayed.' },
    { name: 'offset', type: 'integer', desc: 'The row count of the start row. The first row is counted as row 0.' },
    { name: 'orderBys', type: 'array', desc: 'Specifies how rows are ordered in the response.' },
    { name: 'returnPropertyQuota', type: 'boolean', desc: "Toggles whether to return the current state of this Analytics property's quota." },
  ],
};

const GSC_SEARCH_ANALYTICS: SchemaResource = {
  name: 'search_analytics',
  desc: 'Query Search Console traffic data for the verified site',
  fields: [
    { name: 'aggregationType', type: 'string', desc: 'How data is aggregated: auto, byPage, or byProperty.' },
    { name: 'dataState', type: 'string', desc: 'If "all", fresh data is included; if "final", only finalized data.' },
    { name: 'dimensionFilterGroups', type: 'array', desc: 'Zero or more filter groups applied to dimension values.' },
    { name: 'dimensions', type: 'array', desc: 'Dimensions to group results by: date, query, page, country, device.' },
    { name: 'endDate', type: 'string', desc: 'End date of the requested range, in YYYY-MM-DD format.' },
    { name: 'rowLimit', type: 'integer', desc: 'The maximum number of rows to return, up to 25,000.' },
    { name: 'searchType', type: 'string', desc: 'The search type to filter for: web, image, video, news, discover.' },
    { name: 'startDate', type: 'string', desc: 'Start date of the requested range, in YYYY-MM-DD format.' },
    { name: 'startRow', type: 'integer', desc: 'Zero-based index of the first row to return.' },
  ],
};

const STRIPE_RESOURCES: SchemaResource[] = [
  {
    name: 'charges',
    desc: 'List and filter charges processed through the account',
    fields: [
      { name: 'amount', type: 'integer', desc: 'Amount intended to be collected, in the smallest currency unit.' },
      { name: 'created', type: 'object', desc: 'Filter on the created timestamp with gt, gte, lt, lte.' },
      { name: 'currency', type: 'string', desc: 'Three-letter ISO currency code, in lowercase.' },
      { name: 'customer', type: 'string', desc: 'Only return charges for the customer specified by this ID.' },
      { name: 'limit', type: 'integer', desc: 'A limit on the number of objects returned, between 1 and 100.' },
      { name: 'payment_intent', type: 'string', desc: 'Only return charges for this payment intent ID.' },
    ],
  },
  {
    name: 'subscriptions',
    desc: 'List subscriptions with their status and billing period',
    fields: [
      { name: 'current_period_end', type: 'object', desc: 'Filter on the current period end timestamp.' },
      { name: 'customer', type: 'string', desc: 'The ID of the customer whose subscriptions to return.' },
      { name: 'limit', type: 'integer', desc: 'A limit on the number of objects returned, between 1 and 100.' },
      { name: 'price', type: 'string', desc: 'Filter for subscriptions that contain this price ID.' },
      { name: 'status', type: 'string', desc: 'Status to filter by: active, past_due, canceled, trialing, all.' },
    ],
  },
  {
    name: 'balance_transactions',
    desc: 'Transactions that contribute to the account balance',
    fields: [
      { name: 'created', type: 'object', desc: 'Filter on the created timestamp with gt, gte, lt, lte.' },
      { name: 'currency', type: 'string', desc: 'Only return transactions in a specific currency.' },
      { name: 'limit', type: 'integer', desc: 'A limit on the number of objects returned, between 1 and 100.' },
      { name: 'payout', type: 'string', desc: 'Only return transactions included in this payout ID.' },
      { name: 'type', type: 'string', desc: 'Only return transactions of a given type: charge, refund, payout…' },
    ],
  },
];

const SQL_RESOURCES: SchemaResource[] = [
  {
    name: 'run_query',
    desc: 'Execute a read-only SQL query against the connected database',
    fields: [
      { name: 'query', type: 'string', desc: 'The SQL statement to execute. Only SELECT statements are allowed.' },
      { name: 'parameters', type: 'array', desc: 'Positional parameters bound safely into the query.' },
      { name: 'rowLimit', type: 'integer', desc: 'Maximum number of rows returned. Defaults to 1,000.' },
      { name: 'timeoutMs', type: 'integer', desc: 'Query timeout in milliseconds before the statement is cancelled.' },
    ],
  },
  {
    name: 'list_tables',
    desc: 'Enumerate schemas, tables, and column metadata',
    fields: [
      { name: 'schema', type: 'string', desc: 'Restrict results to a single schema, e.g. "public".' },
      { name: 'includeColumns', type: 'boolean', desc: 'If true, column names and types are included for each table.' },
      { name: 'includeRowCounts', type: 'boolean', desc: 'If true, approximate row counts are returned per table.' },
    ],
  },
];

const DEFAULT_RESOURCES: SchemaResource[] = [
  {
    name: 'run_request',
    desc: 'Run a read-only request against the connected source',
    fields: [
      { name: 'resource', type: 'string', desc: 'The resource or endpoint to read from.' },
      { name: 'filters', type: 'object', desc: 'Field-level filters applied server-side before returning rows.' },
      { name: 'fields', type: 'array', desc: 'Subset of fields to include in the response.' },
      { name: 'limit', type: 'integer', desc: 'Maximum number of records returned per page.' },
      { name: 'cursor', type: 'string', desc: 'Opaque pagination cursor from a previous response.' },
    ],
  },
];

/* Keyed by connector-type slug; existing live connectors map onto
   the same schemas via aliases (ga4 → google-analytics, etc.). */
const SCHEMAS: Record<string, SchemaResource[]> = {
  'google-analytics': [GA_RUN_REPORT],
  ga4: [GA_RUN_REPORT],
  'google-search-console': [GSC_SEARCH_ANALYTICS],
  gse: [GSC_SEARCH_ANALYTICS],
  stripe: STRIPE_RESOURCES,
  postgres: SQL_RESOURCES,
  mysql: SQL_RESOURCES,
  mssql: SQL_RESOURCES,
  clickhouse: SQL_RESOURCES,
  'google-bigquery': SQL_RESOURCES,
  snowflake: SQL_RESOURCES,
};

export function getSchema(slug: string): SchemaResource[] {
  return SCHEMAS[slug] ?? DEFAULT_RESOURCES;
}

export type SystemWorkflow = {
  key: 'documentation' | 'risk';
  name: string;
  desc: string;
};

export const SYSTEM_WORKFLOWS: SystemWorkflow[] = [
  {
    key: 'documentation',
    name: 'Documentation',
    desc: 'Generates and updates connector documentation from schema and data.',
  },
  {
    key: 'risk',
    name: 'Risk analysis',
    desc: 'Reviews risks and opportunities, then publishes feed workflows.',
  },
];
