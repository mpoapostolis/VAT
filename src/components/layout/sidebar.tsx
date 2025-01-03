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
        "border-r border-black/10 bg-white",
        "transition-all duration-300 ease-in-out",
        "h-screen sticky top-0",
        "flex flex-col",
        isMobile ? "w-20" : isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo Section */}
      <div className="h-[65px] border-b border-black/10 flex items-center justify-between px-4">
        <div
          className={cn(
            "flex items-center gap-3",
            (isMobile || isCollapsed) && "justify-center"
          )}
        >
          <div className="rounded bg-[#F1F5F9]">
            <Calculator className="w-5 h-5 text-[#3B82F6]" />
          </div>
          {!isMobile && !isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-[#0F172A] tracking-tight">
                VAT Manager
              </span>
              <span className="text-[11px] text-[#64748B] font-medium tracking-wide uppercase">
                Business Edition
              </span>
            </div>
          )}
        </div>
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded hover:bg-black/[0.02] text-black/40 hover:text-black/70"
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
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const NavItem = (
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors",
                    {
                      "bg-[#F1F5F9] text-[#0F172A]": isActive,
                    }
                  )
                }
              >
                <item.icon className="w-5 h-5 text-black/70 flex-shrink-0" />
                {!isMobile && !isCollapsed && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-[#64748B]">
                      {item.description}
                    </span>
                  </div>
                )}
              </NavLink>
            );

            return (
              <li key={item.href}>
                {isMobile || isCollapsed ? (
                  <Tooltip
                    content={
                      <div className="flex flex-col gap-1 min-w-[180px]">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-xs opacity-60">
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
