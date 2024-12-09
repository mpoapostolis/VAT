import {
  ChevronDown,
  LogOut,
  Settings,
  User,
  Building2,
  Menu,
} from "lucide-react";
import { Search } from "../ui/search";
import { cn } from "../../lib/utils";
import { useAuth } from "@/lib/auth";
import { Dropdown } from "../ui/dropdown";
import { useLayout } from "@/lib/contexts/layout-context";
import { Button } from "../ui/button";

const companies = [
  { id: 1, name: "Acme Corp" },
  { id: 2, name: "Stark Industries" },
  { id: 3, name: "Wayne Enterprises" },
];

function CompanySelector() {
  return (
    <Dropdown
      trigger={
        <button
          className={cn(
            "h-10 px-4 text-sm rounded",
            "bg-white border border-gray-200",
            "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20",
            "flex items-center gap-3"
          )}
        >
          <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="font-medium text-gray-700">Acme Corp</span>
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </button>
      }
      items={companies.map((company) => ({
        label: company.name,
        onClick: () => console.log("Selected company:", company.name),
        icon: Building2,
      }))}
    />
  );
}

function UserDropdown() {
  const { user, logout } = useAuth();

  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded transition-colors">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900">
              {user?.email || "John Doe"}
            </span>
            <span className="text-xs text-gray-500">Administrator</span>
          </div>

          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>

          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      }
      items={[
        {
          label: "Profile",
          onClick: () => console.log("Profile clicked"),
          icon: User,
        },
        {
          label: "Settings",
          onClick: () => console.log("Settings clicked"),
          icon: Settings,
        },
        {
          label: "Logout",
          onClick: logout,
          icon: LogOut,
        },
      ]}
    />
  );
}

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="h-16 px-8">
        <div className="mx-auto max-w-[1600px] h-full flex items-center justify-between gap-8">
          {/* Left section with menu and search */}
          <div className="flex items-center gap-4 flex-1">
            <div className="w-full max-w-lg">
              <Search />
            </div>
          </div>

          {/* Right section with company selector and user profile */}
          <div className="flex items-center gap-6">
            <CompanySelector />
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
