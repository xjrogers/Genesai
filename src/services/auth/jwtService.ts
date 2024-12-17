import { generateToken, validateToken } from '../../utils/jwt';
import type { TokenResponse } from '../../utils/jwt';

export class JwtService {
  private static instance: JwtService;
  private currentToken: TokenResponse | null = null;

  private constructor() {}

  static getInstance(): JwtService {
    if (!JwtService.instance) {
      JwtService.instance = new JwtService();
    }
    return JwtService.instance;
  }

  generateAuthToken(orgId: string, privateKey: string): TokenResponse {
    this.currentToken = generateToken(orgId, privateKey);
    return this.currentToken;
  }

  validateAuthToken(token: string, privateKey: string) {
    return validateToken(token, privateKey);
  }

  getCurrentToken(): TokenResponse | null {
    if (!this.currentToken) {
      return null;
    }

    // Check if token is expired
    if (this.currentToken.expiresAt < new Date()) {
      this.currentToken = null;
      return null;
    }

    return this.currentToken;
  }

  clearToken() {
    this.currentToken = null;
  }
}