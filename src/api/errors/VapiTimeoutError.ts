export class VapiTimeoutError extends Error {
  constructor() {
    super('Request timed out');
    Object.setPrototypeOf(this, VapiTimeoutError.prototype);
  }
}