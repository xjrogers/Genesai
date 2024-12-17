// src/pages/settings/voice/VoiceIdentitySettings.tsx
import React from 'react';
import { SettingsInput } from '../components/SettingsInput';

interface Props {
  voiceId?: string;
  conversationName?: string;
  onUpdate: (field: string, value: string) => void;
}

export function VoiceIdentitySettings({ voiceId, conversationName, onUpdate }: Props) {
  return (
    <div className="space-y-4">
      <SettingsInput
        label="Voice ID"
        description="Unique identifier for the voice model"
        value={voiceId}
        onChange={(value) => onUpdate('voice.voiceId', value)}
      />
      
      <SettingsInput
        label="Conversation Name"
        description="Name to identify this conversation context"
        value={conversationName}
        onChange={(value) => onUpdate('voice.conversationName', value)}
      />
    </div>
  );
}
