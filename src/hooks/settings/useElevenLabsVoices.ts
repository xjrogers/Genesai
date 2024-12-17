import { useEffect, useState, useCallback } from 'react';
import { useVapi } from '../../contexts/vapi';
import { logger } from '../../utils/logger';
import { ELEVEN_LABS_VOICES } from '../../pages/settings/voice/constants';

interface ElevenLabsVoice {
  value: string;
  label: string;
  tags?: string[];
}

export function useElevenLabsVoices() {
  const { client } = useVapi();
  const [voices, setVoices] = useState<ElevenLabsVoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVoices = useCallback(async () => {
    if (!client) return;

    try {
      setIsLoading(true);
      setError(null);

      // Get available voices from Vapi platform
      const response = await client.assistants.list();
      const availableVoices = response
        .filter(assistant => assistant.voice?.provider === '11labs')
        .map(assistant => assistant.voice?.voiceId)
        .filter((voiceId): voiceId is string => Boolean(voiceId));

      // Filter built-in voices to only include available ones
      const validVoices = ELEVEN_LABS_VOICES.filter(voice => 
        availableVoices.includes(voice.value)
      );

      setVoices(validVoices);
      
      logger.info('ElevenLabs voices fetched successfully', {
        availableCount: validVoices.length,
        totalVoices: ELEVEN_LABS_VOICES.length
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch ElevenLabs voices';
      setError(message);
      logger.error('Failed to fetch ElevenLabs voices:', { error: message });
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  // Fetch voices on mount and when client changes
  useEffect(() => {
    fetchVoices();
  }, [client, fetchVoices]);

  return {
    voices,
    isLoading,
    error,
    refetch: fetchVoices
  };
}