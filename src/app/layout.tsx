import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import { MiniAIChatbot } from "@/components/chat/MiniAIChatbot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | IndiaWise",
    default: "IndiaWise - Calculate Smarter. Understand Better.",
  },
  description: "Fast, accurate calculators and everyday utilities designed for India.",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: "IndiaWise - Calculate Smarter. Understand Better.",
    description: "Fast, accurate calculators and everyday utilities designed for India.",
    url: "/",
    siteName: "IndiaWise",
    locale: "en_IN",
    type: "website",
  },
  verification: {
    google: "UBOQH9JIs8VlJziTn14mqIpAPuZkTBln6uO_IBb1BZ4",
    other: {
      "p:domain_verify": "ddbf5e45ca152e366891f96d4c29c96b",
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/images/favicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <head>
        {/* Pinterest Domain Verification */}
        <meta name="p:domain_verify" content="ddbf5e45ca152e366891f96d4c29c96b" />
        <meta name="pinterest-site-verification" content="ddbf5e45ca152e366891f96d4c29c96b" />
        {/* Explicitly tell Google our Site Name and Founder to fix AI Overview confusion */}
        <script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${siteConfig.url}/#website`,
                  "url": siteConfig.url,
                  "name": "IndiaWise",
                  "alternateName": "IndiaWise Calculators"
                },
                {
                  "@type": "Organization",
                  "@id": `${siteConfig.url}/#organization`,
                  "name": "IndiaWise",
                  "url": siteConfig.url,
                  "logo": `${siteConfig.url}/images/favicon.png`,
                  "founder": {
                    "@type": "Person",
                    "name": "Ishan Bansal",
                    "url": `${siteConfig.url}/founder`
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground font-sans print:bg-white">
        <div className="hidden print:flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
          <div className="flex items-center gap-3">
            <img src="/images/favicon.png" alt="IndiaWise Icon" className="h-10 w-10 object-contain" />
            <span className="text-2xl font-bold text-navy tracking-tight">IndiaWise</span>
          </div>
          <span className="text-sm text-gray-500">Calculate Smarter. Understand Better.</span>
        </div>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <MiniAIChatbot />
      </body>
    </html>
  );
}
