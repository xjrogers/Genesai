// src/components/common/LoadingProgress.tsx
import React from 'react';

interface LoadingProgressProps {
  progress: number;
  className?: string;
}

export function LoadingProgress({ progress, className = '' }: LoadingProgressProps) {
  const percentage = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-gray-500 text-center">
        {percentage.toFixed(0)}% complete
      </div>
    </div>
  );
}
