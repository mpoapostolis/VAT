import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  Eye,
  Download,
  FileEdit,
  Trash2,
  MoreHorizontal,
  MoreVertical,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

interface ActionDropdownProps {
  onView?: () => void;
  onDownload?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export function ActionDropdown({
  onView,
  onDownload,
  onEdit,
  onDelete,
  onDuplicate,
}: ActionDropdownProps) {
  const menuItems = [
    onView && {
      label: "View Details",
      icon: Eye,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        onView();
      },
      color: "text-blue-600 bg-blue-50",
    },
    onDownload && {
      label: "Download",
      icon: Download,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        onDownload();
      },
      color: "text-green-600 bg-green-50",
    },
    onDuplicate && {
      label: "Duplicate",
      icon: DocumentDuplicateIcon,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        onDuplicate();
      },
      color: "text-gray-600 bg-gray-50",
    },
    onEdit && {
      label: "Edit",
      icon: FileEdit,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit();
      },
      color: "text-purple-600 bg-purple-50",
    },
    onDelete && {
      label: "Delete",
      icon: Trash2,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
      },
      color: "text-red-600 bg-red-50",
    },
  ].filter(Boolean);

  return (
    <Menu>
      {({ open }) => (
        <>
          <Menu.Button
            className={cn(
              "flex items-center   justify-center w-8 h-8 transition-all duration-200",
              "text-gray-400 hover:text-gray-600",
              "hover:bg-gray-100",
              open && "bg-gray-100 text-gray-600"
            )}
          >
            <MoreVertical className="h-5 w-5" />
          </Menu.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Menu.Items
              className={cn(
                // Layout
                "absolute right-0 w-48  bg-white  mt-2 origin-top-right ",
                // Visual
                "bg-white shadow-xl border border-gray-100",
                // Spacing
                "py-1",
                // State
                "overflow-hidden"
              )}
            >
              {menuItems.map((item, index) => (
                <Menu.Item key={item.label}>
                  {({ active }) => (
                    <div className="">
                      {active && (
                        <motion.div
                          layoutId="highlight"
                          className="absolute inset-0 bg-gray-50"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                      <motion.button
                        onClick={item.onClick}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={cn(
                          "relative z-10 flex items-center w-full px-3 py-2 text-xs transition-all duration-200 group"
                        )}
                      >
                        <span
                          className={cn(
                            "flex items-center justify-center w-8 h-8 mr-3",
                            item.color
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                        </span>
                        <span className="font-medium text-gray-700 group-hover:text-gray-900">
                          {item.label}
                        </span>
                      </motion.button>
                    </div>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
