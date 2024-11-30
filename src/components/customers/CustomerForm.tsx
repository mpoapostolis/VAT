import React from 'react';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { Customer } from '@/types';
import { customerFormAtom } from '@/lib/state/atoms';

interface CustomerFormProps {
  onSubmit: (data: Partial<Customer>) => void;
  initialData?: Partial<Customer>;
}

export function CustomerForm({ onSubmit, initialData }: CustomerFormProps) {
  const [form, setForm] = useAtom(customerFormAtom);

  React.useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData, setForm]);

  const updateField = (field: keyof Customer, value: any) => {
    setForm({
      ...form,
      [field]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={form.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            VAT Number
          </label>
          <input
            type="text"
            value={form.vatNumber || ''}
            onChange={(e) => updateField('vatNumber', e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm px-4 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={form.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={form.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm px-4 py-2"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Address
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Street"
              value={typeof form.address === 'object' ? form.address.street : ''}
              onChange={(e) => updateField('address', {
                ...(typeof form.address === 'object' ? form.address : {}),
                street: e.target.value
              })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm px-4 py-2"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="City"
              value={typeof form.address === 'object' ? form.address.city : ''}
              onChange={(e) => updateField('address', {
                ...(typeof form.address === 'object' ? form.address : {}),
                city: e.target.value
              })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm px-4 py-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Postal Code"
              value={typeof form.address === 'object' ? form.address.postalCode : ''}
              onChange={(e) => updateField('address', {
                ...(typeof form.address === 'object' ? form.address : {}),
                postalCode: e.target.value
              })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm px-4 py-2"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Country"
              value={typeof form.address === 'object' ? form.address.country : ''}
              onChange={(e) => updateField('address', {
                ...(typeof form.address === 'object' ? form.address : {}),
                country: e.target.value
              })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm px-4 py-2"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Currency
          </label>
          <select
            value={form.currency || 'EUR'}
            onChange={(e) => updateField('currency', e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm px-4 py-2"
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            VAT Status
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.isZeroRated || false}
                onChange={(e) => updateField('isZeroRated', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Zero-rated for VAT</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-sm hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        >
          Save Customer
        </motion.button>
      </div>
    </form>
  );
}
