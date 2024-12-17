import React from 'react';
import { Save } from 'lucide-react';

interface SaveButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function SaveButton({ onClick, isLoading, disabled }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        (isLoading || disabled) ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <Save className={`h-4 w-4 mr-2 ${isLoading ? 'animate-pulse' : ''}`} />
      {isLoading ? 'Saving...' : disabled ? 'No Changes' : 'Save Changes'}
    </button>
  );
}