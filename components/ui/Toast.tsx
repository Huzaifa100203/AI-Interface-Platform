"use client";

import { useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: {
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-800 dark:text-green-200",
    icon: "text-green-600 dark:text-green-400",
  },
  error: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-800 dark:text-red-200",
    icon: "text-red-600 dark:text-red-400",
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-800 dark:text-blue-200",
    icon: "text-blue-600 dark:text-blue-400",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-800 dark:text-amber-200",
    icon: "text-amber-600 dark:text-amber-400",
  },
};

export function ToastComponent({ toast, onClose }: ToastProps) {
  const Icon = icons[toast.type];
  const color = colors[toast.type];
  const duration = toast.duration || 5000;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, toast.id, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`min-w-[300px] max-w-md rounded-lg border ${color.border} ${color.bg} shadow-lg p-4 flex items-start gap-3`}
    >
      <Icon className={`h-5 w-5 ${color.icon} shrink-0 mt-0.5`} />
      <p className={`flex-1 text-sm font-medium ${color.text}`}>{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className={`shrink-0 ${color.icon} hover:opacity-70 transition-opacity`}
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

