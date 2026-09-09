import { siteConfig } from '@/config/site';
import { generatePageMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

export const metadata = generatePageMetadata({
  title: 'Privacy Policy',
  description: 'Read the IndiaWise Privacy Policy to understand how we collect, use, and protect your data.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Privacy Policy', href: '/privacy-policy' }]} />

      <div className="mt-6 prose prose-navy max-w-none">
        <h1 className="text-4xl font-bold text-navy mb-8">Privacy Policy</h1>
        <p className="text-muted text-sm mb-8">Last updated: September 2026</p>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-navy">1. Information We Collect</h2>
          <p className="text-muted leading-relaxed">IndiaWise is designed with a privacy-first approach. Our calculators run entirely in your browser — we do not collect, store, or transmit any of the values you enter into our calculators.</p>
          <p className="text-muted leading-relaxed">We may collect basic, anonymized usage data such as page views, browser type, and device type through standard analytics tools to improve our services.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-navy">2. How We Use Your Information</h2>
          <p className="text-muted leading-relaxed">Any data we collect is used solely to improve the IndiaWise platform, understand which calculators are most useful, and optimize the user experience. We never sell, rent, or share personal data with third parties for marketing purposes.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-navy">3. Cookies</h2>
          <p className="text-muted leading-relaxed">We may use cookies or similar technologies for basic analytics and functionality. You can control cookie settings through your browser preferences.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-navy">4. Third-Party Services</h2>
          <p className="text-muted leading-relaxed">We may use third-party analytics services (such as Google Analytics) that collect anonymized usage data. These services have their own privacy policies governing the use of information.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-navy">5. Data Security</h2>
          <p className="text-muted leading-relaxed">We implement reasonable technical and organizational measures to protect any data we collect. Since calculator inputs are processed entirely in your browser and are never transmitted to our servers, your financial data is inherently secure.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-navy">6. Contact Us</h2>
          <p className="text-muted leading-relaxed">If you have any questions about this Privacy Policy, please reach out to us at <a href={`mailto:${siteConfig.email}`} className="text-brand hover:underline">{siteConfig.email}</a> or through our <a href="/contact" className="text-brand hover:underline">Contact Page</a>.</p>
        </section>
      </div>
    </div>
  );
}