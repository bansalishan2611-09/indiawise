import { Metadata } from "next";
import { Suspense } from "react";
import FinancialHealthExperience from "@/components/financial-health/FinancialHealthExperience";
import { generatePageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = generatePageMetadata({
  title: "IndiaWise Financial Health Score — Free Diagnostic & Simulator",
  description:
    "Calculate your personal IndiaWise Financial Health Score (0-100). A 100% deterministic, private diagnosis of debt burden, emergency runway, and compounding momentum.",
  path: "/financial-health-score",
});

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

  const breadcrumbs = [
    { label: "Calculators", href: "/calculators" },
    { label: "Financial Health Score", href: "/financial-health-score" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      <div className="mb-6 print:hidden">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <Suspense fallback={<FinancialHealthLoadingFallback />}>
        <FinancialHealthExperience />
      </Suspense>
    </div>
  );
}
