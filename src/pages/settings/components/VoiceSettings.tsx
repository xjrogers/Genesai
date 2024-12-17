import React from 'react';
import { Mic } from 'lucide-react';
import { useVoiceSettings } from '../../../hooks/settings/useVoiceSettings';
import { SettingsCard } from './SettingsCard';
import { SettingsSelect } from './SettingsSelect';
import { SettingsSlider } from './SettingsSlider';
import { SettingsToggle } from './SettingsToggle';

export function VoiceSettings() {
  const {
    voiceProvider,
    voiceId,
    speed,
    fillerInjectionEnabled,
    availableVoices,
    availableProviders,
    updateVoiceSettings,
    isLoading
  } = useVoiceSettings();

  return (
    <SettingsCard
      title="Voice Settings"
      description="Customize how your AI assistant sounds"
      icon={<Mic className="h-5 w-5 text-blue-500" />}
      isLoading={isLoading}
    >
      <div className="space-y-6">
        <SettingsSelect
          label="Voice Provider"
          value={voiceProvider}
          options={availableProviders}
          onChange={(value) => updateVoiceSettings({ provider: value })}
        />

        <SettingsSelect
          label="Voice"
          value={voiceId}
          options={availableVoices}
          onChange={(value) => updateVoiceSettings({ voiceId: value })}
        />

        <SettingsSlider
          label="Speaking Speed"
          value={speed}
          min={0.5}
          max={2.0}
          step={0.1}
          onChange={(value) => updateVoiceSettings({ speed: value })}
        />

        <SettingsToggle
          label="Filler Words"
          description="Enable natural filler words like 'um', 'uh' during speech"
          enabled={fillerInjectionEnabled}
          onChange={(enabled) => updateVoiceSettings({ fillerInjectionEnabled: enabled })}
        />
      </div>
    </SettingsCard>
  );
}