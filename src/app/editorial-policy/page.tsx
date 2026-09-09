import { generatePageMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

export const metadata = generatePageMetadata({
  title: 'Editorial Policy',
  description: 'Learn about IndiaWise editorial standards for accuracy, transparency, and integrity.',
  path: '/editorial-policy',
});

export default function EditorialPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Editorial Policy', href: '/editorial-policy' }]} />

      <div className="mt-6">
        <h1 className="text-4xl font-bold text-navy mb-8">Editorial Policy</h1>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-navy">Our Commitment to Accuracy</h2>
          <p className="text-muted leading-relaxed">At IndiaWise, accuracy is paramount. Every calculator we publish is built using verified mathematical formulas, current government tax slab rates, and standard industry practices. Our team reviews and tests every calculator before it goes live.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-navy">Independence</h2>
          <p className="text-muted leading-relaxed">Our calculators and content are developed independently. We do not allow any financial institution, advertiser, or partner to influence the results of our calculators or the content of our guides.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-navy">Transparency</h2>
          <p className="text-muted leading-relaxed">We clearly state the formulas and assumptions used in each calculator. Where simplifications are made (for example, not accounting for every possible tax deduction), we disclose this to the user.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-navy">Updates and Corrections</h2>
          <p className="text-muted leading-relaxed">We commit to updating our calculators when regulations change (such as new tax slabs or interest rate policies). If an error is found, we will correct it promptly and transparently.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-navy">User-First Approach</h2>
          <p className="text-muted leading-relaxed">Every feature and design decision at IndiaWise is made with the user in mind. We avoid dark patterns, misleading results, or unnecessary complexity. If a user reports an issue, we treat it with the highest priority.</p>
        </section>
      </div>
    </div>
  );
}