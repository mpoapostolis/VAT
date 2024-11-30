import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/components/ui/Modal';
import { Stepper } from '@/components/ui/Stepper';
import { VatReturnForm } from './VatReturnForm';
import { useVatReturns } from '@/lib/hooks/useVatReturns';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const steps = [
  { id: 'period', name: 'VAT Period' },
  { id: 'calculations', name: 'VAT Calculations' },
  { id: 'review', name: 'Review & Submit' },
];

export function VatReturnCreate() {
  const navigate = useNavigate();
  const { createVatReturn } = useVatReturns();
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = async (data: any) => {
    try {
      await createVatReturn(data);
      toast.success('VAT return created successfully');
      navigate('/vat-returns');
    } catch (error) {
      toast.error('Failed to create VAT return');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate('/vat-returns');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New VAT Return"
      maxWidth="2xl"
    >
      <div className="space-y-8">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          key={currentStep}
        >
          <VatReturnForm onSubmit={handleSubmit} />
        </motion.div>
      </div>
    </Modal>
  );
}