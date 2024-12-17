import React from 'react';

interface SettingsSectionProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function SettingsSection({
  title,
  description,
  icon,
  children
}: SettingsSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          {icon && (
            <div className="bg-gray-50 rounded-lg p-2">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
}