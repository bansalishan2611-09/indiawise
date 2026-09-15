import Link from "next/link";
import Image from "next/image";
import { Calculator, Percent, FileText, Briefcase, Calendar, Receipt, TrendingUp, ShieldCheck, Zap, LineChart, Target, Coins, ArrowRight, Sparkles } from "lucide-react";
import HeroSearch from "@/components/search/HeroSearch";
import { siteConfig } from "@/config/site";

export default function Home() {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      email: siteConfig.email,
      contactType: 'customer support'
    }
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="flex flex-col items-center w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {/* Hero Section */}
      <section className="relative w-full bg-white pt-16 pb-24 sm:pt-24 sm:pb-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center border-b border-border">
        {/* Graph paper grid background overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none"></div>
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 mx-auto max-w-5xl space-y-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-blue-100 text-sm font-bold text-navy shadow-sm mb-4">
            <div className="w-2 h-2 rounded-full bg-brand"></div>
            <span>Built for Indian Tax & Financial Rules</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-balance leading-[1.1] text-navy">
            Calculate smarter,<br />
            <span className="text-brand">understand better.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted max-w-3xl mx-auto text-balance leading-relaxed font-medium mt-6 mb-8">
            The ultimate platform for Indian users. Transform complex financial calculations into clear, actionable insights instantly.
          </p>
          
          <div className="w-full relative z-50">
            <HeroSearch />
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 pt-10 text-sm font-semibold text-muted">
            <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-brand"/> 100% Free</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-brand"/> Local Processing</div>
            <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-brand"/> Instant Results</div>
          </div>
        </div>
      </section>

      {/* Flagship Diagnostic Spotlight */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-gradient-to-r from-navy via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand/25 border border-brand/40 text-brand text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              Flagship Diagnostic Tool
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              What is your Financial Health Score?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Get a 360° confidential diagnosis of your debt-to-income, emergency buffer, and compounding velocity. 100% free, client-side, with zero personal data stored.
            </p>
          </div>
          <Link
            href="/financial-health-score"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand/90 transition-all shadow-lg hover:shadow-brand/30"
          >
            <span>Check Your Score (0-100)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-32">
        
        {/* Bento Grid: Popular Calculators */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
            <div>
              <h2 className="text-3xl font-bold text-navy tracking-tight">Popular Calculators</h2>
              <p className="text-muted mt-2">The most used utilities by our users right now.</p>
            </div>
            <Link href="/calculators" className="text-brand font-medium hover:text-brand-hover flex items-center gap-1 group transition-colors">
              View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 auto-rows-[200px]">
            {/* Main Featured Card - Spans 2x2 */}
            <Link href="/calculators/finance/home-loan-emi" className="group col-span-1 md:col-span-2 md:row-span-2 bg-white rounded-3xl p-8 border border-border hover:border-brand hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand/10 transition-colors duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-alt rounded-2xl flex items-center justify-center text-brand mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Calculator className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-navy mb-2">Home Loan EMI</h3>
                <p className="text-muted leading-relaxed max-w-sm">Calculate your monthly loan payments, total interest, and amortization schedule instantly.</p>
              </div>
              <div className="mt-8 flex items-center text-brand font-semibold gap-2 relative z-10">
                <span>Open Calculator</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            
            {/* Standard Bento Cards */}
            <Link href="/calculators/finance/sip-calculator" className="group col-span-1 md:col-span-1 md:row-span-1 bg-white rounded-3xl p-6 border border-border hover:border-brand hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-alt rounded-xl flex items-center justify-center text-brand mb-4 group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-navy mb-1">SIP Returns</h3>
                <p className="text-sm text-muted">Plan your mutual fund investments.</p>
              </div>
            </Link>

            <Link href="/calculators/salary/in-hand-salary-calculator" className="group col-span-1 md:col-span-1 md:row-span-1 bg-white rounded-3xl p-6 border border-border hover:border-brand hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-alt rounded-xl flex items-center justify-center text-brand mb-4 group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-navy mb-1">In-Hand Salary</h3>
                <p className="text-sm text-muted">CTC to take-home breakdown.</p>
              </div>
            </Link>

            <Link href="/calculators/tax/gst-calculator" className="group col-span-1 md:col-span-2 md:row-span-1 bg-navy text-white rounded-3xl p-6 border border-navy hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-row items-center justify-between">
              <div className="absolute inset-0 bg-grid-pattern-light opacity-30 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <Receipt className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold">GST Calculator</h3>
                </div>
                <p className="text-blue-100/70 text-sm">Inclusive and exclusive tax calculation.</p>
              </div>
              <div className="relative z-10 bg-white/10 p-3 rounded-full group-hover:bg-brand transition-colors">
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </section>

        {/* Bento Grid: Categories */}
        <section className="space-y-8 relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none -z-10 -mx-4 sm:-mx-6 lg:-mx-8"></div>
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-navy tracking-tight mb-4">Everything You Need to Calculate</h2>
            <p className="text-muted text-lg">Browse our comprehensive suite of tools organized by category.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Finance", desc: "Loans, investments, and returns", icon: LineChart, href: "/categories/finance" },
              { name: "Salary", desc: "Income, tax deductions, and take-home", icon: Briefcase, href: "/categories/salary" },
              { name: "Tax", desc: "GST, income tax, and compliance", icon: Receipt, href: "/categories/tax" },
              { name: "Education", desc: "Marks, percentages, and CGPA", icon: Target, href: "/categories/education" },
              { name: "Business", desc: "Margins, profits, and break-even", icon: Coins, href: "/categories/business" },
              { name: "Everyday", desc: "Dates, age, time, and units", icon: Calendar, href: "/categories/everyday" },
            ].map((cat, i) => (
              <Link key={i} href={cat.href} className="group bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-border hover:border-brand transition-colors shadow-sm hover:shadow-md flex items-start gap-4">
                <div className="w-12 h-12 bg-alt rounded-2xl flex items-center justify-center text-navy group-hover:bg-brand group-hover:text-white transition-colors shrink-0">
                  <cat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-navy text-lg">{cat.name}</h3>
                  <p className="text-sm text-muted mt-1 leading-relaxed">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
        
        {/* Featured Guide/Tool Section */}
        <section className="bg-alt rounded-[2.5rem] p-8 md:p-12 border border-border flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
          <div className="relative z-10 md:w-1/2 space-y-6">
            <div className="inline-block px-3 py-1 bg-blue-100 text-brand text-xs font-bold tracking-wider uppercase rounded-full">
              Educational Guide
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy leading-tight tracking-tight">
              Understand how EMI is actually calculated.
            </h2>
            <p className="text-lg text-muted">
              Don't just plug numbers into a tool. Learn the mathematics behind loan amortization and how changing interest rates affect your total payout over decades.
            </p>
            <Link href="/guides/how-home-loan-emi-is-calculated" className="inline-flex items-center justify-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-semibold hover:bg-navy/90 transition-colors shadow-md">
              Read the Guide <FileText className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative z-10 md:w-1/2 w-full flex justify-center perspective-1000">
            {/* Decorative element representing a loan amortization breakdown */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-border overflow-hidden transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700 ease-out">
              <div className="bg-navy p-6 text-white">
                <div className="text-sm text-blue-200 font-medium mb-1">Monthly EMI</div>
                <div className="text-4xl font-bold font-mono">₹ 43,391</div>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Principal Amount</span>
                    <span className="font-semibold text-navy">₹ 50,00,000</span>
                  </div>
                  <div className="w-full h-2 bg-alt rounded-full overflow-hidden">
                    <div className="w-3/5 h-full bg-blue-400 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Total Interest</span>
                    <span className="font-semibold text-navy">₹ 54,13,879</span>
                  </div>
                  <div className="w-full h-2 bg-alt rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-brand rounded-full"></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-center text-sm">
                  <span className="text-muted">Tenure: 20 Years</span>
                  <span className="text-brand font-medium flex items-center gap-1">View Schedule <ArrowRight className="w-3 h-3"/></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Statement CTA */}
        <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-24">
          <div className="relative bg-white rounded-[2.5rem] border border-border p-8 md:p-14 lg:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row items-center md:items-center gap-10 md:gap-14">
            
            {/* Subtle Architectural Grid & Glow Background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-navy/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Left: Premium Circular Image */}
            <div className="shrink-0 relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full p-2 bg-white shadow-xl shadow-navy/5 border border-gray-100 z-10">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image 
                  src="/images/founder.png" 
                  alt="Ishan Bansal - Founder of IndiaWise" 
                  fill
                  className="object-cover scale-[1.35] origin-[55%_45%]"
                  sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, 208px"
                />
              </div>
            </div>

            {/* Right: Content & Quote */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left z-10 flex-1 mt-2">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-border text-xs font-bold tracking-widest uppercase text-muted mb-6 bg-alt">
                From the Founder
              </div>
              
              <h2 className="text-2xl md:text-3xl lg:text-[2rem] font-medium text-navy leading-[1.4] tracking-tight mb-8">
                &quot;IndiaWise is being built as a long-term vision — not just as a single product, but as a complete ecosystem of practical utilities, technology, and people.&quot;
              </h2>
              
              <div className="flex flex-col sm:flex-row items-center md:items-center justify-between w-full gap-6 pt-6 border-t border-border/60">
                <div>
                  <div className="text-navy font-bold text-xl">Ishan Bansal</div>
                  <div className="text-muted text-xs font-bold tracking-widest uppercase mt-1">Founder & Creator</div>
                </div>
                
                <Link href="/founder" className="group inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-navy transition-colors bg-white hover:bg-alt px-6 py-3 rounded-full border border-border shadow-sm">
                  Read Full Statement <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
