import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/components/ui/Modal';
import { InvoiceForm } from './InvoiceForm';
import { useInvoices } from '@/lib/hooks/useInvoices';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentTextIcon, UserIcon, CurrencyDollarIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

const steps = [
  { 
    id: 'customer',
    name: 'Customer Details',
    icon: UserIcon,
    description: 'Select customer and billing information'
  },
  { 
    id: 'items',
    name: 'Invoice Items',
    icon: CurrencyDollarIcon,
    description: 'Add products or services'
  },
  { 
    id: 'review',
    name: 'Review & Submit',
    icon: DocumentCheckIcon,
    description: 'Verify and create invoice'
  }
];

export function InvoiceCreate() {
  const navigate = useNavigate();
  const { createInvoice } = useInvoices();
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = async (data: any) => {
    try {
      await createInvoice(data);
      toast.success('Invoice created successfully');
      navigate('/invoices');
    } catch (error) {
      toast.error('Failed to create invoice');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate('/invoices');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Invoice"
      maxWidth="2xl"
    >
      <div className="space-y-8">
        {/* Progress Steps */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-between">
            {steps.map((step, stepIdx) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    initial={false}
                    animate={{
                      scale: currentStep >= stepIdx ? 1 : 0.9,
                      opacity: currentStep >= stepIdx ? 1 : 0.5,
                    }}
                    className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white dark:bg-gray-800 ${
                      currentStep >= stepIdx
                        ? 'border-indigo-600 dark:border-indigo-400'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <StepIcon
                      className={`h-6 w-6 ${
                        currentStep >= stepIdx
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    />
                    {currentStep > stepIdx && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                      </motion.div>
                    )}
                  </motion.div>
                  <div className="mt-2 flex flex-col items-center">
                    <span
                      className={`text-sm font-medium ${
                        currentStep >= stepIdx
                          ? 'text-gray-900 dark:text-gray-100'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {step.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                      {step.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <InvoiceForm
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              onSubmit={handleSubmit}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </Modal>
  );
}