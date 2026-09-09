import { generatePageMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

export const metadata = generatePageMetadata({
  title: 'Advertising Disclosure',
  description: 'Understand how IndiaWise handles advertising, affiliate links, and sponsorships.',
  path: '/advertising-disclosure',
});

export default function AdvertisingDisclosurePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Advertising Disclosure', href: '/advertising-disclosure' }]} />

      <div className="mt-6">
        <h1 className="text-4xl font-bold text-navy mb-8">Advertising Disclosure</h1>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-navy">How We Sustain IndiaWise</h2>
          <p className="text-muted leading-relaxed">IndiaWise is a free platform. To keep our calculators and tools freely available, we may in the future display advertisements or include affiliate links to financial products. This page explains how we handle such relationships.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-navy">Independence of Results</h2>
          <p className="text-muted leading-relaxed">Our calculators are completely independent of any advertising or affiliate partnerships. No advertiser or partner can influence the results displayed by our calculators. The mathematical formulas and logic remain the same regardless of any commercial relationships.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-navy">Affiliate Links</h2>
          <p className="text-muted leading-relaxed">In the future, some links on IndiaWise may be affiliate links, meaning we may earn a commission if you click on a link and sign up for a product or service. This comes at no additional cost to you. We will always clearly label affiliate links where they appear.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-navy">Our Promise</h2>
          <p className="text-muted leading-relaxed">We will never recommend a product solely because of an affiliate relationship. Any product mentioned on IndiaWise is included based on its merit and relevance to Indian users. We prioritize your trust above revenue.</p>
        </section>
      </div>
    </div>
  );
}