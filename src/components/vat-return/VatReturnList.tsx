import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useSWR from "swr";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
} from "@/components/ui/table";
import {
  Receipt,
  Plus,
  Calculator,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import type { VatReturn } from "@/lib/pocketbase";
import { useTableParams } from "@/lib/hooks/useTableParams";
import { formatDate, formatCurrency } from "@/lib/utils";
import { pb } from "@/lib/pocketbase";
import { useToast } from "@/lib/hooks/useToast";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { ActionDropdown } from "@/components/ui/action-dropdown";

export function VatReturnList() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const tableParams = useTableParams();
  const [deleteModal, setDeleteModal] = React.useState<{
    isOpen: boolean;
    vatReturnId: string | null;
  }>({
    isOpen: false,
    vatReturnId: null,
  });

  const { data, isLoading, mutate } = useSWR(
    ["vat_returns", tableParams.page, tableParams.perPage, tableParams.sort],
    async () => {
      const sort = tableParams.sort || "-created";
      return await pb.collection("vat_returns").getList(1, 50, {
        sort,
      });
    }
  );

  const handleSort = (field: string) => {
    const currentSort = tableParams.sort;
    if (currentSort === field) {
      tableParams.setSort(`-${field}`);
    } else if (currentSort === `-${field}`) {
      tableParams.setSort("");
    } else {
      tableParams.setSort(field);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.vatReturnId) return;

    try {
      await pb.collection("vat_returns").delete(deleteModal.vatReturnId);
      addToast("VAT return deleted successfully", "success");
      mutate();
    } catch (error) {
      addToast("Failed to delete VAT return", "error");
    }
    setDeleteModal({ isOpen: false, vatReturnId: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">
            VAT Returns
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Manage your VAT returns and submissions
          </p>
        </div>
        <Link
          to="/vat-return/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-colors rounded"
        >
          <Plus className="w-4 h-4" />
          New VAT Return
        </Link>
      </div>

      <div className="bg-white border border-black/10 rounded overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "period"
                    ? "asc"
                    : tableParams.sort === "-period"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("period")}
              >
                Period
              </TableHead>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "salesVat"
                    ? "asc"
                    : tableParams.sort === "-salesVat"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("salesVat")}
              >
                Sales VAT
              </TableHead>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "purchasesVat"
                    ? "asc"
                    : tableParams.sort === "-purchasesVat"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("purchasesVat")}
              >
                Purchases VAT
              </TableHead>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "status"
                    ? "asc"
                    : tableParams.sort === "-status"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("status")}
              >
                Status
              </TableHead>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "created"
                    ? "asc"
                    : tableParams.sort === "-created"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("created")}
              >
                Created
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                  </div>
                </TableCell>
              </TableRow>
            ) : data?.items?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No VAT returns found.
                </TableCell>
              </TableRow>
            ) : (
              data?.items?.map((vatReturn: VatReturn) => {
                const netVat =
                  (vatReturn.salesVat || 0) - (vatReturn.purchasesVat || 0);
                return (
                  <TableRow key={vatReturn.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-[#F1F5F9]">
                          <Receipt className="w-4 h-4 text-[#3B82F6]" />
                        </div>
                        <div>
                          <Link
                            to={`/vat-return/${vatReturn.id}`}
                            className="font-medium text-[#0F172A] hover:text-[#3B82F6] transition-colors"
                          >
                            {vatReturn.period}
                          </Link>
                          <div className="text-sm text-[#64748B]">
                            Net VAT: {formatCurrency(netVat)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                        <div className="font-medium text-[#0F172A]">
                          {formatCurrency(vatReturn.salesVat || 0)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                        <div className="font-medium text-[#0F172A]">
                          {formatCurrency(vatReturn.purchasesVat || 0)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
                          vatReturn.status === "draft"
                            ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                            : "bg-green-50 text-green-800 border border-green-200"
                        }`}
                      >
                        {vatReturn.status.charAt(0).toUpperCase() +
                          vatReturn.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-[#64748B]">
                        {formatDate(vatReturn.created)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ActionDropdown
                        onView={() => navigate(`/vat-return/${vatReturn.id}`)}
                        onEdit={() =>
                          navigate(`/vat-return/${vatReturn.id}/edit`)
                        }
                        onDelete={() =>
                          setDeleteModal({
                            isOpen: true,
                            vatReturnId: vatReturn.id,
                          })
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {data && (
          <div className=" border-slate-200 bg-white">
            <TablePagination
              pageIndex={Math.max(0, (tableParams.page || 1) - 1)}
              pageSize={tableParams.perPage || 10}
              pageCount={Math.ceil(
                (data.totalItems || 0) / (tableParams.perPage || 10)
              )}
              onPageChange={(page) => tableParams.setPage(page + 1)}
              onPageSizeChange={(size) => {
                tableParams.setPerPage(size);
                tableParams.setPage(1);
              }}
            />
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, vatReturnId: null })}
        onConfirm={handleDelete}
        title="Delete VAT Return"
        message="Are you sure you want to delete this VAT return? This action cannot be undone."
        confirmLabel="Delete"
        type="danger"
      />
    </div>
  );
}
