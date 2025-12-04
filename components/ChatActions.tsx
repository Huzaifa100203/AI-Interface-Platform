"use client";

import { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { exportChatAsJSON, exportChatAsMarkdown } from "@/lib/utils";
import AlertDialog from "@/components/ui/AlertDialog";

export const ChatActions = () => {
   const [clearDialogOpen, setClearDialogOpen] = useState(false);
   const { messages, clearMessages, currentSessionId } = useApp();

   if (messages.length === 0) return null;

   const handleExportJSON = () => {
      exportChatAsJSON(messages, currentSessionId || "chat");
   };

   const handleExportMarkdown = () => {
      exportChatAsMarkdown(messages, currentSessionId || "chat");
   };

   const handleClear = () => {
      setClearDialogOpen(true);
   };

   return (
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
         <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
         >
            <Download className="h-4 w-4" />
            Export JSON
         </button>
         <button
            onClick={handleExportMarkdown}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
         >
            <Download className="h-4 w-4" />
            Export MD
         </button>
         <button
            onClick={handleClear}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 rounded-lg border border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-auto"
         >
            <Trash2 className="h-4 w-4" />
            Clear Chat
         </button>

         <AlertDialog
            open={clearDialogOpen}
            showCancelBtn={true}
            showConfirmBtn={true}
            cancel={() => setClearDialogOpen(false)}
            confirm={() => {
               clearMessages();
               setClearDialogOpen(false);
            }}
            Component={
               <div className="">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Clear All Messages</h3>
                  <p className="text-gray-600 dark:text-gray-400">Are you sure you want to clear all messages? This action cannot be undone.</p>
               </div>
            }
         />
      </div>
   );
};
