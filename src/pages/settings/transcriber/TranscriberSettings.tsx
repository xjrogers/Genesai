import React from 'react';
import { MessageSquare } from 'lucide-react';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsSelect } from '../components/SettingsSelect';
import { SettingsToggle } from '../components/SettingsToggle';

interface Props {
  assistant: any;
  getValue: (assistant: any, field: string) => any;
  updateField: (field: string, value: any) => void;
}

const TRANSCRIBER_PROVIDERS = [
  { value: 'talkscriber', label: 'Talkscriber' },
  { value: 'deepgram', label: 'Deepgram' },
  { value: 'gladia', label: 'Gladia' }
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' }
];

const MODELS = [
  { value: 'whisper', label: 'Whisper' },
  { value: 'nova', label: 'Nova' },
  { value: 'enhanced', label: 'Enhanced' }
];

export function TranscriberSettings({ assistant, getValue, updateField }: Props) {
  return (
    <SettingsSection
      title="Transcription Settings"
      description="Configure speech recognition and transcription"
      icon={<MessageSquare className="h-5 w-5 text-green-500" />}
    >
      <div className="space-y-6">
        <SettingsSelect
          label="Transcription Provider"
          value={getValue(assistant, 'transcriber.provider')}
          options={TRANSCRIBER_PROVIDERS}
          onChange={(value) => updateField('transcriber.provider', value)}
        />

        <SettingsSelect
          label="Language"
          value={getValue(assistant, 'transcriber.language')}
          options={LANGUAGES}
          onChange={(value) => updateField('transcriber.language', value)}
        />

        <SettingsSelect
          label="Model"
          value={getValue(assistant, 'transcriber.model')}
          options={MODELS}
          onChange={(value) => updateField('transcriber.model', value)}
        />

        <SettingsToggle
          label="Language Detection"
          description="Automatically detect and switch languages"
          enabled={getValue(assistant, 'transcriber.languageDetectionEnabled')}
          onChange={(value) => updateField('transcriber.languageDetectionEnabled', value)}
        />
      </div>
    </SettingsSection>
  );
}