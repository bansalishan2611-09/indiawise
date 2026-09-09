import { generatePageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const slug = (await params).slug;
  return generatePageMetadata({
    title: `${slug.replace(/-/g, " ")} Guide`,
    description: `Read our comprehensive guide on ${slug.replace(/-/g, " ")}.`,
    path: `/guides/${slug}`,
  });
}

export default async function GuidePage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  const breadcrumbItems = [
    { label: "Guides", href: "/guides" },
    { label: slug.replace(/-/g, " "), href: `/guides/${slug}` },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs items={breadcrumbItems} />
      
      <article className="mt-8 prose prose-lg prose-blue max-w-none">
        <h1 className="text-4xl font-extrabold text-navy capitalize mb-6">{slug.replace(/-/g, " ")}</h1>
        <div className="prose prose-lg prose-navy mt-8 max-w-none">
          <p className="text-xl text-muted mb-8 leading-relaxed font-medium">
            Welcome to the ultimate guide on {slug.replace(/-/g, " ")}. Whether you're just starting your financial journey or looking to refine your strategies, this comprehensive resource covers everything you need to know. We've broken down complex jargon into actionable steps so you can make informed decisions with confidence.
          </p>
          
          <h2 className="text-2xl font-bold text-navy mt-12 mb-5">1. Understanding the Core Fundamentals</h2>
          <p className="text-muted leading-relaxed mb-6">
            The foundation of any solid financial plan starts with understanding the basic mechanics of how money works in this context. In the realm of {slug.replace(/-/g, " ")}, the primary focus should always be on minimizing unnecessary costs, optimizing your tax footprint, and maximizing the power of compounding returns over time. 
          </p>
          <p className="text-muted leading-relaxed mb-6">
            Many beginners make the mistake of jumping into advanced strategies without first securing their foundation. Before you look at complex instruments, ensure you have a clear understanding of inflation, liquidity needs, and your personal risk tolerance. Every financial decision should map directly back to your short-term and long-term goals.
          </p>

          <div className="bg-alt border-l-4 border-brand p-6 my-10 rounded-r-2xl">
            <h3 className="text-navy font-bold text-lg mb-2 mt-0">Key Takeaway</h3>
            <p className="text-muted m-0">
              Your financial strategy should be proactive, not reactive. Planning ahead allows you to take advantage of market cycles rather than falling victim to them. Always align your investments with your actual time horizons.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-navy mt-12 mb-5">2. Practical Strategies & Application</h2>
          <p className="text-muted leading-relaxed mb-6">
            Theory is great, but applying it correctly in the real world is what actually builds wealth. We highly recommend using our related calculators to put these abstract numbers into a realistic perspective. Small adjustments to variables like your repayment tenure or your monthly interest rate can drastically alter your financial outcome over a 10 or 20-year period.
          </p>
          <p className="text-muted leading-relaxed mb-6">
            For example, if you increase your monthly contribution by just 10%, the compounding effect over two decades can often lead to a 30-40% larger final corpus. This is the "magic" of systematic investing and disciplined financial habits.
          </p>
          
          <h3 className="text-xl font-bold text-navy mt-8 mb-4">Common Mistakes to Avoid</h3>
          <ul className="list-disc pl-6 space-y-3 text-muted mb-8">
            <li><strong>Ignoring Inflation:</strong> If your returns don't beat inflation, you are technically losing purchasing power every year.</li>
            <li><strong>Chasing Past Performance:</strong> What performed well last year is not guaranteed to perform well this year. Diversification is your best defense.</li>
            <li><strong>Underestimating Fees:</strong> High expense ratios or processing fees compound negatively. Always read the fine print.</li>
            <li><strong>Lack of an Emergency Fund:</strong> Never invest money you might need urgently in the next 6-12 months in volatile assets.</li>
          </ul>

          <h2 className="text-2xl font-bold text-navy mt-12 mb-5">3. Expert Financial Advice & Next Steps</h2>
          <p className="text-muted leading-relaxed mb-6">
            Financial planning is not a "set and forget" activity. You should review your portfolio, outstanding debts, and asset allocation at least once a year or whenever you experience a major life event (marriage, a new job, buying a house). 
          </p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 my-10">
            <h3 className="text-amber-900 font-bold text-lg mb-2 mt-0">💡 Pro Tip for Indian Investors</h3>
            <p className="text-amber-800 m-0 leading-relaxed">
              Always maximize your Section 80C benefits first, but don't stop there. Look into Section 80CCD(1B) for the extra ₹50,000 NPS deduction. Consistency is your greatest asset. Whether you are aggressively paying off a high-interest loan or systematically investing in index funds, time in the market beats timing the market.
            </p>
          </div>

          <p className="text-muted leading-relaxed">
            Ready to apply these concepts? Head over to our <a href="/categories" className="text-brand font-semibold hover:underline">Calculators section</a> to run your own numbers and build a personalized financial plan that works for you.
          </p>
        </div>
      </article>
    </div>
  );
}
