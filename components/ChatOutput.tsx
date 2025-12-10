"use client";

import { Copy, Edit3, Check } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { copyToClipboard, formatMessageTime } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export const ChatOutput = () => {
   const { messages, startEditingMessage, sessions, currentSessionId } = useApp();
   const { user } = useAuth();
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

   const currentSession = sessions.find((s) => s.id === currentSessionId);
   const showGreeting = currentSession && messages.length === 0 && (currentSession.greetingShown === false || currentSession.greetingShown === undefined);
   const userName = user?.username || "there";

   const handleCopy = async (id: string, text: string) => {
      const ok = await copyToClipboard(text);
      if (!ok) return;
      setCopiedMessageId(id);
      setTimeout(() => {
         setCopiedMessageId((current) => (current === id ? null : current));
      }, 1500);
   };

   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);

   if (messages.length === 0 && !showGreeting) {
      return (
         <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
               <h2 className="text-xl font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Welcome to AI Interface Platform
               </h2>
               <p className="text-gray-600 dark:text-gray-400">
                  Start a conversation by typing a message below
               </p>
            </div>
         </div>
      );
   }

   return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
         {/* Greeting Message - shown on new session, hidden after first message */}
         {showGreeting && (
            <div className="flex justify-start">
               <div className="max-w-3xl rounded-2xl px-4 py-3 shadow-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  <p className="text-sm whitespace-pre-wrap">
                     Hello, {userName}! 👋 Welcome to the AI Interface Platform. How can I assist you today?
                  </p>
               </div>
            </div>
         )}
         
         {messages.map((message) => {
            const isUser = message.role === "user";
            return (
               <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
               >
                  <div
                     className={`max-w-3xl rounded-2xl px-4 py-3 shadow-sm ${
                        isUser
                           ? "bg-blue-500 text-white"
                           : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                     }`}
                  >
                     <p className="text-sm whitespace-pre-wrap text-inherit">
                        {message.content}
                     </p>
                     <div
                        className={`mt-3 flex flex-wrap items-center justify-between gap-2 text-xs ${
                           isUser ? "text-white/80" : "text-gray-500 dark:text-gray-400"
                        }`}
                     >
                        <span>{formatMessageTime(message.timestamp)}</span>
                        <div className="flex items-center gap-2">
                           <button
                              onClick={() => handleCopy(message.id, message.content)}
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 transition ${
                                 isUser
                                    ? "border-white/30 hover:bg-white/10"
                                    : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                           >
                              {copiedMessageId === message.id ? (
                                 <>
                                    <Check className="h-3.5 w-3.5" />
                                    Copied
                                 </>
                              ) : (
                                 <>
                                    <Copy className="h-3.5 w-3.5" />
                                    Copy
                                 </>
                              )}
                           </button>
                           {isUser ? (
                              <button
                                 onClick={() => startEditingMessage(message.id)}
                                 className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 transition ${
                                    isUser
                                       ? "border-white/30 hover:bg-white/10"
                                       : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                 }`}
                              >
                                 <Edit3 className="h-3.5 w-3.5" />
                                 Edit
                              </button>
                           ) : null}
                        </div>
                     </div>
                  </div>
               </div>
            );
         })}
         <div ref={messagesEndRef} />
      </div>
   );
};
