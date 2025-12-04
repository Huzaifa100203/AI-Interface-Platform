"use client";

import { useState } from "react";
import { MessageSquare, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatTimestamp } from "@/lib/utils";
import AlertDialog from "@/components/ui/AlertDialog";

export const ChatSidebar = () => {
   const [isOpen, setIsOpen] = useState(true);
   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
   const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
   const { sessions, currentSessionId, createSession, deleteSession, setCurrentSession } = useApp();

   return (
      <>
         {/* Toggle button */}
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-gray-200 dark:bg-gray-700 rounded-r-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
         >
            {isOpen ? <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />}
         </button>

         {/* Sidebar */}
         <div className={`${isOpen ? "w-64" : "w-0"} transition-all duration-300 overflow-hidden bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
            {/* New Chat Button */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
               <button onClick={createSession} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Plus className="h-4 w-4" />
                  New Chat
               </button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
               {sessions.map((session) => (
                  <div
                     key={session.id}
                     className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                        currentSessionId === session.id ? "bg-blue-500 text-white" : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                     }`}
                     onClick={() => setCurrentSession(session.id)}
                  >
                     <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                           <div className="text-sm font-medium truncate">{session.title}</div>
                           <div className={`text-xs mt-1 ${currentSessionId === session.id ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>
                              {formatTimestamp(session.createdAt)} • {session.messages.length} msgs
                           </div>
                        </div>
                     </div>

                     {/* Delete button */}
                     <button
                        onClick={(e) => {
                           e.stopPropagation();
                           setSessionToDelete(session.id);
                           setDeleteDialogOpen(true);
                        }}
                        className={`absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                           currentSessionId === session.id ? "hover:bg-white/20" : "hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                     >
                        <Trash2 className="h-3.5 w-3.5" />
                     </button>
                  </div>
               ))}
            </div>
         </div>

         <AlertDialog
            open={deleteDialogOpen}
            showCancelBtn={true}
            showConfirmBtn={true}
            cancel={() => {
               setDeleteDialogOpen(false);
               setSessionToDelete(null);
            }}
            confirm={() => {
               if (sessionToDelete) {
                  deleteSession(sessionToDelete);
               }
               setDeleteDialogOpen(false);
               setSessionToDelete(null);
            }}
            Component={
               <div className="">
                  <h3 className="text-lg text-left font-semibold text-gray-900 dark:text-gray-100 mb-2">Delete Chat</h3>
                  <p className="text-gray-600 dark:text-gray-400">Are you sure you want to delete this chat? This action cannot be undone.</p>
               </div>
            }
         />
      </>
   );
};
