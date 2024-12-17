import React from 'react';

export function AssistantsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Assistants</h2>
        <p className="mt-1 text-sm text-gray-500">
          View your AI assistants
        </p>
      </div>
    </div>
  );
}