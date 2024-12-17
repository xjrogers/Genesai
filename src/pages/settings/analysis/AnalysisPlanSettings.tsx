// src/pages/settings/analysis/AnalysisPlanSettings.tsx
import React from 'react';
import { BarChart } from 'lucide-react';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsToggle } from '../components/SettingsToggle';
import { SettingsInput } from '../components/SettingsInput';
import { SettingsSelect } from '../components/SettingsSelect';

const RUBRIC_OPTIONS = [
  { value: 'NumericScale', label: 'Numeric Scale (1-10)' },
  { value: 'DescriptiveScale', label: 'Descriptive Scale' },
  { value: 'PassFail', label: 'Pass/Fail' },
  { value: 'Checklist', label: 'Checklist' }
];

interface Props {
  assistant: any;
  onUpdate: (field: string, value: any) => void;
}

export function AnalysisPlanSettings({ assistant, onUpdate }: Props) {
  return (
    <SettingsSection
      title="Analysis Settings"
      description="Configure call analysis and evaluation"
      icon={<BarChart className="h-5 w-5 text-indigo-500" />}
    >
      <div className="space-y-8">
        {/* Summary Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Summary Analysis</h4>
          <SettingsToggle
            label="Enable Summary"
            description="Generate call summaries"
            enabled={assistant.analysisPlan?.summaryPlan?.enabled || false}
            onChange={(value) => onUpdate('analysisPlan.summaryPlan.enabled', value)}
          />
          <SettingsInput
            type="number"
            label="Summary Timeout"
            description="Seconds to wait for summary generation"
            value={assistant.analysisPlan?.summaryPlan?.timeoutSeconds?.toString()}
            onChange={(value) => onUpdate('analysisPlan.summaryPlan.timeoutSeconds', Number(value))}
          />
        </div>

        {/* Success Evaluation Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Success Evaluation</h4>
          <SettingsToggle
            label="Enable Evaluation"
            description="Evaluate call success"
            enabled={assistant.analysisPlan?.successEvaluationPlan?.enabled || false}
            onChange={(value) => onUpdate('analysisPlan.successEvaluationPlan.enabled', value)}
          />
          <SettingsSelect
            label="Evaluation Rubric"
            description="How to measure success"
            value={assistant.analysisPlan?.successEvaluationPlan?.rubric}
            options={RUBRIC_OPTIONS}
            onChange={(value) => onUpdate('analysisPlan.successEvaluationPlan.rubric', value)}
          />
        </div>
      </div>
    </SettingsSection>
  );
}
