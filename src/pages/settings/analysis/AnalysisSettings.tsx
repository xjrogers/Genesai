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
  getValue: (assistant: any, field: string) => any;
  updateField: (field: string, value: any) => void;
}

export function AnalysisSettings({ assistant, getValue, updateField }: Props) {
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
            enabled={getValue(assistant, 'analysisPlan.summaryPlan.enabled')}
            onChange={(value) => updateField('analysisPlan.summaryPlan.enabled', value)}
          />
          <SettingsInput
            type="number"
            label="Summary Timeout"
            description="Seconds to wait for summary generation"
            value={getValue(assistant, 'analysisPlan.summaryPlan.timeoutSeconds')?.toString()}
            onChange={(value) => updateField('analysisPlan.summaryPlan.timeoutSeconds', Number(value))}
          />
        </div>

        {/* Success Evaluation Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Success Evaluation</h4>
          <SettingsToggle
            label="Enable Evaluation"
            description="Evaluate call success"
            enabled={getValue(assistant, 'analysisPlan.successEvaluationPlan.enabled')}
            onChange={(value) => updateField('analysisPlan.successEvaluationPlan.enabled', value)}
          />
          <SettingsSelect
            label="Evaluation Rubric"
            description="How to measure success"
            value={getValue(assistant, 'analysisPlan.successEvaluationPlan.rubric')}
            options={RUBRIC_OPTIONS}
            onChange={(value) => updateField('analysisPlan.successEvaluationPlan.rubric', value)}
          />
        </div>
      </div>
    </SettingsSection>
  );
}