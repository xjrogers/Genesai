import React from 'react';
import { CallsSearch } from './CallsSearch';
import { DateRangeFilter } from '../filters/DateRangeFilter';
import { FilterSummary } from '../filters/FilterSummary';

export function CallsFilters() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <CallsSearch />
        </div>
      </div>

      <DateRangeFilter />
      <FilterSummary />
    </div>
  );
}