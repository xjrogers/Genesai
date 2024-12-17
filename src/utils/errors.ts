import { VapiError } from '../api/errors';

export function handleApiError(error: unknown): string {
  if (error instanceof VapiError) {
    console.error('API Error:', {
      message: error.message,
      statusCode: error.statusCode,
      body: error.body
    });
    
    if (error.statusCode === 401) {
      return 'Invalid API key or unauthorized access';
    }
    if (error.statusCode === 403) {
      return 'Access forbidden - please check your permissions';
    }
    if (error.statusCode === 404) {
      return 'Resource not found - please check your IDs';
    }
    if (error.statusCode === 429) {
      return 'Rate limit exceeded - please try again later';
    }
    if (error.statusCode >= 500) {
      return 'Server error - please try again later';
    }
    
    return error.message || `API Error (${error.statusCode})`;
  }
  
  if (error instanceof Error) {
    console.error('General Error:', error);
    return error.message;
  }
  
  console.error('Unknown Error:', error);
  return 'An unknown error occurred';
}