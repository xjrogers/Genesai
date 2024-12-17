import React from 'react';
import { Phone, TrendingUp, Clock, Users } from 'lucide-react';
import { useVapi } from '../../contexts/vapi';
import { useDashboardStats } from '../../hooks/dashboard/useDashboardStats';
import { logger } from '../../utils/logger';

const STAT_CONFIGS = [
  {
    id: 'calls',
    name: 'Total Calls',
    icon: Phone,
    color: 'text-blue-600'
  },
  {
    id: 'cost',
    name: 'Total Cost',
    icon: TrendingUp,
    color: 'text-green-600'
  },
  {
    id: 'duration',
    name: 'Avg. Duration',
    icon: Clock,
    color: 'text-indigo-600'
  },
  {
    id: 'success',
    name: 'Success Rate',
    icon: Users,
    color: 'text-purple-600'
  }
];

export function DashboardStats() {
  const { calls, loading } = useVapi();
  const stats = useDashboardStats(calls);

  logger.debug('Rendering dashboard stats', {
    callsCount: calls.length,
    hasStats: stats.length > 0,
    loading
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CONFIGS.map((config) => (
          <div key={config.id} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
            <div className="p-5">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="ml-5 w-full">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <p className="text-gray-500">No data available for the selected period</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const config = STAT_CONFIGS[index];
        return (
          <div key={config.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <config.icon className={`h-6 w-6 ${config.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}