import type { AnalyticsQueryResult } from '../AnalyticsQueryResult';

export interface AnalyticsResponse {
  /** List of query results */
  results: AnalyticsQueryResult[];
  
  /** Whether the analytics query was successful */
  success: boolean;
  
  /** Time taken to process the query in ms */
  processingTimeMs: number;
}