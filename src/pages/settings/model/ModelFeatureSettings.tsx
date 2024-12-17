import React from 'react';
import { SettingsToggle } from '../components/SettingsToggle';

interface Props {
  emotionRecognitionEnabled?: boolean;
  onUpdate: (field: string, value: boolean) => void;
}

export function ModelFeatureSettings({
  emotionRecognitionEnabled,
  onUpdate
}: Props) {
  return (
    <div className="space-y-4">
      <SettingsToggle
        label="Emotion Recognition"
        description="Detect and respond to user emotions"
        enabled={emotionRecognitionEnabled || false}
        onChange={(value) => onUpdate('model.emotionRecognitionEnabled', value)}
      />
    </div>
  );
}