import React from 'react';
import { Settings } from 'lucide-react';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsInput } from '../components/SettingsInput';
import { SettingsToggle } from '../components/SettingsToggle';
import { SettingsSelect } from '../components/SettingsSelect';
import { useBehaviorSettings } from '../../../hooks/settings/useBehaviorSettings';

const BACKGROUND_SOUND_OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'office', label: 'Office' }
];

interface Props {
  assistant: any;
  getValue: (assistant: any, field: string) => any;
  updateField: (field: string, value: any) => void;
}

export function BehaviorSettings({ assistant, getValue, updateField }: Props) {
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
          description="Seconds of silence before ending call (default: 30)"
          value={getValue(assistant, 'silenceTimeoutSeconds')?.toString()}
          onChange={(value) => updateField('silenceTimeoutSeconds', Number(value))}
          min={1}
          max={300}
        />

        <SettingsInput
          type="number"
          label="Max Duration"
          description="Maximum call duration in seconds (default: 600)"
          value={getValue(assistant, 'maxDurationSeconds')?.toString()}
          onChange={(value) => updateField('maxDurationSeconds', Number(value))}
          min={60}
          max={3600}
        />

        <SettingsSelect
          label="Background Sound"
          description="Ambient sound during calls"
          value={getValue(assistant, 'backgroundSound')}
          options={BACKGROUND_SOUND_OPTIONS}
          onChange={(value) => updateField('backgroundSound', value)}
        />

        <SettingsToggle
          label="Background Denoising"
          description="Filter out background noise and improve audio quality"
          enabled={getValue(assistant, 'backgroundDenoisingEnabled')}
          onChange={(value) => updateField('backgroundDenoisingEnabled', value)}
        />

        <SettingsToggle
          label="Model Output in Messages"
          description="Use model output instead of transcription in conversation history"
          enabled={getValue(assistant, 'modelOutputInMessagesEnabled')}
          onChange={(value) => updateField('modelOutputInMessagesEnabled', value)}
        />

        <SettingsToggle
          label="HIPAA Enabled"
          description="Enable HIPAA compliance features (no logs or recordings stored)"
          enabled={getValue(assistant, 'hipaaEnabled')}
          onChange={(value) => updateField('hipaaEnabled', value)}
        />
      </div>
    </SettingsSection>
  );
}