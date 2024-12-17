import React from 'react';
import { Bot } from 'lucide-react';
import type { Assistant } from '../../../types';

interface AssistantSelectorProps {
  assistants: Assistant[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
}

export function AssistantSelector({ assistants, selectedId, onSelect }: AssistantSelectorProps) {
  return (
    <div className="flex items-center space-x-4">
      <Bot className="h-5 w-5 text-gray-400" />
      <select
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        <option value="">Select an Assistant</option>
        {assistants.map((assistant) => (
          <option key={assistant.id} value={assistant.id}>
            {assistant.name || assistant.id}
          </option>
        ))}
      </select>
    </div>
  );
}