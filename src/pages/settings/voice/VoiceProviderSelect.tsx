// src/pages/settings/voice/VoiceProviderSelect.tsx
import React from 'react';
import { SettingsSelect } from '../components/SettingsSelect';

const VOICE_PROVIDERS = [
  { value: 'tavus', label: 'Tavus' },
  { value: 'eleven_labs', label: 'ElevenLabs' },
  { value: 'azure', label: 'Azure' },
  { value: 'deepgram', label: 'Deepgram' },
  { value: 'playht', label: 'PlayHT' }
] as const;

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export function VoiceProviderSelect({ value, onChange }: Props) {
  return (
    <SettingsSelect
      label="Voice Provider"
      description="Select the text-to-speech provider"
      value={value}
      options={VOICE_PROVIDERS}
      onChange={onChange}
    />
  );
}
