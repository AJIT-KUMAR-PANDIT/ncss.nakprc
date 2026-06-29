"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface LivePreviewProps {
  children: (props: any) => React.ReactNode;
  controls: {
    label: string;
    options: string[];
    defaultValue: string;
    id: string;
  }[];
}

export const LivePreview = ({ children, controls }: LivePreviewProps) => {
  const [state, setState] = useState<Record<string, string>>({});

  // Initialize state with default values
  React.useEffect(() => {
    const initialState = controls.reduce((acc, ctrl) => {
      acc[ctrl.id] = ctrl.defaultValue;
      return acc;
    }, {} as Record<string, string>);
    setState(initialState);
  }, [controls]);

  return (
    <div className="flex flex-col gap-6">
      {/* The Preview Area */}
      <div className="aspect-video rounded-2xl border border-white/10 bg-[#050507] relative overflow-hidden p-8 flex items-center justify-center group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(103,74,142,0.1)_0%,transparent_70%)]" />
        <div className="relative z-10">
          {children(state)}
        </div>

        {/* Preview Overlays */}
        <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <div className="px-2 py-1 rounded bg-black/50 border border-white/10 text-[10px] font-mono text-muted-foreground backdrop-blur-md">
             Desktop Preview
           </div>
        </div>
      </div>

      {/* The Controls Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {controls.map((ctrl) => (
          <div key={ctrl.id} className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground ml-1">{ctrl.label}</label>
            <div className="flex gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
              {ctrl.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setState(prev => ({ ...prev, [ctrl.id]: opt }))}
                  className={cn(
                    "flex-1 px-3 py-1 text-xs rounded-md transition-all duration-200",
                    state[ctrl.id] === opt
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
