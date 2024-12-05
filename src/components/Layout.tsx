import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { ChevronDown, Menu } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Dropdown } from "@/components/ui/dropdown";
import { Search } from "@/components/ui/search";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/" },
  { name: "Invoices", href: "/invoices" },
  { name: "Customers", href: "/customers" },
  { name: "Categories", href: "/categories" },
  { name: "VAT Return", href: "/vat-return" },
  { name: "Settings", href: "/settings" },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActiveTab = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="sticky top-0 z-50">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex h-16 items-center justify-between px-4 sm:px-8">
              <div className="flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 -ml-2 mr-2 rounded-lg hover:bg-gray-100 lg:hidden"
                >
                  <Menu className="h-5 w-5 text-gray-500" />
                </button>
                <Link to="/" className="flex items-center space-x-2">
                  <div className="text-gray-900 font-bold tracking-tight whitespace-nowrap">
                    <span className="text-[#0066FF]">C</span> CashFlow
                  </div>
                </Link>
              </div>

              <div className="flex items-center space-x-4 sm:space-x-6">
                <div className="hidden sm:block">
                  <Search />
                </div>

                <Dropdown
                  trigger={
                    <button className="flex items-center space-x-3 hover:bg-gray-50 rounded-xl py-2 px-3 transition-colors">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Profile"
                        className="h-8 w-8 rounded-full ring-2 ring-white"
                      />
                      <div className="hidden sm:flex items-center">
                        <span className="text-sm font-medium text-gray-700">
                          John Doe
                        </span>
                        <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
                      </div>
                    </button>
                  }
                  items={[
                    { label: "Profile", onClick: () => {} },
                    { label: "Settings", onClick: () => navigate("/settings") },
                    { label: "Sign out", onClick: handleLogout },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto">
            {/* Mobile Search */}
            <div className="sm:hidden px-4 py-3 border-b border-gray-200">
              <Search />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex px-8 overflow-x-auto">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`py-4 px-5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    isActiveTab(item.href)
                      ? "border-[#0066FF] text-[#0066FF]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Navigation */}
            <nav className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-3 px-4 text-sm font-medium border-l-4 transition-colors ${
                    isActiveTab(item.href)
                      ? "border-[#0066FF] text-[#0066FF] bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
