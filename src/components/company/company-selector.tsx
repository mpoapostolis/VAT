import { useState } from "react";
import { Check, ChevronDown, Building2 } from "lucide-react";
import useSWR from "swr";
import { companyService } from "../../lib/services/company";
import type { Company } from "../../types/company";
import { cn } from "../../lib/utils";

export function CompanySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, error } = useSWR("companies/1/30", companyService.getCompanies);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  if (error) {
    return null;
  }

  const companies = data?.items || [];

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setIsOpen(false);
    // You can add additional logic here, like storing the selected company in global state
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-sm font-medium",
          "text-gray-700 bg-white rounded border border-gray-200",
          "hover:bg-gray-50 focus:outline-none focus:ring-2",
          "focus:ring-primary/20 transition-colors"
        )}
      >
        <Building2 className="w-4 h-4" />
        <span className="max-w-[200px] truncate">
          {selectedCompany ? selectedCompany.companyNameEn : "Select Company"}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-72 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1 max-h-64 overflow-auto">
            {companies.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                No companies found
              </div>
            ) : (
              companies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => handleCompanySelect(company)}
                  className={cn(
                    "flex items-center w-full px-4 py-2 text-sm",
                    "hover:bg-gray-100 transition-colors",
                    selectedCompany?.id === company.id ? "bg-gray-50" : ""
                  )}
                >
                  <span className="flex-1 text-left">
                    <div className="font-medium">{company.companyNameEn}</div>
                    <div className="text-xs text-gray-500">
                      {company.tradeLicenseNumber}
                    </div>
                  </span>
                  {selectedCompany?.id === company.id && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
