import { generatePageMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata = generatePageMetadata({
  title: "Founder of IndiaWise | Ishan Bansal",
  description: "Meet Ishan Bansal, the founder and creator of IndiaWise  an India-focused platform for smart calculators and everyday utilities.",
  path: "/founder",
});

export default function FounderPage() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white">
      {/* Very subtle grid background to keep IndiaWise theme */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
      
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32">
        
        {/* Back Navigation matching Kaventra "Return to Architecture" style */}
        <div className="mb-20">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-navy transition-colors">
            <ArrowLeft className="w-4 h-4" /> Return to Home
          </Link>
        </div>

        {/* Header / Identity */}
        <div className="mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-border text-xs font-bold tracking-widest uppercase text-muted mb-8">
            The Founder
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-navy tracking-tight mb-8">
            Ishan Bansal
          </h1>
          <div className="w-16 h-1 bg-brand rounded-full"></div>
        </div>

        {/* Massive Statement Quote matching Kaventra hero quote format */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-[2.75rem] font-medium text-navy leading-[1.25] tracking-tight">
            "IndiaWise is being built as a long-term vision  not just as a single product, but as a complete ecosystem of practical utilities, technology, and people."
          </h2>
        </div>

        {/* The Full Statement (Prose flow instead of SaaS Bento cards) */}
        <div className="prose prose-lg prose-navy max-w-none text-muted leading-relaxed">
          <p>
            IndiaWise was created to solve a practical problem: people regularly need tools for money, salary, tax, education, business, health, and everyday decisions, but these experiences can often be cluttered, confusing, or difficult to use.
          </p>
          <p>
            Whether it was figuring out the real impact of an EMI, understanding how new tax regimes affect take-home salary, or just converting units, the existing tools were often overwhelming. They were filled with intrusive ads, broken mobile layouts, or required an advanced financial degree just to interpret the results.
          </p>
          <p>
            The goal was to build something simpler, faster, cleaner, and genuinely useful. A platform that respects the user`s time and delivers answers with absolute clarity.
          </p>
          
          <h3 className="text-2xl font-bold text-navy mt-16 mb-6 tracking-tight">Built With Purpose</h3>
          <p>
            Our focus is on building practical, interconnected digital products. Every feature, calculator, and line of code on this platform is guided by foundational principles:
          </p>
          <ul className="space-y-3 mt-6">
            <li><strong className="text-navy">Simple by Design:</strong> Useful tools should be easy to understand and effortless to use.</li>
            <li><strong className="text-navy">Accuracy First:</strong> Calculations should be transparent, understandable, and dependable.</li>
            <li><strong className="text-navy">Performance Matters:</strong> Fast experiences are a core part of good product design.</li>
            <li><strong className="text-navy">Built for India:</strong> Focusing on the real-world rules, taxes, and utilities people actually need.</li>
          </ul>

          <h3 className="text-2xl font-bold text-navy mt-16 mb-6 tracking-tight">A Product Worth Building</h3>
          <p>
            I wanted to build something that was genuinely useful  not just another website. IndiaWise is my attempt to turn that idea into a product that people can actually rely on. We are designing systems for long-term scalability, ensuring that as we add more tools, the experience remains premium and lightning fast.
          </p>
        </div>

        {/* Footer / CTA matching Kaventra bottom signature & link format */}
        <div className="mt-24 pt-12 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <div className="text-navy font-bold text-xl">Ishan Bansal</div>
            <div className="text-muted text-sm font-semibold tracking-widest uppercase mt-2">Founder & Creator</div>
          </div>
          
          <Link href="/calculators" className="group inline-flex items-center gap-2 text-brand font-semibold hover:text-navy transition-colors text-lg">
            Explore the platform <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </main>
    </div>
  );
}