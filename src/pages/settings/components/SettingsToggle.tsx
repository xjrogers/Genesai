import React from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface SettingsToggleProps {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function SettingsToggle({
  label,
  description,
  enabled,
  onChange
}: SettingsToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      >
        <span className="sr-only">{enabled ? 'Enabled' : 'Disabled'}</span>
        <span
          className={`${
            enabled ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        >
          {enabled ? (
            <ToggleRight className="h-3 w-3 text-blue-600 absolute top-1 left-1" />
          ) : (
            <ToggleLeft className="h-3 w-3 text-gray-400 absolute top-1 left-1" />
          )}
        </span>
      </button>
    </div>
  );
}