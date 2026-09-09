import { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface GenerateMetadataProps {
  title: string;
  description: string;
  path: string;
  openGraph?: {
    type?: "website" | "article";
    publishedTime?: string;
    modifiedTime?: string;
  };
}

export function generatePageMetadata({
  title,
  description,
  path,
  openGraph,
}: GenerateMetadataProps): Metadata {
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: openGraph?.type || "website",
      siteName: "IndiaWise",
      locale: "en_IN",
      ...(openGraph?.publishedTime && { publishedTime: openGraph.publishedTime }),
      ...(openGraph?.modifiedTime && { modifiedTime: openGraph.modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
