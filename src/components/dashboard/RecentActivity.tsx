import React from 'react';
import { Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { useVapi } from '../../contexts/vapi';
import type { Call } from '../../types';

function getActivityIcon(call: Call) {
  switch (call.status) {
    case 'ended':
      return <Phone className="h-5 w-5 text-blue-600" />;
    case 'in-progress':
      return <MessageSquare className="h-5 w-5 text-green-600" />;
    default:
      return <AlertCircle className="h-5 w-5 text-yellow-600" />;
  }
}

function getTimeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.floor(hours / 24)} days ago`;
}

export function RecentActivity() {
  const { calls } = useVapi();
  const recentCalls = calls.slice(0, 5);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <div className="flow-root mt-6">
          <ul role="list" className="-mb-8">
            {recentCalls.map((call, idx) => (
              <li key={call.id}>
                <div className="relative pb-8">
                  {idx !== recentCalls.length - 1 && (
                    <span
                      className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center ring-8 ring-white">
                        {getActivityIcon(call)}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm text-gray-900">
                          Call {call.id.slice(0, 8)}...
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          {call.startedAt ? getTimeAgo(call.startedAt) : 'Not started'}
                        </p>
                        {call.analysis?.summary && (
                          <p className="mt-2 text-sm text-gray-500">
                            {call.analysis.summary}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}