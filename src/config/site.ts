const getSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // Vercel auto-injects these system variables
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

export const siteConfig = {
  name: "IndiaWise",
  url: getSiteUrl(),
  email: "indiawiseofficial@outlook.com",
  youtube: "https://www.youtube.com/@IndiaWiseOfficial",
  description: "Fast, accurate calculators and everyday utilities designed for India.",
};
