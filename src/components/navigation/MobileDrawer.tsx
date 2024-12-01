import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  HomeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  FolderIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface MobileDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Invoices", href: "/invoices", icon: DocumentTextIcon },
  { name: "Customers", href: "/customers", icon: UserGroupIcon },
  { name: "Categories", href: "/categories", icon: FolderIcon },
  { name: "Reports", href: "/reports", icon: ChartBarIcon },
];

export default function MobileDrawer({ isOpen, setIsOpen }: MobileDrawerProps) {
  const location = useLocation();

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-xs">
                  <div className="flex h-full flex-col overflow-y-auto bg-white dark:bg-gray-900 py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                          Navigation
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                            onClick={() => setIsOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                          <li>
                            <ul role="list" className="-mx-2 space-y-1">
                              {navigation.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                  <li key={item.name}>
                                    <Link
                                      to={item.href}
                                      onClick={() => setIsOpen(false)}
                                      className={`
                                        group flex gap-x-3 rounded-md p-2 text-sm leading-6
                                        ${
                                          isActive
                                            ? "bg-gray-100 dark:bg-gray-800 text-violet-600 dark:text-violet-400"
                                            : "text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        }
                                      `}
                                    >
                                      <motion.div
                                        initial={{ scale: 1 }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        <item.icon
                                          className={`h-6 w-6 shrink-0 ${
                                            isActive
                                              ? "text-violet-600 dark:text-violet-400"
                                              : "text-gray-400 dark:text-gray-500 group-hover:text-violet-600 dark:group-hover:text-violet-400"
                                          }`}
                                          aria-hidden="true"
                                        />
                                      </motion.div>
                                      {item.name}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
