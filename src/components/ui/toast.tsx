import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const Icon = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  }[type];

  return (
    <div
      className={cn(
        'flex items-center p-4 mb-4 rounded-lg shadow-lg',
        {
          'bg-green-50 text-green-800': type === 'success',
          'bg-red-50 text-red-800': type === 'error',
          'bg-blue-50 text-blue-800': type === 'info',
        }
      )}
    >
      <Icon className="h-5 w-5 mr-3" />
      <p className="flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      )}
    </div>
  );
}