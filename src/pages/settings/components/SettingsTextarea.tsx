import React from 'react';

interface SettingsTextareaProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  description?: string;
  rows?: number;
}

export function SettingsTextarea({
  label,
  value = '',
  onChange,
  description,
  rows = 4
}: SettingsTextareaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      <div className="mt-1">
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
    </div>
  );
}