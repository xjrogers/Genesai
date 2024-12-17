import React from 'react';
import { Bot } from 'lucide-react';

export function LoginHeader() {
  return (
    <div>
      <div className="flex justify-center">
        <div className="bg-blue-100 rounded-full p-3">
          <Bot className="h-10 w-10 text-blue-600" />
        </div>
      </div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Genesai AI
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Enter your credentials to access the dashboard
      </p>
    </div>
  );
}