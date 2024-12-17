import React from 'react';
import { CalendarDays } from 'lucide-react';
import { useDateRangeStore } from '../../store/useDateRangeStore';
import type { DateFilterOption } from '../../types/filters';

const DATE_FILTER_OPTIONS: { value: DateFilterOption; label: string }[] = [
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: 'month', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' }
];

export function DateFilterSelect() {
  const { selectedFilter, isUpdating, setDateRange } = useDateRangeStore();

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <CalendarDays className="h-5 w-5 text-gray-400" />
      </div>
      <select
        value={selectedFilter}
        onChange={(e) => setDateRange(e.target.value as DateFilterOption)}
        disabled={isUpdating}
        className={`block w-48 pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
          isUpdating ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {DATE_FILTER_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
} 