import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/data/blog";

const BASE = "https://yasinhessnawi.online";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts();
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/no`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/no/blog`, changeFrequency: "weekly", priority: 0.7 },
  ];
  const postEntries: MetadataRoute.Sitemap = posts.flatMap((p) => [
    {
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.metadata.publishedAt,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${BASE}/no/blog/${p.slug}`,
      lastModified: p.metadata.publishedAt,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    },
  ]);
  return [...staticEntries, ...postEntries];
}
