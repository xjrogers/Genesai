export class VapiError extends Error {
  readonly statusCode?: number;
  readonly body?: unknown;

  constructor({ message, statusCode, body }: { message?: string; statusCode?: number; body?: unknown }) {
    super(message || 'API Error');
    Object.setPrototypeOf(this, VapiError.prototype);
    
    if (statusCode != null) {
      this.statusCode = statusCode;
    }

    if (body !== undefined) {
      this.body = body;
    }
  }
}