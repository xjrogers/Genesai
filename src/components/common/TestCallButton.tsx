import React, { useState } from 'react';
import { Phone, Loader2 } from 'lucide-react';
import { useVapi } from '../../contexts/vapi';
import { logger } from '../../utils/logger';

interface TestCallButtonProps {
  assistantId?: string;
  className?: string;
}

export function TestCallButton({ assistantId, className = '' }: TestCallButtonProps) {
  const { client } = useVapi();
  const [isCalling, setIsCalling] = useState(false);

  const startTestCall = async () => {
    if (!client || !assistantId || isCalling) return;

    try {
      setIsCalling(true);
      logger.info('Starting test call', { assistantId });

      // Create an outbound call with the selected assistant
      const call = await client.calls.create({
        type: 'outboundPhoneCall',
        assistantId,
        name: 'Test Call',
        customer: {
          number: process.env.VITE_TEST_PHONE_NUMBER || '+1234567890' // Use environment variable or default
        }
      });

      logger.info('Test call created successfully', { callId: call.id });

      // Show success message
      alert('Test call initiated successfully! Call ID: ' + call.id);
    } catch (error) {
      logger.error('Failed to start test call:', { error });
      alert('Failed to start test call. Please check the console for details.');
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <button
      onClick={startTestCall}
      disabled={isCalling || !assistantId}
      className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isCalling ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Phone className="h-4 w-4 mr-2" />
      )}
      {isCalling ? 'Starting Call...' : 'Test Call'}
    </button>
  );
}