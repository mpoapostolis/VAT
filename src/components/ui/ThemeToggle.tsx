import React from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";
import { ActionButton } from "./ActionButton";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <ActionButton
      variant="secondary"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative !p-2 !bg-transparent"
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === "light" ? 0 : 180,
          scale: [1, 0.9, 0.9, 1],
        }}
        transition={{ duration: 0.3, times: [0, 0.3, 0.6, 1] }}
        className="absolute"
      >
        <SunIcon className="h-5 w-5" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === "dark" ? 0 : -180,
          scale: theme === "dark" ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <MoonIcon className="h-5 w-5" />
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </ActionButton>
  );
}
