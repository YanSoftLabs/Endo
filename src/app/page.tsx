import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Box } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex-1">
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-violet-900 to-indigo-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-sm backdrop-blur">
            <Sparkles className="w-4 h-4" /> AI-powered wirecoding platform
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">Build high-converting<br /><span className="text-violet-300">3D landing pages</span> in minutes</h1>
          <p className="text-lg md:text-xl text-violet-200 max-w-2xl mx-auto">Share your business info. Our AI analyzes, architects, and generates a conversion-optimized site with stunning 3D visuals — then refine it via chat.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-violet-900 hover:bg-violet-100"><Link href="/create">Start building free</Link></Button>
          </div>
        </div>
      </div>
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8">
        {[
          { icon: Zap, title: "Conversion-first", desc: "Hero, testimonials, FAQ, CTAs, and legal pages built for trust and sales." },
          { icon: Box, title: "3D by choice", desc: "Pick Full WebGL, Hybrid, or Light CSS 3D — optimized for your audience." },
          { icon: Sparkles, title: "Chat to edit", desc: "Refine copy, colors, and sections in a split editor with live preview." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="p-6 rounded-2xl border bg-white shadow-sm"><Icon className="w-8 h-8 text-violet-600 mb-4" /><h3 className="font-bold text-lg mb-2">{title}</h3><p className="text-sm text-gray-600">{desc}</p></div>
        ))}
      </section>
      <p className="text-center text-xs text-gray-400 pb-8">Projects saved to your browser session. Sign up coming soon.</p>
    </main>
  );
}
