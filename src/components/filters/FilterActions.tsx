import React from 'react';
import { X } from 'lucide-react';
import { useFilterState } from '../../hooks/filters/useFilterState';

export function FilterActions() {
  const { reset } = useFilterState();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={reset}
        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        <X className="h-3 w-3 mr-1" />
        Clear Filters
      </button>
    </div>
  );
}