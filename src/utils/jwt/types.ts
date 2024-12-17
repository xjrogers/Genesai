export interface JwtPayload {
  orgId: string;
  exp?: number;
  iat?: number;
}

export interface JwtOptions {
  expiresIn?: string | number;
  algorithm?: string;
}

export interface TokenResponse {
  token: string;
  expiresAt: Date;
}