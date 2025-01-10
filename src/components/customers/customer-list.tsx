import { Link } from "react-router-dom";
import { useTableParams } from "@/lib/hooks/useTableParams";
import { User, Plus, Copy, Trash2, Loader2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
} from "@/components/ui/table";
import { useCustomers } from "@/lib/hooks/useCustomers";
import { pb } from "@/lib/pocketbase";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Customer } from "@/types/customer";

export function CustomerList() {
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: { duplicate: boolean; delete: boolean };
  }>({});
  const tableParams = useTableParams();
  const { customers: data, mutate, totalItems, totalPages } = useCustomers();

  const handleSort = useCallback(
    (field: string) => {
      const currentSort = tableParams.sort;
      if (currentSort === field) {
        tableParams.setSort(`-${field}`);
      } else if (currentSort === `-${field}`) {
        tableParams.setSort("");
      } else {
        tableParams.setSort(field);
      }
    },
    [tableParams]
  );

  const handleDuplicate = useCallback(
    async (customer: Customer) => {
      setLoadingStates((prev) => ({
        ...prev,
        [customer.id]: { ...prev[customer.id], duplicate: true },
      }));
      try {
        const formData = new FormData();

        // Customer Basic Info
        formData.append("isCompany", customer.isCompany.toString());
        formData.append("companyName", `${customer.companyName} (Copy)`);
        formData.append("billingAddress", customer.billingAddress);
        formData.append(
          "useShippingAddress",
          customer.useShippingAddress.toString()
        );
        if (customer.shippingAddress) {
          formData.append("shippingAddress", customer.shippingAddress);
        }
        formData.append("contactFirstName", customer.contactFirstName);
        formData.append("contactLastName", customer.contactLastName);
        formData.append("email", customer.email);
        formData.append("phoneNumber", customer.phoneNumber);
        formData.append(
          "taxRegistrationNumber",
          customer.taxRegistrationNumber || ""
        );
        formData.append("country", customer.country);
        formData.append("businessType", customer.businessType);
        formData.append("relationship", customer.relationship);
        formData.append("userId", pb.authStore.model?.id || "");

        await pb.collection("customers").create(formData);
        await mutate();
        toast.success("Customer duplicated successfully");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Failed to duplicate customer: ${error.message}`);
        } else {
          toast.error("Failed to duplicate customer");
        }
        console.error("Duplication error:", error);
      } finally {
        setLoadingStates((prev) => ({
          ...prev,
          [customer.id]: { ...prev[customer.id], duplicate: false },
        }));
      }
    },
    [mutate]
  );

  const handleDelete = useCallback(
    async (customer: Customer) => {
      if (!window.confirm("Are you sure you want to delete this customer?"))
        return;

      setLoadingStates((prev) => ({
        ...prev,
        [customer.id]: { ...prev[customer.id], delete: true },
      }));
      try {
        await pb.collection("customers").delete(customer.id);
        await mutate();
        toast.success("Customer deleted successfully");
      } catch (error) {
        toast.error("Failed to delete customer");
      } finally {
        setLoadingStates((prev) => ({
          ...prev,
          [customer.id]: { ...prev[customer.id], delete: false },
        }));
      }
    },
    [mutate]
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">
            Customers
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your customers and their details
          </p>
        </div>
        <Link
          to="/customers/new"
          className={cn(
            "inline-flex items-center justify-center gap-2",
            "px-4 py-2.5 w-full sm:w-auto",
            "text-xs font-medium text-white",
            "bg-blue-600 hover:bg-blue-700",
            "shadow-sm",
            "transition-all duration-200",
            "",
            "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          )}
        >
          <Plus className="w-4 h-4" />
          New Customer
        </Link>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-hidden bg-white  border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "contactFirstName"
                    ? "asc"
                    : tableParams.sort === "-contactFirstName"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("contactFirstName")}
                className="font-medium text-gray-700"
              >
                Contact
              </TableHead>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "country"
                    ? "asc"
                    : tableParams.sort === "-country"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("country")}
                className="font-medium text-gray-700"
              >
                Country
              </TableHead>
              <TableHead className="font-medium text-gray-700">TRN</TableHead>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "relationship"
                    ? "asc"
                    : tableParams.sort === "-relationship"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("relationship")}
                className="font-medium text-gray-700"
              >
                Type
              </TableHead>
              <TableHead className="font-medium text-gray-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((customer) => (
              <TableRow
                key={customer.id}
                className="hover:bg-gray-50/50 transition-colors duration-200"
              >
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-600/5 blur-sm "></div>
                      <div className="relative p-2  bg-gradient-to-br from-gray-50 to-white shadow-sm">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <Link
                        to={`/customers/${customer.id}/edit`}
                        className="font-medium text-xs text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {customer.isCompany
                          ? customer.companyName
                          : `${customer.contactFirstName} ${customer.contactLastName}`}
                      </Link>
                      <div className="text-xs text-gray-500">
                        {customer.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="font-medium text-xs text-gray-700">
                    {customer.country}
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 ",
                      "text-xs font-medium",
                      "bg-gray-50 text-gray-700",
                      "shadow-sm ring-1 ring-inset ring-gray-600/10"
                    )}
                  >
                    {customer.taxRegistrationNumber || "N/A"}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 ",
                      "text-xs font-medium",
                      customer.relationship === "Client"
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-600/10"
                        : customer.relationship === "Vendor"
                        ? "bg-blue-50 text-blue-700 ring-blue-600/10"
                        : "bg-gray-50 text-gray-700 ring-gray-600/10",
                      "shadow-sm ring-1 ring-inset"
                    )}
                  >
                    {customer.relationship}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDuplicate(customer)}
                      disabled={loadingStates[customer.id]?.duplicate}
                      aria-label={`Duplicate ${customer.companyName}`}
                      className={cn(
                        "p-2",
                        "relative",
                        "",
                        "text-gray-500",
                        "hover:text-blue-600 hover:bg-gray-50",
                        "focus:outline-none focus:ring-2 focus:ring-blue-600/20",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "transition-all duration-200"
                      )}
                    >
                      {loadingStates[customer.id]?.duplicate ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(customer)}
                      disabled={loadingStates[customer.id]?.delete}
                      aria-label={`Delete ${customer.companyName}`}
                      className={cn(
                        "p-2",
                        "relative",
                        "",
                        "text-gray-500",
                        "hover:text-rose-600 hover:bg-gray-50",
                        "focus:outline-none focus:ring-2 focus:ring-rose-600/20",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "transition-all duration-200"
                      )}
                    >
                      {loadingStates[customer.id]?.delete ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          totalItems={totalItems}
          pageIndex={tableParams.page - 1}
          pageSize={tableParams.perPage}
          pageCount={totalPages}
          onPageChange={(page) => tableParams.setPage(page + 1)}
          onPageSizeChange={(size) => tableParams.setPerPage(size)}
        />
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {data?.map((customer) => (
          <div
            key={customer.id}
            className="bg-white border border-gray-200  p-4 space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2  bg-gray-50/50 flex-shrink-0">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/customers/${customer.id}/edit`}
                  className="block text-xs font-medium text-gray-900 hover:text-blue-600 transition-colors truncate"
                >
                  {customer.isCompany
                    ? customer.companyName
                    : `${customer.contactFirstName} ${customer.contactLastName}`}
                </Link>
                <div className="text-xs text-gray-500 truncate">
                  {customer.email}
                </div>
              </div>
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 ",
                  "text-xs font-medium",
                  customer.relationship === "Client"
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-600/10"
                    : customer.relationship === "Vendor"
                    ? "bg-blue-50 text-blue-700 ring-blue-600/10"
                    : "bg-gray-50 text-gray-700 ring-gray-600/10",
                  "shadow-sm ring-1 ring-inset"
                )}
              >
                {customer.relationship}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
              <div>
                <div className="text-xs text-gray-500">Contact</div>
                <div className="text-xs font-medium text-gray-700 truncate">
                  {customer.contactFirstName} {customer.contactLastName}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {customer.phoneNumber}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Location</div>
                <div className="text-xs font-medium text-gray-700">
                  {customer.country}
                </div>
                <div className="text-xs text-gray-500">
                  TRN: {customer.taxRegistrationNumber || "N/A"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Link
                to={`/customers/${customer.id}/edit`}
                className={cn(
                  "p-2",
                  "relative",
                  "",
                  "text-gray-500",
                  "hover:text-blue-600 hover:bg-gray-50",
                  "focus:outline-none focus:ring-2 focus:ring-blue-600/20",
                  "transition-all duration-200"
                )}
              >
                <User className="w-4 h-4" />
              </Link>
              <button
                onClick={() => handleDuplicate(customer)}
                disabled={loadingStates[customer.id]?.duplicate}
                aria-label={`Duplicate ${customer.companyName}`}
                className={cn(
                  "p-2",
                  "relative",
                  "",
                  "text-gray-500",
                  "hover:text-blue-600 hover:bg-gray-50",
                  "focus:outline-none focus:ring-2 focus:ring-blue-600/20",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-all duration-200"
                )}
              >
                {loadingStates[customer.id]?.duplicate ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => handleDelete(customer)}
                disabled={loadingStates[customer.id]?.delete}
                aria-label={`Delete ${customer.companyName}`}
                className={cn(
                  "p-2",
                  "relative",
                  "",
                  "text-gray-500",
                  "hover:text-rose-600 hover:bg-gray-50",
                  "focus:outline-none focus:ring-2 focus:ring-rose-600/20",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-all duration-200"
                )}
              >
                {loadingStates[customer.id]?.delete ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
        <div className="bg-white border border-gray-200  overflow-hidden">
          <TablePagination
            pageIndex={tableParams.page - 1}
            pageSize={tableParams.perPage}
            totalItems={totalItems}
            pageCount={totalPages}
            onPageChange={(page) => tableParams.setPage(page + 1)}
            onPageSizeChange={(size) => tableParams.setPerPage(size)}
          />
        </div>
      </div>
    </div>
  );
}
