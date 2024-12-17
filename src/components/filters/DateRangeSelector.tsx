// src/components/filters/DateRangeSelector.tsx
import React from 'react';
import { useDateRangeStore } from '../../store/useDateRangeStore';

const DATE_RANGES = [
  { value: 'last24Hours', label: 'Last 24 Hours' },
  { value: 'last7Days', label: 'Last 7 Days' },
  { value: 'last30Days', label: 'Last 30 Days' },
  { value: 'thisMonth', label: 'This Month' }
];

export function DateRangeSelector() {
  const { selectedRange, setDateRange } = useDateRangeStore();

  return (
    <select
      value={selectedRange}
      onChange={(e) => setDateRange(e.target.value)}
      className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
    >
      {DATE_RANGES.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
