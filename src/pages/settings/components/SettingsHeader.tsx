import React from 'react';
import { Settings } from 'lucide-react';

export function SettingsHeader() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">AI Agent Settings</h2>
      <p className="mt-1 text-sm text-gray-500">
        Customize your AI assistant's voice, model, and transcription settings
      </p>
    </div>
  );
}