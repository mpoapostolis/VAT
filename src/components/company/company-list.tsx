import { Link } from "react-router-dom";
import { useTableParams } from "@/lib/hooks/useTableParams";
import { Building2, Plus } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
} from "@/components/ui/table";
import { useCompanies } from "@/lib/hooks/useCompanies";

export function CompanyList() {
  const tableParams = useTableParams();
  const { companies: data } = useCompanies();

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
            Companies
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Manage your companies and their details
          </p>
        </div>
        <Link
          to="/companies/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-colors rounded-lg"
        >
          <Plus className="w-4 h-4" />
          New Company
        </Link>
      </div>

      <div className="bg-white border border-black/10 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "companyNameEn"
                    ? "asc"
                    : tableParams.sort === "-companyNameEn"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("companyNameEn")}
              >
                Company
              </TableHead>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "tradeLicenseNumber"
                    ? "asc"
                    : tableParams.sort === "-tradeLicenseNumber"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("tradeLicenseNumber")}
              >
                License Number
              </TableHead>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "emirate"
                    ? "asc"
                    : tableParams.sort === "-emirate"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("emirate")}
              >
                Emirate
              </TableHead>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "defaultVatRate"
                    ? "asc"
                    : tableParams.sort === "-defaultVatRate"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("defaultVatRate")}
              >
                VAT Rate
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#F1F5F9]">
                      <Building2 className="w-4 h-4 text-[#3B82F6]" />
                    </div>
                    <div>
                      <Link
                        to={`/companies/${company.id}`}
                        className="font-medium text-[#0F172A] hover:text-[#3B82F6] transition-colors"
                      >
                        {company.companyNameEN}
                      </Link>
                      <div className="text-sm text-[#64748B]">
                        {company.companyNameAR}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-[#0F172A]">
                    {company.tradeLicenseNumber}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-[#0F172A]">
                      {company.emirate}
                    </div>
                    {company.freeZone && (
                      <div className="text-sm text-[#64748B]">
                        {company.freeZone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#DCFCE7] text-[#10B981]">
                    {company.defaultVATRate}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          pageIndex={tableParams.page - 1}
          pageSize={tableParams.perPage}
          pageCount={data?.length || 1}
          onPageChange={(page) => tableParams.setPage(page + 1)}
          onPageSizeChange={(size) => tableParams.setPerPage(size)}
        />
      </div>
    </div>
  );
}
