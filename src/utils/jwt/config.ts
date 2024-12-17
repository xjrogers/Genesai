export const JWT_CONFIG = {
  DEFAULT_EXPIRES_IN: '1h',
  DEFAULT_ALGORITHM: 'HS256',
  TOKEN_PREFIX: 'Bearer',
} as const;

export const ERROR_MESSAGES = {
  MISSING_PRIVATE_KEY: 'JWT private key is required',
  MISSING_ORG_ID: 'Organization ID is required',
  INVALID_TOKEN: 'Invalid token format',
  TOKEN_EXPIRED: 'Token has expired',
} as const;