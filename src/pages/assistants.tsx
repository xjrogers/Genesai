import React from 'react';
import { Layout } from '../components/Layout';
import { AssistantCard } from '../components/AssistantCard';
import { useVapi } from '../contexts/vapi';
import type { Assistant } from '../types/Assistant';

export default function Assistants() {
  const { assistants, loading, error, setAssistants } = useVapi();

  async function handleEdit(assistant: Assistant) {
    try {
      // Implement edit functionality
      console.log('Editing assistant:', assistant);
    } catch (error) {
      console.error('Error editing assistant:', error);
    }
  }

  async function handleDelete(id: string) {
    try {
      const client = useVapi().client;
      if (!client) throw new Error('Client not initialized');
      
      await client.assistants().delete(id);
      setAssistants(assistants.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting assistant:', error);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
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
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assistants</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your Vapi.ai assistants
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {assistants.map((assistant) => (
            <AssistantCard
              key={assistant.id}
              assistant={assistant}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}