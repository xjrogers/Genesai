import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { AssistantsList } from './components/AssistantsList';
import { AssistantsHeader } from './components/AssistantsHeader';
import { AssistantsFilters } from './components/AssistantsFilters';
import { useVapi } from '../../contexts/vapi';
import { useAssistantFilters } from '../../hooks/filters/useAssistantFilters';
import { RefreshButton } from '../../components/common/RefreshButton';

export function AssistantsPage() {
  const { assistants, loading, error } = useVapi();
  const { filterAssistants } = useAssistantFilters();

  const filteredAssistants = filterAssistants(assistants);

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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <AssistantsHeader />
          <RefreshButton />
        </div>
        <AssistantsFilters />
        <AssistantsList assistants={filteredAssistants} />
      </div>
    </Layout>
  );
}