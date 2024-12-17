import { useState, useCallback } from 'react';
import { useVapi } from '../../contexts/vapi';
import { logger } from '../../utils/logger';

interface TranscriberSettings {
  provider?: string;
  model?: string;
  language?: string;
  languageDetectionEnabled?: boolean;
}

export function useTranscriberSettings() {
  const { client, assistants, setAssistants } = useVapi();
  const [isLoading, setIsLoading] = useState(false);

  const assistant = assistants[0]; // Using first assistant for demo

  const updateTranscriberSettings = useCallback(async (settings: TranscriberSettings) => {
    if (!client || !assistant) return;

    try {
      setIsLoading(true);
      
      const updatedAssistant = await client.assistants.update(assistant.id, {
        transcriber: {
          ...assistant.transcriber,
          ...settings
        }
      });

      setAssistants(assistants.map(a => 
        a.id === updatedAssistant.id ? updatedAssistant : a
      ));

      logger.info('Transcriber settings updated successfully');
    } catch (error) {
      logger.error('Failed to update transcriber settings:', { error });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [client, assistant, assistants, setAssistants]);

  return {
    provider: assistant?.transcriber?.provider,
    model: assistant?.transcriber?.model,
    language: assistant?.transcriber?.language,
    languageDetectionEnabled: assistant?.transcriber?.languageDetectionEnabled,
    availableProviders: [], // TODO: Fetch from API
    availableModels: [], // TODO: Fetch from API
    availableLanguages: [], // TODO: Fetch from API
    updateTranscriberSettings,
    isLoading
  };
}