import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface CredentialFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'password';
  required?: boolean;
  placeholder?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export function CredentialField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = true,
  placeholder,
  showPassword,
  onTogglePassword
}: CredentialFieldProps) {
  const isPasswordField = type === 'password';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative">
        <input
          id={id}
          name={id}
          type={isPasswordField && showPassword ? 'text' : type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {isPasswordField && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}