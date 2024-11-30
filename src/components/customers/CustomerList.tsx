import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { CustomerForm } from './CustomerForm';
import { useCustomers } from '@/lib/hooks/useCustomers';
import { Customer } from '@/types';
import { toast } from 'react-hot-toast';
import { resetCustomerForm } from '@/lib/state/atoms';
import { 
  BuildingOfficeIcon,
  PlusIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export function CustomerList() {
  const { customers, createCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [, resetForm] = useAtom(resetCustomerForm);

  const handleSubmit = async (data: Partial<Customer>) => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, data);
        toast.success('Customer updated successfully');
      } else {
        await createCustomer(data);
        toast.success('Customer created successfully');
      }
      handleCloseModal();
    } catch (error) {
      toast.error(editingCustomer ? 'Failed to update customer' : 'Failed to create customer');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
    resetForm();
  };

  const handleOpenModal = (customer?: Customer) => {
    resetForm();
    setEditingCustomer(customer || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (customer: Customer) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(customer.id);
        toast.success('Customer deleted successfully');
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Customers</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-sm hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Customer
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {customers.map((customer) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <BuildingOfficeIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{customer.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{customer.vatNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleOpenModal(customer)}
                    className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(customer)}
                    className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {customer.email}
                </div>
                {customer.phone && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    {customer.phone}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  {customer.isZeroRated ? 'Zero-rated for VAT' : 'Standard VAT rate'}
                </div>
              </div>

              {customer.address && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {typeof customer.address === 'string' 
                      ? customer.address 
                      : `${customer.address.street}, ${customer.address.city}, ${customer.address.postalCode}, ${customer.address.country}`
                    }
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
      >
        <CustomerForm
          onSubmit={handleSubmit}
          initialData={editingCustomer || undefined}
        />
      </Modal>
    </div>
  );
}
