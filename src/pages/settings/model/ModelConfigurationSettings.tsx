import React from 'react';
import { SettingsInput } from '../components/SettingsInput';
import { SettingsSlider } from '../components/SettingsSlider';

interface Props {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  numFastTurns?: number;
  onUpdate: (field: string, value: any) => void;
}

export function ModelConfigurationSettings({
  model,
  temperature,
  maxTokens,
  numFastTurns,
  onUpdate
}: Props) {
  return (
    <div className="space-y-6">
      <SettingsInput
        label="Model Name"
        description="Specific model to use from the provider"
        value={model}
        onChange={(value) => onUpdate('model.model', value)}
      />

      <SettingsSlider
        label="Temperature"
        description="Controls randomness in responses (0-1)"
        value={temperature}
        min={0}
        max={1}
        step={0.1}
        onChange={(value) => onUpdate('model.temperature', value)}
      />

      <SettingsInput
        type="number"
        label="Max Tokens"
        description="Maximum length of model responses"
        value={maxTokens?.toString()}
        onChange={(value) => onUpdate('model.maxTokens', Number(value))}
      />

      <SettingsInput
        type="number"
        label="Fast Turns"
        description="Number of initial fast response turns"
        value={numFastTurns?.toString()}
        onChange={(value) => onUpdate('model.numFastTurns', Number(value))}
      />
    </div>
  );
}