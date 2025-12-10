"use client";

import { useEffect, useState } from "react";
import { ModelSelector } from "@/components/ModelSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ParametersPanel } from "@/components/ParametersPanel";
import { PromptEditor } from "@/components/PromptEditor";
import { ChatOutput } from "@/components/ChatOutput";
import { ChatActions } from "@/components/ChatActions";
import { ChatSidebar } from "@/components/ChatSidebar";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { status, checkAuth } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      setShowAuthModal(true);
    } else if (status === "authenticated") {
      setShowAuthModal(false);
    }
  }, [status]);

  // Show auth modal when not authenticated
  if (status === "unauthenticated") {
    return (
      <>
        <AuthModal open={showAuthModal} onClose={() => {}} />
      </>
    );
  }

  // Show loading state
  if (status === "loading") {
    return (
      <div className="h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <Header />
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

function Header() {
  const { user } = useAuth();

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {user?.username ? `Hello, ${user.username}` : "AI Interface Platform"}
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
  );
}
