"use client";

import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

export const MainLayout = ({ children, preview }: { children: React.ReactNode; preview?: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      <div className="flex max-w-[1600px] mx-auto">
        <Sidebar />
        <main className="flex-1 min-w-0 relative border-r border-white/10 h-[calc(100vh-64px)] overflow-y-auto scrollbar-hide">
          <div className="p-8 max-w-4xl mx-auto">
            {children}
          </div>
        </main>
        {preview && (
          <aside className="w-[450px] h-[calc(100vh-64px)] sticky top-16 overflow-y-auto p-8 bg-muted/30">
            {preview}
          </aside>
        )}
      </div>
    </div>
  );
};
