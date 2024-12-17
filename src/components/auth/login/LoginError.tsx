import React from 'react';
import { AlertCircle } from 'lucide-react';

interface LoginErrorProps {
  error: string | null;
}

export function LoginError({ error }: LoginErrorProps) {
  if (!error) return null;

  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );
}