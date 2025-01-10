import { Link } from "react-router-dom";
import { useTableParams } from "@/lib/hooks/useTableParams";
import { Building2, Plus, Copy, Trash2, Loader2 } from "lucide-react";
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
import { pb } from "@/lib/pocketbase";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Company } from "@/types/company";

interface PocketbaseError {
  data?: {
    [key: string]: {
      code: string;
      message: string;
    };
  };
  message: string;
  status: number;
}

export function CompanyList() {
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: { duplicate: boolean; delete: boolean };
  }>({});
  const tableParams = useTableParams();
  const { companies: data, mutate, totalItems, totalPages } = useCompanies();

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

  const generateUniqueTradeLicense = (original: string) => {
    const timestamp = Date.now().toString().slice(-6);
    return `${original}-${timestamp}`;
  };

  const handleDuplicate = useCallback(
    async (company: Company) => {
      setLoadingStates((prev) => ({
        ...prev,
        [company.id]: { ...prev[company.id], duplicate: true },
      }));
      try {
        const formData = new FormData();

        // Company Basic Info
        formData.append("companyNameEN", `${company.companyNameEN} (Copy)`);
        formData.append(
          "companyNameAR",
          company.companyNameAR ? `${company.companyNameAR} (Copy)` : ""
        );
        formData.append(
          "tradeLicenseNumber",
          generateUniqueTradeLicense(company.tradeLicenseNumber)
        );
        formData.append("primaryBusinessType", company.primaryBusinessType);
        formData.append(
          "businessTypeDescription",
          company.businessTypeDescription || ""
        );
        formData.append("serviceType", company.serviceType || "");
        formData.append("emirate", company.emirate);
        formData.append("freeZone", company.freeZone?.toString() || "false");
        formData.append("Designated_Zone", company.Designated_Zone || "");

        // Contact Information
        formData.append(
          "contactPersonFirstName",
          company.contactPersonFirstName
        );
        formData.append("contactPersonLastName", company.contactPersonLastName);
        formData.append(
          "contactPersonPosition",
          company.contactPersonPosition || ""
        );
        formData.append("email", company.email);
        formData.append("phoneNumber", company.phoneNumber);
        formData.append("website", company.website || "");

        // Financial Information
        formData.append("baseCurrency", company.baseCurrency);
        formData.append("defaultVatRate", company.defaultVatRate.toString());
        formData.append(
          "defaultPaymentTermsDays",
          company.defaultPaymentTermsDays.toString()
        );
        formData.append(
          "reverseChargeMechanism",
          company.reverseChargeMechanism?.toString() || "false"
        );

        // Bank Details
        formData.append("bankName", company.bankName);
        formData.append("branch", company.branch);
        formData.append("accountNumber", company.accountNumber);
        formData.append("swiftCode", company.swiftCode);
        formData.append("accountCurrency", company.accountCurrency);

        // Address Information
        formData.append(
          "billingAddress",
          JSON.stringify(company.billingAddress)
        );
        if (company.useShippingAddress && company.shippingAddress) {
          formData.append(
            "shippingAddress",
            JSON.stringify(company.shippingAddress)
          );
          formData.append("useShippingAddress", "true");
        }

        // Status
        formData.append(
          "registrationStatus",
          company.registrationStatus || "pending"
        );
        formData.append("isActive", (company.isActive ?? true).toString());

        // Logo
        if (company.logo && typeof company.logo === "string") {
          const response = await fetch(pb.getFileUrl(company, company.logo));
          const blob = await response.blob();
          formData.append("logo", blob, "logo");
        }

        await pb
          .collection("companies")
          .create({ ...formData, userId: pb.authStore.model?.id });
        await mutate();
        toast.success("Company duplicated successfully");
      } catch (error) {
        const pbError = error as PocketbaseError;
        if (
          pbError.data?.tradeLicenseNumber?.code === "validation_not_unique"
        ) {
          toast.error(
            "Failed to duplicate company: Trade license number must be unique"
          );
        } else if (pbError.data && Object.keys(pbError.data).length > 0) {
          // Get the first validation error
          const firstError = Object.entries(pbError.data)[0];
          const [field, errorDetails] = firstError;
          const readableField = field
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()
            .replace(/^\w/, (c) => c.toUpperCase());
          toast.error(
            `Failed to duplicate company: ${readableField} ${errorDetails.message}`
          );
        } else {
          toast.error("Failed to duplicate company");
        }
        console.error("Duplication error:", error);
      } finally {
        setLoadingStates((prev) => ({
          ...prev,
          [company.id]: { ...prev[company.id], duplicate: false },
        }));
      }
    },
    [mutate]
  );

  const handleDelete = useCallback(
    async (company: Company) => {
      if (!window.confirm("Are you sure you want to delete this company?"))
        return;

      setLoadingStates((prev) => ({
        ...prev,
        [company.id]: { ...prev[company.id], delete: true },
      }));
      try {
        await pb.collection("companies").delete(company.id);
        await mutate();
        toast.success("Company deleted successfully");
      } catch (error) {
        toast.error("Failed to delete company");
      } finally {
        setLoadingStates((prev) => ({
          ...prev,
          [company.id]: { ...prev[company.id], delete: false },
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
            Companies
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your companies and their details
          </p>
        </div>
        <Link
          to="/companies/new"
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
          New Company
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
                  tableParams.sort === "companyNameEn"
                    ? "asc"
                    : tableParams.sort === "-companyNameEn"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("companyNameEn")}
                className="font-medium text-gray-700"
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
                className="font-medium text-gray-700"
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
                className="font-medium text-gray-700"
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
                className="font-medium text-gray-700"
              >
                VAT Rate
              </TableHead>
              <TableHead className="font-medium text-gray-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((company) => (
              <TableRow
                key={company.id}
                className="hover:bg-gray-50/50 transition-colors duration-200"
              >
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-600/5 blur-sm "></div>
                      <div className="relative p-2  bg-gradient-to-br from-gray-50 to-white shadow-sm">
                        {company.logo ? (
                          <img
                            src={pb.getFileUrl(company, company.logo as string)}
                            alt={company.companyNameEN}
                            className="w-6 h-6 "
                          />
                        ) : (
                          <Building2 className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    </div>
                    <div>
                      <Link
                        to={`/companies/${company.id}`}
                        className="font-medium text-xs text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {company.companyNameEN}
                      </Link>
                      <div className="text-xs text-gray-500">
                        {company.companyNameAR}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="font-medium text-xs text-gray-700">
                    {company.tradeLicenseNumber}
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div>
                    <div className="font-medium text-xs text-gray-700">
                      {company.emirate}
                    </div>
                    {company.freeZone && (
                      <div className="text-xs text-gray-500">
                        {company.freeZone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 ",
                      "text-xs font-medium",
                      "bg-emerald-50 text-emerald-700",
                      "shadow-sm ring-1 ring-inset ring-emerald-600/10"
                    )}
                  >
                    {company.defaultVatRate}%
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDuplicate(company)}
                      disabled={loadingStates[company.id]?.duplicate}
                      aria-label={`Duplicate ${company.companyNameEN}`}
                      className={cn(
                        // Layout
                        "p-2",
                        "relative",
                        // Visual
                        "",
                        // Typography
                        "text-gray-500",
                        // States
                        "hover:text-blue-600 hover:bg-gray-50",
                        "focus:outline-none focus:ring-2 focus:ring-blue-600/20",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "transition-all duration-200"
                      )}
                    >
                      {loadingStates[company.id]?.duplicate ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(company)}
                      disabled={loadingStates[company.id]?.delete}
                      aria-label={`Delete ${company.companyNameEN}`}
                      className={cn(
                        // Layout
                        "p-2",
                        "relative",
                        // Visual
                        "",
                        // Typography
                        "text-gray-500",
                        // States
                        "hover:text-rose-600 hover:bg-gray-50",
                        "focus:outline-none focus:ring-2 focus:ring-rose-600/20",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "transition-all duration-200"
                      )}
                    >
                      {loadingStates[company.id]?.delete ? (
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
        {data?.map((company) => (
          <div
            key={company.id}
            className="bg-white border border-gray-200  p-4 space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2  bg-gray-50/50 flex-shrink-0">
                {company.logo ? (
                  <img
                    src={pb.getFileUrl(company, company.logo as string)}
                    alt={company.companyNameEN}
                    className="w-8 h-8 "
                  />
                ) : (
                  <Building2 className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/companies/${company.id}`}
                  className="block text-xs font-medium text-gray-900 hover:text-blue-600 transition-colors truncate"
                >
                  {company.companyNameEN}
                </Link>
                <div className="text-xs text-gray-500 truncate">
                  {company.companyNameAR}
                </div>
              </div>
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 ",
                  "text-xs font-medium",
                  "bg-emerald-50 text-emerald-700",
                  "shadow-sm ring-1 ring-inset ring-emerald-600/10"
                )}
              >
                {company.defaultVatRate}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
              <div>
                <div className="text-xs text-gray-500">License Number</div>
                <div className="text-xs font-medium text-gray-700 truncate">
                  {company.tradeLicenseNumber}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Emirate</div>
                <div className="text-xs font-medium text-gray-700">
                  {company.emirate}
                  {company.freeZone && (
                    <div className="text-xs text-gray-500 truncate">
                      {company.freeZone}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => handleDuplicate(company)}
                disabled={loadingStates[company.id]?.duplicate}
                aria-label={`Duplicate ${company.companyNameEN}`}
                className={cn(
                  // Layout
                  "p-2",
                  "relative",
                  // Visual
                  "",
                  // Typography
                  "text-gray-500",
                  // States
                  "hover:text-blue-600 hover:bg-gray-50",
                  "focus:outline-none focus:ring-2 focus:ring-blue-600/20",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-all duration-200"
                )}
              >
                {loadingStates[company.id]?.duplicate ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => handleDelete(company)}
                disabled={loadingStates[company.id]?.delete}
                aria-label={`Delete ${company.companyNameEN}`}
                className={cn(
                  // Layout
                  "p-2",
                  "relative",
                  // Visual
                  "",
                  // Typography
                  "text-gray-500",
                  // States
                  "hover:text-rose-600 hover:bg-gray-50",
                  "focus:outline-none focus:ring-2 focus:ring-rose-600/20",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-all duration-200"
                )}
              >
                {loadingStates[company.id]?.delete ? (
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
