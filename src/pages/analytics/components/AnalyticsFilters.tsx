import React from 'react';
import { Filter } from 'lucide-react';
import { DateRangeFilter } from '../../../components/filters/DateRangeFilter';
import { DatePresetFilter } from '../../../components/filters/DatePresetFilter';
import { useDateFilter } from '../../../hooks/filters/useDateFilter';

export function AnalyticsFilters() {
  const {
    startDate,
    endDate,
    selectedPreset,
    handlePresetChange,
    handleStartDateChange,
    handleEndDateChange
  } = useDateFilter();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
      </div>
      <div className="flex gap-2">
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
        <div className="w-48">
          <DatePresetFilter
            value={selectedPreset}
            onChange={handlePresetChange}
          />
        </div>
      </div>
    </div>
  );
}