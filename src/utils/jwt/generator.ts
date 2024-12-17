import { sign } from 'jsonwebtoken';
import type { JwtPayload, JwtOptions, TokenResponse } from './types';
import { JWT_CONFIG, ERROR_MESSAGES } from './config';

export function generateToken(
  orgId: string | undefined,
  privateKey: string | undefined,
  options: JwtOptions = {}
): TokenResponse {
  if (!privateKey) {
    throw new Error(ERROR_MESSAGES.MISSING_PRIVATE_KEY);
  }

  if (!orgId) {
    throw new Error(ERROR_MESSAGES.MISSING_ORG_ID);
  }

  const payload: JwtPayload = {
    orgId,
    iat: Math.floor(Date.now() / 1000),
  };

  const tokenOptions = {
    expiresIn: options.expiresIn || JWT_CONFIG.DEFAULT_EXPIRES_IN,
    algorithm: options.algorithm || JWT_CONFIG.DEFAULT_ALGORITHM,
  };

  const token = sign(payload, privateKey, tokenOptions);
  
  // Calculate expiration date
  const expiresInSeconds = typeof tokenOptions.expiresIn === 'string' 
    ? parseExpiresIn(tokenOptions.expiresIn)
    : tokenOptions.expiresIn;
  
  const expiresAt = new Date(Date.now() + (expiresInSeconds * 1000));

  return {
    token,
    expiresAt,
  };
}

function parseExpiresIn(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 3600; // Default to 1 hour

  const [, value, unit] = match;
  const multipliers: Record<string, number> = {
    's': 1,
    'm': 60,
    'h': 3600,
    'd': 86400,
  };

  return parseInt(value) * (multipliers[unit] || 3600);
}