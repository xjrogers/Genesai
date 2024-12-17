import React from 'react';
import { Activity } from 'lucide-react';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsToggle } from '../components/SettingsToggle';

interface Props {
  assistant: any;
  getValue: (assistant: any, field: string) => any;
  updateField: (field: string, value: any) => void;
}

export function MonitoringSettings({ assistant, getValue, updateField }: Props) {
  return (
    <SettingsSection
      title="Monitoring Settings"
      description="Configure real-time call monitoring"
      icon={<Activity className="h-5 w-5 text-red-500" />}
    >
      <div className="space-y-6">
        <SettingsToggle
          label="Enable Listening"
          description="Allow real-time call listening"
          enabled={getValue(assistant, 'monitorPlan.listenEnabled')}
          onChange={(value) => updateField('monitorPlan.listenEnabled', value)}
        />

        <SettingsToggle
          label="Enable Control"
          description="Allow real-time call control"
          enabled={getValue(assistant, 'monitorPlan.controlEnabled')}
          onChange={(value) => updateField('monitorPlan.controlEnabled', value)}
        />
      </div>
    </SettingsSection>
  );
}