import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { cn } from "@/lib/utils";

interface DropdownProps {
  trigger: React.ReactNode;
  items: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  width?: "auto" | "trigger" | number;
  direction?: "up" | "down";
}

export function Dropdown({
  trigger,
  items,
  width = "auto",
  direction = "down",
}: DropdownProps) {
  return (
    <Menu as="div" className="relative w-full">
      <div className="w-full">
        <Menu.Button as={Fragment}>{trigger}</Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            "absolute z-50",
            "bg-white rounded shadow-lg",
            "border border-gray-200",
            "focus:outline-none",
            "min-w-[200px]",
            direction === "up" ? "bottom-full mb-2" : "top-full mt-2",
            "left-0",
            width === "trigger"
              ? "w-full"
              : width === "auto"
              ? ""
              : `w-[${width}px]`
          )}
          style={{
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
          }}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    onClick={item.onClick}
                    className={cn(
                      "flex w-full items-center px-4 py-2.5",
                      "text-xs transition-colors duration-150",
                      "hover:bg-gray-50/80",
                      active ? "bg-gray-50/80 text-gray-900" : "text-gray-700"
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "mr-3 h-5 w-5",
                          active ? "text-primary" : "text-gray-400"
                        )}
                      />
                    )}
                    <span className="font-medium">{item.label}</span>
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
