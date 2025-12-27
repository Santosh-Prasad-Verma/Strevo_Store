import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://strevo.com";
  
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/cart`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const supabase = await createClient();
    const { data: products } = await supabase.from("products").select("id, updated_at");
    const { data: categories } = await supabase.from("categories").select("slug, updated_at");

    return [
      ...staticPages,
      ...(products?.map((p) => ({
        url: `${baseUrl}/products/${p.id}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })) || []),
      ...(categories?.map((c) => ({
        url: `${baseUrl}/category/${c.slug}`,
        lastModified: new Date(c.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })) || []),
    ];
  } catch (error) {
    console.error('[Sitemap] Error generating sitemap:', error);
    return staticPages;
  }
}
