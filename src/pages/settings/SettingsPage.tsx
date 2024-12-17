import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { useVapi } from '../../contexts/vapi';
import { SaveButton } from '../../components/common/SaveButton';
import { RefreshButton } from '../../components/common/RefreshButton';
import { useSettingsSync } from '../../hooks/settings/useSettingsSync';
import { useSettingsState } from '../../hooks/settings/useSettingsState';
import { useAssistantSelection } from '../../hooks/settings/useAssistantSelection';
import { AssistantSelector } from './components/AssistantSelector';
import { VoiceSettings } from './voice/VoiceSettings';
import { ModelSettings } from './model/ModelSettings';
import { BehaviorSettings } from './behavior/BehaviorSettings';
import { MessageSettings } from './message/MessageSettings';

export function SettingsPage() {
  const { loading, error } = useVapi();
  const { isSaving, saveSettings, fetchSettings } = useSettingsSync();
  const { getValue, updateField, resetChanges, getPendingChanges, hasChanges } = useSettingsState();
  const { selectedAssistant, selectedAssistantId, handleAssistantChange, assistants } = useAssistantSelection();

  const handleSave = async () => {
    if (!selectedAssistant || !hasChanges) return;
    try {
      await saveSettings(selectedAssistant.id, getPendingChanges());
      resetChanges();
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      await fetchSettings();
      resetChanges();
    } catch (error) {
      console.error('Failed to refresh settings:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Agent Settings</h2>
            <p className="mt-1 text-sm text-gray-500">
              Configure your AI assistant's behavior and capabilities
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <RefreshButton onRefresh={handleRefresh} />
            <SaveButton 
              onClick={handleSave}
              isLoading={isSaving}
              disabled={!hasChanges}
            />
          </div>
        </div>

        <AssistantSelector
          assistants={assistants}
          selectedId={selectedAssistantId}
          onSelect={handleAssistantChange}
        />

        {selectedAssistant && (
          <div className="space-y-8">
            <VoiceSettings 
              assistant={selectedAssistant} 
              getValue={getValue} 
              updateField={updateField} 
            />
            
            <ModelSettings 
              assistant={selectedAssistant} 
              getValue={getValue} 
              updateField={updateField} 
            />
            
            <BehaviorSettings 
              assistant={selectedAssistant} 
              getValue={getValue} 
              updateField={updateField} 
            />
            
            <MessageSettings 
              assistant={selectedAssistant} 
              getValue={getValue} 
              updateField={updateField} 
            />
          </div>
        )}
      </div>
    </Layout>
  );
}