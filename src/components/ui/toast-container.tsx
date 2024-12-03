import React from 'react';
import { Toast } from './toast';
import { useToast } from '@/lib/hooks/useToast';

export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => {}}
        />
      ))}
    </div>
  );
}
