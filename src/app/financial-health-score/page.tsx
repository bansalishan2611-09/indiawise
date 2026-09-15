import { Metadata } from "next";
import { Suspense } from "react";
import FinancialHealthExperience from "@/components/financial-health/FinancialHealthExperience";
import { generatePageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { ShieldCheck, TrendingUp, AlertTriangle, CheckCircle2, BookOpen, ArrowRight, HelpCircle } from "lucide-react";

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const hasQueryParams = Object.keys(resolvedSearchParams).length > 0;

  return generatePageMetadata({
    title: "IndiaWise Financial Health Score (0-100) — Free Financial Diagnostic & Simulator",
    description:
      "Calculate your personal IndiaWise Financial Health Score (0-100). A 100% deterministic, private diagnostic evaluating debt burden, emergency runway, and compounding momentum.",
    path: "/financial-health-score",
    noIndex: hasQueryParams,
  });
}

function FinancialHealthLoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-3 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-muted">Loading Financial Health Engine...</p>
      </div>
    </div>
  );
}

const fhsFaqs = [
  {
    question: "How is the IndiaWise Financial Health Score calculated?",
    answer: "The score uses a 100% deterministic mathematical model weighted across 4 core pillars: Debt Burden / DTI ratio (up to 50 points), Investment Rate / Compounding velocity (25 points), Emergency Buffer runway (15 points), and Savings Capacity (10 points). The score produces an objective diagnostic from 0 to 100.",
  },
  {
    question: "Is my personal financial data saved in a database?",
    answer: "No. All calculations are executed purely in your browser's local client memory. IndiaWise does not require signup, creates no user account, and does not transmit or store your income, EMIs, or savings figures to any remote database.",
  },
  {
    question: "How does this differ from a CIBIL credit score?",
    answer: "A CIBIL credit score only tracks your past borrowing history and loan repayment punctuality. The IndiaWise Financial Health Score evaluates your forward-looking financial stability: whether you have enough emergency reserves, whether your savings rate beats inflation, and how vulnerable your monthly cash flows are to unexpected economic shocks.",
  },
  {
    question: "What is considered a Good Financial Health Score in India?",
    answer: "A score of 70 to 84 is considered 'Good' — indicating manageable debt, steady monthly investments, and a healthy emergency reserve. Scores of 85 and above reflect 'Excellent' financial resilience with zero high-interest debt and strong compounding momentum.",
  },
  {
    question: "Can I simulate improvements before taking financial decisions?",
    answer: "Yes. Use the interactive 'What-If Simulator' inside the tool to test how increasing your monthly SIP by ₹5,000, paying off a credit card balance, or adding ₹50,000 to emergency savings directly lifts your score.",
  },
];

export default function FinancialHealthScorePage() {
  const siteUrl = siteConfig.url;

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "IndiaWise Financial Health Score",
    description:
      "A deterministic diagnostic tool that calculates your personal Financial Health Score based on Indian cashflows, debt-to-income, and emergency buffer.",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    url: `${siteUrl}/financial-health-score`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: fhsFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbs = [
    { label: "Calculators", href: "/calculators" },
    { label: "Financial Health Score", href: "/financial-health-score" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mb-6 print:hidden">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <Suspense fallback={<FinancialHealthLoadingFallback />}>
        <FinancialHealthExperience />
      </Suspense>

      {/* SEO Explanatory Content — 4 Pillars of Financial Health */}
      <div className="mt-16 print:hidden">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-navy tracking-tight mb-3">
            How the IndiaWise Financial Health Score Works
          </h2>
          <p className="text-muted text-base leading-relaxed">
            Most personal finance advice is fragmented. Our diagnostic framework synthesizes your entire household economy into four measurable, weighted dimensions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white border border-border rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold mb-4">
                50%
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">Debt-to-Income (DTI)</h3>
              <p className="text-sm text-muted leading-relaxed">
                Carries the highest weight. High-interest loans and excessive EMIs consume cash flow and pose catastrophic risks during income interruptions. Keeping total EMIs under 35% is critical.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60 text-xs font-semibold text-navy">
              Benchmark: &lt; 35% of in-hand salary
            </div>
          </div>

          <div className="p-6 bg-white border border-border rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                25%
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">Investment Rate</h3>
              <p className="text-sm text-muted leading-relaxed">
                Measures the percentage of monthly income channeled into long-term compounding assets (mutual funds, SIPs, equity, PPF). Without active investing, inflation erodes net worth.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60 text-xs font-semibold text-navy">
              Benchmark: &ge; 20% of net income
            </div>
          </div>

          <div className="p-6 bg-white border border-border rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
                15%
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">Emergency Buffer</h3>
              <p className="text-sm text-muted leading-relaxed">
                Calculates how many months of non-negotiable living expenses your liquid bank balances and fixed deposits can cover in the event of job loss or medical crises.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60 text-xs font-semibold text-navy">
              Benchmark: 3 to 6 months of expenses
            </div>
          </div>

          <div className="p-6 bg-white border border-border rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
                10%
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">Savings Margin</h3>
              <p className="text-sm text-muted leading-relaxed">
                Evaluates the surplus cash left at the end of each month after accounting for mandatory expenses, EMIs, and routine lifestyle expenditures.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60 text-xs font-semibold text-navy">
              Benchmark: Positive surplus every month
            </div>
          </div>
        </div>

        {/* Score Tier Explanations */}
        <div className="mt-12 p-6 sm:p-8 bg-alt/60 border border-border rounded-2xl">
          <h3 className="text-xl font-bold text-navy mb-6">Score Tier Definitions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-border/80 rounded-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded w-fit mb-2">
                85 – 100
              </div>
              <h4 className="font-bold text-navy mb-1">Excellent</h4>
              <p className="text-xs text-muted leading-relaxed">
                Robust emergency liquidity, negligible high-cost debt, and exceptional investment compounding rate.
              </p>
            </div>

            <div className="p-4 bg-white border border-border/80 rounded-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded w-fit mb-2">
                70 – 84
              </div>
              <h4 className="font-bold text-navy mb-1">Good</h4>
              <p className="text-xs text-muted leading-relaxed">
                Healthy financial foundation with minor areas for optimization in debt reduction or higher SIP allocations.
              </p>
            </div>

            <div className="p-4 bg-white border border-border/80 rounded-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded w-fit mb-2">
                50 – 69
              </div>
              <h4 className="font-bold text-navy mb-1">Fair</h4>
              <p className="text-xs text-muted leading-relaxed">
                Moderate vulnerability. Emergency cushion is thin, or EMI burdens are restricting savings growth.
              </p>
            </div>

            <div className="p-4 bg-white border border-border/80 rounded-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-100/70 px-2 py-0.5 rounded w-fit mb-2">
                0 – 49
              </div>
              <h4 className="font-bold text-navy mb-1">Needs Attention</h4>
              <p className="text-xs text-muted leading-relaxed">
                Elevated risk profile. Immediate priority must be halting debt expansion and accumulating a 3-month safety fund.
              </p>
            </div>
          </div>
        </div>

        {/* Deep Dive Educational Guides */}
        <div className="mt-12">
          <div className="flex items-center gap-2 text-brand font-semibold text-sm mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Recommended Reading</span>
          </div>
          <h3 className="text-2xl font-bold text-navy mb-4">Educational Guides for Financial Resilience</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/guides/how-to-improve-your-financial-health-score"
              className="p-5 bg-white border border-border rounded-xl hover:border-brand hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <h4 className="font-semibold text-navy group-hover:text-brand transition-colors mb-1.5">
                  How to Improve Your Financial Health Score in India
                </h4>
                <p className="text-sm text-muted line-clamp-2">
                  Actionable step-by-step roadmap to eliminate costly consumer debt, build emergency runways, and automate compounding.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-brand group-hover:translate-x-1 transition-transform">
                <span>Read guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/guides/debt-to-income-ratio-explained"
              className="p-5 bg-white border border-border rounded-xl hover:border-brand hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <h4 className="font-semibold text-navy group-hover:text-brand transition-colors mb-1.5">
                  Debt-to-Income (DTI) Ratio Explained for Indian Borrowers
                </h4>
                <p className="text-sm text-muted line-clamp-2">
                  Understand how banks calculate your FOIR and why keeping debt under 35% preserves your cash flow flexibility.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-brand group-hover:translate-x-1 transition-transform">
                <span>Read guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/guides/how-much-emergency-fund-should-you-have"
              className="p-5 bg-white border border-border rounded-xl hover:border-brand hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <h4 className="font-semibold text-navy group-hover:text-brand transition-colors mb-1.5">
                  How Much Emergency Fund Should You Have in India?
                </h4>
                <p className="text-sm text-muted line-clamp-2">
                  The ideal 3 to 6-month calculation matrix, where to park liquid reserves, and when to tap into emergency cash.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-brand group-hover:translate-x-1 transition-transform">
                <span>Read guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/guides/emi-vs-income-loan-affordability"
              className="p-5 bg-white border border-border rounded-xl hover:border-brand hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <h4 className="font-semibold text-navy group-hover:text-brand transition-colors mb-1.5">
                  EMI vs Income: The 40% Affordability Rule
                </h4>
                <p className="text-sm text-muted line-clamp-2">
                  How much home loan can you comfortably afford based on your actual salary without suffocating your lifestyle?
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-brand group-hover:translate-x-1 transition-transform">
                <span>Read guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>

        {/* Server-Rendered FAQ Section */}
        <div className="mt-14">
          <div className="flex items-center gap-2 text-brand font-semibold text-sm mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h3 className="text-2xl font-bold text-navy mb-6">Financial Health Score FAQs</h3>
          <div className="space-y-3">
            {fhsFaqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white border border-border rounded-xl p-4 sm:p-5 [&_summary::-webkit-details-marker]:hidden cursor-pointer open:ring-1 open:ring-brand/30"
              >
                <summary className="flex items-center justify-between font-semibold text-navy text-base list-none">
                  <span>{faq.question}</span>
                  <span className="text-muted group-open:rotate-180 transition-transform text-lg ml-2 font-mono">
                    ↓
                  </span>
                </summary>
                <p className="mt-3 text-muted text-sm sm:text-base leading-relaxed border-t border-border/60 pt-3">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
