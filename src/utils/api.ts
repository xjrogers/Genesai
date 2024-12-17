import { VapiClient } from '../Client';
import { auth } from './auth';

export function getClient() {
  const credentials = auth.getCredentials();
  if (!credentials) {
    throw new Error('No credentials found');
  }

  return new VapiClient({
    token: credentials.privateApiKey,
  });
}