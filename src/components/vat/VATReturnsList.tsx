import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VatReturn, VatReturnStatus } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { VatReturnForm } from './VatReturnForm';
import { 
  DocumentTextIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline';
import { useVatReturns } from '@/lib/hooks/useVatReturns';
import { toast } from 'react-hot-toast';

const STATUS_CONFIG = {
  [VatReturnStatus.SUBMITTED]: {
    label: 'Submitted',
    icon: CheckCircleIcon,
    color: 'from-green-500 to-green-600',
    lightBg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-700 dark:text-green-300',
  },
  [VatReturnStatus.DRAFT]: {
    label: 'Draft',
    icon: ClockIcon,
    color: 'from-yellow-500 to-yellow-600',
    lightBg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-700 dark:text-yellow-300',
  },
  [VatReturnStatus.REJECTED]: {
    label: 'Rejected',
    icon: ExclamationCircleIcon,
    color: 'from-red-500 to-red-600',
    lightBg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-300',
  },
  [VatReturnStatus.ACCEPTED]: {
    label: 'Accepted',
    icon: CalculatorIcon,
    color: 'from-blue-500 to-blue-600',
    lightBg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-300',
  },
};

export function VatReturnsList() {
  const { vatReturns, createVatReturn, updateVatReturn, deleteVatReturn } = useVatReturns();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVatReturn, setEditingVatReturn] = useState<VatReturn | null>(null);
  const [previewVatReturn, setPreviewVatReturn] = useState<VatReturn | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [periodFilter, setPeriodFilter] = useState<string>('');

  const handleSubmit = async (data: Partial<VatReturn>) => {
    try {
      if (editingVatReturn) {
        await updateVatReturn(editingVatReturn.id, data);
        toast.success('VAT Return updated successfully');
      } else {
        await createVatReturn(data);
        toast.success('VAT Return created successfully');
      }
      handleCloseModal();
    } catch (error) {
      toast.error(editingVatReturn ? 'Failed to update VAT Return' : 'Failed to create VAT Return');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVatReturn(null);
  };

  const handleDelete = async (vatReturn: VatReturn) => {
    if (window.confirm('Are you sure you want to delete this VAT Return?')) {
      try {
        await deleteVatReturn(vatReturn.id);
        toast.success('VAT Return deleted successfully');
      } catch (error) {
        toast.error('Failed to delete VAT Return');
      }
    }
  };

  const filteredVatReturns = vatReturns.filter(vatReturn => {
    const matchesSearch = !searchTerm || 
      vatReturn.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vatReturn.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || vatReturn.status === statusFilter;
    const matchesPeriod = !periodFilter || vatReturn.period === periodFilter;
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">VAT Returns</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your VAT returns and submissions
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-sm hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New VAT Return
        </motion.button>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search VAT returns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
            />
            <FunnelIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-48 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
          >
            <option value="">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([status, config]) => (
              <option key={status} value={status}>{config.label}</option>
            ))}
          </select>
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="w-48 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
          >
            <option value="">All Periods</option>
            {/* Add period options dynamically */}
          </select>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {filteredVatReturns.map((vatReturn) => {
              const statusConfig = STATUS_CONFIG[vatReturn.status];
              const StatusIcon = statusConfig.icon;
              
              return (
                <motion.div
                  key={vatReturn.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200"
                >
                  <div className="flex items-center p-4">
                    {/* Left Side - Icon & Status */}
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${statusConfig.color}`}>
                        <DocumentArrowDownIcon className="h-7 w-7 text-white" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${statusConfig.lightBg}`}>
                        <StatusIcon className={`h-4 w-4 ${statusConfig.text}`} />
                      </div>
                    </div>

                    {/* Middle - Main Content */}
                    <div className="flex-1 ml-4">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          VAT Return - {vatReturn.period}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.lightBg} ${statusConfig.text}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Due: {formatDate(vatReturn.dueDate)}
                        </span>
                        <span className="flex items-center font-medium text-gray-900 dark:text-gray-100">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          Net VAT: {formatCurrency(vatReturn.netVAT)}
                        </span>
                        {vatReturn.reference && (
                          <span className="flex items-center">
                            <HashtagIcon className="h-4 w-4 mr-1" />
                            Ref: {vatReturn.reference}
                          </span>
                        )}
                      </div>

                      {vatReturn.notes && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {vatReturn.notes}
                        </p>
                      )}
                    </div>

                    {/* Right Side - Actions */}
                    <div className="ml-4 flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setPreviewVatReturn(vatReturn)}
                        className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {/* Download VAT Return */}}
                        className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setEditingVatReturn(vatReturn);
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(vatReturn)}
                        className="p-2 rounded-full text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingVatReturn ? 'Edit VAT Return' : 'New VAT Return'}
        maxWidth="xl"
      >
        <VatReturnForm
          onSubmit={handleSubmit}
          initialData={editingVatReturn || undefined}
        />
      </Modal>

      <Modal
        isOpen={!!previewVatReturn}
        onClose={() => setPreviewVatReturn(null)}
        title="VAT Return Preview"
        maxWidth="2xl"
      >
        {previewVatReturn && (
          <div className="p-4">
            {/* Add VAT Return Preview Content */}
          </div>
        )}
      </Modal>
    </div>
  );
}
