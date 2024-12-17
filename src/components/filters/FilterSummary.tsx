import React from 'react';
import { useFilterState } from '../../hooks/filters/useFilterState';
import { formatDateForDisplay } from '../../utils/filters/dateRangeUtils';

interface FilterSummaryProps {
  total: number;
  filtered: number;
}

export function FilterSummary({ total, filtered }: FilterSummaryProps) {
  const { startDate, endDate, searchTerm } = useFilterState();

  if (total === filtered && !searchTerm) return null;

  return (
    <div className="text-sm text-gray-500">
      Showing {filtered} of {total} results
      {startDate && endDate && (
        <span className="ml-2">
          from {formatDateForDisplay(startDate)} to {formatDateForDisplay(endDate)}
        </span>
      )}
      {searchTerm && (
        <span className="ml-2">
          matching "{searchTerm}"
        </span>
      )}
    </div>
  );
}