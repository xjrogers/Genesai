import { useCallback } from 'react';
import { useVapi } from '../../contexts/vapi';
import { logger } from '../../utils/logger';

export interface BehaviorSettings {
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number;
  backgroundSound?: 'off' | 'office';
  backgroundDenoisingEnabled?: boolean;
  modelOutputInMessagesEnabled?: boolean;
  hipaaEnabled?: boolean;
}

export function useBehaviorSettings() {
  const { client, assistants, setAssistants } = useVapi();

  const updateBehaviorSettings = useCallback(async (assistantId: string, settings: Partial<BehaviorSettings>) => {
    if (!client) return;

    try {
      logger.info('Updating behavior settings', { assistantId, settings });

      const updatedAssistant = await client.assistants.update(assistantId, {
        silenceTimeoutSeconds: settings.silenceTimeoutSeconds,
        maxDurationSeconds: settings.maxDurationSeconds,
        backgroundSound: settings.backgroundSound,
        backgroundDenoisingEnabled: settings.backgroundDenoisingEnabled,
        modelOutputInMessagesEnabled: settings.modelOutputInMessagesEnabled,
        hipaaEnabled: settings.hipaaEnabled
      });

      setAssistants(assistants.map(a => 
        a.id === assistantId ? updatedAssistant : a
      ));

      logger.info('Behavior settings updated successfully');
      return true;
    } catch (error) {
      logger.error('Failed to update behavior settings:', { error });
      throw error;
    }
  }, [client, assistants, setAssistants]);

  return { updateBehaviorSettings };
}