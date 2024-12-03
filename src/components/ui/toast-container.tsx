import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toast } from './toast';
import { useToast } from '@/lib/hooks/useToast';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}