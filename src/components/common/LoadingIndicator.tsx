// src/components/common/LoadingIndicator.tsx
import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingIndicator({ size = 'md', className = '' }: LoadingIndicatorProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader 
      className={`animate-spin text-blue-500 ${sizeClasses[size]} ${className}`} 
    />
  );
}
