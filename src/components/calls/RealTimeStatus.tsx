import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RealTimeStatusProps {
  isConnected: boolean;
  hasNewUpdates: boolean;
}

export function RealTimeStatus({ isConnected, hasNewUpdates }: RealTimeStatusProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <motion.div
          animate={{
            scale: hasNewUpdates ? [1, 1.2, 1] : 1,
            opacity: isConnected ? 1 : 0.5
          }}
          transition={{
            duration: 0.3,
            repeat: hasNewUpdates ? 1 : 0
          }}
          className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className="text-sm text-gray-500">
          {isConnected ? 'Live' : 'Reconnecting...'}
        </span>
      </div>
      
      <AnimatePresence>
        {hasNewUpdates && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-xs text-blue-500 font-medium"
          >
            New updates available
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 