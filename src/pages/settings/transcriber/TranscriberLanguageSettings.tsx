// src/pages/settings/transcriber/TranscriberLanguageSettings.tsx
import React from 'react';
import { SettingsSelect } from '../components/SettingsSelect';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'nl', label: 'Dutch' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' }
] as const;

interface Props {
  language?: string;
  onUpdate: (field: string, value: string) => void;
}

export function TranscriberLanguageSettings({ language, onUpdate }: Props) {
  return (
    <SettingsSelect
      label="Language"
      description="Primary language for transcription"
      value={language}
      options={LANGUAGES}
      onChange={(value) => onUpdate('transcriber.language', value)}
    />
  );
}
