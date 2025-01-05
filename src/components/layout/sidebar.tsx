import { NavLink, useLocation } from "react-router-dom";
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
  Euro,
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
    name: "Receivables",
    href: "/receivables",
    icon: Euro,
    description: "Receivable Invoices",
  },
  {
    name: "Payables",
    href: "/payables",
    icon: Receipt,
    description: "Payable Invoices",
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

  const pathname = useLocation().pathname;
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
        "bg-white border-r border-black/5 shadow-[1px_0_5px_rgba(0,0,0,0.02)]",
        "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "h-screen sticky top-0",
        "flex flex-col",
        // Dynamic width
        isMobile ? "w-20" : isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo Section */}
      <div className="h-[65px] border-b border-black/10 flex items-center justify-between px-6">
        <div
          className={cn(
            "flex items-center gap-3.5",
            (isMobile || isCollapsed) && "justify-center w-full"
          )}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-violet-500/20 blur-xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-blue-50 via-white to-violet-50 rounded p-2.5  ring-black/[0.03]">
              <Calculator className="w-[22px] h-[22px] text-blue-600" />
            </div>
          </div>
          {!isMobile && !isCollapsed && (
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 tracking-tight">
                VAT Manager
              </span>
              <span className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">
                Business Edition
              </span>
            </div>
          )}
        </div>
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "hover:bg-gray-50/80 text-gray-400 hover:text-gray-600",
              "h-7 w-7 rounded flex items-center justify-center",
              "transition-colors ml-1 duration-200"
            )}
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
                    "flex items-center gap-3.5 px-4 py-2.5 rounded",
                    "transition-all duration-200 ease-out group",
                    // Text styles
                    "text-gray-500 hover:text-gray-900",
                    // Background styles
                    "hover:bg-gray-50/80",
                    // Active styles
                    isActive && [
                      "bg-gradient-to-r from-blue-50/50 to-violet-50/50 text-blue-600",
                      "hover:from-blue-50/70 hover:to-violet-50/70 hover:text-blue-600",
                      "ring-1 ring-blue-100/30",
                    ]
                  )
                }
              >
                <item.icon
                  className={cn(
                    "w-[18px] h-[18px] flex-shrink-0",
                    "transition-colors duration-200",
                    "text-gray-400 group-hover:text-gray-500",
                    { "text-blue-500": pathname === item.href }
                  )}
                />
                {!isMobile && !isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium truncate">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium truncate">
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
                      <div className="flex flex-col gap-1 min-w-[200px] p-2 rounded bg-gradient-to-r from-blue-50/50 to-violet-50/50">
                        <span className="text-xs font-medium text-gray-900">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-gray-500 font-medium">
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
