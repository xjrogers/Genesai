// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import { LoginPage } from '../pages/auth/LoginPage';
import { HomePage } from '../pages/home/HomePage';
import { CallsPage } from '../pages/calls/CallsPage';
import { AssistantsPage } from '../pages/assistants/AssistantsPage';
import { SettingsPage } from '../pages/settings/SettingsPage';

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/calls" element={<CallsPage />} />
      <Route path="/assistants" element={<AssistantsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
