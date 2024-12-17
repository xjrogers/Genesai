// src/pages/settings/messages/MessagePlanSettings.tsx
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsInput } from '../components/SettingsInput';
import { SettingsTextarea } from '../components/SettingsTextarea';

interface Props {
  assistant: any;
  onUpdate: (field: string, value: any) => void;
}

export function MessagePlanSettings({ assistant, onUpdate }: Props) {
  return (
    <SettingsSection
      title="Message Settings"
      description="Configure automated messages and responses"
      icon={<MessageCircle className="h-5 w-5 text-yellow-500" />}
    >
      <div className="space-y-6">
        <SettingsTextarea
          label="Idle Messages"
          description="Messages to say during silence"
          value={assistant.messagePlan?.idleMessages?.join('\n')}
          onChange={(value) => onUpdate('messagePlan.idleMessages', value.split('\n'))}
        />

        <SettingsInput
          type="number"
          label="Max Idle Messages"
          description="Maximum number of idle messages"
          value={assistant.messagePlan?.idleMessageMaxSpokenCount?.toString()}
          onChange={(value) => onUpdate('messagePlan.idleMessageMaxSpokenCount', Number(value))}
        />

        <SettingsInput
          type="number"
          label="Idle Timeout"
          description="Seconds before idle message"
          value={assistant.messagePlan?.idleTimeoutSeconds?.toString()}
          onChange={(value) => onUpdate('messagePlan.idleTimeoutSeconds', Number(value))}
        />
      </div>
    </SettingsSection>
  );
}
