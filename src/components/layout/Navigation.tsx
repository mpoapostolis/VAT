import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  CalculatorIcon, 
  ChartBarIcon,
  FolderIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/hooks/useAuth';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/', icon: ChartBarIcon },
  { name: 'Invoices', href: '/invoices', icon: DocumentTextIcon },
  { name: 'VAT Returns', href: '/vat-returns', icon: CalculatorIcon },
  { name: 'Categories', href: '/categories', icon: FolderIcon },
  { name: 'Customers', href: '/customers', icon: BuildingOfficeIcon },
];

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <motion.div 
      className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center flex-1 gap-10">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to="/" className="flex items-center gap-2">
                <div className="relative size-8">
                  <motion.div 
                    className="absolute inset-0 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500"
                    animate={{ 
                      rotate: [0, 10, 0],
                      scale: [1, 1.1, 1] 
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  VAT Accounting
                </span>
              </Link>
            </motion.div>

            <nav className="hidden md:flex items-center gap-6">
              <AnimatePresence mode="wait">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        to={item.href}
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline-block">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}