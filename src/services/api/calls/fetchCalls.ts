// src/services/api/calls/fetchCalls.ts
import type { VapiClient } from '@vapi-ai/server-sdk';
import type { Call } from '../../../types';
import { logger } from '../../../utils/logger';
import { fetchWithRetry } from '../../../utils/api/retryUtils';
import { isValidDateRange } from '../../../utils/date/dateUtils';
import { API_CONFIG } from '../../../config/api';

interface FetchCallsOptions {
  startDate?: string;
  endDate?: string;
  onProgress?: (progress: number, stats: {
    totalCalls: number;
    batchCount: number;
    batchSize: number;
    estimatedTotal: number;
  }) => void;
  signal?: AbortSignal;
}

const RATE_LIMIT_DELAY = 100; // ms between requests
const INITIAL_BATCH_SIZE = 50; // Start with smaller batches
const MAX_BATCH_SIZE = 200; // Maximum batch size
const BATCH_SIZE_INCREASE_FACTOR = 1.5; // How much to increase batch size on success
const MAX_RETRIES = 5;
const MAX_TOTAL_RETRIES = 15;

function formatDateForApi(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  try {
    // Ensure the date is in the correct ISO format without being double-encoded
    const date = new Date(dateStr);
    return date.toISOString();
  } catch (error) {
    logger.error('Invalid date format:', { dateStr, error });
    return undefined;
  }
}

export async function fetchFilteredCalls(
  client: VapiClient,
  { startDate, endDate, onProgress, signal }: FetchCallsOptions = {}
): Promise<Call[]> {
  if (!client) {
    throw new Error(API_CONFIG.errorMessages.CLIENT_NOT_INITIALIZED);
  }

  if (!isValidDateRange(startDate, endDate)) {
    throw new Error('Invalid date range provided');
  }

  try {
    logger.info('Starting calls fetch', { 
      startDate, 
      endDate,
      timestamp: new Date().toISOString()
    });

    const fetchPage = async ({ limit, cursor }: { limit: number; cursor?: string }) => {
      if (signal?.aborted) {
        throw new Error('Request aborted');
      }

      // Format dates properly for the API
      const formattedStartDate = formatDateForApi(startDate);
      const formattedEndDate = formatDateForApi(endDate);

      if (!formattedStartDate || !formattedEndDate) {
        throw new Error('Invalid date format');
      }

      try {
        const response = await fetchWithRetry(
          async () => {
            logger.debug('Making API request', {
              limit,
              cursor,
              startDate: formattedStartDate,
              endDate: formattedEndDate,
              timestamp: new Date().toISOString()
            });

            try {
              const result = await client.calls.list({
                limit,
                cursor,
                createdAtGe: formattedStartDate,
                createdAtLe: formattedEndDate,
                sortBy: 'createdAt',
                sortOrder: 'desc'
              });

              logger.debug('API response received', {
                resultLength: result?.length ?? 0,
                timestamp: new Date().toISOString()
              });

              return result;
            } catch (error) {
              // Check for CORS errors
              if (error instanceof Error && 
                  (error.message.includes('CORS') || 
                   error.message.includes('Failed to fetch'))) {
                logger.error('CORS error during API request:', {
                  error,
                  timestamp: new Date().toISOString()
                });
                throw new Error(API_CONFIG.errorMessages.CORS_ERROR);
              }
              throw error;
            }
          },
          {
            maxRetries: MAX_RETRIES,
            baseDelay: 1000,
            maxDelay: 5000,
            shouldRetry: (error) => {
              if (signal?.aborted) return false;
              
              if (error instanceof Error) {
                // Log retry attempt
                logger.warn('API call failed, considering retry', {
                  error: error.message,
                  cursor,
                  timestamp: new Date().toISOString()
                });
                
                // Don't retry on CORS errors
                if (error.message.includes('CORS') || 
                    error.message.includes('Failed to fetch')) {
                  return false;
                }
                
                // Don't retry on date format errors
                if (error.message.includes('must be a valid ISO 8601 date string')) {
                  return false;
                }
                
                // Retry on rate limits and specific API errors
                if (error.message.includes('429') || 
                    error.message.toLowerCase().includes('rate limit')) {
                  return true;
                }
                // Retry on specific HTTP errors
                const status = (error as any).response?.status;
                return status === 408 || // Request Timeout
                       status === 500 || // Internal Server Error
                       status === 502 || // Bad Gateway
                       status === 503 || // Service Unavailable
                       status === 504;   // Gateway Timeout
              }
              return false;
            }
          }
        );

        if (!response || !Array.isArray(response)) {
          logger.error('Invalid API response format:', {
            response,
            timestamp: new Date().toISOString()
          });
          throw new Error(`Invalid API response format: ${JSON.stringify(response)}`);
        }

        return response as Call[];
      } catch (error) {
        logger.error('Failed to fetch page:', {
          error,
          cursor,
          limit,
          formattedStartDate,
          formattedEndDate,
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    };

    const allCalls: Call[] = [];
    let hasMore = true;
    let cursor: string | undefined;
    let currentBatchSize = INITIAL_BATCH_SIZE;
    let batchCount = 0;
    let consecutiveSuccesses = 0;
    let estimatedTotal = 1000; // Initial estimate
    let lastProgressUpdate = Date.now();
    let totalRetries = 0;

    while (hasMore && !signal?.aborted && totalRetries < MAX_TOTAL_RETRIES) {
      try {
        logger.debug('Fetching calls batch', { 
          cursor,
          batchSize: currentBatchSize,
          totalSoFar: allCalls.length,
          timestamp: new Date().toISOString()
        });

        const batch = await fetchPage({ 
          limit: currentBatchSize,
          cursor
        });

        if (signal?.aborted) {
          logger.warn('Request aborted during batch processing', {
            batchSize: currentBatchSize,
            totalSoFar: allCalls.length,
            timestamp: new Date().toISOString()
          });
          break; // Exit the loop instead of throwing
        }

        // Reset retry count on successful request
        totalRetries = 0;
        allCalls.push(...batch);
        batchCount++;

        // Update estimated total based on current data
        if (batch.length === currentBatchSize) {
          estimatedTotal = Math.max(estimatedTotal, allCalls.length * 2);
        } else {
          estimatedTotal = allCalls.length;
        }

        // Update progress at most once every 500ms
        const now = Date.now();
        if (onProgress && (now - lastProgressUpdate > 500)) {
          const progress = batch.length < currentBatchSize ? 100 : 
            Math.min((allCalls.length / estimatedTotal) * 100, 99);
          
          onProgress(progress, {
            totalCalls: allCalls.length,
            batchCount,
            batchSize: currentBatchSize,
            estimatedTotal
          });
          lastProgressUpdate = now;
          
          logger.debug('Progress update', {
            progress,
            totalCalls: allCalls.length,
            batchCount,
            timestamp: new Date().toISOString()
          });
        }

        hasMore = batch.length === currentBatchSize;
        if (hasMore && batch.length > 0) {
          cursor = batch[batch.length - 1].id;
          consecutiveSuccesses++;

          // Increase batch size after consecutive successes
          if (consecutiveSuccesses >= 2 && currentBatchSize < MAX_BATCH_SIZE) {
            currentBatchSize = Math.min(
              Math.floor(currentBatchSize * BATCH_SIZE_INCREASE_FACTOR),
              MAX_BATCH_SIZE
            );
          }
        }

        // Add a small delay between batches to prevent rate limiting
        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
        }
      } catch (error) {
        totalRetries++;
        
        if (signal?.aborted) {
          logger.warn('Request aborted during error handling', {
            error,
            totalRetries,
            totalSoFar: allCalls.length,
            timestamp: new Date().toISOString()
          });
          break; // Exit the loop instead of throwing
        }

        // If we've retried too many times, throw the error
        if (totalRetries >= MAX_TOTAL_RETRIES) {
          logger.error('Max retries exceeded:', {
            error,
            totalRetries,
            totalCalls: allCalls.length,
            timestamp: new Date().toISOString()
          });
          throw new Error(`Failed to fetch calls after ${totalRetries} retries: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        // Check for CORS errors
        if (error instanceof Error && 
            (error.message.includes('CORS') || 
             error.message.includes('Failed to fetch'))) {
          logger.error('CORS error during batch processing:', {
            error,
            totalRetries,
            totalCalls: allCalls.length,
            timestamp: new Date().toISOString()
          });
          throw new Error(API_CONFIG.errorMessages.CORS_ERROR);
        }

        // On error, reduce batch size and reset consecutive successes
        if (error instanceof Error && 
            (error.message.includes('429') || 
             error.message.toLowerCase().includes('rate limit'))) {
          currentBatchSize = Math.max(Math.floor(currentBatchSize / 2), INITIAL_BATCH_SIZE);
          consecutiveSuccesses = 0;
          logger.warn('Rate limit hit, reducing batch size', { 
            newBatchSize: currentBatchSize,
            totalSoFar: allCalls.length,
            totalRetries,
            timestamp: new Date().toISOString()
          });
          // Wait longer on rate limit
          await new Promise(resolve => setTimeout(resolve, 2000 * totalRetries));
          continue;
        }

        // For other errors, wait a bit and retry with the same batch size
        logger.warn('Error fetching batch, retrying', {
          error,
          totalRetries,
          currentBatchSize,
          totalSoFar: allCalls.length,
          timestamp: new Date().toISOString()
        });
        await new Promise(resolve => setTimeout(resolve, 1000 * totalRetries));
        continue;
      }
    }

    // Sort calls by date descending
    const sortedCalls = allCalls.sort((a, b) => {
      const dateA = a.startedAt ? new Date(a.startedAt).getTime() : 0;
      const dateB = b.startedAt ? new Date(b.startedAt).getTime() : 0;
      return dateB - dateA;
    });

    logger.info('Completed fetching all calls', {
      totalCalls: sortedCalls.length,
      totalBatches: batchCount,
      finalBatchSize: currentBatchSize,
      dateRange: { startDate, endDate },
      firstCallDate: sortedCalls[0]?.startedAt,
      lastCallDate: sortedCalls[sortedCalls.length - 1]?.startedAt,
      timestamp: new Date().toISOString()
    });

    return sortedCalls;
  } catch (error) {
    if (error instanceof Error && error.message === 'Request aborted') {
      logger.info('Call fetch aborted');
      return [];
    }
    
    logger.error('Error fetching calls:', { 
      error,
      timestamp: new Date().toISOString()
    });
    
    // Check for CORS errors
    if (error instanceof Error && 
        (error.message.includes('CORS') || 
         error.message.includes('Failed to fetch'))) {
      throw new Error(API_CONFIG.errorMessages.CORS_ERROR);
    }
    
    // Ensure we throw a proper error object with a message
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to fetch calls: Unknown error');
    }
  }
}
