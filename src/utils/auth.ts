export interface Credentials {
  privateApiKey: string;
  publicApiKey: string;
  organizationId: string;
  assistantId: string;
}

const STORAGE_KEY = 'vapi_credentials';

export const auth = {
  saveCredentials: (credentials: Credentials) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
  },

  getCredentials: (): Credentials | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  clearCredentials: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  isAuthenticated: (): boolean => {
    return auth.getCredentials() !== null;
  }
};