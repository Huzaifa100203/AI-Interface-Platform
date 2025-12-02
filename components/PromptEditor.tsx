"use client";

import { useEffect, useState, useRef } from "react";
import { Send, Sparkles, Plus } from "lucide-react";
import { TEMPLATES } from "@/lib/mockData";
import { useApp } from "@/context/AppContext";

export const PromptEditor = () => {
  const [prompt, setPrompt] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const templateAnchorRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const {
    addMessage,
    parameters,
    updateParameters,
    selectedModel,
    editingState,
    cancelEditingMessage,
    updateMessageContent,
    upsertAssistantResponse,
  } = useApp();

  useEffect(() => {
    if (editingState) {
      setPrompt(editingState.content);
    }
  }, [editingState]);

  // Close templates popover on outside click
  useEffect(() => {
    if (!showTemplates) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        templateAnchorRef.current &&
        !templateAnchorRef.current.contains(event.target as Node)
      ) {
        setShowTemplates(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTemplates]);

  // Auto-resize textarea up to a max height, then scroll
  useEffect(() => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const maxHeight = 160; // px, ~8–10 lines

    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${next}px`;
  }, [prompt]);
  

  const sendPrompt = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt && attachedFiles.length === 0) return;

    const wasEditing = Boolean(editingState);
    const targetMessageId = editingState
      ? editingState.id
      : addMessage({
          role: "user",
          content: trimmedPrompt || "(sent with attachments)",
        });

    if (editingState) {
      updateMessageContent(editingState.id, trimmedPrompt);
      cancelEditingMessage();
    }
    setPrompt("");

    let uploadedSummary: string | null = null;
    if (attachedFiles.length > 0) {
      try {
        const formData = new FormData();
        attachedFiles.forEach((file) => formData.append("files", file));
        const res = await fetch(
          process.env.NEXT_PUBLIC_FILE_UPLOAD_URL ?? "http://localhost:4000/upload",
          {
          method: "POST",
          body: formData,
          }
        );
        if (res.ok) {
          const data = await res.json();
          const names = (data.files as { name: string }[]).map((f) => f.name);
          uploadedSummary = `Attached files: ${names.join(", ")}`;
        } else {
          uploadedSummary = "File upload failed (mock).";
        }
      } catch {
        uploadedSummary = "File upload failed (network error).";
      } finally {
        setAttachedFiles([]);
      }
    }

    setTimeout(() => {
      const aiResponse = [
        `🤖 ${selectedModel.toUpperCase()} responding...`,
        `• Temperature: ${parameters.temperature}`,
        `• Max Tokens: ${parameters.maxTokens}`,
        "",
        uploadedSummary ? uploadedSummary : "",
        wasEditing
          ? `Updated reply for: "${trimmedPrompt.slice(0, 80)}"`
          : `Here's my take on: "${trimmedPrompt.slice(0, 80)}"`,
      ].join("\n");

      if (wasEditing) {
        const updated = upsertAssistantResponse(targetMessageId, aiResponse);
        if (!updated) {
          addMessage({
            role: "assistant",
            content: aiResponse,
          });
        }
      } else {
        addMessage({
          role: "assistant",
          content: aiResponse,
        });
      }
    }, 900);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendPrompt();
  };

  const useTemplate = (template: (typeof TEMPLATES)[0]) => {
    setPrompt(template.prompt);
    if (template.parameters) {
      updateParameters(template.parameters);
    }
    setShowTemplates(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="mx-auto w-full max-w-4xl">
        {editingState ? (
          <div className="mb-2 flex items-center justify-between rounded-xl border border-amber-400 bg-amber-50 px-4 py-2 text-xs text-amber-900 dark:border-amber-500 dark:bg-amber-500/10 dark:text-amber-100">
            <span>Editing your earlier message</span>
            <button
              type="button"
              onClick={cancelEditingMessage}
              className="font-medium underline"
            >
              Cancel
            </button>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-2">
          <div
            ref={templateAnchorRef}
            className="relative flex items-center gap-2 rounded-3xl border border-gray-300 bg-white px-4 py-2 shadow-sm dark:border-gray-700 dark:bg-slate-900"
          >
            {/* Templates popover */}
            {showTemplates && (
              <div className="absolute bottom-full left-0 z-20 mb-2 w-72 rounded-xl border border-gray-200 bg-white p-2 text-xs shadow-lg dark:border-gray-700 dark:bg-slate-950">
                <div className="mb-1 px-1 text-[11px] font-medium text-gray-700 dark:text-gray-300">
                  Prompt templates
                </div>
                <div className="max-h-64 space-y-1 overflow-y-auto">
                  {TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => useTemplate(template)}
                      className="w-full rounded-lg px-2 py-1.5 text-left text-[11px] text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                    >
                      <div className="font-medium">{template.name}</div>
                      <div className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                        {template.category}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Left icon */}
            <button
              type="button"
              onClick={() => setShowTemplates((prev) => !prev)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              title="Prompt templates"
            >
              <Sparkles className="h-4 w-4" />
            </button>

            {/* Input */}
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask anything..."
              className="prompt-textarea flex-1 resize-none bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500 leading-[1.4] py-1 min-h-[24px] max-h-40 overflow-y-auto dark:text-gray-100"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void sendPrompt();
                }
              }}
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={!prompt.trim()}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between px-2 text-[11px] text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <label
                className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-dashed border-gray-600 px-2 py-0.5 text-[11px] text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Attach files">
                <Plus className="h-3 w-3" />
                Add files
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (!files.length) return;
                    setAttachedFiles((prev) => {
                      const next = [...prev, ...files].slice(0, 5);
                      return next;
                    });
                    e.target.value = "";
                  }}
                />
              </label>
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {attachedFiles.map((file, idx) => (
                    <span
                      key={`${file.name}-${idx}`}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      <span className="max-w-[120px] truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setAttachedFiles((prev) =>
                            prev.filter((_, i) => i !== idx)
                          )
                        }
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-100">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <span>Press Enter to send • Shift + Enter for new line</span>
          </div>
        </form>
      </div>
    </div>
  );
};
