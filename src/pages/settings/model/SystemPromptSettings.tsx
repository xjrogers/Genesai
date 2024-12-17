import React from 'react';
import { MessageSquare } from 'lucide-react';
import { SettingsTextarea } from '../components/SettingsTextarea';

interface Props {
  assistant: any;
  getValue: (assistant: any, field: string) => any;
  updateField: (field: string, value: any) => void;
}

export function SystemPromptSettings({ assistant, getValue, updateField }: Props) {
  const systemMessages = getValue(assistant, 'model.messages')?.filter(
    (msg: any) => msg.role === 'system'
  ) || [];

  const systemPrompt = systemMessages[0]?.content || '';

  const handlePromptChange = (content: string) => {
    const messages = getValue(assistant, 'model.messages') || [];
    const updatedMessages = messages.filter((msg: any) => msg.role !== 'system');
    
    if (content.trim()) {
      updatedMessages.unshift({
        role: 'system',
        content
      });
    }
    
    updateField('model.messages', updatedMessages);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-gray-200">
      <div className="flex items-center space-x-2">
        <MessageSquare className="h-5 w-5 text-gray-400" />
        <h4 className="font-medium text-gray-900">System Prompt</h4>
      </div>
      
      <SettingsTextarea
        label="System Instructions"
        description="Define the core behavior and personality of your assistant"
        value={systemPrompt}
        onChange={handlePromptChange}
        rows={6}
        placeholder="You are a helpful AI assistant..."
      />
    </div>
  );
}