import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import type { Assistant } from '../API/Types/Assistant';

interface AssistantCardProps {
  assistant: Assistant;
  onEdit: (assistant: Assistant) => void;
  onDelete: (id: string) => void;
}

export function AssistantCard({ assistant, onEdit, onDelete }: AssistantCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{assistant.name || 'Unnamed Assistant'}</h3>
          <p className="mt-1 text-sm text-gray-500">ID: {assistant.id}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(assistant)}
            className="p-2 text-gray-400 hover:text-gray-500"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(assistant.id)}
            className="p-2 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Model</p>
          <p className="mt-1 text-sm text-gray-900">{assistant.model?.provider || 'Not set'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Voice</p>
          <p className="mt-1 text-sm text-gray-900">{assistant.voice?.provider || 'Not set'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Created</p>
          <p className="mt-1 text-sm text-gray-900">
            {new Date(assistant.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Updated</p>
          <p className="mt-1 text-sm text-gray-900">
            {new Date(assistant.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}