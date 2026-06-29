"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SIDEBAR_CONFIG } from "@/lib/constants/sidebar";
import { motion } from "framer-motion";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto border-r border-white/10 px-4 py-6 scrollbar-hide">
      <div className="space-y-8">
        {SIDEBAR_CONFIG.map((group, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              {group.group}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                        />
                      )}
                      <span className={cn("transition-colors", isActive ? "text-primary" : "group-hover:text-foreground")}>
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
};
