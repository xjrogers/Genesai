import React from 'react';
import { Lock } from 'lucide-react';

interface SubmitButtonProps {
  isLoading: boolean;
}

export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
        isLoading ? 'opacity-75 cursor-not-allowed' : ''
      }`}
    >
      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
        <Lock className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
      </span>
      {isLoading ? 'Signing in...' : 'Sign in'}
    </button>
  );
}