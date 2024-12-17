// src/pages/settings/voice/VoiceFeatureToggles.tsx
import React from 'react';
import { SettingsToggle } from '../components/SettingsToggle';

interface Props {
  enableRecording?: boolean;
  enableTranscription?: boolean;
  onUpdate: (field: string, value: boolean) => void;
}

export function VoiceFeatureToggles({ enableRecording, enableTranscription, onUpdate }: Props) {
  return (
    <div className="space-y-4">
      <SettingsToggle
        label="Enable Recording"
        description="Record and store conversation audio"
        enabled={enableRecording || false}
        onChange={(value) => onUpdate('voice.properties.enableRecording', value)}
      />

      <SettingsToggle
        label="Enable Transcription"
        description="Convert speech to text in real-time"
        enabled={enableTranscription || false}
        onChange={(value) => onUpdate('voice.properties.enableTranscription', value)}
      />
    </div>
  );
}
