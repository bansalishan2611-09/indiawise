import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";

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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans print:bg-white">
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
      </body>
    </html>
  );
}
