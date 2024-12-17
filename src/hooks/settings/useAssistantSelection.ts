import { useState, useCallback } from 'react';
import { useVapi } from '../../contexts/vapi';
import { logger } from '../../utils/logger';

export function useAssistantSelection() {
  const { assistants } = useVapi();
  const [selectedAssistantId, setSelectedAssistantId] = useState<string | undefined>(
    assistants[0]?.id
  );

  const selectedAssistant = assistants.find(a => a.id === selectedAssistantId);

  const handleAssistantChange = useCallback((id: string) => {
    setSelectedAssistantId(id);
    logger.info('Selected assistant changed:', { assistantId: id });
  }, []);

  return {
    selectedAssistantId,
    selectedAssistant,
    handleAssistantChange,
    assistants
  };
}