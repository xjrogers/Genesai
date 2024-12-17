import type { WebhookMessage, WebhookResponse } from './types';
import { 
  handleConversationUpdate,
  handleEndOfCallReport,
  handleToolCall
} from './handlers';
import { logger } from '../utils/logger';

export class WebhookRouter {
  async route(message: WebhookMessage): Promise<WebhookResponse> {
    try {
      logger.info('Routing webhook message', { type: message.type });

      switch (message.type) {
        case 'conversation-update':
          return await handleConversationUpdate(message);
          
        case 'end-of-call-report':
          return await handleEndOfCallReport(message);
          
        case 'tool-calls':
          return await handleToolCall(message);
          
        default:
          logger.warn('Unhandled webhook message type', { type: message.type });
          return {
            success: true,
            data: {
              processed: false,
              reason: 'Unhandled message type'
            }
          };
      }
    } catch (error) {
      logger.error('Failed to route webhook message', { error });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to route webhook message'
      };
    }
  }
}