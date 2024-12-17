// src/components/common/LoadingState.tsx
import React from 'react';
import { Loader } from 'lucide-react';
import { LoadingProgress } from './LoadingProgress';

interface LoadingStateProps {
  progress?: number;
  message?: string;
}

export function LoadingState({ progress, message = 'Loading data...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <div className="flex items-center space-x-3">
        <Loader className="h-6 w-6 text-blue-500 animate-spin" />
        <span className="text-sm text-gray-600">{message}</span>
      </div>
      
      {progress !== undefined && (
        <div className="w-64">
          <LoadingProgress 
            progress={progress}
          />
        </div>
      )}
    </div>
  );
}
