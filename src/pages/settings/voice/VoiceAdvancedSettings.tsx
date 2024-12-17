// src/pages/settings/voice/VoiceAdvancedSettings.tsx
import React from 'react';
import { SettingsInput } from '../components/SettingsInput';
import { SettingsToggle } from '../components/SettingsToggle';

interface Props {
  properties?: {
    maxCallDuration?: number;
    participantLeftTimeout?: number;
    participantAbsentTimeout?: number;
    applyGreenscreen?: boolean;
  };
  onUpdate: (field: string, value: any) => void;
}

export function VoiceAdvancedSettings({ properties, onUpdate }: Props) {
  return (
    <div className="space-y-4">
      <SettingsInput
        type="number"
        label="Max Call Duration (seconds)"
        description="Maximum length of the conversation"
        value={properties?.maxCallDuration?.toString()}
        onChange={(value) => onUpdate('voice.properties.maxCallDuration', Number(value))}
      />

      <SettingsInput
        type="number"
        label="Participant Left Timeout (seconds)"
        description="Time to wait after participant leaves"
        value={properties?.participantLeftTimeout?.toString()}
        onChange={(value) => onUpdate('voice.properties.participantLeftTimeout', Number(value))}
      />

      <SettingsToggle
        label="Apply Greenscreen"
        description="Enable background replacement for video calls"
        enabled={properties?.applyGreenscreen || false}
        onChange={(value) => onUpdate('voice.properties.applyGreenscreen', value)}
      />
    </div>
  );
}
