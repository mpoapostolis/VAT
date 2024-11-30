import React from "react";
import { useAtom, useAtomValue } from "jotai";
import { DatePicker } from "@/components/ui/DatePicker";
import { Dropdown } from '../ui/Dropdown';
import { CategorySelect } from "@/components/categories/CategorySelect";
import { Invoice, InvoiceLine } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  TrashIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import { useCustomers } from "@/lib/hooks/useCustomers";
import {
  invoiceFormAtom,
  selectedCustomerAtom,
  invoiceTotalsAtom,
  categoriesAtom
} from "@/lib/state/atoms";

interface InvoiceFormProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  onSubmit: (data: Partial<Invoice>) => void;
  initialData?: Partial<Invoice>;
}

export function InvoiceForm({
  currentStep,
  onStepChange,
  onSubmit,
  initialData,
}: InvoiceFormProps) {
  const { customers } = useCustomers();
  const [form, setForm] = useAtom(invoiceFormAtom);
  const selectedCustomer = useAtomValue(selectedCustomerAtom);
  const totals = useAtomValue(invoiceTotalsAtom);
  const categories = useAtomValue(categoriesAtom);

  React.useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData, setForm]);

  const lines = form.lines || [];

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0: // Customer step
        return Boolean(form.customerId && form.customerId.length > 0);
      case 1: // Category and dates step
        return Boolean(
          form.categoryId && 
          form.categoryId.length > 0 && 
          form.date && 
          form.dueDate
        );
      case 2: // Items step
        return Boolean(
          lines.length > 0 &&
          lines.every(
            (line) =>
              line.description &&
              line.description.length > 0 &&
              line.quantity > 0 &&
              line.unitPrice >= 0 &&
              line.vatRate >= 0
          )
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNext()) {
      onStepChange(currentStep + 1);
    }
  };

  const handleBack = () => {
    onStepChange(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canProceedToNext()) {
      onSubmit({ ...form, ...totals });
    }
  };

  const updateField = (field: keyof Invoice, value: any) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const updateLine = (index: number, field: keyof InvoiceLine, value: any) => {
    setForm({
      ...form,
      lines: lines.map((line, i) =>
        i === index ? { ...line, [field]: value } : line
      ),
    });
  };

  const addLine = () => {
    setForm({
      ...form,
      lines: [
        ...lines,
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
          vatRate: selectedCustomer?.isZeroRated ? 0 : 20,
        },
      ],
    });
  };

  const removeLine = (index: number) => {
    setForm({
      ...form,
      lines: lines.filter((_, i) => i !== index),
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="relative">
              <Dropdown
                label="Customer"
                value={form.customerId || ''}
                onChange={(value) => updateField('customerId', value)}
                options={customers.map(customer => ({
                  value: customer.id,
                  label: customer.name
                }))}
                placeholder="Select customer..."
              />
            </div>

            {selectedCustomer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 shadow-sm border border-indigo-100 dark:border-indigo-800"
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      VAT Number
                    </div>
                    <div className="text-gray-900 dark:text-gray-100 font-medium">
                      {selectedCustomer.vatNumber}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      Email
                    </div>
                    <div className="text-gray-900 dark:text-gray-100 font-medium">
                      {selectedCustomer.email}
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-1">
                  <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Address
                  </div>
                  <div className="text-gray-900 dark:text-gray-100 font-medium">
                    {selectedCustomer.address.street}
                    <br />
                    {selectedCustomer.address.city}, {selectedCustomer.address.postalCode}
                    <br />
                    {selectedCustomer.address.country}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="relative">
              <Dropdown
                label="Category"
                value={form.categoryId || ''}
                onChange={(value) => updateField('categoryId', value)}
                options={categories
                  .filter(cat => cat.type === 'REVENUE')
                  .map(category => ({
                    value: category.id,
                    label: category.name
                  }))}
                placeholder="Select category..."
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
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid  gap-4 items-end bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-800/50 dark:to-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"></h3>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={addLine}
                  className="inline-flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/70 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-1.5" />
                  Add Item
                </motion.button>
              </div>

              <AnimatePresence mode="popLayout">
                {lines.map((line, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex gap-3 items-end bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg"
                  >
                    <div className="flex-[2]">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={line.description}
                        onChange={(e) =>
                          updateLine(index, "description", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm px-3 py-1.5 text-sm"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={line.quantity}
                        onChange={(e) =>
                          updateLine(
                            index,
                            "quantity",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm px-3 py-1.5 text-sm"
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Unit Price
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={line.unitPrice}
                        onChange={(e) =>
                          updateLine(
                            index,
                            "unitPrice",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm px-3 py-1.5 text-sm"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        VAT %
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={line.vatRate}
                        onChange={(e) =>
                          updateLine(index, "vatRate", parseInt(e.target.value))
                        }
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm px-3 py-1.5 text-sm"
                      />
                    </div>
                    <div className="flex items-center pb-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeLine(index)}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {lines.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6"
              >
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">
                    Subtotal
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: selectedCustomer?.currency || "EUR",
                    }).format(totals.totalExVat)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">VAT</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: selectedCustomer?.currency || "EUR",
                    }).format(totals.totalVat)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold mt-2">
                  <span className="text-gray-900 dark:text-gray-100">
                    Total
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: selectedCustomer?.currency || "EUR",
                    }).format(totals.totalIncVat)}
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Progress Steps */}
      <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800">
        <div className="flex justify-between items-center">
          {["Customer", "Invoice Info", "Items"].map((step, index) => (
            <div key={index} className="flex-1 relative">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full mx-auto
                  ${
                    currentStep === index
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-900"
                      : currentStep > index
                      ? "bg-green-500 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-500 border-2 border-gray-200 dark:border-gray-700"
                  }`}
              >
                {currentStep > index ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <div className="text-center mt-2">
                <span
                  className={`text-sm font-medium ${
                    currentStep === index
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < 2 && (
                <div
                  className={`absolute top-5 -right-1/2 w-full h-0.5 transition-colors duration-300
                  ${
                    currentStep > index
                      ? "bg-green-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-8"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStep}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          {currentStep > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleBack}
              className="flex items-center px-6 py-2.5 text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
            >
              <ChevronLeftIcon className="mr-2 h-5 w-5" />
              Back
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type={currentStep === 2 ? "submit" : "button"}
            onClick={currentStep === 2 ? undefined : handleNext}
            disabled={!canProceedToNext()}
            className={`flex items-center px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              canProceedToNext()
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
            } ml-auto`}
          >
            {currentStep === 2 ? (
              "Create Invoice"
            ) : (
              <>
                Next
                <ChevronRightIcon className="ml-2 h-5 w-5" />
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
