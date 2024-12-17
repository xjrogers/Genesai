import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsTextarea } from '../components/SettingsTextarea';

interface Props {
  assistant: any;
  getValue: (assistant: any, field: string) => any;
  updateField: (field: string, value: any) => void;
}

export function MessageSettings({ assistant, getValue, updateField }: Props) {
  return (
    <SettingsSection
      title="Message Settings"
      description="Configure automated messages and responses"
      icon={<MessageCircle className="h-5 w-5 text-yellow-500" />}
    >
      <div className="space-y-6">
        <SettingsTextarea
          label="First Message"
          description="Initial message spoken by the assistant"
          value={getValue(assistant, 'firstMessage')}
          onChange={(value) => updateField('firstMessage', value)}
        />

        <SettingsTextarea
          label="Voicemail Message"
          description="Message spoken when voicemail is detected"
          value={getValue(assistant, 'voicemailMessage')}
          onChange={(value) => updateField('voicemailMessage', value)}
        />

        <SettingsTextarea
          label="End Call Message"
          description="Message spoken before ending the call"
          value={getValue(assistant, 'endCallMessage')}
          onChange={(value) => updateField('endCallMessage', value)}
        />
      </div>
    </SettingsSection>
  );
}