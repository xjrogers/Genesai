export interface Credentials {
  privateApiKey: string;
  publicApiKey: string;
  organizationId: string;
  assistantId: string;
}

export interface AuthState extends Credentials {
  isAuthenticated: boolean;
}