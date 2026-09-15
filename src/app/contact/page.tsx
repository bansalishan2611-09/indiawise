import { generatePageMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { Mail, MapPin } from 'lucide-react';

import { siteConfig } from '@/config/site';

export const metadata = generatePageMetadata({
  title: 'Contact Us',
  description: 'Get in touch with the IndiaWise team for feedback, support, or partnership inquiries.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Contact', href: '/contact' }]} />

      <div className="mt-6">
        <h1 className="text-4xl font-bold text-navy mb-4">Contact Us</h1>
        <p className="text-lg text-muted mb-10 max-w-2xl">We would love to hear from you. Whether you have feedback, a feature request, or a business inquiry — reach out and we will get back to you.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-border rounded-2xl p-6 hover:border-brand/30 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-brand" />
            </div>
            <h3 className="text-lg font-bold text-navy mb-2">Email Us</h3>
            <p className="text-muted text-sm leading-relaxed mb-3">For general inquiries, feedback, and support.</p>
            <a href={`mailto:${siteConfig.email}`} className="text-brand font-semibold hover:underline">{siteConfig.email}</a>
          </div>

          <div className="bg-white border border-border rounded-2xl p-6 hover:border-red-500/30 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-navy mb-2">YouTube Channel</h3>
            <p className="text-muted text-sm leading-relaxed mb-3">Watch video guides, tutorials, and financial explainers.</p>
            <a href={siteConfig.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 font-semibold hover:underline">@OfficialIndiaWise</a>
          </div>

          <div className="bg-white border border-border rounded-2xl p-6 hover:border-brand/30 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-brand" />
            </div>
            <h3 className="text-lg font-bold text-navy mb-2">Location</h3>
            <p className="text-muted text-sm leading-relaxed mb-3">We are a remote-first team based in India.</p>
            <p className="text-navy font-semibold">India 🇮🇳</p>
          </div>
        </div>

        <div className="bg-alt border border-border rounded-2xl p-8">
          <h2 className="text-xl font-bold text-navy mb-4">Frequently Asked</h2>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-navy">I found a bug or incorrect calculation.</p>
              <p className="text-muted text-sm mt-1">Please email us with the calculator name, your inputs, and the expected result. We will fix it as soon as possible.</p>
            </div>
            <div>
              <p className="font-semibold text-navy">Can you add a specific calculator?</p>
              <p className="text-muted text-sm mt-1">Absolutely! Drop us an email with the calculator type and any details. We prioritize based on user demand.</p>
            </div>
            <div>
              <p className="font-semibold text-navy">Partnership and advertising inquiries?</p>
              <p className="text-muted text-sm mt-1">We are open to relevant, non-intrusive partnerships. Please reach out via email with your proposal.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}