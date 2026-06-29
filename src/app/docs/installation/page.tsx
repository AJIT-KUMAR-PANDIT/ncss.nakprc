import { MainLayout } from "@/components/layout/MainLayout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Zap, Package, Terminal } from "lucide-react";

export default function InstallationPage() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4 vitrum-text-gradient">Installation</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Get Vitrum up and running in your project. We support all modern JavaScript frameworks.
          </p>
        </header>

        <section className="space-y-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Package className="text-primary" /> Quick Install
            </h2>
            <p className="text-muted-foreground mb-4">
              The fastest way to start is using our CLI tool. It will automatically configure your
              Tailwind config and install all dependencies.
            </p>
            <CodeBlock
              filename="terminal"
              code="npx vitrum-cli@latest init"
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Terminal className="text-primary" /> Manual Installation
            </h2>
            <p className="text-muted-foreground mb-4">
              If you prefer manual setup, install the core package and peer dependencies.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <GlassCard interactive>
                <span className="text-xs font-mono text-muted-foreground block mb-2">npm</span>
                <CodeBlock code="npm i @vitrum/core framer-motion lucide-react" />
              </GlassCard>
              <GlassCard interactive>
                <span className="text-xs font-mono text-muted-foreground block mb-2">pnpm</span>
                <CodeBlock code="pnpm add @vitrum/core framer-motion lucide-react" />
              </GlassCard>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Zap className="text-primary" /> Tailwind Configuration
            </h2>
            <p className="text-muted-foreground mb-4">
              Add the Vitrum plugin to your <code>tailwind.config.js</code> to enable the glass tokens and custom utilities.
            </p>
            <CodeBlock
              filename="tailwind.config.js"
              code={`module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  plugins: [
    require("@vitrum/plugin"),
  ],
}`}
            />
          </div>

          <div className="p-8 rounded-2xl bg-primary/10 border border-primary/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
             <h3 className="text-xl font-bold mb-2 relative z-10">Need help?</h3>
             <p className="text-muted-foreground mb-6 relative z-10">Join our community on Discord to get support from the team and other developers.</p>
             <Button variant="primary" className="relative z-10">Join Discord</Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
