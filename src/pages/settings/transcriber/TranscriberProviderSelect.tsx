// src/pages/settings/transcriber/TranscriberProviderSelect.tsx
import React from 'react';
import { SettingsSelect } from '../components/SettingsSelect';

const TRANSCRIBER_PROVIDERS = [
  { value: 'talkscriber', label: 'Talkscriber' },
  { value: 'deepgram', label: 'Deepgram' },
  { value: 'whisper', label: 'Whisper' },
  { value: 'azure', label: 'Azure Speech' }
] as const;

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export function TranscriberProviderSelect({ value, onChange }: Props) {
  return (
    <SettingsSelect
      label="Transcription Provider"
      description="Select the speech-to-text provider"
      value={value}
      options={TRANSCRIBER_PROVIDERS}
      onChange={onChange}
    />
  );
}
