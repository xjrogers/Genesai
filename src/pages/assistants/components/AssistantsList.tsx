import React from 'react';
import { AssistantCard } from '../../../components/assistants/AssistantCard';
import type { Assistant } from '../../../types';

interface AssistantsListProps {
  assistants: Assistant[];
}

export function AssistantsList({ assistants }: AssistantsListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {assistants.map((assistant) => (
        <AssistantCard
          key={assistant.id}
          assistant={assistant}
        />
      ))}
    </div>
  );
}