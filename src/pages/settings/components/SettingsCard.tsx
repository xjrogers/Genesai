import React from 'react';
import { Loader2 } from 'lucide-react';

interface SettingsCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isLoading?: boolean;
}

export function SettingsCard({
  title,
  description,
  icon,
  children,
  isLoading = false
}: SettingsCardProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-50 rounded-lg p-2">
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
          {isLoading && (
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
          )}
        </div>
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
}