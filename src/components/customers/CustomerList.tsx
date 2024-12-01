import React, { useState } from "react";
import { useAtom } from "jotai";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { CustomerForm } from "./CustomerForm";
import { useCustomers } from "@/lib/hooks/useCustomers";
import { Customer } from "@/types";
import { toast } from "react-hot-toast";
import { resetCustomerForm } from "@/lib/state/atoms";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import {
  BuildingOfficeIcon,
  PlusIcon,
  PhoneIcon,
  EnvelopeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { DataTable } from "../ui/DataTable";
import { SearchInput } from "../ui/SearchInput";
import { PageHeader } from "../ui/PageHeader";
import { ActionButton } from "../ui/ActionButton";

export function CustomerList() {
  const { customers, createCustomer, updateCustomer, deleteCustomer } =
    useCustomers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [, resetForm] = useAtom(resetCustomerForm);

  const handleSubmit = async (data: Partial<Customer>) => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, data);
        toast.success("Customer updated successfully");
      } else {
        await createCustomer(data);
        toast.success("Customer created successfully");
      }
      handleCloseModal();
    } catch (error) {
      toast.error(
        editingCustomer
          ? "Failed to update customer"
          : "Failed to create customer"
      );
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

  const filteredCustomers = customers.filter((customer) =>
    Object.values(customer).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (!customers) {
    return <LoadingSpinner />;
  }

  const columns = [
    {
      key: "name",
      title: "Company",
      render: (_, customer: Customer) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center">
              <BuildingOfficeIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {customer.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "vatNumber",
      title: "VAT Number",
    },
    {
      key: "phone",
      title: "Contact",
      render: (phone: string) => (
        <div className="flex items-center">
          <PhoneIcon className="h-4 w-4 mr-1" />
          {phone}
        </div>
      ),
    },
    {
      key: "email",
      title: "Email",
      render: (email: string) => (
        <div className="flex items-center">
          <EnvelopeIcon className="h-4 w-4 mr-1" />
          {email}
        </div>
      ),
    },
  ];

  const renderActions = (customer: Customer) => (
    <div className="flex items-center justify-end gap-2">
      <ActionButton
        variant="secondary"
        size="sm"
        icon={<PencilIcon className="h-4 w-4" />}
        onClick={() => {
          setEditingCustomer(customer);
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
  );

  return (
    <div className="">
      <PageHeader
        title="Customers"
        description="Manage your customer information and details"
      >
        <ActionButton
          icon={<PlusIcon className="h-5 w-5" />}
          onClick={() => handleOpenModal()}
        >
          Add Customer
        </ActionButton>
      </PageHeader>

      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search customers..."
          className="max-w-lg"
        />
      </div>

      <div className="mt-4 flex flex-col">
        <div className=" ">
          <div className="inline-block min-w-full py-2 align-middle">
            <DataTable
              columns={columns}
              data={filteredCustomers}
              keyField="id"
              actions={renderActions}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCustomer ? "Edit Customer" : "Add Customer"}
      >
        <CustomerForm
          onSubmit={handleSubmit}
          initialData={editingCustomer}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
