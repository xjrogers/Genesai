import React from 'react';

interface SettingsSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  description?: string;
}

export function SettingsSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  description
}: SettingsSliderProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <span className="text-sm text-gray-500">
          {value.toFixed(2)}
        </span>
      </div>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      <div className="mt-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{min}</span>
          <span className="text-xs text-gray-500">{max}</span>
        </div>
      </div>
    </div>
  );
}