"use client";

import * as React from "react";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  filename?: string;
  language?: string;
  className?: string;
}

export const CodeBlock = ({ code, filename, language, className }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative rounded-xl border border-white/10 bg-[#0a0a0c] overflow-hidden my-6", className)}>
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
          <span className="text-xs font-mono text-muted-foreground">{filename}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-[10px] gap-1.5 rounded-md bg-white/5 hover:bg-white/10"
            onClick={copyToClipboard}
          >
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-zinc-300">
        <code>{code}</code>
      </pre>
    </div>
  );
};
