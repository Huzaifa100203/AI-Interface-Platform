"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  try {

    if (!theme) return null;

    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {theme}
        </span>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-red-500 hover:bg-gray-200 dark:hover:bg-red-600 transition-colors"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
          {theme === "light" ? (
            <Moon className="h-5 w-5 text-gray-600 dark:text-white" />
          ) : (
            <Sun className="h-5 w-5 text-yellow-500 dark:text-white" />
          )}
        </button>
      </div>
    );
  } catch (error) {
    console.error("Error in ThemeToggle:", error);
  }
};
