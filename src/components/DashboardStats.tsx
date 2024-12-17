import React from 'react';
import { Phone, Users, Clock, TrendingUp } from 'lucide-react';
import { useVapi } from '../contexts/VapiContext';

export function DashboardStats() {
  const { analytics } = useVapi();

  // Calculate stats from analytics data
  const totalCalls = analytics[0]?.result.reduce((acc: number, curr: any) => acc + curr.countId, 0) || 0;
  const totalCost = analytics[0]?.result.reduce((acc: number, curr: any) => acc + (curr.sumCost || 0), 0) || 0;
  const avgDuration = analytics[0]?.result.reduce((acc: number, curr: any) => acc + (curr.avgDuration || 0), 0) / (analytics[0]?.result.length || 1) || 0;

  const stats = [
    {
      name: 'Total Calls',
      value: totalCalls.toString(),
      icon: <Phone className="h-6 w-6 text-blue-600" />,
      change: '12%',
      changeType: 'increase' as const,
    },
    {
      name: 'Total Cost',
      value: `$${totalCost.toFixed(2)}`,
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      change: '8%',
      changeType: 'increase' as const,
    },
    {
      name: 'Avg. Duration',
      value: `${avgDuration.toFixed(1)}m`,
      icon: <Clock className="h-6 w-6 text-indigo-600" />,
      change: '4%',
      changeType: 'decrease' as const,
    },
    {
      name: 'Success Rate',
      value: '98.5%',
      icon: <Users className="h-6 w-6 text-purple-600" />,
      change: '1.2%',
      changeType: 'increase' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">{stat.icon}</div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.changeType === 'increase' ? '↑' : '↓'}
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}