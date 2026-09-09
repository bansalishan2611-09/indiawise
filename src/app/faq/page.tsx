import { siteConfig } from '@/config/site';
import { generatePageMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { ChevronDown } from 'lucide-react';

export const metadata = generatePageMetadata({
  title: 'Frequently Asked Questions',
  description: 'Find answers to the most common questions about IndiaWise calculators, accuracy, and usage.',
  path: '/faq',
});

const faqs = [
  {
    question: 'Are IndiaWise calculators free to use?',
    answer: 'Yes, all our calculators are 100% free to use with no registration required. We believe financial tools should be accessible to everyone.'
  },
  {
    question: 'How accurate are the calculations?',
    answer: 'Our calculators use standard financial formulas and the latest tax slab rates. While we strive for maximum accuracy, results are estimates and may differ slightly from exact figures due to rounding, bank-specific policies, or individual tax circumstances. Always verify with a professional.'
  },
  {
    question: 'Is my data stored or shared?',
    answer: 'No. All calculations happen entirely in your browser. We do not collect, store, or transmit any of the values you enter into our calculators. Your data stays on your device.'
  },
  {
    question: 'Which tax year do your calculators use?',
    answer: 'Our Income Tax calculator is updated for FY 2024-25 (AY 2025-26) and includes the latest slab rates, rebates, and standard deduction rules for both Old and New regimes.'
  },
  {
    question: 'Can I use these calculators on my phone?',
    answer: 'Yes! IndiaWise is fully responsive and works beautifully on mobile phones, tablets, and desktops.'
  },
  {
    question: 'How is SIP return calculated?',
    answer: 'SIP returns are calculated using the future value of an annuity formula: FV = P × [((1+r)^n - 1) / r] × (1+r), where P is the monthly investment, r is the monthly return rate, and n is the number of months.'
  },
  {
    question: 'What compounding frequency does the FD calculator use?',
    answer: 'Our FD calculator uses quarterly compounding, which is the standard practice followed by most Indian banks.'
  },
  {
    question: 'I found an error. How do I report it?',
    answer: `Please email us at ${siteConfig.email} with the calculator name, your inputs, and the expected result. We take accuracy very seriously and will fix it promptly.`
  },
  {
    question: 'Can I suggest a new calculator?',
    answer: `Absolutely! We are constantly adding new calculators based on user demand. Email us your suggestion to ${siteConfig.email} and we will prioritize accordingly.`
  }
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'FAQs', href: '/faq' }]} />

      <div className="mt-6">
        <h1 className="text-4xl font-bold text-navy mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-muted mb-10">Everything you need to know about using IndiaWise.</p>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-white border border-border rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer text-left font-semibold text-navy hover:bg-alt transition-colors list-none [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown className="w-5 h-5 text-muted shrink-0 ml-4 group-open:rotate-180 transition-transform duration-200" />
              </summary>
              <div className="px-5 pb-5 text-muted leading-relaxed border-t border-border pt-4">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}