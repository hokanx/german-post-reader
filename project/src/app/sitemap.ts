import type { MetadataRoute } from "next";

const siteUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/signup`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
