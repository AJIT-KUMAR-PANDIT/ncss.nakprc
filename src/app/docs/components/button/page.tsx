import { MainLayout } from "@/components/layout/MainLayout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { LivePreview } from "@/components/docs/LivePreview";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";

export default function ButtonPage() {
  const buttonControls = [
    { id: "variant", label: "Variant", options: ["primary", "glass", "ghost"], defaultValue: "glass" },
    { id: "size", label: "Size", options: ["sm", "md", "lg"], defaultValue: "md" },
  ];

  return (
    <MainLayout
      preview={
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Interactive Preview</h3>
            <LivePreview controls={buttonControls}>
              {(props) => (
                <Button variant={props.variant as any} size={props.size as any}>
                  Vitrum Button
                </Button>
              )}
            </LivePreview>
          </div>

          <GlassCard>
            <h4 className="text-sm font-semibold mb-3">Current Props</h4>
            <div className="space-y-2 text-xs font-mono text-muted-foreground">
               <div className="flex justify-between border-b border-white/5 pb-1">
                 <span>variant</span> <span className="text-primary">"{buttonControls[0].defaultValue}"</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-1">
                 <span>size</span> <span className="text-primary">"{buttonControls[1].defaultValue}"</span>
               </div>
            </div>
          </GlassCard>
        </div>
      }
    >
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4 vitrum-text-gradient">Button</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A high-precision interaction primitive. Designed for clarity, feedback, and
            the distinct optical feel of Vitrum Liquid Glass.
          </p>
        </header>

        <section className="space-y-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Installation</h2>
            <CodeBlock
              filename="terminal"
              code="npm i @vitrum/core"
            />
            <CodeBlock
              filename="Button.tsx"
              code={`import { Button } from "@vitrum/core";\n\nexport default function App() {\n  return <Button variant="glass">Click Me</Button>;\n}`}
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">Variants</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-center">
                 <Button variant="primary" className="mb-4 w-full">Primary</Button>
                 <span className="text-xs text-muted-foreground font-mono">variant="primary"</span>
               </div>
               <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-center">
                 <Button variant="glass" className="mb-4 w-full">Glass</Button>
                 <span className="text-xs text-muted-foreground font-mono">variant="glass"</span>
               </div>
               <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-center">
                 <Button variant="ghost" className="mb-4 w-full">Ghost</Button>
                 <span className="text-xs text-muted-foreground font-mono">variant="ghost"</span>
               </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">API Reference</h2>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/10 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
                  <tr>
                    <th className="px-4 py-3">Prop</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-4 py-3 font-mono text-primary">variant</td>
                    <td className="px-4 py-3 font-mono text-xs">'primary' | 'glass' | 'ghost'</td>
                    <td className="px-4 py-3 text-muted-foreground">The visual style of the button.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-primary">size</td>
                    <td className="px-4 py-3 font-mono text-xs">'sm' | 'md' | 'lg'</td>
                    <td className="px-4 py-3 text-muted-foreground">The size of the button.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
