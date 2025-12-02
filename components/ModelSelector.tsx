"use client";

import { ChevronDown } from "lucide-react";
import { MODELS } from "@/lib/mockData";
import { useApp } from "@/context/AppContext";

export const ModelSelector = () => {
  const { selectedModel, setSelectedModel } = useApp();
  const currentModel = MODELS.find(m => m.id === selectedModel);

  return (
    <div className="relative">
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className="appearance-none w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-10 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        {MODELS.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/3 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
      {currentModel && (
        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
          {currentModel.contextWindow} • {currentModel.speed}
        </div>
      )}
    </div>
  );
};
