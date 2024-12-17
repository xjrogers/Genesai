import React from 'react';
import { Filter } from 'lucide-react';
import { CallsSearch } from '../../../components/calls/CallsSearch';

export function CallsFilters() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <CallsSearch />
      <div className="flex gap-2">
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
        <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
          <option>All Statuses</option>
          <option>Active</option>
          <option>Completed</option>
          <option>Failed</option>
        </select>
      </div>
    </div>
  );
}