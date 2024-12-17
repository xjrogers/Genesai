import React from 'react';
import { Phone, User, Clock } from 'lucide-react';
import type { Call } from '../API/Types/Call';

interface CallsListProps {
  calls: Call[];
}

export function CallsList({ calls }: CallsListProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {calls.map((call) => (
          <li key={call.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <p className="ml-2 text-sm font-medium text-indigo-600 truncate">
                    {call.name || call.id}
                  </p>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${call.status === 'ended' ? 'bg-green-100 text-green-800' : 
                      call.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {call.status}
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    <User className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    {call.customer?.name || 'Unknown Customer'}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  <p>
                    Started {call.startedAt ? new Date(call.startedAt).toLocaleString() : 'Not started'}
                  </p>
                </div>
              </div>
              {call.analysis?.summary && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{call.analysis.summary}</p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}