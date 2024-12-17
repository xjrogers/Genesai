import React from 'react';
import { Brain } from 'lucide-react';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsInput } from '../components/SettingsInput';
import { SettingsToggle } from '../components/SettingsToggle';
import { SystemPromptSettings } from './SystemPromptSettings';

interface Props {
  assistant: any;
  getValue: (assistant: any, field: string) => any;
  updateField: (field: string, value: any) => void;
}

export function ModelSettings({ assistant, getValue, updateField }: Props) {
  return (
    <SettingsSection
      title="Model Settings"
      description="Configure your AI assistant's language model"
      icon={<Brain className="h-5 w-5 text-purple-500" />}
    >
      <div className="space-y-6">
        <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-md">
          <Brain className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-blue-700">Using OpenAI GPT-4o mini</span>
        </div>

        <SettingsInput
          type="number"
          label="Temperature"
          description="Controls randomness in responses (0-1)"
          value={getValue(assistant, 'model.temperature')?.toString()}
          min={0}
          max={1}
          step={0.1}
          onChange={(value) => updateField('model.temperature', Number(value))}
        />

        <SettingsInput
          type="number"
          label="Max Tokens"
          description="Maximum response length"
          value={getValue(assistant, 'model.maxTokens')?.toString()}
          min={1}
          max={4000}
          onChange={(value) => updateField('model.maxTokens', Number(value))}
        />

        <SettingsToggle
          label="Emotion Recognition"
          description="Detect user emotions during conversation"
          enabled={getValue(assistant, 'model.emotionRecognitionEnabled')}
          onChange={(value) => updateField('model.emotionRecognitionEnabled', value)}
        />

        <SystemPromptSettings
          assistant={assistant}
          getValue={getValue}
          updateField={updateField}
        />
      </div>
    </SettingsSection>
  );
}