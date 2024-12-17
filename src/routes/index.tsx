import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import { LoginForm } from '../components/LoginForm';
import Home from '../pages';
import Calls from '../pages/calls';
import Assistants from '../pages/assistants';
import Analytics from '../pages/analytics';

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/calls" element={<Calls />} />
      <Route path="/assistants" element={<Assistants />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}