import { logger } from '../logger';

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
}

export class RetryableError extends Error {
  constructor(message: string, public readonly originalError: unknown) {
    super(message);
    this.name = 'RetryableError';
  }
}

export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries - 1) {
        throw new RetryableError(
          `Failed after ${maxRetries} attempts`,
          error
        );
      }

      // Calculate exponential backoff with jitter
      const delay = Math.min(
        Math.random() * baseDelay * Math.pow(2, attempt),
        maxDelay
      );

      logger.warn('API call failed, retrying...', {
        attempt: attempt + 1,
        maxRetries,
        delay,
        error
      });

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    // Network errors
    if (error.name === 'NetworkError') return true;
    if (error.name === 'TimeoutError') return true;

    // Rate limiting
    if (error.message.includes('429')) return true;
    if (error.message.toLowerCase().includes('rate limit')) return true;

    // Server errors
    if (error.message.includes('500')) return true;
    if (error.message.includes('503')) return true;
  }
  return false;
} 