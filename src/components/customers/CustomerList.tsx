import React, { useState } from "react";
import { useAtom } from "jotai";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useCustomers } from "@/lib/hooks/useCustomers";
import {
  PlusIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  PencilIcon,
  TrashIcon,
  ArrowsUpDownIcon,
  ClockIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { CustomerForm } from "./CustomerForm";
import { Modal } from "@/components/ui/Modal";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { SearchInput } from "../ui/SearchInput";
import { PageHeader } from "../ui/PageHeader";
import { ActionButton } from "../ui/ActionButton";
import { Dropdown } from "../ui/Dropdown";
import { Customer } from "@/types";
import { toast } from "react-hot-toast";
import { resetCustomerForm } from "@/lib/state/atoms";

export function CustomerList() {
  const {
    customers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    isLoading,
  } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [sortType, setSortType] = useState("");
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [, resetForm] = useAtom(resetCustomerForm);

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

  const handleSubmit = async (data: Partial<Customer>) => {
    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id, data);
        toast.success("Customer updated successfully");
      } else {
        await createCustomer(data);
        toast.success("Customer created successfully");
      }
      handleCloseModal();
    } catch (error) {
      toast.error(
        selectedCustomer
          ? "Failed to update customer"
          : "Failed to create customer"
      );
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(id);
        toast.success("Customer deleted successfully");
      } catch (error) {
        toast.error("Failed to delete customer");
      }
    }
  };

  if (isLoading || !customers) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      searchTerm === "" ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCustomers = filteredCustomers.sort((a, b) => {
    if (sortType === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortType === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortType === "invoices") {
      return b.invoices.length - a.invoices.length;
    }
    return 0;
  });

  const filteredSortedCustomers = sortedCustomers.filter((customer) => {
    if (filterType === "company") {
      return customer.company !== null;
    } else if (filterType === "individual") {
      return customer.company === null;
    }
    return true;
  });

  const getRandomColor = (seed: string) => {
    const colors = [
      "#10B981", // emerald-500
      "#3B82F6", // blue-500
      "#8B5CF6", // violet-500
      "#EC4899", // pink-500
      "#F59E0B", // amber-500
      "#6366F1", // indigo-500
    ];
    const hash = seed
      .split("")
      .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your customer information"
      >
        <ActionButton
          icon={<PlusIcon className="h-5 w-5" />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Customer
        </ActionButton>
      </PageHeader>

      <div className="mb-4 flex items-center gap-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search customers..."
          className="max-w-xl"
        />
        <div className="flex ml-auto items-center gap-2">
          <Dropdown
            value={filterType}
            onChange={setFilterType}
            placeholder="All Types"
            options={[
              {
                value: "",
                label: "All Types",
                icon: <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />,
              },
              {
                value: "company",
                label: "Companies",
                icon: <BuildingOfficeIcon className="w-4 h-4" />,
                color: "blue",
              },
              {
                value: "individual",
                label: "Individuals",
                icon: <UserIcon className="w-4 h-4" />,
                color: "violet",
              },
            ]}
          />
          <Dropdown
            value={sortType}
            onChange={setSortType}
            placeholder="Sort By"
            options={[
              {
                value: "",
                label: "Sort By",
                icon: <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />,
              },
              {
                value: "name",
                label: "Name",
                icon: <UserIcon className="w-4 h-4" />,
              },
              {
                value: "recent",
                label: "Recently Added",
                icon: <ClockIcon className="w-4 h-4" />,
              },
              {
                value: "invoices",
                label: "Most Invoices",
                icon: <DocumentTextIcon className="w-4 h-4" />,
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
          {filteredSortedCustomers.map((customer, index) => {
            const customerColor = getRandomColor(customer.name);

            return (
              <motion.div
                key={customer.id}
                variants={itemVariants}
                layout
                whileHover={{
                  scale: 1.02,
                  rotateX: 5,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 10,
                  },
                }}
                className="relative group bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br opacity-5"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, ${customerColor}, ${customerColor}88)`,
                  }}
                />

                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        variants={iconVariants}
                        className="flex-shrink-0"
                      >
                        <BuildingOfficeIcon
                          className="w-6 h-6"
                          style={{ color: customerColor }}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {customer.name}
                        </h3>
                        {customer.company && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {customer.company}
                          </p>
                        )}
                      </motion.div>
                    </div>

                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ActionButton
                        variant="secondary"
                        size="sm"
                        icon={<PencilIcon className="h-4 w-4" />}
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setIsModalOpen(true);
                        }}
                        className="!p-1.5 !shadow-none border-0 !bg-gray-100 hover:!bg-gray-200 dark:!bg-gray-800 dark:hover:!bg-gray-700"
                      />
                      <ActionButton
                        variant="danger"
                        size="sm"
                        icon={<TrashIcon className="h-4 w-4" />}
                        onClick={() => handleDelete(customer.id)}
                        className="!p-1.5 !shadow-none border-0 !bg-red-100 hover:!bg-red-200 dark:!bg-red-900/30 dark:hover:!bg-red-800/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {customer.email && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="flex items-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        <EnvelopeIcon className="h-4 w-4 mr-2" />
                        {customer.email}
                      </motion.div>
                    )}

                    {customer.phone && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="flex items-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        {customer.phone}
                      </motion.div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        className="text-gray-500 dark:text-gray-400"
                      >
                        Customer Since
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        className="font-medium text-gray-900 dark:text-white"
                      >
                        {new Date().getFullYear()}
                      </motion.div>
                    </div>
                  </div>

                  <motion.div
                    className="absolute bottom-0 right-0 w-32 h-32 opacity-5"
                    style={{
                      backgroundColor: customerColor,
                      borderRadius: "100% 0 0 0",
                    }}
                    initial={{ scale: 0, rotate: 45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                      delay: index * 0.1,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} maxWidth="2xl">
        <CustomerForm
          onSubmit={handleSubmit}
          customer={selectedCustomer}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
