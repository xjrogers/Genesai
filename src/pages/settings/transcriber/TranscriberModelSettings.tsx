// src/pages/settings/transcriber/TranscriberModelSettings.tsx
import React from 'react';
import { SettingsSelect } from '../components/SettingsSelect';

const MODELS = [
  { value: 'whisper', label: 'Whisper' },
  { value: 'whisper-large', label: 'Whisper Large' },
  { value: 'whisper-medium', label: 'Whisper Medium' },
  { value: 'whisper-small', label: 'Whisper Small' }
] as const;

interface Props {
  model?: string;
  onUpdate: (field: string, value: string) => void;
}

export function TranscriberModelSettings({ model, onUpdate }: Props) {
  return (
    <SettingsSelect
      label="Model"
      description="Transcription model to use"
      value={model}
      options={MODELS}
      onChange={(value) => onUpdate('transcriber.model', value)}
    />
  );
}
