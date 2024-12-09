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
      <div className="h-16 flex items-center px-6 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
        <div
          className={cn(
            "flex items-center gap-3 transition-all duration-300",
            isSidebarCollapsed
              ? "opacity-0 translate-x-4"
              : "opacity-100 translate-x-0"
          )}
        >
          <Calculator className="w-7 h-7 opacity-40 text-primary flex-shrink-0" />
          <span className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text whitespace-nowrap">
            VAT Manager
          </span>
        </div>

        {/* Collapse button */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "absolute -right-4 top-4 p-1.5 rounded-full bg-white border border-gray-200",
            "hover:bg-gray-50 text-gray-500 hover:text-gray-700",
            "transition-all duration-150 shadow-sm hover:shadow",
            "hover:scale-105"
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
                  "transition-all duration-200 ease-out relative",
                  "hover:bg-gradient-to-r hover:from-gray-50 hover:to-white",
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-l-4 border-blue-500  shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                )
              }
            >
              <div className="relative flex items-center">
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    "group-hover:text-primary group-hover:scale-110 flex-shrink-0",
                    ({ isActive }) =>
                      isActive && "text-primary transform scale-110"
                  )}
                />

                {/* Tooltip for collapsed state */}
                {isSidebarCollapsed && (
                  <div
                    className={cn(
                      "absolute left-full ml-2 px-3 py-2",
                      "bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-lg",
                      "opacity-0 group-hover:opacity-100",
                      "transition-all duration-200 ease-out",
                      "pointer-events-none z-50 shadow-xl",
                      "whitespace-nowrap transform scale-95 group-hover:scale-100"
                    )}
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-gray-400 text-[10px] mt-0.5">
                      {item.description}
                    </div>
                  </div>
                )}
              </div>

              {!isSidebarCollapsed && (
                <>
                  <div className="flex-1 flex flex-col min-w-0">
                    <span
                      className={cn(
                        "text-sm font-medium truncate transition-all duration-200",
                        ({ isActive }) =>
                          isActive &&
                          "text-primary font-semibold transform scale-[1.02]"
                      )}
                    >
                      {item.name}
                    </span>
                    <span
                      className={cn(
                        "text-xs transition-all duration-200 truncate",
                        "text-gray-500 group-hover:text-gray-600",
                        ({ isActive }) => isActive && "text-primary/70"
                      )}
                    >
                      {item.description}
                    </span>
                  </div>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 transition-all duration-200",
                      ({ isActive }) =>
                        isActive
                          ? "opacity-100 text-primary transform translate-x-0 scale-110"
                          : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-gray-400"
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
