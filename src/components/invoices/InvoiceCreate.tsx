import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "@/components/ui/Dropdown";
import { DatePicker } from "@/components/ui/DatePicker";
import { useCustomers } from "@/lib/hooks/useCustomers";
import { useCategories } from "@/lib/hooks/useCategories";
import { useInvoices } from "@/lib/hooks/useInvoices";
import { toast } from "react-hot-toast";
import {
  UserIcon,
  DocumentTextIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Invoice } from "@/types";
import { LoadingSpinner } from "../ui/LoadingSpinner";

interface Props {
  invoice?: Invoice | null;
  onClose: () => void;
}

const steps = [
  {
    id: "customer",
    name: "Customer Details",
    icon: UserIcon,
  },
  {
    id: "invoice",
    name: "Invoice Details",
    icon: DocumentTextIcon,
  },
];

export function InvoiceCreate({ invoice, onClose }: Props) {
  const navigate = useNavigate();
  const { customers } = useCustomers();
  const { categories } = useCategories();
  const { createInvoice, updateInvoice } = useInvoices();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({
    customer: null,
    items: [],
    categoryId: invoice?.categoryId || "",
    date: invoice?.date ? new Date(invoice.date) : new Date(),
    dueDate: invoice?.dueDate ? new Date(invoice.dueDate) : new Date(),
    lines: invoice?.lines || [
      { description: "", quantity: 1, unitPrice: 0, vatRate: 0 },
    ],
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        customer: null,
        items: [],
        categoryId: invoice.categoryId,
        date: new Date(invoice.date),
        dueDate: new Date(invoice.dueDate),
        lines: invoice.lines,
      });
    }
  }, [invoice]);

  useEffect(() => {
    if (!invoice && customers.length > 0) {
      setFormData((prev) => ({ ...prev, customer: customers[0] }));
    }
  }, [customers, invoice]);

  const handleCustomerSelect = (customer: any) => {
    setFormData((prev) => ({ ...prev, customer }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (
      !formData.customer ||
      !formData.categoryId ||
      formData.lines.length === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      if (invoice) {
        await updateInvoice(invoice.id, formData);
        toast.success("Invoice updated successfully");
      } else {
        await createInvoice(formData);
        toast.success("Invoice created successfully");
      }
      onClose();
      navigate("/invoices");
    } catch (error: any) {
      toast.error(
        error.message || `Failed to ${invoice ? "update" : "create"} invoice`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const addLine = () => {
    setFormData((prev) => ({
      ...prev,
      lines: [
        ...prev.lines,
        { description: "", quantity: 1, unitPrice: 0, vatRate: 0 },
      ],
    }));
  };

  const updateLine = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      lines: prev.lines.map((line, i) =>
        i === index ? { ...line, [field]: value } : line
      ),
    }));
  };

  const removeLine = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index),
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
                Select Customer
              </label>
              <Dropdown
                value={formData.customer}
                onChange={handleCustomerSelect}
                options={customers.map((customer) => ({
                  label: customer.name,
                  value: customer,
                }))}
                placeholder="Choose a customer..."
                className="w-full text-base border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>

            {formData.customer && (
              <div className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-violet-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {formData.customer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formData.customer.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      VAT Number: {formData.customer.vatNumber}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Contact Information
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {formData.customer.email}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {formData.customer.phone}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Billing Address
                    </h4>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {formData.customer.address?.street}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {formData.customer.address?.city},{" "}
                        {formData.customer.address?.postalCode}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {formData.customer.address?.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
                Select Category
              </label>
              <Dropdown
                value={formData.categoryId}
                onChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
                options={categories.map((category) => ({
                  label: category.name,
                  value: category.id,
                }))}
                placeholder="Choose a category..."
                className="w-full text-base border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
                  Invoice Date
                </label>
                <DatePicker
                  selected={formData.date}
                  onChange={(date) =>
                    setFormData({ ...formData, date: date || new Date() })
                  }
                  className="w-full bg-white dark:bg-gray-800 text-base border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
                  Due Date
                </label>
                <DatePicker
                  selected={formData.dueDate}
                  onChange={(date) =>
                    setFormData({ ...formData, dueDate: date || new Date() })
                  }
                  className="w-full bg-white dark:bg-gray-800 text-base border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-300 dark:border-gray-600">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gradient-to-r from-violet-50 to-violet-100 dark:from-gray-900 dark:to-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        VAT Rate (%)
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {formData.lines.map((line, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={line.description}
                            onChange={(e) =>
                              updateLine(index, "description", e.target.value)
                            }
                            className="w-full px-2 py-1 rounded-lg border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-violet-500 focus:ring-violet-500 shadow-sm text-sm"
                            placeholder="Enter description"
                          />
                        </td>
                        <td className="px-6 py-4">
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
                            className="w-24 px-2 py-1 rounded-lg border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-violet-500 focus:ring-violet-500 shadow-sm text-sm"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                              €
                            </span>
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
                              className="w-32  px-2 py-1  rounded-lg border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-violet-500 focus:ring-violet-500 shadow-sm text-sm pl-8"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={line.vatRate}
                            onChange={(e) =>
                              updateLine(
                                index,
                                "vatRate",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-24  px-2 py-1  rounded-lg border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-violet-500 focus:ring-violet-500 shadow-sm text-sm"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs font-medium text-gray-900 dark:text-white">
                            €{" "}
                            {(
                              line.quantity *
                              line.unitPrice *
                              (1 + line.vatRate / 100)
                            ).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => removeLine(index)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              type="button"
              onClick={addLine}
              className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-indigo-700 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 rounded-lg transition-colors duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 01-1 1h-3a1 1 0 110-2h3V9a1 1 0 011-1V6a1 1 0 110-2z"
                  clipRule="evenodd"
                />
              </svg>
              Add Line Item
            </button>

            <div className="mt-6 bg-gradient-to-br from-violet-50 to-violet-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-violet-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Subtotal
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  €{" "}
                  {formData.lines
                    .reduce(
                      (acc, line) => acc + line.quantity * line.unitPrice,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  VAT Total
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  €{" "}
                  {formData.lines
                    .reduce(
                      (acc, line) =>
                        acc +
                        (line.quantity * line.unitPrice * line.vatRate) / 100,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-base font-semibold text-gray-900 dark:text-white">
                  Total
                </span>
                <span className="text-base font-semibold text-gray-900 dark:text-white">
                  €{" "}
                  {formData.lines
                    .reduce(
                      (acc, line) =>
                        acc +
                        line.quantity *
                          line.unitPrice *
                          (1 + line.vatRate / 100),
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="flex-none px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {currentStep === 0 ? "Select Customer" : "Invoice Details"}
          </h2>
          <div className="flex items-center space-x-4">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Back
              </button>
            )}
            {currentStep === steps.length - 1 ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`
                  inline-flex items-center px-4 py-2 text-sm font-medium text-white
                  rounded-lg transition-all duration-200 shadow-md
                  ${
                    isSubmitting
                      ? "bg-violet-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700"
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner className="w-5 h-5 mr-2" />
                    {invoice ? "Updating..." : "Creating..."}
                  </>
                ) : invoice ? (
                  "Update Invoice"
                ) : (
                  "Create Invoice"
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!formData.customer}
                className={`
                  inline-flex items-center px-4 py-2 text-sm font-medium
                  rounded-lg transition-all duration-200 shadow-md
                  ${
                    !formData.customer
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white"
                  }
                `}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content with scrollable body */}
      <div className="flex-1">
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="p-6 overflow-auto max-h-[calc(100vh-200px)]">
              {renderStepContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
