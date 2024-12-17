import React from 'react';
import { Bot, Mic, Brain } from 'lucide-react';
import type { Assistant } from '../../types';

interface AssistantCardProps {
  assistant: Assistant;
}

export function AssistantCard({ assistant }: AssistantCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center space-x-3">
        <div className="bg-blue-100 rounded-full p-2">
          <Bot className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {assistant.name || 'Unnamed Assistant'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">ID: {assistant.id}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-500" />
          <div>
            <p className="text-sm font-medium text-gray-700">Model</p>
            <p className="text-sm text-gray-500">{assistant.model?.provider || 'Not set'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Mic className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-sm font-medium text-gray-700">Voice</p>
            <p className="text-sm text-gray-500">{assistant.voice?.provider || 'Not set'}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700">Created</p>
            <p className="text-gray-500">
              {new Date(assistant.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Updated</p>
            <p className="text-gray-500">
              {new Date(assistant.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}