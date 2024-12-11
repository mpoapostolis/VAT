import { useState } from "react";
import { Building2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dropdown } from "../ui/dropdown";
import { Tooltip } from "../ui/tooltip";

const companies = [
  { id: "1", name: "Acme Corp" },
  { id: "2", name: "Stark Industries" },
  { id: "3", name: "Wayne Enterprises" },
];

interface CompanySelectorProps {
  isCollapsed?: boolean;
}

export function CompanySelector({ isCollapsed }: CompanySelectorProps) {
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);

  const trigger = (
    <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors">
      <Building2 className="w-5 h-5 text-black/70 flex-shrink-0" />
      {!isCollapsed && (
        <>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-black/90">
              {selectedCompany.name}
            </span>
            <span className="text-xs text-black/40">Switch Company</span>
          </div>
          <ChevronDown className="w-4 h-4 text-black/40 ml-auto" />
        </>
      )}
    </button>
  );

  return isCollapsed ? (
    <Tooltip
      content={
        <div className="flex flex-col gap-1 min-w-[180px]">
          <span className="text-sm font-medium">{selectedCompany.name}</span>
          <span className="text-xs opacity-60">Switch Company</span>
        </div>
      }
    >
      <Dropdown
        direction="up"
        trigger={trigger}
        items={companies.map((company) => ({
          label: company.name,
          onClick: () => setSelectedCompany(company),
          icon: Building2,
        }))}
      />
    </Tooltip>
  ) : (
    <Dropdown
      direction="up"
      trigger={trigger}
      items={companies.map((company) => ({
        label: company.name,
        onClick: () => setSelectedCompany(company),
        icon: Building2,
      }))}
    />
  );
}
