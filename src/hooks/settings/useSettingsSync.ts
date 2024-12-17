import { useCallback, useEffect, useState } from 'react';
import { useVapi } from '../../contexts/vapi';
import { logger } from '../../utils/logger';

export function useSettingsSync() {
  const { client, assistants, setAssistants } = useVapi();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!client) return;

    try {
      const updatedAssistants = await client.assistants.list();
      setAssistants(updatedAssistants);
      setLastSyncedAt(new Date());
      logger.info('Settings fetched successfully');
    } catch (error) {
      logger.error('Failed to fetch settings:', { error });
      throw error;
    }
  }, [client, setAssistants]);

  const saveSettings = useCallback(async (assistantId: string, updates: any) => {
    if (!client) return;

    try {
      setIsSaving(true);

      // Force model settings
      if (updates.model) {
        updates.model = {
          ...updates.model,
          provider: 'openai',
          model: 'gpt-4o-mini'
        };
      }

      const updatedAssistant = await client.assistants.update(assistantId, updates);
      
      setAssistants(assistants.map(a => 
        a.id === updatedAssistant.id ? updatedAssistant : a
      ));
      
      setLastSyncedAt(new Date());
      logger.info('Settings saved successfully');
      return true;
    } catch (error) {
      logger.error('Failed to save settings:', { error });
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [client, assistants, setAssistants]);

  useEffect(() => {
    if (client && !lastSyncedAt) {
      fetchSettings().catch(console.error);
    }
  }, [client, lastSyncedAt, fetchSettings]);

  return {
    isSaving,
    lastSyncedAt,
    fetchSettings,
    saveSettings
  };
}