import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { DataTable } from '@/components/ui/data-table';
import { ActionDropdown } from '@/components/ui/action-dropdown';
import { createColumnHelper } from '@tanstack/react-table';
import type { Customer } from '@/lib/pocketbase';
import { motion } from 'framer-motion';
import { customerService } from '@/lib/services/customer-service';
import { useMutateData } from '@/lib/hooks/useMutateData';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { useTableParams } from '@/lib/hooks/useTableParams';
import { formatDate } from '@/lib/utils';

const columnHelper = createColumnHelper<Customer>();

export function CustomersList() {
  const navigate = useNavigate();
  const tableParams = useTableParams();
  const { data, mutate, isLoading } = useSWR(
    ['customers', tableParams],
    () => customerService.getList(tableParams)
  );
  const { mutateData } = useMutateData();
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; customerId: string | null }>({
    isOpen: false,
    customerId: null
  });

  const handleDelete = async () => {
    if (!deleteModal.customerId) return;
    
    await mutateData(
      mutate,
      () => customerService.delete(deleteModal.customerId!),
      {
        successMessage: 'Customer deleted successfully',
        errorMessage: 'Failed to delete customer'
      }
    );
    setDeleteModal({ isOpen: false, customerId: null });
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Customer',
      cell: (info) => (
        <div className="flex items-center space-x-3">
          <img
            src={`https://ui-avatars.com/api/?name=${info.getValue()}&background=random`}
            alt={info.getValue()}
            className="w-10 h-10 rounded-full border border-gray-200"
          />
          <div>
            <Link
              to={`/customers/${info.row.original.id}`}
              className="font-medium text-gray-900 hover:text-[#0066FF] transition-colors"
            >
              {info.getValue()}
            </Link>
            <div className="text-sm text-gray-500">{info.row.original.email}</div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('phone', {
      header: 'Contact',
      cell: (info) => (
        <div>
          <div className="font-medium text-gray-900">{info.getValue()}</div>
          <div className="text-sm text-gray-500">{info.row.original.address}</div>
        </div>
      ),
    }),
    columnHelper.accessor('trn', {
      header: 'Tax Registration',
      cell: (info) => (
        <div className="font-medium text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('created', {
      header: 'Created',
      cell: (info) => (
        <div className="text-gray-500">
          {formatDate(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor('id', {
      header: '',
      cell: (info) => (
        <div className="flex justify-end">
          <ActionDropdown
            onView={() => navigate(`/customers/${info.getValue()}`)}
            onEdit={() => navigate(`/customers/${info.getValue()}/edit`)}
            onDelete={() => setDeleteModal({ isOpen: true, customerId: info.getValue() })}
          />
        </div>
      ),
    }),
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DataTable
          data={data?.items || []}
          columns={columns}
          pageCount={Math.ceil((data?.totalItems || 0) / tableParams.perPage)}
          pageSize={tableParams.perPage}
          isLoading={isLoading}
          emptyState={{
            title: 'No customers found',
            description: 'Get started by adding your first customer to manage your business relationships.',
            action: {
              label: 'Add Customer',
              onClick: () => navigate('/customers/new')
            }
          }}
        />
      </motion.div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, customerId: null })}
        onConfirm={handleDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone and will remove all associated data."
        confirmLabel="Delete"
        type="danger"
      />
    </>
  );
}