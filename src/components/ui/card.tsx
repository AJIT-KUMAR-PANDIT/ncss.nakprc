"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export const GlassCard = ({ children, className, interactive = false, ...props }: CardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      whileHover={interactive ? { scale: 1.01, translateY: -4 } : {}}
      className={cn(
        "glass-panel relative overflow-hidden p-6 transition-all duration-300",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 pointer-events-none opacity-50 bg-gradient-to-br from-white/5 to-transparent" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
