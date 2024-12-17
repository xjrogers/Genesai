import React from 'react';
import { SettingsInput } from '../components/SettingsInput';

interface Props {
  knowledgeBase?: {
    server?: {
      url?: string;
      timeoutSeconds?: number;
    };
  };
  onUpdate: (field: string, value: any) => void;
}

export function ModelKnowledgeBaseSettings({ knowledgeBase, onUpdate }: Props) {
  return (
    <div className="space-y-4">
      <SettingsInput
        label="Knowledge Base URL"
        description="Server endpoint for knowledge base queries"
        value={knowledgeBase?.server?.url}
        onChange={(value) => onUpdate('model.knowledgeBase.server.url', value)}
      />

      <SettingsInput
        type="number"
        label="Timeout (seconds)"
        description="Maximum time to wait for knowledge base responses"
        value={knowledgeBase?.server?.timeoutSeconds?.toString()}
        onChange={(value) => 
          onUpdate('model.knowledgeBase.server.timeoutSeconds', Number(value))
        }
      />
    </div>
  );
}