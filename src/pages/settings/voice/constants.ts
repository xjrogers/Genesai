export const VOICE_SETTINGS = {
  // Keep this for reference but it won't be used in the UI
  stability: {
    min: 0,
    max: 1,
    step: 0.05,
    default: 0.7,
    description: 'Higher values provide more stable and consistent voice output'
  },
  similarityBoost: {
    min: 0,
    max: 1, 
    step: 0.05,
    default: 0.75,
    description: 'Higher values make the voice more similar to the original sample'
  },
  style: {
    min: 0,
    max: 1,
    step: 0.05,
    default: 0.35,
    description: 'Controls expressiveness and speaking style variation'
  },
  optimizeStreamingLatency: {
    min: 0,
    max: 4,
    step: 1,
    default: 3,
    description: 'Optimize for lower latency (0) or better quality (4)'
  }
} as const;