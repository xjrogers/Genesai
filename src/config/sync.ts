export const SYNC_CONFIG = {
  // Refresh rate in milliseconds (30 seconds)
  INTERVAL: 30 * 1000,
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    INITIAL_DELAY: 1000,
    MAX_DELAY: 10000
  },
  
  // Batch sizes for data fetching
  BATCH_SIZE: {
    CALLS: 1000, // Maximum allowed by API
    ASSISTANTS: 50
  },

  // Pagination settings
  PAGINATION: {
    PROGRESS_INTERVAL: 10 // Update progress every 10%
  }
} as const;