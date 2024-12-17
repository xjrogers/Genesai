import { useState, useCallback } from 'react';
import { useVapi } from '../../contexts/vapi';
import { logger } from '../../utils/logger';
import type { Assistant } from '../../types';

export function useSaveSettings() {
  const { client, setError } = useVapi();
  const [isSaving, setIsSaving] = useState(false);

  const saveSettings = useCallback(async (assistant: Assistant) => {
    if (!client || isSaving) return;

    try {
      setIsSaving(true);
      
      await client.assistants.update(assistant.id, {
        model: assistant.model,
        voice: assistant.voice,
        transcriber: assistant.transcriber,
        firstMessageMode: assistant.firstMessageMode,
        hipaaEnabled: assistant.hipaaEnabled,
        clientMessages: assistant.clientMessages,
        serverMessages: assistant.serverMessages
      });

      logger.info('Settings saved successfully');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save settings';
      logger.error('Save failed:', { error: message });
      setError(message);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [client, setError]);

  return {
    isSaving,
    saveSettings
  };
}