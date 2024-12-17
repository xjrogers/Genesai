import React from 'react';
import { Brain } from 'lucide-react';
import { useModelSettings } from '../../../hooks/settings/useModelSettings';
import { SettingsCard } from './SettingsCard';
import { SettingsSelect } from './SettingsSelect';
import { SettingsSlider } from './SettingsSlider';
import { SettingsToggle } from './SettingsToggle';

export function ModelSettings() {
  const {
    provider,
    model,
    temperature,
    maxTokens,
    emotionRecognitionEnabled,
    availableProviders,
    availableModels,
    updateModelSettings,
    isLoading
  } = useModelSettings();

  return (
    <SettingsCard
      title="Model Settings"
      description="Configure the AI model powering your assistant"
      icon={<Brain className="h-5 w-5 text-purple-500" />}
      isLoading={isLoading}
    >
      <div className="space-y-6">
        <SettingsSelect
          label="Model Provider"
          value={provider}
          options={availableProviders}
          onChange={(value) => updateModelSettings({ provider: value })}
        />

        <SettingsSelect
          label="Model"
          value={model}
          options={availableModels}
          onChange={(value) => updateModelSettings({ model: value })}
        />

        <SettingsSlider
          label="Temperature"
          description="Higher values make the output more random, lower values make it more focused"
          value={temperature}
          min={0}
          max={1}
          step={0.1}
          onChange={(value) => updateModelSettings({ temperature: value })}
        />

        <SettingsSlider
          label="Max Tokens"
          description="Maximum length of the model's response"
          value={maxTokens}
          min={100}
          max={1000}
          step={50}
          onChange={(value) => updateModelSettings({ maxTokens: value })}
        />

        <SettingsToggle
          label="Emotion Recognition"
          description="Enable emotion detection during conversations"
          enabled={emotionRecognitionEnabled}
          onChange={(enabled) => updateModelSettings({ emotionRecognitionEnabled: enabled })}
        />
      </div>
    </SettingsCard>
  );
}