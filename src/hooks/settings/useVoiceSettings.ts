import { useState, useCallback } from 'react';
import { useVapi } from '../../contexts/vapi';
import { logger } from '../../utils/logger';
import type { Assistant } from '../../types';

interface VoiceSettings {
  provider?: string;
  voiceId?: string;
  speed?: number;
  fillerInjectionEnabled?: boolean;
}

export function useVoiceSettings() {
  const { client, assistants, setAssistants } = useVapi();
  const [isLoading, setIsLoading] = useState(false);

  const assistant = assistants[0]; // Using first assistant for demo

  const updateVoiceSettings = useCallback(async (settings: VoiceSettings) => {
    if (!client || !assistant) return;

    try {
      setIsLoading(true);
      
      const updatedAssistant = await client.assistants.update(assistant.id, {
        voice: {
          ...assistant.voice,
          ...settings
        }
      });

      setAssistants(assistants.map(a => 
        a.id === updatedAssistant.id ? updatedAssistant : a
      ));

      logger.info('Voice settings updated successfully');
    } catch (error) {
      logger.error('Failed to update voice settings:', { error });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [client, assistant, assistants, setAssistants]);

  return {
    voiceProvider: assistant?.voice?.provider,
    voiceId: assistant?.voice?.voiceId,
    speed: assistant?.voice?.speed,
    fillerInjectionEnabled: assistant?.voice?.fillerInjectionEnabled,
    availableVoices: [], // TODO: Fetch from API
    availableProviders: [], // TODO: Fetch from API
    updateVoiceSettings,
    isLoading
  };
}