import React, { Fragment } from "react";
import { createPortal } from "react-dom";
import { Menu, Transition } from "@headlessui/react";
import { Eye, Download, FileEdit, Trash2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DropdownProps {
  trigger: React.ReactNode;
  items: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

interface ActionDropdownProps {
  onView?: () => void;
  onDownload?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ActionDropdown({
  onView,
  onDownload,
  onEdit,
  onDelete,
}: ActionDropdownProps) {
  const [menuPosition, setMenuPosition] = React.useState({ top: 0, left: 0 });
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right - 192, // 192px is the width of the menu (w-48)
      });
    }
  };

  const menuItems = [
    onView && {
      label: "View Details",
      icon: Eye,
      onClick: onView,
      color: "text-blue-600 bg-blue-50",
      hoverColor: "hover:bg-blue-50",
    },
    onDownload && {
      label: "Download",
      icon: Download,
      onClick: onDownload,
      color: "text-green-600 bg-green-50",
      hoverColor: "hover:bg-green-50",
    },
    onEdit && {
      label: "Edit",
      icon: FileEdit,
      onClick: onEdit,
      color: "text-purple-600 bg-purple-50",
      hoverColor: "hover:bg-purple-50",
    },
    onDelete && {
      label: "Delete",
      icon: Trash2,
      onClick: onDelete,
      color: "text-red-600 bg-red-50",
      hoverColor: "hover:bg-red-50",
    },
  ].filter(Boolean);

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button
            ref={buttonRef}
            onClick={updatePosition}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200",
              "text-gray-400 hover:text-gray-600",
              "hover:bg-gray-100",
              open && "bg-gray-100 text-gray-600"
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
          </Menu.Button>

          {createPortal(
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
                static
                style={{
                  position: "absolute",
                  top: menuPosition.top,
                  left: menuPosition.left,
                }}
                className="fixed w-48 bg-white rounded shadow-xl border border-gray-100 py-1 z-50 overflow-hidden"
              >
                {menuItems.map((item, index) => (
                  <Menu.Item key={item.label}>
                    {({ active }) => (
                      <div className="relative">
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
                            "relative z-10 flex items-center w-full px-3 py-2 text-xs transition-all duration-200",
                            "group"
                          )}
                        >
                          <span
                            className={cn(
                              "flex items-center justify-center w-8 h-8 rounded-full mr-3",
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
            </Transition>,
            document.body
          )}
        </>
      )}
    </Menu>
  );
}
