import type { TimeRange } from '@vapi-ai/server-sdk';

export interface AnalyticsQueryResult {
  /** This is the unique key for the query. */
  name: string;
  /** This is the time range for the query. */
  timeRange: TimeRange;
  /** This is the result of the query, a list of unique groups with result of their aggregations. */
  result: Record<string, unknown>[];
}