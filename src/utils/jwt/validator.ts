import { verify } from 'jsonwebtoken';
import type { JwtPayload } from './types';
import { JWT_CONFIG, ERROR_MESSAGES } from './config';

export function validateToken(token: string, privateKey: string): JwtPayload {
  if (!token.startsWith(JWT_CONFIG.TOKEN_PREFIX)) {
    throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
  }

  const tokenWithoutPrefix = token.slice(JWT_CONFIG.TOKEN_PREFIX.length + 1);

  try {
    const decoded = verify(tokenWithoutPrefix, privateKey) as JwtPayload;
    
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new Error(ERROR_MESSAGES.TOKEN_EXPIRED);
    }

    return decoded;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
  }
}