import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Mail, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Dropdown } from './ui/dropdown';
import { Search } from './ui/search';

const navItems = [
  { name: 'Dashboard', href: '/' },
  { name: 'Invoices', href: '/invoices' },
  { name: 'Customers', href: '/customers' },
  { name: 'Categories', href: '/categories' },
  { name: 'VAT Return', href: '/vat-return' },
  { name: 'Settings', href: '/settings' },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActiveTab = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50">
        <div className="bg-[#0066FF]">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between py-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="text-white text-2xl font-bold">
                  <span className="text-3xl">C</span> CashFlow
                </div>
              </Link>

              <div className="flex items-center space-x-6">
                <Search />
                <button className="relative p-2 text-white/70 hover:text-white">
                  <Mail className="h-5 w-5" />
                </button>
                <button className="relative p-2 text-white/70 hover:text-white">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <Dropdown
                  trigger={
                    <button className="flex items-center space-x-2 text-white">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Profile"
                        className="h-8 w-8 border-2 border-white/20"
                      />
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  }
                  items={[
                    { label: 'Profile', onClick: () => {} },
                    { label: 'Settings', onClick: () => navigate('/settings') },
                    { label: 'Sign out', onClick: handleLogout },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0066FF]">
          <div className="container mx-auto px-6">
            <nav className="flex">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`py-4 px-6 text-sm font-medium transition-colors ${
                    isActiveTab(item.href)
                      ? 'bg-white text-[#0066FF]'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}