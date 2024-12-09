import { NavLink } from "react-router-dom";
import { useState } from "react";
import { cn } from "../../lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Calculator,
  FolderKanban,
  Building2,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import { Dropdown } from "../ui/dropdown";
import { useAuth } from "@/lib/auth";

const companies = [
  { id: 1, name: "Acme Corp" },
  { id: 2, name: "Stark Industries" },
  { id: 3, name: "Wayne Enterprises" },
];

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Analytics & Overview",
  },
  {
    name: "Companies",
    href: "/companies",
    icon: Users,
    description: "Company Management",
  },
  {
    name: "Invoices",
    href: "/invoices",
    icon: FileText,
    description: "Invoice Processing",
  },
  {
    name: "Categories",
    href: "/categories",
    icon: FolderKanban,
    description: "Data Classification",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "System Configuration",
  },
];

function CompanySelector() {
  return (
    <div className="relative w-full">
      <Dropdown
        direction="up"
        trigger={
          <button
            className={cn(
              "w-full px-4 py-2.5 text-sm rounded-lg",
              "bg-white border border-gray-200",
              "hover:bg-gray-50/80",
              "flex items-center gap-3",
              "transition-all duration-200",
              "shadow-sm"
            )}
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span className="font-medium text-gray-900 truncate w-full">
                Acme Corp
              </span>
              <span className="text-xs text-gray-500">Switch Company</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </button>
        }
        items={companies.map((company) => ({
          label: company.name,
          onClick: () => console.log("Selected company:", company.name),
          icon: Building2,
        }))}
      />
    </div>
  );
}

function UserProfile() {
  const { user, logout } = useAuth();

  return (
    <div className="relative w-full">
      <Dropdown
        direction="up"
        trigger={
          <button
            className={cn(
              "w-full px-4 py-2.5 text-sm rounded-lg",
              "bg-white border border-gray-200",
              "hover:bg-gray-50/80",
              "flex items-center gap-3",
              "transition-all duration-200",
              "shadow-sm"
            )}
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span className="font-medium text-gray-900 truncate w-full">
                {user?.email || "John Doe"}
              </span>
              <span className="text-xs text-gray-500">Administrator</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
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
    </div>
  );
}

export function Sidebar() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200/80 flex-shrink-0",
        "transition-all duration-300 ease-in-out",
        "h-screen sticky top-0",
        "flex flex-col",
        isSidebarCollapsed ? "w-[80px]" : "w-[250px]",
        // Make sure sidebar is always visible on mobile
        "md:translate-x-0",
        isSidebarCollapsed ? "-translate-x-full" : "translate-x-0"
      )}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200/80">
        <div
          className={cn(
            "flex items-center gap-3",
            "transition-all duration-300",
            isSidebarCollapsed ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="w-10 h-10 bg-gray-900/[0.03] rounded-xl flex items-center justify-center shadow-sm">
            <Calculator className="w-5 h-5 text-gray-700" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-900">
              VAT Manager
            </span>
            <span className="text-xs text-gray-500">Government Portal</span>
          </div>
        </div>

        {/* Collapse Button - Only show on desktop */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "absolute -right-3 top-1/2 -translate-y-1/2",
            "p-1.5 rounded-full bg-white",
            "border border-gray-200/80 shadow-sm",
            "hover:bg-gray-50/80 text-gray-400 hover:text-gray-600",
            "transition-all duration-200",
            "z-50",
            "hidden md:block" // Hide on mobile
          )}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl",
                  "transition-all duration-200",
                  isActive
                    ? "bg-gray-900/[0.03] text-gray-900"
                    : "text-gray-600 hover:text-gray-900",
                  "hover:bg-gray-900/[0.02]"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center justify-center w-8 h-8">
                    <item.icon
                      className={cn(
                        "w-5 h-5 transition-all duration-200",
                        isActive
                          ? "text-gray-900"
                          : "text-gray-400 group-hover:text-gray-600"
                      )}
                    />
                  </div>

                  {!isSidebarCollapsed && (
                    <div className="flex-1  flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">
                        {item.name}
                      </span>
                      <span className="text-xs text-gray-400 truncate">
                        {item.description}
                      </span>
                    </div>
                  )}

                  {isSidebarCollapsed && (
                    <div
                      className={cn(
                        "absolute left-full ml-2 px-3 py-2",
                        "bg-white border border-gray-200/80 shadow-sm",
                        "rounded-lg",
                        "opacity-0 group-hover:opacity-100 pointer-events-none",
                        "transition-all duration-200",
                        "z-[10000]  min-w-[200px]"
                      )}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-gray-900">
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.description}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-gray-200/80">
        {/* Company Selector */}
        <div className="px-4 py-3 border-b border-gray-200/80">
          {isSidebarCollapsed ? (
            <Dropdown
              direction="up"
              trigger={
                <button className="w-10 h-10 rounded-xl bg-gray-900/[0.03] flex items-center justify-center hover:bg-gray-900/[0.05] transition-colors duration-200">
                  <Building2 className="w-5 h-5 text-gray-700" />
                </button>
              }
              items={companies.map((company) => ({
                label: company.name,
                onClick: () => console.log("Selected company:", company.name),
                icon: Building2,
              }))}
            />
          ) : (
            <CompanySelector />
          )}
        </div>

        {/* User Profile */}
        <div className="px-4 py-3">
          {isSidebarCollapsed ? (
            <Dropdown
              direction="up"
              trigger={
                <button className="w-10 h-10 rounded-xl bg-gray-900/[0.03] flex items-center justify-center hover:bg-gray-900/[0.05] transition-colors duration-200">
                  <User className="w-5 h-5 text-gray-700" />
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
                  onClick: () => console.log("Logout clicked"),
                  icon: LogOut,
                },
              ]}
            />
          ) : (
            <UserProfile />
          )}
        </div>
      </div>
    </aside>
  );
}
