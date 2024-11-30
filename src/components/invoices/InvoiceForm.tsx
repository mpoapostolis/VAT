import React from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { DatePicker } from '@/components/ui/DatePicker';
import { CategorySelect } from '@/components/categories/CategorySelect';
import { Invoice, InvoiceLine } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, TrashIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useCustomers } from '@/lib/hooks/useCustomers';
import { invoiceFormAtom, selectedCustomerAtom, invoiceTotalsAtom } from '@/lib/state/atoms';

interface InvoiceFormProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  onSubmit: (data: Partial<Invoice>) => void;
  initialData?: Partial<Invoice>;
}

export function InvoiceForm({ currentStep, onStepChange, onSubmit, initialData }: InvoiceFormProps) {
  const { customers } = useCustomers();
  const [form, setForm] = useAtom(invoiceFormAtom);
  const selectedCustomer = useAtomValue(selectedCustomerAtom);
  const totals = useAtomValue(invoiceTotalsAtom);

  React.useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData, setForm]);

  const lines = form.lines || [];

  const addLine = () => {
    setForm({
      ...form,
      lines: [
        ...lines,
        { description: '', quantity: 1, unitPrice: 0, vatRate: selectedCustomer?.isZeroRated ? 0 : 20 }
      ]
    });
  };

  const removeLine = (index: number) => {
    setForm({
      ...form,
      lines: lines.filter((_, i) => i !== index)
    });
  };

  const updateField = (field: keyof Invoice, value: any) => {
    setForm({
      ...form,
      [field]: value
    });
  };

  const updateLine = (index: number, field: keyof InvoiceLine, value: any) => {
    setForm({
      ...form,
      lines: lines.map((line, i) => 
        i === index ? { ...line, [field]: value } : line
      )
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...form, ...totals });
  };

  const renderCustomerStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Customer
        </label>
        <select
          value={form.customerId || ''}
          onChange={(e) => updateField('customerId', e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm px-4 py-2.5"
        >
          <option value="">Select customer...</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>{customer.name}</option>
          ))}
        </select>
      </div>

      {selectedCustomer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">VAT Number</div>
              <div className="text-gray-900 dark:text-gray-100">{selectedCustomer.vatNumber}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</div>
              <div className="text-gray-900 dark:text-gray-100">{selectedCustomer.email}</div>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</div>
            <div className="text-gray-900 dark:text-gray-100">
              {selectedCustomer.address.street}<br />
              {selectedCustomer.address.city}, {selectedCustomer.address.postalCode}<br />
              {selectedCustomer.address.country}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">VAT Status:</div>
            <div className={`text-sm font-medium ${
              selectedCustomer.isZeroRated
                ? 'text-green-600 dark:text-green-400'
                : 'text-blue-600 dark:text-blue-400'
            }`}>
              {selectedCustomer.isZeroRated ? 'Zero Rated' : 'Standard Rate'}
            </div>
          </div>
        </motion.div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category
        </label>
        <CategorySelect
          value={form.categoryId}
          onChange={(categoryId) => updateField('categoryId', categoryId)}
          type="REVENUE"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Invoice Date
          </label>
          <DatePicker
            value={form.date}
            onChange={(date) => updateField('date', date)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Due Date
          </label>
          <DatePicker
            value={form.dueDate}
            onChange={(date) => updateField('dueDate', date)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => onStepChange(1)}
          className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-sm hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        >
          Next Step
          <ChevronRightIcon className="ml-2 h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );

  const renderItemsStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {lines.map((_, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-12 gap-4 items-end"
            >
              <div className="col-span-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <input
                  value={lines[index].description}
                  onChange={(e) => updateLine(index, 'description', e.target.value)}
                  placeholder="Item description"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm px-4 py-2"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={lines[index].quantity}
                  onChange={(e) => updateLine(index, 'quantity', parseInt(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm px-4 py-2"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Unit Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={lines[index].unitPrice}
                  onChange={(e) => updateLine(index, 'unitPrice', parseFloat(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm px-4 py-2"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  VAT Rate %
                </label>
                <input
                  type="number"
                  value={lines[index].vatRate}
                  onChange={(e) => updateLine(index, 'vatRate', parseInt(e.target.value))}
                  disabled={selectedCustomer?.isZeroRated}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div className="col-span-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => removeLine(index)}
                  className="w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                >
                  <TrashIcon className="h-5 w-5 mx-auto" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={addLine}
          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5 mx-auto" />
        </motion.button>
      </div>

      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => onStepChange(0)}
          className="inline-flex items-center px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ChevronLeftIcon className="mr-2 h-5 w-5" />
          Previous Step
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => onStepChange(2)}
          className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-sm hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        >
          Next Step
          <ChevronRightIcon className="ml-2 h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );

  const renderReviewStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Subtotal</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: selectedCustomer?.currency || 'EUR'
              }).format(totals.totalExVat)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">VAT</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: selectedCustomer?.currency || 'EUR'
              }).format(totals.totalVat)}
            </p>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</h3>
          <p className="mt-1 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: selectedCustomer?.currency || 'EUR'
            }).format(totals.totalIncVat)}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm px-4 py-2"
        />
      </div>

      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => onStepChange(1)}
          className="inline-flex items-center px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ChevronLeftIcon className="mr-2 h-5 w-5" />
          Previous Step
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-sm hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        >
          Create Invoice
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <form onSubmit={handleFormSubmit}>
      {currentStep === 0 && renderCustomerStep()}
      {currentStep === 1 && renderItemsStep()}
      {currentStep === 2 && renderReviewStep()}
    </form>
  );
}