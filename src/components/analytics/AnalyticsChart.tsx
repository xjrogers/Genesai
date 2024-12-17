import React from 'react';
import { useCostDisplay } from '../../hooks/cost/useCostDisplay';
import type { AnalyticsQueryResult } from '../../types';

interface AnalyticsChartProps {
  data: AnalyticsQueryResult[];
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics Overview</h3>
      <div className="space-y-4">
        {data.map((result) => (
          <div key={result.name} className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-500">{result.name}</h4>
            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {result.result.map((item: any, index: number) => {
                const { formattedCost } = useCostDisplay(item.sumCost || 0);
                
                return (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    {Object.entries(item).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-gray-500">{key}:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {key.toLowerCase().includes('cost') 
                            ? formattedCost 
                            : typeof value === 'number' 
                              ? value.toFixed(2) 
                              : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}