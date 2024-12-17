// src/pages/settings/behavior/BehaviorSettings.tsx
import React from 'react';
import { Settings } from 'lucide-react';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsInput } from '../components/SettingsInput';
import { SettingsToggle } from '../components/SettingsToggle';

interface Props {
  assistant: any;
  onUpdate: (field: string, value: any) => void;
}

export function BehaviorSettings({ assistant, onUpdate }: Props) {
  return (
    <SettingsSection
      title="Behavior Settings"
      description="Configure how your assistant interacts and responds"
      icon={<Settings className="h-5 w-5 text-orange-500" />}
    >
      <div className="space-y-6">
        <SettingsInput
          type="number"
          label="Silence Timeout"
          description="Seconds of silence before ending call"
          value={assistant.silenceTimeoutSeconds?.toString()}
          onChange={(value) => onUpdate('silenceTimeoutSeconds', Number(value))}
        />

        <SettingsInput
          type="number"
          label="Max Duration"
          description="Maximum call duration in seconds"
          value={assistant.maxDurationSeconds?.toString()}
          onChange={(value) => onUpdate('maxDurationSeconds', Number(value))}
        />

        <SettingsToggle
          label="Background Denoising"
          description="Filter out background noise"
          enabled={assistant.backgroundDenoisingEnabled || false}
          onChange={(value) => onUpdate('backgroundDenoisingEnabled', value)}
        />

        <SettingsToggle
          label="Model Output in Messages"
          description="Use model output instead of transcription"
          enabled={assistant.modelOutputInMessagesEnabled || false}
          onChange={(value) => onUpdate('modelOutputInMessagesEnabled', value)}
        />
      </div>
    </SettingsSection>
  );
}
