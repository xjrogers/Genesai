// src/pages/settings/voice/VoiceGreetingSettings.tsx
import React from 'react';
import { SettingsInput } from '../components/SettingsInput';
import { SettingsTextarea } from '../components/SettingsTextarea';

interface Props {
  customGreeting?: string;
  firstMessage?: string;
  onUpdate: (field: string, value: string) => void;
}

export function VoiceGreetingSettings({ customGreeting, firstMessage, onUpdate }: Props) {
  return (
    <div className="space-y-4">
      <SettingsTextarea
        label="Custom Greeting"
        description="Initial message spoken by the assistant"
        value={customGreeting}
        onChange={(value) => onUpdate('voice.customGreeting', value)}
      />
      
      <SettingsTextarea
        label="First Message"
        description="Default response when conversation starts"
        value={firstMessage}
        onChange={(value) => onUpdate('firstMessage', value)}
      />
    </div>
  );
}
