import { useState, useCallback } from 'react';
import { useVapi } from '../../contexts/vapi';
import { logger } from '../../utils/logger';

export function useSettingsState() {
  const { assistants } = useVapi();
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Get current value with any pending changes
  const getValue = useCallback((assistant: any, field: string) => {
    const fieldPath = field.split('.');
    let pendingValue = pendingChanges;
    let currentValue = assistant;

    for (const key of fieldPath) {
      pendingValue = pendingValue?.[key];
      currentValue = currentValue?.[key];
    }

    return pendingValue !== undefined ? pendingValue : currentValue;
  }, [pendingChanges]);

  // Update local state without saving to API
  const updateField = useCallback((field: string, value: any) => {
    setPendingChanges(prev => {
      const newChanges = { ...prev };
      const fieldPath = field.split('.');
      let current = newChanges;

      // Build nested structure
      for (let i = 0; i < fieldPath.length - 1; i++) {
        const key = fieldPath[i];
        current[key] = current[key] || {};
        current = current[key];
      }

      // Set final value
      current[fieldPath[fieldPath.length - 1]] = value;
      
      setHasChanges(true);
      logger.debug('Settings field updated locally:', { field, value });
      return newChanges;
    });
  }, []);

  // Clear all pending changes
  const resetChanges = useCallback(() => {
    setPendingChanges({});
    setHasChanges(false);
    logger.info('Pending settings changes cleared');
  }, []);

  // Get all pending changes
  const getPendingChanges = useCallback(() => {
    return pendingChanges;
  }, [pendingChanges]);

  return {
    getValue,
    updateField,
    resetChanges,
    getPendingChanges,
    hasChanges
  };
}