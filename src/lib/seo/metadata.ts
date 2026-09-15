import { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface GenerateMetadataProps {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  openGraph?: {
    type?: "website" | "article";
    publishedTime?: string;
    modifiedTime?: string;
    image?: string;
  };
}

export function generatePageMetadata({
  title,
  description,
  path,
  noIndex,
  openGraph,
}: GenerateMetadataProps): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImageUrl = openGraph?.image || `${siteConfig.url}/images/logo.png`;
  const cleanTitle = title.replace(/\s*\|\s*IndiaWise$/i, '').trim();

  return {
    title: cleanTitle,
    description,
    alternates: {
      canonical: url,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: true,
      },
    }),
    openGraph: {
      title: `${cleanTitle} | IndiaWise`,
      description,
      url,
      type: openGraph?.type || "website",
      siteName: "IndiaWise",
      locale: "en_IN",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${cleanTitle} | IndiaWise`,
        },
      ],
      ...(openGraph?.publishedTime && { publishedTime: openGraph.publishedTime }),
      ...(openGraph?.modifiedTime && { modifiedTime: openGraph.modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${cleanTitle} | IndiaWise`,
      description,
      images: [ogImageUrl],
    },
  };
}
