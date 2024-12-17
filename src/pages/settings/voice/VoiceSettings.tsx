import React from 'react';
import { Mic } from 'lucide-react';
import { SettingsSection } from '../components/SettingsSection';

interface Props {
  assistant: any;
  getValue: (assistant: any, field: string) => any;
  updateField: (field: string, value: any) => void;
}

export function VoiceSettings({ assistant, getValue }: Props) {
  const currentVoice = getValue(assistant, 'voice');
  const voiceTitle = currentVoice?.voiceId ? `ElevenLabs - ${currentVoice.voiceId}` : 'No voice selected';

  return (
    <SettingsSection
      title="Voice Settings"
      description="Current voice configuration using ElevenLabs"
      icon={<Mic className="h-5 w-5 text-blue-500" />}
    >
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <Mic className="h-5 w-5 text-blue-500" />
          <div>
            <h4 className="text-sm font-medium text-gray-900">Current Voice</h4>
            <p className="text-sm text-gray-500">{voiceTitle}</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Voice settings can only be configured through the Vapi platform
        </p>
      </div>
    </SettingsSection>
  );
}