"use client";

import { Settings, X } from "lucide-react";
import { useState, useRef } from "react";
import { useApp } from "@/context/AppContext";

export const ParametersPanel = () => {
   const [isOpen, setIsOpen] = useState(false);
   const { parameters, updateParameters } = useApp();
   const panelRef = useRef<HTMLDivElement>(null);

   // useEffect(() => {
   //   const handleClickOutside = (event: MouseEvent) => {
   //     if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
   //       setIsOpen(false);
   //     }
   //   };

   //   if (isOpen) {
   //     document.addEventListener('mousedown', handleClickOutside);
   //   }

   //   return () => {
   //     document.removeEventListener('mousedown', handleClickOutside);
   //   };
   // }, [isOpen]);

   const presets = {
      creative: {
         temperature: 0.9,
         maxTokens: 2048,
         topP: 0.9,
         frequencyPenalty: 0.5,
      },
      balanced: {
         temperature: 0.7,
         maxTokens: 2048,
         topP: 1.0,
         frequencyPenalty: 0.0,
      },
      precise: {
         temperature: 0.3,
         maxTokens: 1024,
         topP: 0.8,
         frequencyPenalty: 0.2,
      },
   };

   return (
      <div className="relative">
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Parameters"
         >
            <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
         </button>

         {isOpen && (
            <div
               ref={panelRef}
               className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-10"
            >
               <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                     Parameters
                  </h3>
                  <button
                     onClick={() => setIsOpen(false)}
                     className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
                  >
                     <X className="h-4 w-4" />
                  </button>
               </div>

               <div className="space-y-3 mb-4">
                  <div>
                     <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Temperature: {parameters.temperature}
                     </label>
                     <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={parameters.temperature}
                        onChange={(e) =>
                           updateParameters({ temperature: parseFloat(e.target.value) })
                        }
                        className="w-full"
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Max Tokens: {parameters.maxTokens}
                     </label>
                     <input
                        type="range"
                        min="256"
                        max="4096"
                        step="256"
                        value={parameters.maxTokens}
                        onChange={(e) =>
                           updateParameters({ maxTokens: parseInt(e.target.value) })
                        }
                        className="w-full"
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Top P: {parameters.topP}
                     </label>
                     <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={parameters.topP}
                        onChange={(e) =>
                           updateParameters({ topP: parseFloat(e.target.value) })
                        }
                        className="w-full"
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Frequency Penalty: {parameters.frequencyPenalty}
                     </label>
                     <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={parameters.frequencyPenalty}
                        onChange={(e) =>
                           updateParameters({
                              frequencyPenalty: parseFloat(e.target.value),
                           })
                        }
                        className="w-full"
                     />
                  </div>
               </div>

               <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                  <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                     Presets:
                  </p>
                  <div className="flex gap-2">
                     {Object.entries(presets).map(([name, preset]) => (
                        <button
                           key={name}
                           onClick={() => updateParameters(preset)}
                           className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 capitalize"
                        >
                           {name}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
