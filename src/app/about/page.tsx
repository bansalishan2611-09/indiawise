import { siteConfig } from "@/config/site";
import { generatePageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const metadata = generatePageMetadata({
  title: "About Us",
  description: "Learn more about IndiaWise and our mission to simplify financial planning for Indians.",
  path: "/about",
});

export default function AboutPage() {
  const breadcrumbItems = [
    { label: "About", href: "/about" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mt-6 max-w-3xl">
        <h1 className="text-4xl font-bold text-navy mb-6">About IndiaWise</h1>
        
        <div className="space-y-6 text-lg text-muted leading-relaxed">
          <p>
            IndiaWise is a modern financial technology platform dedicated to making calculations, planning, and understanding finances easier for every Indian.
          </p>
          <p>
            Our goal is to build the highest quality, most accurate, and easiest to use calculators on the web. Whether you are trying to figure out your next EMI, plan your SIPs, or calculate your GST, we provide the tools you need with a premium experience.
          </p>
          <p>
            This platform is currently under active development, and we are constantly adding new tools and guides. Stay tuned!
          </p>
          <p>
            Have questions, feedback, or calculator requests? We would love to hear from you. Reach out to us at <a href={`mailto:${siteConfig.email}`} className="text-brand font-medium hover:underline">{siteConfig.email}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}