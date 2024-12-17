import { useCallback } from 'react';
import { useVapi } from '../../contexts/vapi';
import { logger } from '../../utils/logger';

export function useModelSettings() {
  const { client, assistants, setAssistants } = useVapi();

  const updateModelSettings = useCallback(async (assistantId: string, settings: any) => {
    if (!client) return;

    try {
      // Force OpenAI provider and GPT-4o mini model
      const updates = {
        ...settings,
        provider: 'openai',
        model: 'gpt-4o-mini' // Force GPT-4o mini
      };

      const updatedAssistant = await client.assistants.update(assistantId, {
        model: updates
      });

      setAssistants(assistants.map(a => 
        a.id === updatedAssistant.id ? updatedAssistant : a
      ));

      logger.info('Model settings updated successfully');
    } catch (error) {
      logger.error('Failed to update model settings:', { error });
      throw error;
    }
  }, [client, assistants, setAssistants]);

  return {
    updateModelSettings
  };
}