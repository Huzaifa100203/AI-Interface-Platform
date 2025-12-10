"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Modal } from "@/components/ui/Modal";
import { User, Mail, LogOut, Loader2 } from "lucide-react";
import { useState } from "react";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileModal({ open, onClose }: ProfileModalProps) {
  const { user, logout } = useAuth();
  const { showSuccess } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      logout();
      showSuccess("Successfully logged out");
      setIsLoggingOut(false);
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Profile"
      size="md"
      blurOverlay={false}
    >
      <div className="p-6">
        {user && (
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.username || "User"}
                  className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-700 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center border-4 border-gray-200 dark:border-gray-700">
                  <User className="h-12 w-12 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="space-y-4">
              {user.username && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Username
                  </label>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-100">
                      {user.username}
                    </span>
                  </div>
                </div>
              )}

              {user.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Email
                  </label>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-100">
                      {user.email}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

