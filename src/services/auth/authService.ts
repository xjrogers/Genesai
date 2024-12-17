import { ClientService } from '../client/clientService';
import { CredentialValidator } from '../validation/credentialValidator';
import { logger } from '../../utils/logger';
import type { Credentials } from '../../types/auth';

export class AuthService {
  private static instance: AuthService;
  private clientService: ClientService;

  private constructor() {
    this.clientService = ClientService.getInstance();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: Credentials): Promise<void> {
    try {
      logger.info('Starting login process');
      
      // Validate credentials
      await CredentialValidator.validate(credentials);
      
      // Initialize client
      await this.clientService.initialize(credentials.privateApiKey);
      
      logger.info('Login successful');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      logger.error('Login failed:', message);
      this.clientService.reset();
      throw error;
    }
  }

  logout(): void {
    this.clientService.reset();
    logger.info('Logged out successfully');
  }

  getClient() {
    return this.clientService.getClient();
  }
}