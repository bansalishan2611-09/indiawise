import { generatePageMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

export const metadata = generatePageMetadata({
  title: 'Disclaimer',
  description: 'Read the IndiaWise Disclaimer regarding the accuracy and intended use of our calculators.',
  path: '/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Disclaimer', href: '/disclaimer' }]} />

      <div className="mt-6">
        <h1 className="text-4xl font-bold text-navy mb-8">Disclaimer</h1>
        <p className="text-muted text-sm mb-8">Last updated: September 2026</p>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-10">
          <p className="text-amber-900 font-semibold text-lg mb-2">Important Notice</p>
          <p className="text-amber-800 leading-relaxed">The information and calculators provided on IndiaWise are for general informational and educational purposes only. They do not constitute financial, tax, legal, or medical advice.</p>
        </div>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-navy">No Professional Advice</h2>
          <p className="text-muted leading-relaxed">IndiaWise does not provide professional financial advisory services. The calculators are tools designed to assist with general estimates. You should always consult with a qualified Chartered Accountant, financial planner, tax professional, or doctor before making decisions based on our calculations.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-navy">Accuracy of Calculations</h2>
          <p className="text-muted leading-relaxed">While we make every effort to ensure the accuracy of our calculators, results are approximate and may not reflect exact values due to rounding, changing regulations, varying bank policies, or simplifications in the mathematical models used.</p>
          <p className="text-muted leading-relaxed">Tax calculations are based on publicly available slab rates and standard deduction rules. Actual tax liability may differ based on individual circumstances, exemptions, and deductions not captured by our calculator.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-navy">No Guarantee</h2>
          <p className="text-muted leading-relaxed">IndiaWise does not guarantee any financial outcome, investment return, or tax saving. Past performance indicators (such as average SIP returns) do not guarantee future results. All investments carry risk.</p>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-navy">External Links & Updates</h2>
          <p className="text-muted leading-relaxed">IndiaWise may contain links to third-party websites. We are not responsible for the content, accuracy, or privacy practices of external sites.</p>
          <p className="text-muted leading-relaxed font-semibold">Please note that we reserve the right to change, modify, or remove any calculator, formula, design, or content on this platform at any time, without prior notice.</p>
        </section>
      </div>
    </div>
  );
}