import type { MetadataRoute } from "next"
import { getBlogPosts } from "@/modules/public/api"

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/clases", "/blog", "/contacto"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
  }))

  const posts = await getBlogPosts()
  const postRoutes = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
  }))

  return [...staticRoutes, ...postRoutes]
}
