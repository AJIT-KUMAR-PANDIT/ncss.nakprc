"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { ChevronRight, Zap, Sparkles, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
        {/* Background Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-blue/10 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-muted-foreground mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Introducing Vitrum 1.0
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 vitrum-text-gradient leading-[1.1]">
            Liquid Glass <br />
            <span className="text-primary">Design System</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            A premium UI framework inspired by real optical refraction and
            modern web standards. Designed for those who demand absolute precision.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" variant="primary" className="gap-2 group">
              Get Started <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="glass" className="gap-2">
              View Components
            </Button>
          </div>
        </motion.div>

        {/* Interactive Hero Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 relative w-full max-w-4xl aspect-video glass-panel p-4 group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 rounded-inherit pointer-events-none" />

          {/* Mock UI Interface */}
          <div className="w-full h-full bg-[#0a0a0c] rounded-lg border border-white/10 overflow-hidden flex">
            <div className="w-48 border-r border-white/5 p-4 space-y-3 hidden sm:block">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 w-full bg-white/5 rounded-full" />
              ))}
            </div>
            <div className="flex-1 p-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-20 pointer-events-none">
                 <div className="w-[500px] h-[500px] bg-primary/30 blur-[100px] rounded-full" />
               </div>
               <div className="relative z-10 space-y-6 max-w-md mx-auto text-left">
                  <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-white/5 rounded-full" />
                    <div className="h-4 w-5/6 bg-white/5 rounded-full" />
                    <div className="h-4 w-4/6 bg-white/5 rounded-full" />
                  </div>
                  <div className="flex gap-3">
                    <div className="h-10 w-24 bg-primary/40 rounded-full" />
                    <div className="h-10 w-24 bg-white/10 rounded-full" />
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Built for Precision</h2>
          <p className="text-muted-foreground">Everything in Vitrum is designed with optical physics in mind.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Optical Refraction",
              desc: "Real-time refraction effects that make your UI feel like physical glass.",
              icon: <Sparkles className="text-primary" />
            },
            {
              title: "Physics Motion",
              desc: "Spring-based animations based on real-world inertia and damping.",
              icon: <Zap className="text-accent-blue" />
            },
            {
              title: "Absolute Access",
              desc: "WCAG AA compliance out of the box without compromising aesthetics.",
              icon: <ShieldCheck className="text-accent-purple" />
            },
          ].map((feature, i) => (
            <GlassCard key={i} interactive>
              <div className="mb-4 p-3 w-fit rounded-xl bg-white/5 border border-white/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.desc}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}
