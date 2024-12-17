/**
 * API environment configuration
 */
export const VapiEnvironment = {
  Default: "https://api.vapi.ai",
} as const;

export type VapiEnvironment = typeof VapiEnvironment.Default;