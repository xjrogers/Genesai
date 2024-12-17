import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { getDatePresets } from '../../utils/date';

export function DatePresetFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const presets = getDatePresets();
  const currentPreset = searchParams.get('preset') || 'last7Days';

  const handlePresetChange = (preset: string) => {
    const params = new URLSearchParams(searchParams);
    const { startDate, endDate } = presets[preset].getRange();
    
    params.set('preset', preset);
    params.set('startDate', startDate);
    params.set('endDate', endDate);
    
    setSearchParams(params);
  };

  return (
    <select
      value={currentPreset}
      onChange={(e) => handlePresetChange(e.target.value)}
      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
    >
      {Object.entries(presets).map(([key, { label }]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </select>
  );
}