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
import { Users, Plus } from "lucide-react";
import type { Customer } from "@/lib/pocketbase";
import { useTableParams } from "@/lib/hooks/useTableParams";
import { formatDate } from "@/lib/utils";
import { pb } from "@/lib/pocketbase";

export function CustomersList() {
  const navigate = useNavigate();
  const tableParams = useTableParams();

  const { data, isLoading } = useSWR(
    ["customers", tableParams.page, tableParams.perPage, tableParams.sort],
    async () => {
      const sort = tableParams.sort || "-created";
      return await pb.collection("customers").getList(1, 50, {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">
            Customers
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Manage your customers and their information
          </p>
        </div>
        <Link
          to="/customers/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-colors rounded"
        >
          <Plus className="w-4 h-4" />
          New Customer
        </Link>
      </div>

      <div className="bg-white border border-black/10 rounded overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "name"
                    ? "asc"
                    : tableParams.sort === "-name"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("name")}
              >
                Customer
              </TableHead>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "email"
                    ? "asc"
                    : tableParams.sort === "-email"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("email")}
              >
                Contact
              </TableHead>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "trn"
                    ? "asc"
                    : tableParams.sort === "-trn"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("trn")}
              >
                Tax Registration
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                  </div>
                </TableCell>
              </TableRow>
            ) : data?.items?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              data?.items?.map((customer: Customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-[#F1F5F9]">
                        <Users className="w-4 h-4 text-[#3B82F6]" />
                      </div>
                      <div>
                        <Link
                          to={`/customers/${customer.id}`}
                          className="font-medium text-[#0F172A] hover:text-[#3B82F6] transition-colors"
                        >
                          {customer.name}
                        </Link>
                        <div className="text-sm text-[#64748B]">
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-[#0F172A]">
                        {customer.phone}
                      </div>
                      <div className="text-sm text-[#64748B]">
                        {customer.address}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-[#0F172A]">
                      {customer.trn}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-[#64748B]">
                      {formatDate(customer.created)}
                    </div>
                  </TableCell>
                </TableRow>
              ))
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
    </div>
  );
}
