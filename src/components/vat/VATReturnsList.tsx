import React, { useState } from "react";
import { useJotaiStore } from "@/lib/hooks/useJotaiStore";
import { PlusIcon } from "@heroicons/react/24/outline";
import { VatReturnForm } from "./VatReturnForm";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "../ui/Modal";
import { Dropdown } from "../ui/Dropdown";
import {
  DocumentTextIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "PAID", label: "Paid" },
];

const PERIOD_OPTIONS = [
  { value: "Q1", label: "Q1" },
  { value: "Q2", label: "Q2" },
  { value: "Q3", label: "Q3" },
  { value: "Q4", label: "Q4" },
];

export function VATReturnsList() {
  const { vatReturns } = useJotaiStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");

  if (!vatReturns) {
    return <LoadingSpinner />;
  }

  const filteredReturns = vatReturns.filter((vatReturn) => {
    if (statusFilter && vatReturn.status !== statusFilter) return false;
    if (periodFilter && vatReturn.period !== periodFilter) return false;
    return true;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PAID":
        return {
          icon: CheckCircleIcon,
          color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        };
      case "SUBMITTED":
        return {
          icon: ClockIcon,
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        };
      default:
        return {
          icon: ExclamationCircleIcon,
          color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          VAT Returns
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New VAT Return
        </button>
      </div>

      <div className="flex space-x-4">
        <Dropdown
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Filter by status..."
          className="w-48"
        />
        <Dropdown
          options={PERIOD_OPTIONS}
          value={periodFilter}
          onChange={setPeriodFilter}
          placeholder="Filter by period..."
          className="w-48"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredReturns.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No VAT returns found. Create your first return!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total VAT
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredReturns.map((vatReturn) => {
                    const statusConfig = getStatusConfig(vatReturn.status);
                    return (
                      <motion.tr
                        key={vatReturn.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <DocumentTextIcon className="h-5 w-5 text-indigo-500 mr-3" />
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {vatReturn.period} {vatReturn.year}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              statusConfig.color
                            }`}
                          >
                            <statusConfig.icon className="h-4 w-4 mr-1" />
                            {vatReturn.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                            <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                            {formatDate(vatReturn.dueDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                            <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-1" />
                            {formatCurrency(vatReturn.totalVAT)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setSelectedReturn(vatReturn)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            {vatReturn.status === "DRAFT" && (
                              <button
                                onClick={() => setSelectedReturn(vatReturn)}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                            )}
                            <button
                              onClick={() => {/* Add download handler */}}
                              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                            >
                              <ArrowDownTrayIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {(showCreateModal || selectedReturn) && (
          <Modal
            title={selectedReturn ? "View VAT Return" : "Create VAT Return"}
            onClose={() => {
              setShowCreateModal(false);
              setSelectedReturn(null);
            }}
          >
            <VatReturnForm
              initialData={selectedReturn}
              onSubmit={() => {
                setShowCreateModal(false);
                setSelectedReturn(null);
              }}
              onCancel={() => {
                setShowCreateModal(false);
                setSelectedReturn(null);
              }}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
