import React from 'react';
import { Filter } from 'lucide-react';
import { DateFilterSelect } from './DateFilterSelect';
import { FilterSummary } from './FilterSummary';
import { useDateRangeStore } from '../../store/useDateRangeStore';

export function AnalyticsFilters() {
  const { startDate, endDate } = useDateRangeStore();

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <DateFilterSelect />
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>
      
      <FilterSummary 
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
} 