import type { TimeRange } from '../common';

export interface AnalyticsMetric {
  /** Metric name */
  name: string;
  
  /** Aggregation function */
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count';
  
  /** Field to aggregate */
  field: string;
}

export interface AnalyticsRequest {
  /** Time range for the query */
  timeRange: TimeRange;
  
  /** Metrics to calculate */
  metrics: AnalyticsMetric[];
  
  /** Fields to group by */
  groupBy?: string[];
  
  /** Additional filters */
  filters?: Record<string, unknown>;
}