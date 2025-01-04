import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { Tooltip } from "../ui/tooltip";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Settings,
  Calculator,
  FolderOpen,
  Receipt,
} from "lucide-react";

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
    description: "Manage Your Companies",
  },
  {
    name: "Invoices",
    href: "/invoices",
    icon: Receipt,
    description: "Invoice Processing",
  },
  {
    name: "Categories",
    href: "/categories",
    icon: FolderOpen,
    description: "Income & Expense Categories",
  },
  {
    name: "Customers",
    href: "/customers",
    icon: Users,
    description: "Customer Management",
  },
  {
    name: "VAT Return",
    href: "/vat-return",
    icon: Calculator,
    description: "VAT Return Processing",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "System Configuration",
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside
      className={cn(
        // Base styles
        "bg-white border-r border-black/5",
        "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "h-screen sticky top-0",
        "flex flex-col",
        // Dynamic width
        isMobile ? "w-20" : isCollapsed ? "w-20" : "w-72"
        // Premium shadow
      )}
    >
      {/* Logo Section */}
      <div className="h-[65px] border-b border-black/5 flex items-center justify-between px-5">
        <div
          className={cn(
            "flex items-center gap-3",
            (isMobile || isCollapsed) && "justify-center w-full"
          )}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-600/10 blur-lg rounded-full"></div>
            <div className="relative bg-gradient-to-br from-indigo-50 to-white rounded p-2 shadow-sm">
              <Calculator className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          {!isMobile && !isCollapsed && (
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-gray-900 tracking-tight">
                VAT Manager
              </span>
              <span className="text-[11px] text-gray-500 font-medium tracking-wide uppercase">
                Business Edition
              </span>
            </div>
          )}
        </div>
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn("hover:bg-gray-50 text-gray-400 hover:text-gray-600")}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-1.5">
          {navigation.map((item) => {
            const NavItem = (
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    // Base styles
                    "flex items-center gap-3 px-4 py-2.5 rounded",
                    "transition-all duration-200 ease-out",
                    // Text styles
                    "text-gray-500 hover:text-gray-900",
                    // Background styles
                    "hover:bg-gray-50/80",
                    // Active styles
                    isActive && [
                      "bg-indigo-50/50 text-indigo-600",
                      "hover:bg-indigo-50/70 hover:text-indigo-700",
                      "shadow-[0_1px_3px_rgba(0,0,0,0.02)]",
                    ],
                    // Focus styles
                    "focus:outline-none focus:ring-2 focus:ring-indigo-600/10"
                  )
                }
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    "transition-colors duration-200",
                    "text-gray-400 group-hover:text-gray-600"
                  )}
                />
                {!isMobile && !isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-400 truncate">
                      {item.description}
                    </span>
                  </div>
                )}
              </NavLink>
            );

            return (
              <li key={item.href} className="group">
                {isMobile || isCollapsed ? (
                  <Tooltip
                    content={
                      <div className="flex flex-col gap-1 min-w-[200px] p-1">
                        <span className="text-sm font-medium text-gray-900">
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.description}
                        </span>
                      </div>
                    }
                  >
                    {NavItem}
                  </Tooltip>
                ) : (
                  NavItem
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
