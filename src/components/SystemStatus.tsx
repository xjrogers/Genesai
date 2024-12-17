import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { useVapi } from '../contexts/VapiContext';

export function SystemStatus() {
  const { client, error } = useVapi();

  const systems = [
    {
      name: 'API Connection',
      status: client ? 'operational' : 'down',
      latency: '45ms'
    },
    {
      name: 'Voice Processing',
      status: 'operational',
      latency: '120ms'
    },
    {
      name: 'Assistant Engine',
      status: error ? 'degraded' : 'operational',
      latency: '85ms'
    },
    {
      name: 'Analytics',
      status: 'operational',
      latency: '65ms'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-500';
      case 'degraded':
        return 'text-yellow-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">System Status</h3>
          <div className="flex items-center">
            {error ? (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            <span className="ml-2 text-sm text-gray-500">
              {error ? 'Some Systems Degraded' : 'All Systems Operational'}
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          {systems.map((system) => (
            <div key={system.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(system.status)} mr-2`} />
                <span className="text-sm text-gray-900">{system.name}</span>
              </div>
              {system.latency && (
                <span className="text-sm text-gray-500">Latency: {system.latency}</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Last checked</span>
            <span className="text-gray-900">2 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}