import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useTranscriberSettings } from '../../../hooks/settings/useTranscriberSettings';
import { SettingsCard } from './SettingsCard';
import { SettingsSelect } from './SettingsSelect';
import { SettingsToggle } from './SettingsToggle';

export function TranscriberSettings() {
  const {
    provider,
    model,
    language,
    languageDetectionEnabled,
    availableProviders,
    availableModels,
    availableLanguages,
    updateTranscriberSettings,
    isLoading
  } = useTranscriberSettings();

  return (
    <SettingsCard
      title="Transcription Settings"
      description="Configure how your assistant understands speech"
      icon={<MessageSquare className="h-5 w-5 text-green-500" />}
      isLoading={isLoading}
    >
      <div className="space-y-6">
        <SettingsSelect
          label="Transcription Provider"
          value={provider}
          options={availableProviders}
          onChange={(value) => updateTranscriberSettings({ provider: value })}
        />

        <SettingsSelect
          label="Model"
          value={model}
          options={availableModels}
          onChange={(value) => updateTranscriberSettings({ model: value })}
        />

        <SettingsSelect
          label="Language"
          value={language}
          options={availableLanguages}
          onChange={(value) => updateTranscriberSettings({ language: value })}
        />

        <SettingsToggle
          label="Auto Language Detection"
          description="Automatically detect and switch to the speaker's language"
          enabled={languageDetectionEnabled}
          onChange={(enabled) => updateTranscriberSettings({ languageDetectionEnabled: enabled })}
        />
      </div>
    </SettingsCard>
  );
}