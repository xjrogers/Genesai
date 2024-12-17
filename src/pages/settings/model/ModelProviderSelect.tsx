import React from 'react';
import { SettingsSelect } from '../components/SettingsSelect';

const MODEL_PROVIDERS = [
  { value: 'xai', label: 'XAI' },
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'azure', label: 'Azure OpenAI' },
  { value: 'custom', label: 'Custom LLM' }
] as const;

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export function ModelProviderSelect({ value, onChange }: Props) {
  return (
    <SettingsSelect
      label="Model Provider"
      description="Select the language model provider"
      value={value}
      options={MODEL_PROVIDERS}
      onChange={onChange}
    />
  );
}