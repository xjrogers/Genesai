import type { TimeRange } from './common';

export interface AnalyticsQueryResult {
  /** This is the unique key for the query. */
  name: string;
  
  /** This is the time range for the query. */
  timeRange: TimeRange;
  
  /** 
   * This is the result of the query, a list of unique groups with result of their aggregations.
   * Example:
   * [
   *   { "date": "2023-01-01", "assistantId": "123", "sumDuration": 120, "avgCost": 10.5 },
   *   { "date": "2023-01-02", "assistantId": "123", "sumDuration": 0, "avgCost": 0 }
   * ]
   */
  result: Record<string, unknown>[];
}