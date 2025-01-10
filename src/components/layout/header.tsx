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

function UserDropdown() {
  const { user, logout } = useAuth();

  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-3 hover:bg-[#F8FAFC] px-3 py-2  transition-colors">
          <div className="flex flex-col items-end">
            <span className="text-xs font-medium text-[#0F172A] tracking-tight">
              {user?.email || "John Doe"}
            </span>
            <span className="text-[11px] text-[#64748B] font-medium tracking-wide uppercase">
              Administrator
            </span>
          </div>

          <div className="h-9 w-9  bg-[#F1F5F9] flex items-center justify-center">
            <User className="w-5 h-5 text-[#3B82F6]" />
          </div>
        </button>
      }
      items={[
        {
          label: "Profile",
          onClick: () => console.log("Profile clicked"),
          icon: User,
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
    <header className="border-b border-black/10 bg-white">
      <div className="h-16 px-8">
        <div className="mx-auto max-w-[1600px] h-full flex items-center justify-between gap-8">
          {/* Left section with menu and search */}
          <div className="flex items-center gap-4 flex-1">
            <div className="w-full hidden sm:flex max-w-lg">
              <Search />
            </div>
          </div>

          {/* Right section with user dropdown */}
          <div className="flex items-center gap-4">
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
