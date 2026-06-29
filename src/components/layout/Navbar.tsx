"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, Code2, MessageSquare, Moon, Sun, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVitrumStore } from "@/lib/store/useVitrumStore";

export const Navbar = () => {
  const { theme, setTheme } = useVitrumStore();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-500 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
            </div>
            <span className="text-xl font-bold tracking-tight vitrum-text-gradient">Vitrum</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-muted-foreground">
             {/* Links will be added here */}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group w-[240px]">
            <Search size={16} />
            <span className="text-xs flex-1">Search documentation...</span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/20 bg-black/20 text-[10px] font-mono">
              <Command size={10} />
              K
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="p-2 rounded-full hover:bg-white/10">
              <Code2 size={18} />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 rounded-full hover:bg-white/10">
              <MessageSquare size={18} />
            </Button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-full hover:bg-white/10"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
