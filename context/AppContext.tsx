"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface Message {
   id: string;
   role: "user" | "assistant";
   content: string;
   timestamp: number;
}

export interface ChatSession {
   id: string;
   title: string;
   messages: Message[];
   createdAt: number;
   model: string;
}
export interface ModelConfig {
   id: string;
   name: string;
   description: string;
   // parameters : {
   //     temperature : number,
   //     max_tokens : number,
   //     top_p : number,
   //     frequency_penalty : number,
   //     presence_penalty : number
   // }
   contextWindow: string;
   speed: "fast" | "medium" | "slow";
}

export interface Parameters {
   temperature: number;
   maxTokens: number;
   topP: number;
   frequencyPenalty: number;
}

const generateMessageId = () => `msg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

interface AppContextType {
   // Chat Sessions
   sessions: ChatSession[];
   currentSessionId: string | null;
   createSession: () => void;
   deleteSession: (id: string) => void;
   setCurrentSession: (id: string) => void;

   // Messages
   messages: Message[];
   addMessage: (message: Omit<Message, "id" | "timestamp">) => string;
   clearMessages: () => void;

   // Models
   selectedModel: string;
   setSelectedModel: (model: string) => void;

   // Parameters
   parameters: Parameters;
   updateParameters: (params: Partial<Parameters>) => void;

   // Editing
   editingState: { id: string; content: string } | null;
   startEditingMessage: (id: string) => void;
   cancelEditingMessage: () => void;
   updateMessageContent: (id: string, content: string) => void;
   upsertAssistantResponse: (afterMessageId: string, content: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
   const defaultModel = "gpt-4";
   const initialSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: "New Chat 1",
      messages: [],
      createdAt: Date.now(),
      model: defaultModel,
   };
   const [sessions, setSessions] = useState<ChatSession[]>([initialSession]);
   const [currentSessionId, setCurrentSessionId] = useState<string | null>(initialSession.id);
   const [selectedModel, setSelectedModel] = useState("gpt-4");
   const [parameters, setParameters] = useState<Parameters>({
      temperature: 0.7,
      maxTokens: 2048,
      topP: 1.0,
      frequencyPenalty: 0.0,
   });
   const [editingState, setEditingState] = useState<{
      id: string;
      content: string;
   } | null>(null);

   const currentSession = sessions.find((s) => s.id === currentSessionId);
   const messages = currentSession?.messages || [];

   const createSession = () => {
      const newSession: ChatSession = {
         id: `session-${Date.now()}`,
         title: `New Chat ${sessions.length + 1}`,
         messages: [],
         createdAt: Date.now(),
         model: selectedModel,
      };
      setSessions((prev) => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
   };

   const deleteSession = (id: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (currentSessionId === id) {
         setCurrentSessionId(sessions[0]?.id || null);
      }
   };

   const setCurrentSession = (id: string) => {
      setCurrentSessionId(id);
   };

   const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
      const newMessage: Message = {
         ...message,
         id: generateMessageId(),
         timestamp: Date.now(),
      };

      setSessions((prev) => prev.map((session) => (session.id === currentSessionId ? { ...session, messages: [...session.messages, newMessage] } : session)));
      return newMessage.id;
   };

   const clearMessages = () => {
      setSessions((prev) => prev.map((session) => (session.id === currentSessionId ? { ...session, messages: [] } : session)));
   };

   const updateMessageContent = (id: string, content: string) => {
      setSessions((prev) =>
         prev.map((session) =>
            session.id === currentSessionId
               ? {
                    ...session,
                    messages: session.messages.map((message) => (message.id === id ? { ...message, content, timestamp: Date.now() } : message)),
                 }
               : session
         )
      );
      setEditingState(null);
   };

   const startEditingMessage = (id: string) => {
      const message = messages.find((msg) => msg.id === id && msg.role === "user");
      if (!message) return;
      setEditingState({ id: message.id, content: message.content });
   };

   const cancelEditingMessage = () => {
      setEditingState(null);
   };

   const upsertAssistantResponse = (afterMessageId: string, content: string): boolean => {
      let updated = false;
      setSessions((prev) =>
         prev.map((session) => {
            if (session.id !== currentSessionId) return session;
            const messages = [...session.messages];
            const userIndex = messages.findIndex((msg) => msg.id === afterMessageId);
            if (userIndex === -1) {
               return session;
            }

            const assistantRelativeIndex = messages.slice(userIndex + 1).findIndex((msg) => msg.role === "assistant");

            if (assistantRelativeIndex === -1) {
               const newMessage: Message = {
                  id: generateMessageId(),
                  role: "assistant",
                  content,
                  timestamp: Date.now(),
               };
               messages.splice(userIndex + 1, 0, newMessage);
               updated = true;
            } else {
               const absoluteIndex = userIndex + 1 + assistantRelativeIndex;
               messages[absoluteIndex] = {
                  ...messages[absoluteIndex],
                  content,
                  timestamp: Date.now(),
               };
               updated = true;
            }

            return { ...session, messages };
         })
      );
      return updated;
   };

   const updateParameters = (params: Partial<Parameters>) => {
      setParameters((prev) => ({ ...prev, ...params }));
   };

   return (
      <AppContext.Provider
         value={{
            sessions,
            currentSessionId,
            createSession,
            deleteSession,
            setCurrentSession,
            messages,
            addMessage,
            clearMessages,
            selectedModel,
            setSelectedModel,
            parameters,
            updateParameters,
            editingState,
            startEditingMessage,
            cancelEditingMessage,
            updateMessageContent,
            upsertAssistantResponse,
         }}
      >
         {children}
      </AppContext.Provider>
   );
}

export function useApp() {
   const context = useContext(AppContext);
   if (!context) throw new Error("useApp must be used within AppProvider");
   return context;
}
