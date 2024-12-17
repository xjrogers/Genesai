import React from 'react';

interface SettingsSliderProps {
  label: string;
  value?: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  description?: string;
}

export function SettingsSlider({
  label,
  value = 0,
  min,
  max,
  step,
  onChange,
  description
}: SettingsSliderProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      <div className="mt-2 flex items-center space-x-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm text-gray-500 w-12 text-right">
          {value.toFixed(1)}
        </span>
      </div>
    </div>
  );
}