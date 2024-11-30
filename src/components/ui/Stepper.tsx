import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

interface Step {
  id: string;
  name: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step, index) => (
          <li key={step.id} className="md:flex-1">
            <button
              onClick={() => onStepClick?.(index)}
              className="group flex w-full cursor-pointer"
              disabled={index > currentStep}
            >
              <span className="flex items-center px-6 py-4 text-sm font-medium">
                <motion.span
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                    index < currentStep
                      ? 'bg-indigo-600 group-hover:bg-indigo-800'
                      : index === currentStep
                      ? 'border-2 border-indigo-600 bg-white'
                      : 'border-2 border-gray-300 bg-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {index < currentStep ? (
                    <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  ) : (
                    <span
                      className={`${
                        index === currentStep ? 'text-indigo-600' : 'text-gray-500'
                      }`}
                    >
                      {index + 1}
                    </span>
                  )}
                </motion.span>
                <motion.span
                  className="ml-4 text-sm font-medium"
                  initial={false}
                  animate={{
                    color: index <= currentStep ? '#4F46E5' : '#6B7280',
                  }}
                >
                  {step.name}
                  {step.description && (
                    <p className="text-sm text-gray-500">{step.description}</p>
                  )}
                </motion.span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}