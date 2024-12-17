import React from 'react';

interface SettingsInputProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  description?: string;
  type?: 'text' | 'number' | 'url';
  placeholder?: string;
}

export function SettingsInput({
  label,
  value = '',
  onChange,
  description,
  type = 'text',
  placeholder
}: SettingsInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      <div className="mt-1">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
    </div>
  );
}