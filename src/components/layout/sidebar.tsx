import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useLayout } from "../../lib/contexts/layout-context";
import {
  LayoutDashboard,
  FileText,
  Users,
  FolderTree,
  Building2,
  Calculator,
  FileBarChart,
  Settings,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Overview of your business",
  },
  {
    name: "Invoices",
    href: "/invoices",
    icon: FileText,
    description: "Manage your invoices",
  },
  {
    name: "Customers",
    href: "/customers",
    icon: Users,
    description: "Customer management",
  },
  {
    name: "Categories",
    href: "/categories",
    icon: FolderTree,
    description: "Organize your items",
  },
  {
    name: "Companies",
    href: "/companies",
    icon: Building2,
    description: "Company profiles",
  },
  {
    name: "VAT Return",
    href: "/vat-return",
    icon: Calculator,
    description: "VAT calculations & returns",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileBarChart,
    description: "Business analytics",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "System configuration",
  },
];

export function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar } = useLayout();

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 flex-shrink-0 relative",
        "transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "w-[72px]" : "w-[280px]"
      )}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div
          className={cn(
            "flex items-center gap-3 transition-all duration-300",
            isSidebarCollapsed
              ? "opacity-0 translate-x-4"
              : "opacity-100 translate-x-0"
          )}
        >
          <Calculator className="w-7 h-7 opacity-40 text-primary flex-shrink-0" />
          <span className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 text-black bg-clip-text text-transparent whitespace-nowrap">
            VAT Manager
          </span>
        </div>

        {/* Collapse button - now absolutely positioned */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "absolute -right-4 top-4 p-1.5 rounded-full bg-white border border-gray-200",
            "hover:bg-gray-50 text-gray-500 hover:text-gray-700",
            "transition-colors duration-150 shadow-sm",
            "focus:outline-none focus:ring-2 focus:ring-primary/20"
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
      <nav className="py-4">
        <div
          className={cn("space-y-1 px-3", isSidebarCollapsed ? "px-2" : "px-4")}
        >
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-lg",
                  "transition-all duration-150 ease-in-out relative",
                  "hover:bg-gray-50",
                  isActive
                    ? "bg-primary/10 text-primary hover:bg-primary/15"
                    : "text-gray-600 hover:text-gray-900"
                )
              }
            >
              <div className="relative flex items-center">
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-colors duration-150",
                    "group-hover:text-primary flex-shrink-0"
                  )}
                />

                {/* Tooltip for collapsed state */}
                {isSidebarCollapsed && (
                  <div
                    className={cn(
                      "absolute left-full ml-2 px-2 py-1",
                      "bg-gray-900 text-white text-xs rounded-md",
                      "opacity-0 group-hover:opacity-100",
                      "transition-all duration-150 transform",
                      "pointer-events-none z-50 shadow-lg",
                      "whitespace-nowrap"
                    )}
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-gray-400 text-[10px]">
                      {item.description}
                    </div>
                  </div>
                )}
              </div>

              {!isSidebarCollapsed && (
                <>
                  <div className="flex-1 flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">
                      {item.name}
                    </span>
                    <span
                      className={cn(
                        "text-xs transition-colors duration-150 truncate",
                        "text-gray-500 group-hover:text-gray-600"
                      )}
                    >
                      {item.description}
                    </span>
                  </div>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 opacity-0 -translate-x-2",
                      "transition-all duration-150 ease-in-out",
                      "group-hover:opacity-100 group-hover:translate-x-0",
                      "text-gray-400"
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}
