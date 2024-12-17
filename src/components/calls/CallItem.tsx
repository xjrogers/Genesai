import React, { memo } from 'react';
import { Phone, User, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Call } from '../../types';
import { formatDateForDisplay } from '../../utils/filters/dateRangeUtils';
import { useCostDisplay } from '../../hooks/cost/useCostDisplay';

interface CallItemProps {
  call: Call;
}

export const CallItem = memo(function CallItem({ call }: CallItemProps) {
  const { formatCost } = useCostDisplay();
  const phoneNumber = call.customer?.number || 'Unknown Number';
  const customerName = call.customer?.name || 'Unknown Caller';
  const callCost = formatCost(call.cost || 0);
  const startTime = call.startedAt ? formatDateForDisplay(call.startedAt) : 'Not started';
  const isNew = call._lastUpdate && 
    new Date().getTime() - new Date(call._lastUpdate).getTime() < 2000;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Phone className="h-5 w-5 text-gray-400" />
          <p className="ml-2 text-sm font-medium text-blue-600 truncate">
            {phoneNumber}
          </p>
        </div>
        <div className="ml-2 flex items-center space-x-2">
          <motion.span
            animate={{
              scale: isNew ? [1, 1.1, 1] : 1,
              backgroundColor: isNew ? ['#fff', '#f3f9ff', '#fff'] : '#fff'
            }}
            className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
          >
            {callCost}
          </motion.span>
          <motion.span
            animate={{
              scale: call.status === 'in-progress' ? [1, 1.05, 1] : 1
            }}
            transition={{
              repeat: call.status === 'in-progress' ? Infinity : 0,
              duration: 2
            }}
            className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full 
              ${call.status === 'ended' ? 'bg-green-100 text-green-800' : 
                call.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-gray-100 text-gray-800'}`}
          >
            {call.status === 'ended' && <CheckCircle className="w-3 h-3 mr-1" />}
            {call.status === 'in-progress' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-3 h-3 mr-1 border-2 border-yellow-500 border-t-transparent rounded-full"
              />
            )}
            {call.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
            {call.status}
          </motion.span>
        </div>
      </div>
      <div className="mt-2 sm:flex sm:justify-between">
        <div className="sm:flex">
          <p className="flex items-center text-sm text-gray-500">
            <User className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
            {customerName}
          </p>
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
          <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
          <p>{startTime}</p>
        </div>
      </div>
      {call.endedReason && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2 flex items-center text-sm text-gray-500"
        >
          <AlertCircle className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
          <p>Ended: {call.endedReason}</p>
        </motion.div>
      )}
      {call.analysis?.summary && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.2 }}
          className="mt-2"
        >
          <p className="text-sm text-gray-500">{call.analysis.summary}</p>
        </motion.div>
      )}
    </div>
  );
}); 