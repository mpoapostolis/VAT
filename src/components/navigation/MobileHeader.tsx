import { Bars3Icon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface MobileHeaderProps {
  openDrawer: () => void;
  title: string;
}

export default function MobileHeader({ openDrawer, title }: MobileHeaderProps) {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={openDrawer}
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </motion.button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h1>
          </div>
          <div className="w-6" /> {/* Spacer for alignment */}
        </div>
      </div>
    </div>
  );
}
