import React, { useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useInvoices } from "@/lib/hooks/useInvoices";
import { useCustomers } from "@/lib/hooks/useCustomers";
import { formatCurrency, formatDate } from "../../lib/utils/format";
import { PlusIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { InvoiceCreate } from "./InvoiceCreate";
import { Modal } from "../ui/Modal";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { SearchInput } from "../ui/SearchInput";
import { PageHeader } from "../ui/PageHeader";
import { ActionButton } from "../ui/ActionButton";
import { Dropdown } from "../ui/Dropdown";
import {
  ClockIcon,
  BanknotesIcon,
  CalendarIcon,
  ClockIcon as PendingIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { Invoice } from "@/types";
import { InvoicePreview } from "./InvoicePreview";

export function InvoiceList() {
  const { invoices, isLoading } = useInvoices();
  const { customers } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      rotateX: -10,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  const progressVariants = {
    hidden: { scaleX: 0, originX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, -0.01, 0.9],
      },
    },
  };

  if (isLoading || !invoices || !customers) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const filteredInvoices = invoices.filter(
    (invoice) =>
      searchTerm === "" ||
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customers
        .find((c) => c.id === invoice.customerId)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      statusFilter === "" ||
      invoice.status.toLowerCase() === statusFilter ||
      dateFilter === "" ||
      (dateFilter === "today" &&
        formatDate(invoice.dueDate) === formatDate(new Date())) ||
      (dateFilter === "week" &&
        new Date(invoice.dueDate).getTime() >=
          new Date().getTime() - 7 * 24 * 60 * 60 * 1000) ||
      (dateFilter === "month" &&
        new Date(invoice.dueDate).getTime() >=
          new Date().getTime() - 30 * 24 * 60 * 60 * 1000) ||
      (dateFilter === "year" &&
        new Date(invoice.dueDate).getTime() >=
          new Date().getTime() - 365 * 24 * 60 * 60 * 1000)
  );

  const calculateDueProgress = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const created = new Date(due.getTime() - 30 * 24 * 60 * 60 * 1000); // Assuming 30 days payment term
    const total = due.getTime() - created.getTime();
    const elapsed = now.getTime() - created.getTime();
    const progress = Math.min(Math.max((elapsed / total) * 100, 0), 100);
    return progress;
  };

  const getDueStatus = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const daysLeft = Math.ceil(
      (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysLeft < 0) return { color: "#EF4444", text: "Overdue" }; // red-500
    if (daysLeft <= 7)
      return { color: "#F59E0B", text: `${daysLeft} days left` }; // yellow-500
    return { color: "#10B981", text: `${daysLeft} days left` }; // emerald-500
  };

  const handleDownload = (invoice: Invoice) => {
    // Generate PDF and trigger download
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(invoice, null, 2)], {
      type: "application/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = `invoice-${invoice.number}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = async (invoice: Invoice) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice #${invoice.number}`,
          text: `Invoice for ${
            customers.find((c) => c.id === invoice.customerId)?.name
          }`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // toast.success('Link copied to clipboard!');
    }
  };

  const handlePrint = (invoice: Invoice) => {
    setPreviewInvoice(invoice);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" description="Manage your customer invoices">
        <ActionButton
          icon={<PlusIcon className="h-5 w-5" />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Invoice
        </ActionButton>
      </PageHeader>

      <div className="mb-4 flex items-center gap-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search invoices..."
          className="max-w-lg"
        />
        <div className="flex ml-auto items-center gap-2">
          <Dropdown
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Statuses"
            options={[
              {
                value: "",
                label: "All Statuses",
                icon: <BanknotesIcon className="w-4 h-4 text-gray-400" />,
              },
              {
                value: "paid",
                label: "Paid",
                icon: <BanknotesIcon className="w-4 h-4" />,
                color: "green",
              },
              {
                value: "pending",
                label: "Pending",
                icon: <PendingIcon className="w-4 h-4" />,
                color: "yellow",
              },
              {
                value: "overdue",
                label: "Overdue",
                icon: <ExclamationTriangleIcon className="w-4 h-4" />,
                color: "red",
              },
            ]}
          />
          <Dropdown
            value={dateFilter}
            onChange={setDateFilter}
            placeholder="All Dates"
            options={[
              {
                value: "",
                label: "All Dates",
                icon: <CalendarIcon className="w-4 h-4 text-gray-400" />,
              },
              {
                value: "today",
                label: "Today",
                icon: <ClockIcon className="w-4 h-4" />,
              },
              {
                value: "week",
                label: "This Week",
                icon: <CalendarIcon className="w-4 h-4" />,
              },
              {
                value: "month",
                label: "This Month",
                icon: <CalendarIcon className="w-4 h-4" />,
              },
              {
                value: "year",
                label: "This Year",
                icon: <CalendarIcon className="w-4 h-4" />,
              },
            ]}
          />
        </div>
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="wait">
          {filteredInvoices.map((invoice, index) => {
            const dueProgress = calculateDueProgress(invoice.dueDate);
            const dueStatus = getDueStatus(invoice.dueDate);

            return (
              <motion.div
                key={invoice.id}
                variants={itemVariants}
                layout
                className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br opacity-[0.02] group-hover:opacity-[0.04] transition-opacity"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, ${dueStatus.color}, ${dueStatus.color}88)`,
                  }}
                />

                <motion.div
                  className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full opacity-[0.07] group-hover:opacity-[0.1] transition-all duration-500"
                  style={{
                    backgroundColor: dueStatus.color,
                    transform: "translate(20%, 20%)",
                  }}
                  initial={{ scale: 0.8, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  }}
                />

                <div className="relative p-5">
                  <div className="flex items-start space-x-4">
                    <motion.div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br`}
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, ${dueStatus.color}88, ${dueStatus.color})`,
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChartBarIcon className="h-6 w-6 text-white" />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate pr-4 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        {customers.find((c) => c.id === invoice.customerId)
                          ?.name || "Unknown Customer"}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">#{invoice.number}</span>
                        <span className="inline-block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                        <span>{formatDate(invoice.dueDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-start justify-between">
                    <div className="flex flex-col gap-2">
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                      >
                        {formatCurrency(invoice.totalIncVat)}
                      </motion.span>
                      <div className="flex items-center justify-between gap-4">
                        <div
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit"
                          style={{ backgroundColor: `${dueStatus.color}15` }}
                        >
                          <div
                            className="h-1.5 w-1.5 rounded-full animate-pulse"
                            style={{ backgroundColor: dueStatus.color }}
                          />
                          <span
                            className="text-sm font-medium"
                            style={{ color: dueStatus.color }}
                          >
                            {dueStatus.text}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="relative h-1.5 w-16 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${dueProgress.toFixed(2)}%` }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className="absolute wf inset-0 rounded-full"
                              style={{ backgroundColor: dueStatus.color }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[3ch] text-right">
                            {dueProgress.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center justify-end gap-2">
                    {[
                      {
                        icon: EyeIcon,
                        action: () => setPreviewInvoice(invoice),
                        title: "Preview",
                      },
                      {
                        icon: ArrowDownTrayIcon,
                        action: () => handleDownload(invoice),
                        title: "Download",
                      },
                      {
                        icon: ShareIcon,
                        action: () => handleShare(invoice),
                        title: "Share",
                      },
                      {
                        icon: PrinterIcon,
                        action: () => handlePrint(invoice),
                        title: "Print",
                      },
                    ].map((btn, i) => (
                      <motion.button
                        key={btn.title}
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-all duration-200"
                        onClick={btn.action}
                        title={btn.title}
                      >
                        <btn.icon className="w-4 h-4" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <InvoicePreview
        invoice={previewInvoice!}
        isOpen={!!previewInvoice}
        onClose={() => setPreviewInvoice(null)}
        onDownload={() => previewInvoice && handleDownload(previewInvoice)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedInvoice(null);
        }}
        maxWidth="5xl"
      >
        <InvoiceCreate
          invoice={selectedInvoice}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedInvoice(null);
          }}
        />
      </Modal>
    </div>
  );
}
