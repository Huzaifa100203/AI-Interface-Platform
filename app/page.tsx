"use client";

import { ModelSelector } from "@/components/ModelSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ParametersPanel } from "@/components/ParametersPanel";
import { PromptEditor } from "@/components/PromptEditor";
import { ChatOutput } from "@/components/ChatOutput";
import { ChatActions } from "@/components/ChatActions";
import { ChatSidebar } from "@/components/ChatSidebar";

export default function Home() {
  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              AI Interface Platform
            </h1>
            <div className="w-64">
              <ModelSelector />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ParametersPanel />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex overflow-hidden relative">
          <ChatSidebar />

          {/* Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatActions />
            <ChatOutput />
          </div>
        </div>

        {/* Prompt Editor */}
        <PromptEditor />
      </div>
    </div>
  );
}
